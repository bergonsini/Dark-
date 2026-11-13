#!/usr/bin/env python3
"""
Gera TODO o áudio do vídeo + a linha do tempo usada pelo Remotion.

Saídas:
  public/audio/narration.wav   -> narração completa (PT-BR)
  public/audio/music.wav       -> trilha de fundo original (gerada por código, livre de direitos)
  public/audio/sfx_*.wav       -> efeitos sonoros (gerados por código, livres de direitos)
  src/timeline.json            -> cenas, legendas palavra-a-palavra e amplitude da boca (lip-sync)

Provedores de voz (variável TTS_PROVIDER):
  kokoro      (padrão) voz neural offline, roda local. Baixa o modelo do GitHub na 1ª vez.
  edge        vozes neurais da Microsoft (pt-BR-AntonioNeural etc.). Precisa de internet.
  elevenlabs  ElevenLabs (mais natural de todas). Precisa de ELEVENLABS_API_KEY.

Exemplos:
  python3 scripts/generate_audio.py
  TTS_PROVIDER=edge EDGE_VOICE=pt-BR-AntonioNeural python3 scripts/generate_audio.py
  TTS_PROVIDER=elevenlabs ELEVENLABS_API_KEY=xxx ELEVENLABS_VOICE_ID=yyy python3 scripts/generate_audio.py
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
TIMELINE = ROOT / "src" / "timeline.json"
MODELS_DIR = Path(os.environ.get("KOKORO_DIR", ROOT / "models"))
FPS = 30
SR = 44100

# --------------------------------------------------------------------------
# ROTEIRO — cada cena tem frases (texto falado, pausa depois em segundos).
# O Remotion usa o "id" da cena para escolher a animação.
# --------------------------------------------------------------------------
SCRIPT = [
    {
        "id": "hook",
        "lead": 0.12,
        "lines": [
            ("Você sobreviveria um dia como homem das cavernas?", 0.35),
        ],
    },
    {
        "id": "intro",
        "lines": [
            ("Esse é o Gruk.", 0.15),
            ("Há quarenta mil anos, não existia casa, nem mercado...", 0.1),
            ("nem celular!", 0.35),
        ],
    },
    {
        "id": "choice",
        "lines": [
            ("Pra jantar, você tinha duas escolhas:", 0.2),
            ("enfrentar um mamute gigante...", 0.15),
            ("ou coletar frutas e raízes, com bem menos perigo.", 0.4),
        ],
    },
    {
        "id": "curiosity",
        "lines": [
            ("Curiosidade!", 0.15),
            ("Dominar o fogo mudou tudo.", 0.15),
            ("Cozinhar a comida ajudou o nosso cérebro a crescer.", 0.4),
        ],
    },
    {
        "id": "night",
        "lines": [
            ("À noite, todo mundo dormia junto na caverna,", 0.05),
            ("pintando histórias nas paredes.", 0.4),
        ],
    },
    {
        "id": "cta",
        "lines": [
            ("E aí?", 0.12),
            ("Você ia caçar o mamute, ou coletar frutas?", 0.15),
            ("Comenta aqui embaixo!", 0.0),
        ],
        "tail": 1.2,
    },
]


# --------------------------------------------------------------------------
# Utilidades de áudio
# --------------------------------------------------------------------------
def resample(x: np.ndarray, sr_in: int, sr_out: int = SR) -> np.ndarray:
    if sr_in == sr_out:
        return x.astype(np.float32)
    n_out = int(round(len(x) * sr_out / sr_in))
    t_in = np.linspace(0, 1, len(x), endpoint=False)
    t_out = np.linspace(0, 1, n_out, endpoint=False)
    return np.interp(t_out, t_in, x).astype(np.float32)


def decode_with_ffmpeg(path: str) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        check=True,
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def trim_silence(x: np.ndarray, thresh: float = 0.012, pad: float = 0.03) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    p = int(pad * SR)
    return x[max(0, idx[0] - p): min(len(x), idx[-1] + p)]


# --------------------------------------------------------------------------
# Provedores de TTS -> retornam float32 mono em 44.1 kHz
# --------------------------------------------------------------------------
class KokoroTTS:
    URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"

    def __init__(self):
        from kokoro_onnx import Kokoro  # pip install kokoro-onnx

        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        for f in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
            dst = MODELS_DIR / f
            if not dst.exists():
                print(f"Baixando {f} ...")
                urllib.request.urlretrieve(self.URL + f, dst)
        self.k = Kokoro(str(MODELS_DIR / "kokoro-v1.0.onnx"), str(MODELS_DIR / "voices-v1.0.bin"))
        self.voice = os.environ.get("KOKORO_VOICE", "pm_alex")
        self.speed = float(os.environ.get("KOKORO_SPEED", "1.08"))

    def say(self, text: str) -> np.ndarray:
        samples, sr = self.k.create(text, voice=self.voice, speed=self.speed, lang="pt-br")
        return resample(np.asarray(samples, dtype=np.float32), sr)


class EdgeTTS:
    def __init__(self):
        import edge_tts  # pip install edge-tts

        self.edge_tts = edge_tts
        self.voice = os.environ.get("EDGE_VOICE", "pt-BR-AntonioNeural")
        self.rate = os.environ.get("EDGE_RATE", "+8%")

    def say(self, text: str) -> np.ndarray:
        import asyncio

        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            path = tmp.name
        comm = self.edge_tts.Communicate(
            text, self.voice, rate=self.rate, proxy=os.environ.get("HTTPS_PROXY")
        )
        asyncio.run(comm.save(path))
        return decode_with_ffmpeg(path)


class ElevenLabsTTS:
    def __init__(self):
        self.key = os.environ["ELEVENLABS_API_KEY"]
        # Voz padrão multilíngue; troque por uma voz PT-BR da sua biblioteca.
        self.voice = os.environ.get("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
        self.model = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")

    def say(self, text: str) -> np.ndarray:
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice}",
            data=json.dumps(
                {
                    "text": text,
                    "model_id": self.model,
                    "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.45},
                }
            ).encode(),
            headers={"xi-api-key": self.key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        )
        with urllib.request.urlopen(req) as r, tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            tmp.write(r.read())
            path = tmp.name
        return decode_with_ffmpeg(path)


def get_tts():
    name = os.environ.get("TTS_PROVIDER", "kokoro").lower()
    print(f"Provedor de voz: {name}")
    return {"kokoro": KokoroTTS, "edge": EdgeTTS, "elevenlabs": ElevenLabsTTS}[name]()


# --------------------------------------------------------------------------
# Tempo de cada palavra dentro de uma frase (proporcional às sílabas aprox.)
# --------------------------------------------------------------------------
VOWELS = "aeiouáéíóúâêôãõàü"


def word_weight(w: str) -> float:
    core = re.sub(r"[^\wÀ-ÿ]", "", w.lower())
    groups = re.findall(f"[{VOWELS}y]+", core)
    syl = max(1, len(groups))
    punct = 0.6 if re.search(r"[,.!?:…]$", w) else 0.0
    return syl + 0.15 * len(core) / 4 + punct


def words_with_times(text: str, start: float, dur: float):
    words = text.split()
    weights = np.array([word_weight(w) for w in words], dtype=float)
    edges = np.concatenate([[0], np.cumsum(weights)]) / weights.sum() * dur
    out = []
    for i, w in enumerate(words):
        out.append({"word": w, "start": round(start + edges[i], 3), "end": round(start + edges[i + 1], 3)})
    return out


# --------------------------------------------------------------------------
# Narração + timeline
# --------------------------------------------------------------------------
def build_narration():
    tts = get_tts()
    chunks: list[np.ndarray] = []
    t = 0.0
    scenes = []
    words = []
    for scene in SCRIPT:
        s_start = t
        lead = scene.get("lead", 0.0)
        if lead:
            chunks.append(np.zeros(int(lead * SR), np.float32))
            t += lead
        for text, pause in scene["lines"]:
            print(f"  [{scene['id']}] {text}")
            audio = trim_silence(tts.say(text))
            peak = np.max(np.abs(audio)) or 1.0
            audio = audio / peak * 0.92
            dur = len(audio) / SR
            words += words_with_times(text, t + 0.03, dur - 0.06)
            chunks.append(audio)
            t += dur
            if pause:
                chunks.append(np.zeros(int(pause * SR), np.float32))
                t += pause
        tail = scene.get("tail", 0.0)
        if tail:
            chunks.append(np.zeros(int(tail * SR), np.float32))
            t += tail
        scenes.append({"id": scene["id"], "start": round(s_start, 3), "end": round(t, 3)})

    narration = np.concatenate(chunks)
    return narration, scenes, words


def mouth_envelope(x: np.ndarray, total_frames: int):
    hop = SR // FPS
    env = []
    for f in range(total_frames):
        seg = x[f * hop:(f + 1) * hop]
        env.append(float(np.sqrt(np.mean(seg**2))) if len(seg) else 0.0)
    env = np.array(env)
    env = np.clip(env / (np.percentile(env[env > 0], 95) if np.any(env > 0) else 1), 0, 1)
    return [round(float(v), 3) for v in env]


# --------------------------------------------------------------------------
# Síntese de música e efeitos (100% originais, gerados matematicamente)
# --------------------------------------------------------------------------
rng = np.random.default_rng(7)


def env_exp(n, decay):
    return np.exp(-np.arange(n) / SR * decay).astype(np.float32)


def lowpass(x, alpha):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def tom(freq=90, dur=0.45, drop=2.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 + drop * np.exp(-t * 30))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * env_exp(n, 9)).astype(np.float32)


def shaker(dur=0.08):
    n = int(dur * SR)
    noise = rng.standard_normal(n).astype(np.float32)
    hp = noise - lowpass(noise, 0.3)
    return hp * env_exp(n, 60) * 0.5


def marimba(freq, dur=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 25)
    return (tone * env_exp(n, 7)).astype(np.float32)


def place(buf, clip, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i]


def make_music(seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    out = np.zeros(n, np.float32)
    bpm = 104
    beat = 60 / bpm
    # escala pentatônica menor em Ré (som "tribal")
    notes = [146.83, 174.61, 196.0, 220.0, 261.63, 293.66, 349.23, 392.0]
    melody = [0, 2, 3, 2, 4, 3, 2, 0, 5, 4, 3, 2, 3, 2, 1, 0]
    bass = [73.42, 73.42, 87.31, 65.41]
    t = 0.0
    k = 0
    while t < seconds:
        bar_pos = k % 8
        if bar_pos in (0, 3, 6):
            place(out, tom(85, 0.5) * 0.9, t)
        if bar_pos in (2, 5):
            place(out, tom(150, 0.3, 1.5) * 0.55, t)
        place(out, shaker() * (0.5 if k % 2 else 0.3), t)
        place(out, shaker() * 0.25, t + beat / 2)
        if k % 2 == 0:
            m = melody[(k // 2) % len(melody)]
            place(out, marimba(notes[m] * 2) * 0.22, t)
        if k % 8 == 0:
            f = bass[(k // 8) % len(bass)]
            nb = int(beat * 8 * SR)
            tt = np.arange(nb) / SR
            drone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) * 0.18
            drone *= np.minimum(1, tt * 4) * np.minimum(1, (tt[-1] - tt) * 4)
            place(out, drone.astype(np.float32), t)
        t += beat
        k += 1
    # fade in/out
    fade = int(0.4 * SR)
    out[:fade] *= np.linspace(0, 1, fade)
    out[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
    return out / np.max(np.abs(out)) * 0.8


def sfx_whoosh():
    n = int(0.45 * SR)
    noise = rng.standard_normal(n).astype(np.float32)
    t = np.linspace(0, 1, n)
    alpha = 0.02 + 0.35 * np.sin(np.pi * t) ** 2
    y = np.empty_like(noise)
    acc = 0.0
    for i in range(n):
        acc += alpha[i] * (noise[i] - acc)
        y[i] = acc
    return y * np.sin(np.pi * t) ** 1.5 * 2.0


def sfx_pop():
    n = int(0.15 * SR)
    t = np.arange(n) / SR
    f = 300 + 1400 * t / t[-1]
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 30)


def sfx_ding():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(1318.5, 1), (1975.5, 0.5), (2637, 0.3), (3951, 0.15)])
    return y * env_exp(n, 4) * 0.5


def sfx_roar():
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    f = 220 + 160 * np.sin(np.pi * t / t[-1]) + 12 * np.sin(2 * np.pi * 7 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    rough = rng.standard_normal(n) * 0.25
    y = lowpass((saw + rough).astype(np.float32), 0.12)
    shape = np.minimum(1, t * 8) * np.minimum(1, (t[-1] - t) * 3)
    return y * shape * 1.6


def sfx_fire():
    n = int(2.5 * SR)
    y = lowpass(rng.standard_normal(n).astype(np.float32), 0.05) * 0.6
    for _ in range(70):
        c = rng.integers(0, n - 800)
        click = rng.standard_normal(400) * env_exp(400, 300) * rng.uniform(0.2, 0.9)
        y[c:c + 400] += click
    t = np.arange(n) / SR
    return y * np.minimum(1, t * 3) * np.minimum(1, (t[-1] - t) * 2)


def sfx_boing():
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 180 + 120 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4) + 200 * t
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 5)


def sfx_tick():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1800 * t) * env_exp(n, 70)


def sfx_drum():
    body = tom(70, 0.8, 3.0)
    snap = shaker(0.1) * 0.6
    body[: len(snap)] += snap
    return body


def sfx_swoosh_up():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = 200 + 1600 * (t / t[-1]) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    noise = rng.standard_normal(n) * 0.15
    return (tone + noise) * np.sin(np.pi * t / t[-1])


def norm(x, peak=0.9):
    x = np.asarray(x, np.float32)
    return x / (np.max(np.abs(x)) or 1) * peak


def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print("Gerando narração...")
    narration, scenes, words = build_narration()
    total = len(narration) / SR
    total_frames = int(np.ceil(total * FPS))
    sf.write(AUDIO_DIR / "narration.wav", narration, SR)

    print("Gerando música...")
    sf.write(AUDIO_DIR / "music.wav", make_music(total + 0.5), SR)

    print("Gerando efeitos sonoros...")
    sfx = {
        "whoosh": sfx_whoosh(),
        "pop": sfx_pop(),
        "ding": sfx_ding(),
        "roar": sfx_roar(),
        "fire": sfx_fire(),
        "boing": sfx_boing(),
        "tick": sfx_tick(),
        "drum": sfx_drum(),
        "swoosh_up": sfx_swoosh_up(),
    }
    for name, clip in sfx.items():
        sf.write(AUDIO_DIR / f"sfx_{name}.wav", norm(clip), SR)

    timeline = {
        "fps": FPS,
        "durationInFrames": total_frames,
        "seconds": round(total, 3),
        "scenes": scenes,
        "words": words,
        "mouth": mouth_envelope(narration, total_frames),
    }
    TIMELINE.write_text(json.dumps(timeline, ensure_ascii=False))
    print(f"OK! Duração total: {total:.2f}s ({total_frames} frames)")
    for s in scenes:
        print(f"  {s['id']:10s} {s['start']:6.2f}s -> {s['end']:6.2f}s")


if __name__ == "__main__":
    sys.exit(main())
