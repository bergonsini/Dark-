#!/usr/bin/env python3
"""
cartoon-explainer: gera TODO o áudio do vídeo e a linha do tempo usada pelo Remotion.

  1. Narração em português brasileiro, estilo documentário (motores em voz.py):
       --engine auto        edge -> kokoro -> mbrola -> espeak (só GRATUITOS; um motor só para o vídeo todo)
       --engine kokoro      Kokoro neural offline (recomendado quando não há internet)
       --engine edge        voz neural Microsoft via edge-tts (gratuito, precisa de internet)
       --engine elevenlabs  PAGO: exige também --autorizo-custo e ELEVENLABS_API_KEY
  2. Música de fundo original sintetizada (livre de direitos autorais)
  3. Efeitos sonoros sintetizados
  4. src/cartoon/timeline.json: cenas, falas, cada PALAVRA com seu frame e a abertura da boca por frame.
     As cenas (wordAt/lineStart), as legendas e o lip-sync leem este arquivo, então tudo fica sincronizado.

A duração total é ajustada a `duracaoSegundos` (padrão 60 s): primeiro a velocidade da voz é ajustada
(dentro de limites naturais), depois as pausas entre cenas, e o restante vai para o final.

Uso (na raiz do projeto Remotion):
    python3 .claude/skills/cartoon-explainer/scripts/generate_audio.py [--engine ...] [--roteiro roteiro.json]
Requisitos: python3, numpy, ffmpeg (+ o motor de voz escolhido).
"""
import argparse
import json
import math
import os
import sys
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import voz  # noqa: E402

ROOT = voz.ROOT
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
TIMELINE = os.path.join(ROOT, "src", "cartoon", "timeline.json")
SR = voz.SR

LEAD_IN = 0.10       # silêncio antes da primeira fala: o gancho começa imediatamente
SCENE_GAP = 0.55     # pausa mínima entre cenas (s)
MAX_SCENE_GAP = 1.5  # pausa máxima entre cenas ao esticar até a duração alvo
MIN_OUTRO = 2.0      # tempo mínimo depois da última fala (s)
MAX_OUTRO = 4.0      # acima disso, a voz é desacelerada (se o motor for gratuito)
VEL_MIN, VEL_MAX = 0.9, 1.12  # limites do ajuste automático de velocidade


def write_wav(path, data, stereo=False):
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ----------------------------------------------------------------------------- síntese (música e SFX)
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env_exp(dur, decay):
    return np.exp(-t_axis(dur) * decay)


def noise(dur, seed=0):
    return np.random.default_rng(seed).uniform(-1, 1, int(dur * SR))


def lowpass(x, cutoff):
    n = max(1, int(SR / (cutoff * 2.2)))
    k = np.ones(n) / n
    return np.convolve(np.convolve(x, k, mode="same"), k, mode="same")


def place(buf, clip, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i] * gain


def kick(dur=0.4):
    t = t_axis(dur)
    f = 50 + 110 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(dur, 9)


def hat(dur=0.06, seed=1):
    x = noise(dur, seed)
    return (x - lowpass(x, 5000)) * env_exp(dur, 60)


def snare(dur=0.22, seed=2):
    t = t_axis(dur)
    n = noise(dur, seed)
    return (n - lowpass(n, 1200)) * env_exp(dur, 18) + np.sin(2 * np.pi * 190 * t) * env_exp(dur, 30) * 0.5


def pluck(freq, dur=0.45):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 12) \
        + 0.2 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-t * 20)
    return s * env_exp(dur, 8) * (1 - np.exp(-t * 500))


def pad(freqs, dur):
    t = t_axis(dur)
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 1.003 * t) for f in freqs)
    a = np.minimum(1, t / 0.3) * np.clip((dur - t) / 0.4, 0, 1)
    return s * a / len(freqs)


def bass(freq, dur=0.4):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return s * env_exp(dur, 5) * (1 - np.exp(-t * 300))


def note_hz(semi_from_a4):
    return 440.0 * 2 ** (semi_from_a4 / 12)


