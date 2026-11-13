#!/usr/bin/env python3
"""
Gera TODO o áudio do vídeo e a linha do tempo usada pelo Remotion.

  1. Narração em português brasileiro (uma faixa por frase)
       --engine edge    -> voz neural Microsoft (pt-BR-AntonioNeural) via `pip install edge-tts`
                           (precisa de internet com acesso a speech.platform.bing.com)
       --engine mbrola  -> voz offline espeak-ng + MBROLA br3 (apt install espeak-ng mbrola mbrola-br3)
       --engine espeak  -> voz offline espeak-ng pura (fallback final)
       --engine auto    -> tenta edge, depois mbrola, depois espeak (padrão)
  2. Trilha de fundo original (sintetizada aqui -> 100% livre de direitos autorais)
  3. Efeitos sonoros (whoosh, boom, pop, ding, brilho, fogo) também sintetizados
  4. public/timeline.json com tempos de cena/frase/palavra e envelope da boca (lip-sync)

Uso:  python3 scripts/generate_audio.py [--engine auto|edge|mbrola|espeak]
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

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
AUDIO_DIR = os.path.join(PUBLIC, "audio")
SR = 48000

LEAD_IN = 0.15          # silêncio antes da primeira fala (s)
LINE_GAP = 0.12         # pausa entre frases da mesma cena (s)
SCENE_GAP = 0.30        # pausa entre cenas (s)
OUTRO = 2.6             # tempo extra no final para a pergunta final (s)


# ----------------------------------------------------------------------------- utils
def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def to_mono_48k(src, dst):
    """Converte qualquer áudio para wav mono 48 kHz, com leve compressão e normalização."""
    run([
        "ffmpeg", "-y", "-i", src,
        "-af", "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=60,loudnorm=I=-16:TP=-1.5:LRA=7",
        "-ac", "1", "-ar", str(SR), dst,
    ])


def read_wav(path):
    with wave.open(path, "rb") as w:
        n = w.getnframes()
        data = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768.0
        ch = w.getnchannels()
        if ch > 1:
            data = data.reshape(-1, ch).mean(axis=1)
        return data


def write_wav(path, data, stereo=False):
    data = np.clip(data, -1, 1)
    pcm = (data * 32767).astype(np.int16)
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
    b = min(len(x), idx[-1] + int(0.04 * SR))
    return x[a:b]


# ----------------------------------------------------------------------------- TTS engines
def tts_edge(text, out_path, cfg):
    import edge_tts  # noqa: F401  (pip install edge-tts)

    async def go():
        kwargs = {}
        proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        if proxy:
            kwargs["proxy"] = proxy
        com = edge_tts.Communicate(text, cfg["edge"], rate=cfg.get("edgeRate", "+0%"), **kwargs)
        await com.save(out_path)

    asyncio.run(asyncio.wait_for(go(), timeout=30))
    if not os.path.exists(out_path) or os.path.getsize(out_path) < 1000:
        raise RuntimeError("edge-tts não gerou áudio")


def tts_espeak(text, out_path, cfg, mbrola):
    exe = shutil.which("espeak-ng") or shutil.which("espeak")
    if not exe:
        raise RuntimeError("espeak-ng não instalado")
    voice = cfg["mbrola"] if mbrola else "pt-br"
    if mbrola and not os.path.exists(f"/usr/share/mbrola/{voice.replace('mb-', '')}"):
        raise RuntimeError("voz MBROLA não instalada")
    run([exe, "-v", voice, "-s", str(cfg["espeakSpeed"]), "-p", str(cfg["espeakPitch"]), "-w", out_path, text])
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
        except Exception as e:  # tenta o próximo motor
            last = e
    raise RuntimeError(f"Nenhum motor de voz funcionou: {last}")


# ----------------------------------------------------------------------------- synth helpers (música e SFX)
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env_exp(dur, decay):
    return np.exp(-t_axis(dur) * decay)


def noise(dur, seed=0):
    return np.random.default_rng(seed).uniform(-1, 1, int(dur * SR))


def lowpass_fast(x, cutoff):
    # versão vetorizada aproximada via média móvel em cascata
    n = max(1, int(SR / (cutoff * 2.2)))
    k = np.ones(n) / n
    y = np.convolve(x, k, mode="same")
    return np.convolve(y, k, mode="same")


def tom(freq, dur=0.5, decay=9, drop=0.5):
    t = t_axis(dur)
    f = freq * (1 + drop * np.exp(-t * 30))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_exp(dur, decay)


def shaker(dur=0.09, seed=1):
    x = noise(dur, seed)
    x = x - lowpass_fast(x, 4000)
    return x * env_exp(dur, 45) * 0.6


def marimba(freq, dur=0.6):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 25)
    return s * env_exp(dur, 7) * (1 - np.exp(-t * 400))


def bass(freq, dur=0.4):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t)
    return s * env_exp(dur, 6) * (1 - np.exp(-t * 300))


def place(buf, clip, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i] * gain


def make_music(total_s):
    """Trilha 'tribal' alegre: tambores + shaker + marimba pentatônica + baixo. 105 BPM."""
    bpm = 105
    beat = 60 / bpm
    L = total_s + 1
    left = np.zeros(int(L * SR))
    right = np.zeros(int(L * SR))
    # escala pentatônica de Ré
    scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25]
    melody = [0, 2, 4, 2, 5, 4, 2, 1, 0, 2, 4, 6, 5, 4, 2, None,
              4, 5, 6, 5, 4, 2, 4, None, 2, 1, 0, 1, 2, 4, 2, None]
    basses = [146.83, 146.83, 196.0, 220.0]
    rng = np.random.default_rng(7)
    n_beats = int(L / beat)
    for b in range(n_beats):
        t0 = b * beat
        bar_pos = b % 4
        # bumbo/tom grave
        if bar_pos in (0, 2) or (bar_pos == 3 and b % 8 == 7):
            k = tom(70, 0.45, 8, 1.2)
            place(left, k, t0, 0.9)
            place(right, k, t0, 0.9)
        # tom médio sincopado
        if bar_pos in (1, 3):
            m = tom(150, 0.3, 14, 0.6)
            place(left, m, t0 + beat * 0.5, 0.35)
            place(right, m, t0 + beat * 0.5, 0.25)
        # shaker em colcheias
        for h in range(2):
            s = shaker(0.08, seed=int(rng.integers(0, 9999)))
            g = 0.22 if h == 1 else 0.12
            place(left, s, t0 + h * beat / 2, g * 0.7)
            place(right, s, t0 + h * beat / 2, g)
        # baixo
        if bar_pos == 0:
            bf = basses[(b // 4) % len(basses)]
            bb = bass(bf, beat * 1.8)
            place(left, bb, t0, 0.35)
            place(right, bb, t0, 0.35)
        # marimba (entra depois do gancho)
        if b >= 4:
            for h in range(2):
                note = melody[((b - 4) * 2 + h) % len(melody)]
                if note is not None:
                    mm = marimba(scale[note], 0.5)
                    place(left, mm, t0 + h * beat / 2, 0.16)
                    place(right, mm, t0 + h * beat / 2 + 0.012, 0.20)
    # fade in/out
    fade_in = np.minimum(1, t_axis(L) / 0.4)
    fade_out = np.clip((L - 1 - t_axis(L)) / 1.5, 0, 1)
    env = fade_in * fade_out
    left *= env
    right *= env
    st = np.stack([left, right], axis=1)
    st /= np.max(np.abs(st)) + 1e-9
    return (st * 0.8).reshape(-1)


def make_sfx():
    sfx = {}
    # whoosh: ruído filtrado com varredura de volume
    d = 0.45
    t = t_axis(d)
    x = noise(d, 3)
    x = lowpass_fast(x, 2500) - lowpass_fast(x, 300)
    sfx["whoosh"] = x * np.sin(np.pi * t / d) ** 2 * 3.0
    # boom: seno grave descendo + ruído
    d = 1.2
    t = t_axis(d)
    f = 45 + 90 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    boom += lowpass_fast(noise(d, 4), 400) * np.exp(-t * 9) * 1.5
    sfx["boom"] = boom
    # pop
    d = 0.14
    t = t_axis(d)
    f = 500 + 900 * np.exp(-t * 60)
    sfx["pop"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)
    # ding (duas notas)
    d = 0.9
    t = t_axis(d)
    ding = (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 5)
    ding2 = np.zeros_like(ding)
    off = int(0.09 * SR)
    ding2[off:] = (np.sin(2 * np.pi * 1760 * t) * np.exp(-t * 5))[: len(ding) - off]
    sfx["ding"] = (ding + ding2) * 0.6
    # sparkle: arpejo rápido agudo
    d = 0.8
    sp = np.zeros(int(d * SR))
    for i, fr in enumerate([1568, 2093, 2637, 3136, 4186]):
        tt = t_axis(0.35)
        place(sp, np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 12), i * 0.06, 0.5)
    sfx["sparkle"] = sp
    # stomp: passo pesado do mamute
    d = 0.6
    t = t_axis(d)
    st = np.sin(2 * np.pi * np.cumsum(35 + 60 * np.exp(-t * 20)) / SR) * np.exp(-t * 7)
    st += lowpass_fast(noise(d, 5), 250) * np.exp(-t * 14) * 2
    sfx["stomp"] = st
    # fogo crepitando
    d = 2.5
    fire = lowpass_fast(noise(d, 6), 800) * 0.4
    rng = np.random.default_rng(9)
    for _ in range(45):
        cl = noise(0.012, int(rng.integers(0, 9999))) * np.exp(-t_axis(0.012) * 300)
        place(fire, cl, rng.uniform(0, d - 0.02), rng.uniform(0.3, 1.0))
    fire *= np.minimum(1, t_axis(d) / 0.2) * np.clip((d - t_axis(d)) / 0.4, 0, 1)
    sfx["fire"] = fire
    # stamp (carimbo do X)
    d = 0.25
    t = t_axis(d)
    stamp = lowpass_fast(noise(d, 8), 1200) * np.exp(-t * 25) * 2 + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 20)
    sfx["stamp"] = stamp
    # normaliza cada SFX
    for k, v in sfx.items():
        sfx[k] = v / (np.max(np.abs(v)) + 1e-9) * 0.9
    return sfx


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default=os.environ.get("TTS_ENGINE", "auto"), choices=["auto", "edge", "mbrola", "espeak"])
    args = ap.parse_args()

    with open(os.path.join(ROOT, "scripts", "narration.json"), encoding="utf-8") as f:
        script = json.load(f)
    fps = script["fps"]
    cfg = script["voice"]

    os.makedirs(AUDIO_DIR, exist_ok=True)
    os.makedirs(os.path.join(AUDIO_DIR, "sfx"), exist_ok=True)

    # ---- 1) narração
    clips = []
    engines_used = set()
    with tempfile.TemporaryDirectory() as tmp:
        for si, scene in enumerate(script["scenes"]):
            for li, text in enumerate(scene["lines"]):
                out = os.path.join(tmp, f"{scene['id']}_{li}.wav")
                eng = synthesize(text, out, cfg, args.engine, tmp)
                engines_used.add(eng)
                clips.append((si, li, text, trim_silence(read_wav(out))))
                print(f"  [{eng}] {scene['id']}#{li}: {text}")

    # ---- 2) linha do tempo
    t = LEAD_IN
    scenes_out = []
    prev_scene = -1
    for si, li, text, audio in clips:
        if si != prev_scene:
            if prev_scene >= 0:
                t += SCENE_GAP
            scenes_out.append({"id": script["scenes"][si]["id"], "start": t, "lines": []})
            prev_scene = si
        elif li > 0:
            t += LINE_GAP
        dur = len(audio) / SR
        words = text.split()
        weights = [len(w.strip(",.?!:;")) + 1.5 for w in words]
        tot = sum(weights)
        acc = 0.0
        wl = []
        for w, wt in zip(words, weights):
            wl.append({"text": w, "start": round(t + dur * acc / tot, 3), "end": round(t + dur * (acc + wt) / tot, 3)})
            acc += wt
        scenes_out[-1]["lines"].append({"text": text, "start": round(t, 3), "end": round(t + dur, 3), "words": wl, "_audio": audio})
        t += dur
    total = t + OUTRO
    for i, s in enumerate(scenes_out):
        s["end"] = scenes_out[i + 1]["start"] - SCENE_GAP * 0.5 if i + 1 < len(scenes_out) else total
        if i + 1 < len(scenes_out):
            scenes_out[i + 1]["_visualStart"] = s["end"]
    scenes_out[0]["start"] = 0.0
    for s in scenes_out[1:]:
        s["start"] = s.pop("_visualStart")

    # mixa narração completa
    narr = np.zeros(int(total * SR) + SR)
    for s in scenes_out:
        for ln in s["lines"]:
            place(narr, ln.pop("_audio"), ln["start"])
    narr = narr[: int(total * SR)]
    write_wav(os.path.join(AUDIO_DIR, "narration.wav"), narr * 0.95)

    # envelope da boca por frame (lip-sync)
    spf = SR // fps
    n_frames = int(math.ceil(total * fps))
    mouth = []
    for fr in range(n_frames):
        seg = narr[fr * spf:(fr + 1) * spf]
        rms = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0
        mouth.append(rms)
    peak = np.percentile([m for m in mouth if m > 0.005] or [1], 90)
    mouth = [round(min(1.0, m / peak), 3) if m > 0.01 else 0.0 for m in mouth]

    # ---- 3) música e efeitos
    print("  gerando trilha sonora original...")
    write_wav(os.path.join(AUDIO_DIR, "music.wav"), make_music(total), stereo=True)
    for name, data in make_sfx().items():
        write_wav(os.path.join(AUDIO_DIR, "sfx", f"{name}.wav"), data)

    timeline = {
        "fps": fps,
        "durationInFrames": n_frames,
        "durationSeconds": round(total, 3),
        "engine": "+".join(sorted(engines_used)),
        "scenes": [
            {
                "id": s["id"],
                "startFrame": int(round(s["start"] * fps)),
                "endFrame": int(round(s["end"] * fps)),
                "lines": [
                    {
                        "text": ln["text"],
                        "startFrame": int(round(ln["start"] * fps)),
                        "endFrame": int(round(ln["end"] * fps)),
                        "words": [
                            {"text": w["text"], "startFrame": int(round(w["start"] * fps)), "endFrame": int(round(w["end"] * fps))}
                            for w in ln["words"]
                        ],
                    }
                    for ln in s["lines"]
                ],
            }
            for s in scenes_out
        ],
        "mouth": mouth,
    }
    with open(os.path.join(ROOT, "src", "timeline.json"), "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False)
    print(f"OK: {total:.2f}s ({n_frames} frames), motor de voz: {timeline['engine']}")
    if total < 25 or total > 35:
        print("AVISO: duração fora de 25-35s; ajuste o texto ou a velocidade em scripts/narration.json", file=sys.stderr)


if __name__ == "__main__":
    main()
