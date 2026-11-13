#!/usr/bin/env python3
"""
cartoon-explainer: gera TODO o áudio do vídeo e a linha do tempo usada pelo Remotion.

  1. Narração em português brasileiro (uma faixa por frase do roteiro.json)
       --engine edge    -> voz neural Microsoft (pip install edge-tts; precisa de internet)
       --engine mbrola  -> voz offline espeak-ng + MBROLA br3/br4 (apt install espeak-ng mbrola mbrola-br3)
       --engine espeak  -> voz offline espeak-ng pura (último recurso)
       --engine auto    -> tenta edge, depois mbrola, depois espeak (padrão)
  2. Música de fundo original sintetizada aqui (livre de direitos autorais)
  3. Efeitos sonoros sintetizados (whoosh, boom, pop, ding, sparkle, boing, click, riser, tada)
  4. src/cartoon/timeline.json com tempos de cena / frase / palavra e envelope da boca (lip-sync)

A duração total é ajustada para `duracaoSegundos` do roteiro (padrão 60 s):
pausas extras são distribuídas entre as cenas e o restante vai para o final.

Uso (na raiz do projeto Remotion):
    python3 .claude/skills/cartoon-explainer/scripts/generate_audio.py [--engine auto|edge|mbrola|espeak] [--roteiro roteiro.json]
Requisitos: python3, numpy, ffmpeg.
"""
import argparse
import asyncio
import json
import math
import os
import shutil
import subprocess
import sys
import tempfile
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
TIMELINE = os.path.join(ROOT, "src", "cartoon", "timeline.json")
SR = 48000

LEAD_IN = 0.10      # silêncio antes da primeira fala (s): o gancho começa imediatamente
LINE_GAP = 0.18     # pausa entre frases da mesma cena (s)
SCENE_GAP = 0.45    # pausa mínima entre cenas (s)
MAX_SCENE_GAP = 1.6 # pausa máxima entre cenas ao esticar até a duração alvo
MIN_OUTRO = 2.0     # tempo mínimo depois da última fala (s)


# ----------------------------------------------------------------------------- utils
def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def to_mono_48k(src, dst):
    """Converte para wav mono 48 kHz, com leve compressão e normalização de loudness."""
    run([
        "ffmpeg", "-y", "-i", src,
        "-af", "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=60,loudnorm=I=-16:TP=-1.5:LRA=7",
        "-ac", "1", "-ar", str(SR), dst,
    ])


def read_wav(path):
    with wave.open(path, "rb") as w:
        n = w.getnframes()
        data = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() > 1:
            data = data.reshape(-1, w.getnchannels()).mean(axis=1)
        return data


def write_wav(path, data, stereo=False):
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def trim_silence(x, thr=0.02):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.02 * SR))
    b = min(len(x), idx[-1] + int(0.05 * SR))
    return x[a:b]


# ----------------------------------------------------------------------------- TTS
def tts_edge(text, out_path, cfg):
    import edge_tts  # noqa: F401

    async def go():
        kwargs = {}
        proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        if proxy:
            kwargs["proxy"] = proxy
        com = edge_tts.Communicate(text, cfg.get("edge", "pt-BR-AntonioNeural"), rate=cfg.get("edgeRate", "+0%"),
                                   pitch=cfg.get("edgePitch", "+0Hz"), **kwargs)
        await com.save(out_path)

    asyncio.run(asyncio.wait_for(go(), timeout=30))
    if not os.path.exists(out_path) or os.path.getsize(out_path) < 1000:
        raise RuntimeError("edge-tts não gerou áudio")


def tts_espeak(text, out_path, cfg, mbrola):
    exe = shutil.which("espeak-ng") or shutil.which("espeak")
    if not exe:
        raise RuntimeError("espeak-ng não instalado")
    voice = cfg.get("mbrola", "mb-br3") if mbrola else "pt-br"
    if mbrola and not os.path.exists(f"/usr/share/mbrola/{voice.replace('mb-', '')}"):
        raise RuntimeError("voz MBROLA não instalada")
    run([exe, "-v", voice, "-s", str(cfg.get("espeakSpeed", 165)), "-p", str(cfg.get("espeakPitch", 45)), "-w", out_path, text])
    if os.path.getsize(out_path) < 1000:
        raise RuntimeError("espeak não gerou áudio")