def make_music(total_s, cfg):
    """Trilha alegre e leve (pop educativo): bumbo, caixa, chimbal, baixo, pad e melodia em pluck."""
    bpm = cfg.get("bpm", 100)
    root = cfg.get("tom", -9)  # semitons a partir de Lá4: -9 = Dó4
    beat = 60 / bpm
    L = total_s + 1
    left = np.zeros(int(L * SR))
    right = np.zeros(int(L * SR))
    # progressão I - V - vi - IV (graus em semitons)
    prog = [(0, [0, 4, 7]), (7, [7, 11, 14]), (9, [9, 12, 16]), (5, [5, 9, 12])]
    major = [0, 2, 4, 7, 9, 12, 14, 16]
    mel = [4, 5, 6, 5, 4, 2, 3, 2, 1, 2, 4, None, 2, 3, 4, 7, 6, 5, 4, None,
           5, 4, 2, 1, 0, 1, 2, None, 4, 2, 1, None]
    rng = np.random.default_rng(11)
    n_beats = int(L / beat)
    for b in range(n_beats):
        t0 = b * beat
        bar = b // 4
        pos = b % 4
        deg, chord = prog[bar % 4]
        if pos in (0, 2):
            k = kick()
            place(left, k, t0, 0.85)
            place(right, k, t0, 0.85)
        if pos in (1, 3) and b >= 4:
            s = snare(seed=int(rng.integers(0, 9999)))
            place(left, s, t0, 0.28)
            place(right, s, t0, 0.32)
        for h in range(2):
            x = hat(seed=int(rng.integers(0, 9999)))
            place(left, x, t0 + h * beat / 2, 0.10 if h == 0 else 0.16)
            place(right, x, t0 + h * beat / 2, 0.14 if h == 0 else 0.10)
        if pos == 0:
            p = pad([note_hz(root + c) for c in chord], beat * 4)
            place(left, p, t0, 0.12)
            place(right, p, t0 + 0.01, 0.12)
        if pos in (0, 2):
            bb = bass(note_hz(root + deg - 24), beat * 1.8)
            place(left, bb, t0, 0.32)
            place(right, bb, t0, 0.32)
        if b >= 8:
            for h in range(2):
                n = mel[((b - 8) * 2 + h) % len(mel)]
                if n is not None:
                    pk = pluck(note_hz(root + 12 + major[n]))
                    place(left, pk, t0 + h * beat / 2, 0.13)
                    place(right, pk, t0 + h * beat / 2 + 0.015, 0.16)
    env = np.minimum(1, t_axis(L) / 0.3) * np.clip((L - 1 - t_axis(L)) / 2.0, 0, 1)
    left *= env
    right *= env
    st = np.stack([left, right], axis=1)
    st /= np.max(np.abs(st)) + 1e-9
    return (st * 0.8).reshape(-1)


def sweep(f0, f1, dur, decay=0.0):
    t = t_axis(dur)
    f = f0 + (f1 - f0) * (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)


