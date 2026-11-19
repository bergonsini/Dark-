#!/usr/bin/env python3
"""Canal 4 (desafio do pause): SEM narração. Gera só a música (arcade) e os efeitos sonoros em public/desafio/audio,
reaproveitando os sintetizadores do gerador do Tito. Custo zero (nada é pago)."""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, ".claude", "skills", "cartoon-explainer", "scripts"))
import generate_audio as ga  # noqa: E402

cfg = json.load(open(os.path.join(ROOT, "desafios", "ativo.json"), encoding="utf-8"))
dur = cfg["duracaoFrames"] / 30
out = os.path.join(ROOT, "public", "desafio", "audio")
os.makedirs(os.path.join(out, "sfx"), exist_ok=True)
ga.write_wav(os.path.join(out, "music.wav"), ga.make_music(dur + 1, cfg.get("musica", {})), stereo=True)
for nome, dado in ga.make_sfx().items():
    ga.write_wav(os.path.join(out, "sfx", f"{nome}.wav"), dado)
print(f"OK: música {dur:.1f}s + efeitos em public/desafio/audio (sem narração, custo zero)")
