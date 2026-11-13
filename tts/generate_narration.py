#!/usr/bin/env python3
"""
Gera a narração em português brasileiro (voz masculina neural, Kokoro TTS - roda 100% offline)
e o arquivo de tempos usado pelas legendas sincronizadas.

Saídas:
  public/audio/narration.wav      -> narração final (masterizada)
  src/data/timings.json           -> início/fim de cada trecho + tempo de cada palavra

Uso:
  python3 tts/generate_narration.py
"""
import json
import os
import re
import subprocess
import sys

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "tts", "models")
MODEL = os.path.join(MODELS, "kokoro-v1.0.onnx")
VOICES = os.path.join(MODELS, "voices-v1.0.bin")
MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"

SCRIPT = os.path.join(ROOT, "tts", "script.json")
OUT_WAV = os.path.join(ROOT, "public", "audio", "narration.wav")
OUT_JSON = os.path.join(ROOT, "src", "data", "timings.json")

SR = 24000
LEAD_IN = 0.20  # segundos de silêncio antes da primeira fala


def ensure_models():
    os.makedirs(MODELS, exist_ok=True)
    for name in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
        path = os.path.join(MODELS, name)
        if not os.path.exists(path):
            print(f"Baixando {name} ...")
            subprocess.check_call(["curl", "-sSL", "-o", path, MODEL_URL + name])


def trim(audio, thr=0.01, pad=0.03):
    idx = np.where(np.abs(audio) > thr)[0]
    if len(idx) == 0:
        return audio
    a = max(0, idx[0] - int(pad * SR))
    b = min(len(audio), idx[-1] + int(pad * SR))
    return audio[a:b]


def find_gaps(audio, min_gap=0.09, thr=0.012):
    """Retorna lista de (centro_seg, duração) de silêncios internos."""
    win = int(0.01 * SR)
    n = len(audio) // win
    env = np.array([np.abs(audio[i * win:(i + 1) * win]).max() for i in range(n)])
    silent = env < thr
    gaps = []
    i = 0
    while i < n:
        if silent[i]:
            j = i
            while j < n and silent[j]:
                j += 1
            dur = (j - i) * 0.01
            if i > 0 and j < n and dur >= min_gap:
                gaps.append(((i + j) / 2 * 0.01, dur))
            i = j
        else:
            i += 1
    return gaps


VOWELS = "aeiouáéíóúâêôãõàü"


def syllables(word):
    w = word.lower()
    groups = re.findall(f"[{VOWELS}y]+", w)
    return max(1, len(groups))


def split_phrases(text):
    """Divide em frases nos sinais de pontuação, mantendo as palavras."""
    words = text.split()
    phrases, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r"[,.?!:;]$|\.\.\.$", w):
            phrases.append(cur)
            cur = []
    if cur:
        phrases.append(cur)
    return phrases


def word_timings(text, audio, offset):
    dur = len(audio) / SR
    phrases = split_phrases(text)
    gaps = find_gaps(audio)
    # escolhe as (n-1) maiores pausas, em ordem temporal, como fronteiras das frases
    need = len(phrases) - 1
    # posição esperada de cada fronteira (proporcional às sílabas)
    total = sum(syllables(w) for p in phrases for w in p)
    acc, expected = 0, []
    for p in phrases[:-1]:
        acc += sum(syllables(w) for w in p)
        expected.append(acc / total * dur)
    # para cada fronteira esperada, procura o ponto de menor energia (a pausa real) por perto
    win = int(0.01 * SR)
    n = len(audio) // win
    env = np.array([np.sqrt(np.mean(audio[i * win:(i + 1) * win] ** 2)) for i in range(n)])
    env = np.convolve(env, np.ones(6) / 6, mode="same")
    bounds = []
    prev = 0.0
    for e in expected:
        lo = max(int((e - 0.4) * 100), int(prev * 100) + 10, 1)
        hi = min(int((e + 0.4) * 100), n - 2)
        if hi <= lo:
            bounds.append((max(e, prev), max(e, prev)))
        else:
            k = lo + int(np.argmin(env[lo:hi]))
            # expande a região silenciosa ao redor do mínimo
            thr = env[k] * 2.0 + 1e-4
            a = k
            while a > lo and env[a - 1] < thr:
                a -= 1
            b = k
            while b < hi and env[b + 1] < thr:
                b += 1
            bounds.append((a / 100, (b + 1) / 100))
        prev = bounds[-1][1]
    spans = []
    start = 0.0
    for i, p in enumerate(phrases):
        end = bounds[i][0] if i < len(bounds) else dur
        spans.append((start, end))
        if i < len(bounds):
            start = bounds[i][1]
    words = []
    for p, (a, b) in zip(phrases, spans):
        weights = [syllables(w) + 0.6 for w in p]
        tot = sum(weights)
        t = a
        for w, wt in zip(p, weights):
            d = (b - a) * wt / tot
            words.append({"word": w, "start": round(offset + t, 3), "end": round(offset + t + d, 3)})
            t += d
    return words


def main():
    ensure_models()
    from kokoro_onnx import Kokoro

    cfg = json.load(open(SCRIPT, encoding="utf-8"))
    kokoro = Kokoro(MODEL, VOICES)
    voice = cfg.get("voice", "pm_alex")
    speed = cfg.get("speed", 1.0)

    pieces = [np.zeros(int(LEAD_IN * SR), dtype=np.float32)]
    t = LEAD_IN
    segments = []
    for seg in cfg["segments"]:
        print(f"  -> {seg['id']}: {seg['text']}")
        samples, sr = kokoro.create(seg["text"], voice=voice, speed=speed, lang="pt-br")
        assert sr == SR
        audio = trim(np.asarray(samples, dtype=np.float32))
        dur = len(audio) / SR
        words = word_timings(seg["text"], audio, t)
        segments.append({
            "id": seg["id"],
            "text": seg["text"],
            "start": round(t, 3),
            "end": round(t + dur, 3),
            "words": words,
        })
        pieces.append(audio)
        pause = seg.get("pauseAfter", 0.3)
        pieces.append(np.zeros(int(pause * SR), dtype=np.float32))
        t += dur + pause

    full = np.concatenate(pieces)
    os.makedirs(os.path.dirname(OUT_WAV), exist_ok=True)
    raw = OUT_WAV.replace(".wav", ".raw.wav")
    sf.write(raw, full, SR)

    # masterização leve: tira graves sujos, dá presença na voz, comprime e normaliza (-16 LUFS)
    subprocess.check_call([
        "ffmpeg", "-y", "-loglevel", "error", "-i", raw,
        "-af",
        "highpass=f=75,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.2:g=2.5,"
        "acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=7",
        "-ar", "48000", OUT_WAV,
    ])
    os.remove(raw)

    total = round(t, 3)
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    json.dump({"fps": 30, "totalSeconds": total, "segments": segments},
              open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"Narração pronta: {total:.2f}s -> {OUT_WAV}")
    print(f"Tempos das legendas -> {OUT_JSON}")


if __name__ == "__main__":
    sys.exit(main())