def make_sfx():
    sfx = {}
    d = 0.45
    t = t_axis(d)
    x = noise(d, 3)
    sfx["whoosh"] = (lowpass(x, 2500) - lowpass(x, 300)) * np.sin(np.pi * t / d) ** 2 * 3.0
    d = 1.2
    t = t_axis(d)
    boom = np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-t * 6)) / SR) * np.exp(-t * 3.2)
    sfx["boom"] = boom + lowpass(noise(d, 4), 400) * np.exp(-t * 9) * 1.5
    d = 0.14
    t = t_axis(d)
    sfx["pop"] = np.sin(2 * np.pi * np.cumsum(500 + 900 * np.exp(-t * 60)) / SR) * np.exp(-t * 30)
    d = 0.9
    t = t_axis(d)
    ding = (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 5)
    ding2 = np.zeros_like(ding)
    off = int(0.09 * SR)
    ding2[off:] = (np.sin(2 * np.pi * 1760 * t) * np.exp(-t * 5))[: len(ding) - off]
    sfx["ding"] = (ding + ding2) * 0.6
    sp = np.zeros(int(0.8 * SR))
    for i, fr in enumerate([1568, 2093, 2637, 3136, 4186]):
        tt = t_axis(0.35)
        place(sp, np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 12), i * 0.06, 0.5)
    sfx["sparkle"] = sp
    d = 0.5
    t = t_axis(d)
    f = 180 + 120 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)
    sfx["boing"] = np.sin(2 * np.pi * np.cumsum(f + 200 * t) / SR) * np.exp(-t * 6)
    d = 0.05
    t = t_axis(d)
    sfx["click"] = np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 120) + noise(d, 5) * np.exp(-t * 200) * 0.4
    d = 1.4
    t = t_axis(d)
    n = noise(d, 6)
    sfx["riser"] = (sweep(200, 1200, d) * 0.6 + (n - lowpass(n, 1500)) * 0.5) * (t / d) ** 2
    tada = np.zeros(int(1.3 * SR))
    for i, fr in enumerate([523.25, 659.25, 783.99, 1046.5]):
        place(tada, pluck(fr, 1.0), i * 0.07, 0.6)
    sfx["tada"] = tada
    for k, v in sfx.items():
        sfx[k] = v / (np.max(np.abs(v)) + 1e-9) * 0.9
    return sfx


# ----------------------------------------------------------------------------- roteiro
def normaliza_falas(script):
    """Cada fala pode ser texto simples ou objeto:
    {"texto": "...", "pronuncia": "...", "velocidade": 0.95, "pausaDepois": 0.4}
      texto       -> o que aparece na legenda
      pronuncia   -> o que a voz fala (opcional: números por extenso, siglas, ênfase com pontuação)
      velocidade  -> multiplicador só desta fala
      pausaDepois -> pausa (s) depois da fala, substitui a automática
    """
    out = []
    for si, cena in enumerate(script["cenas"]):
        for li, f in enumerate(cena["falas"]):
            if isinstance(f, str):
                f = {"texto": f}
            out.append({"cena": si, "linha": li, "texto": f["texto"], "falar": f.get("pronuncia", f["texto"]),
                        "vel": float(f.get("velocidade", 1.0)), "pausa": f.get("pausaDepois")})
    return out


def pausa_auto(texto, st):
    t = texto.rstrip().rstrip("\"')")
    if t.endswith("?"):
        return st["pausaPergunta"]
    if t.endswith((".", "!", "…")):
        return st["pausaPonto"]
    return st["pausaVirgula"]


def sintetizar_tudo(falas, motor, cfg, fator):
    res = []
    for i, f in enumerate(falas):
        ctx = {"velocidade": f["vel"] * fator, "legenda": f["texto"],
               "anterior": falas[i - 1]["falar"] if i else None,
               "proxima": falas[i + 1]["falar"] if i + 1 < len(falas) else None}
        audio, words = voz.gerar_fala(motor, f["falar"], ctx, cfg)
        res.append((audio, words))
    return res