def synthesize(text, out_wav, cfg, engine, tmp):
    order = {"auto": ["edge", "mbrola", "espeak"], "edge": ["edge"], "mbrola": ["mbrola"], "espeak": ["espeak"]}[engine]
    last = None
    for eng in order:
        try:
            raw = os.path.join(tmp, "raw." + ("mp3" if eng == "edge" else "wav"))
            if eng == "edge":
                tts_edge(text, raw, cfg)
            else:
                tts_espeak(text, raw, cfg, mbrola=(eng == "mbrola"))
            to_mono_48k(raw, out_wav)
            return eng
        except Exception as e:
            last = e
    raise RuntimeError(f"Nenhum motor de voz funcionou: {last}")


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


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default=os.environ.get("TTS_ENGINE", "auto"), choices=["auto", "edge", "mbrola", "espeak"])
    ap.add_argument("--roteiro", default=os.path.join(ROOT, "roteiro.json"))
    args = ap.parse_args()

    with open(args.roteiro, encoding="utf-8") as f:
        script = json.load(f)
    fps = script.get("fps", 30)
    target = float(script.get("duracaoSegundos", 60))
    cfg = script.get("voz", {})

    os.makedirs(os.path.join(AUDIO_DIR, "sfx"), exist_ok=True)

    # ---- 1) narração
    clips = []
    engines = set()
    with tempfile.TemporaryDirectory() as tmp:
        for si, scene in enumerate(script["cenas"]):
            for li, text in enumerate(scene["falas"]):
                out = os.path.join(tmp, f"{si}_{li}.wav")
                eng = synthesize(text, out, cfg, args.engine, tmp)
                engines.add(eng)
                clips.append((si, li, text, trim_silence(read_wav(out))))
                print(f"  [{eng}] {scene['id']}#{li}: {text}")

    n_scenes = len(script["cenas"])
    speech = sum(len(c[3]) for c in clips) / SR
    line_gaps = sum(1 for c in clips if c[1] > 0) * LINE_GAP
    natural = LEAD_IN + speech + line_gaps + (n_scenes - 1) * SCENE_GAP + MIN_OUTRO
    spare = max(0.0, target - natural)
    extra_gap = min(MAX_SCENE_GAP - SCENE_GAP, spare / max(1, n_scenes - 1)) if n_scenes > 1 else 0
    scene_gap = SCENE_GAP + extra_gap
    outro = MIN_OUTRO + spare - extra_gap * (n_scenes - 1)

    # ---- 2) linha do tempo
    t = LEAD_IN
    scenes_out = []
    prev = -1
    for si, li, text, audio in clips:
        if si != prev:
            if prev >= 0:
                t += scene_gap
            scenes_out.append({"id": script["cenas"][si]["id"], "start": t, "lines": []})
            prev = si
        elif li > 0:
            t += LINE_GAP
        dur = len(audio) / SR
        words = text.split()
        weights = [len(w.strip(",.?!:;…")) + 1.5 for w in words]
        tot = sum(weights)
        acc = 0.0
        wl = []
        for w, wt in zip(words, weights):
            wl.append({"text": w, "start": t + dur * acc / tot, "end": t + dur * (acc + wt) / tot})
            acc += wt
        scenes_out[-1]["lines"].append({"text": text, "start": t, "end": t + dur, "words": wl, "_audio": audio})
        t += dur
    total = t + outro
    # cortes visuais: no meio da pausa entre cenas
    for i, s in enumerate(scenes_out):
        if i + 1 < len(scenes_out):
            s["end"] = (s["lines"][-1]["end"] + scenes_out[i + 1]["start"]) / 2
        else:
            s["end"] = total
    for i in range(len(scenes_out) - 1, 0, -1):
        scenes_out[i]["start"] = scenes_out[i - 1]["end"]
    scenes_out[0]["start"] = 0.0

    narr = np.zeros(int(total * SR) + SR)
    for s in scenes_out:
        for ln in s["lines"]:
            place(narr, ln.pop("_audio"), ln["start"])
    narr = narr[: int(total * SR)]
    write_wav(os.path.join(AUDIO_DIR, "narration.wav"), narr * 0.95)

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
        "engine": "+".join(sorted(engines)),
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
                        "words": [{"text": w["text"], "startFrame": F(w["start"]), "endFrame": F(w["end"])} for w in ln["words"]],
                    }
                    for ln in s["lines"]
                ],
            }
            for s in scenes_out
        ],
        "mouth": mouth,
    }
    os.makedirs(os.path.dirname(TIMELINE), exist_ok=True)
    with open(TIMELINE, "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False)

    hook_end = scenes_out[0]["lines"][0]["end"]
    print(f"OK: {total:.2f}s ({n_frames} frames) | fala {speech:.1f}s | pausa entre cenas {scene_gap:.2f}s | final {outro:.2f}s | voz: {timeline['engine']}")
    if natural > target + 0.5:
        print(f"AVISO: a narração ({natural:.1f}s) passa da duração alvo ({target:.0f}s). Encurte o texto ou acelere a voz.", file=sys.stderr)
    if outro > 6:
        print(f"AVISO: sobram {outro:.1f}s no final. Escreva mais narração para preencher {target:.0f}s.", file=sys.stderr)
    if hook_end > 3.2:
        print(f"AVISO: a frase do gancho termina em {hook_end:.1f}s; ela deve caber nos primeiros 3 segundos.", file=sys.stderr)


if __name__ == "__main__":
    main()