def montar(falas, clips, script, st, target):
    n_scenes = len(script["cenas"])
    speech = sum(len(a) for a, _ in clips) / SR
    gaps = 0.0
    for i, f in enumerate(falas[:-1]):
        if falas[i + 1]["cena"] == f["cena"]:
            gaps += f["pausa"] if f["pausa"] is not None else pausa_auto(f["texto"], st)
    natural = LEAD_IN + speech + gaps + (n_scenes - 1) * SCENE_GAP + MIN_OUTRO
    return natural, speech


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default=os.environ.get("TTS_ENGINE"), choices=["auto", "kokoro", "edge", "elevenlabs", "mbrola", "espeak"])
    ap.add_argument("--roteiro", default=os.path.join(ROOT, "roteiro.json"))
    ap.add_argument("--autorizo-custo", action="store_true", help="necessário para usar um motor PAGO (ElevenLabs)")
    ap.add_argument("--sem-ajuste", action="store_true", help="não ajustar a velocidade da voz à duração alvo")
    args = ap.parse_args()

    with open(args.roteiro, encoding="utf-8") as fh:
        script = json.load(fh)
    fps = script.get("fps", 30)
    target = float(script.get("duracaoSegundos", 60))
    cfg = script.get("voz", {})
    st = voz.estilo(cfg)
    falas = normaliza_falas(script)
    pedido = args.engine or cfg.get("motor", "auto")

    if voz.MOTORES[pedido].pago if pedido in voz.MOTORES else False:
        chars = sum(len(f["falar"]) for f in falas)
        print(f"ATENÇÃO: '{pedido}' é um serviço PAGO. Este roteiro tem {chars} caracteres "
              f"(consome créditos do seu plano; ajustes de duração não são refeitos para não gastar de novo).")
        if not args.autorizo_custo:
            print("Nada foi enviado. Para autorizar, rode de novo com --autorizo-custo.", file=sys.stderr)
            sys.exit(2)
        args.sem_ajuste = True

    motor = voz.escolher_motor(pedido, cfg)
    print(f"  motor de voz: {motor}  | estilo: {cfg.get('estilo', 'documentario')}")
    os.makedirs(os.path.join(AUDIO_DIR, "sfx"), exist_ok=True)

    # ---- 1) narração (com ajuste de ritmo à duração alvo)
    fator = 1.0
    clips = sintetizar_tudo(falas, motor, cfg, fator)
    natural, speech = montar(falas, clips, script, st, target)
    folga_max = (MAX_OUTRO - MIN_OUTRO) + (len(script["cenas"]) - 1) * (MAX_SCENE_GAP - SCENE_GAP)
    for _ in range(3 if not args.sem_ajuste else 0):
        avail = target - (natural - speech)
        if natural > target:
            need = speech / max(1.0, avail - 0.2)
        elif target - natural > folga_max:
            need = speech / max(1.0, avail - folga_max * 0.5)
        else:
            break
        novo = max(VEL_MIN, min(VEL_MAX, fator * need))
        if abs(novo - fator) < 0.01:
            break
        fator = novo
        print(f"  ajustando ritmo da voz: x{fator:.2f}")
        clips = sintetizar_tudo(falas, motor, cfg, fator)
        natural, speech = montar(falas, clips, script, st, target)

    if voz.MOTORES[motor].pago:
        # sem nova cobrança: ajuste fino local do ritmo (±7%, sem mudar o tom)
        avail = target - (natural - speech)
        fx = 1.0
        if natural > target:
            fx = speech / max(1.0, avail - 0.2)
        elif target - natural > folga_max:
            fx = speech / max(1.0, avail - folga_max * 0.5)
        fx = max(0.93, min(1.07, fx))
        if abs(fx - 1) >= 0.01:
            print(f"  ajuste local de ritmo (sem custo): x{fx:.3f}")
            clips = [voz.esticar(a, w, fx) for a, w in clips]
            natural, speech = montar(falas, clips, script, st, target)
            fator = fx
        print(f"  ElevenLabs: {voz.ElevenLabs.caracteres} caracteres cobrados nesta execução (0 = veio do cache)")

    n_scenes = len(script["cenas"])
    spare = max(0.0, target - natural)
    extra_gap = min(MAX_SCENE_GAP - SCENE_GAP, spare / max(1, n_scenes - 1)) if n_scenes > 1 else 0
    scene_gap = SCENE_GAP + extra_gap
    outro = MIN_OUTRO + spare - extra_gap * (n_scenes - 1)

    # ---- 2) linha do tempo
    t = LEAD_IN
    scenes_out = []
    for i, (f, (audio, words)) in enumerate(zip(falas, clips)):
        if not scenes_out or scenes_out[-1]["_si"] != f["cena"]:
            if scenes_out:
                t += scene_gap
            scenes_out.append({"_si": f["cena"], "id": script["cenas"][f["cena"]]["id"], "start": t, "lines": []})
        else:
            prev = falas[i - 1]
            t += prev["pausa"] if prev["pausa"] is not None else pausa_auto(prev["texto"], st)
        dur = len(audio) / SR
        wl = [{"text": w, "start": t + a, "end": t + b} for (w, a, b) in words]
        scenes_out[-1]["lines"].append({"text": f["texto"], "start": t, "end": t + dur, "words": wl, "_audio": audio})
        t += dur
    total = t + outro
    for i, s in enumerate(scenes_out):
        s["end"] = (s["lines"][-1]["end"] + scenes_out[i + 1]["start"]) / 2 if i + 1 < len(scenes_out) else total
    for i in range(len(scenes_out) - 1, 0, -1):
        scenes_out[i]["start"] = scenes_out[i - 1]["end"]
    scenes_out[0]["start"] = 0.0

    narr = np.zeros(int(total * SR) + SR)
    for s in scenes_out:
        for ln in s["lines"]:
            place(narr, ln.pop("_audio"), ln["start"])
    narr = narr[: int(total * SR)]
    write_wav(os.path.join(AUDIO_DIR, "narration.wav"), narr * 0.95)

    # abertura da boca por frame (lip-sync), a partir do áudio real
    spf = SR // fps
    n_frames = int(round(total * fps))
    mouth = []
    for fr in range(n_frames):
        seg = narr[fr * spf:(fr + 1) * spf]
        mouth.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
    peak = np.percentile([m for m in mouth if m > 0.005] or [1], 90)
    mouth = [round(min(1.0, m / peak), 3) if m > 0.01 else 0.0 for m in mouth]

    # ---- 3) música e efeitos
    print("  gerando trilha sonora original...")
    write_wav(os.path.join(AUDIO_DIR, "music.wav"), make_music(total, script.get("musica", {})), stereo=True)
    for name, data in make_sfx().items():
        write_wav(os.path.join(AUDIO_DIR, "sfx", f"{name}.wav"), data)

    F = lambda s: int(round(s * fps))  # noqa: E731
    timeline = {
        "titulo": script.get("titulo", ""),
        "fps": fps,
        "durationInFrames": n_frames,
        "durationSeconds": round(total, 3),
        "engine": motor,
        "voz": {"estilo": cfg.get("estilo", "documentario"), "ritmo": round(fator, 3)},
        "scenes": [
            {
                "id": s["id"],
                "startFrame": F(s["start"]),
                "endFrame": F(s["end"]),
                "lines": [
                    {
                        "text": ln["text"],
                        "startFrame": F(ln["start"]),
                        "endFrame": F(ln["end"]),
                        "words": [{"text": w["text"], "startFrame": F(w["start"]), "endFrame": max(F(w["start"]) + 1, F(w["end"]))} for w in ln["words"]],
                    }
                    for ln in s["lines"]
                ],
            }
            for s in scenes_out
        ],
        "mouth": mouth,
    }
    os.makedirs(os.path.dirname(TIMELINE), exist_ok=True)
    with open(TIMELINE, "w", encoding="utf-8") as fh:
        json.dump(timeline, fh, ensure_ascii=False)

    words_s = sum(len(ln["words"]) for s in scenes_out for ln in s["lines"])
    hook_end = scenes_out[0]["lines"][0]["end"]
    print(f"OK: {total:.2f}s ({n_frames} frames) | fala {speech:.1f}s ({words_s / speech * 60:.0f} palavras/min) | "
          f"pausa entre cenas {scene_gap:.2f}s | final {outro:.2f}s | voz: {motor}")
    if natural > target + 0.5:
        print(f"AVISO: a narração ({natural:.1f}s) passa da duração alvo ({target:.0f}s). Encurte o texto.", file=sys.stderr)
    if outro > 6:
        print(f"AVISO: sobram {outro:.1f}s no final. Escreva mais narração para preencher {target:.0f}s.", file=sys.stderr)
    if hook_end > 3.2:
        print(f"AVISO: a frase do gancho termina em {hook_end:.1f}s; ela deve caber nos primeiros 3 segundos.", file=sys.stderr)
    if motor in ("mbrola", "espeak"):
        print("AVISO: voz de reserva (robótica). Instale o Kokoro (scripts/instalar_voz.py) ou o edge-tts.", file=sys.stderr)


if __name__ == "__main__":
    main()
