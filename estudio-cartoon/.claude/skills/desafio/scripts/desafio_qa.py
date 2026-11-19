#!/usr/bin/env python3
"""Conferência do canal 4: usa o qa_check do Tito sem timeline (não há narração) e com a duração do desafio ativo."""
import json
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
cfg = json.load(open(os.path.join(ROOT, "desafios", "ativo.json"), encoding="utf-8"))
qa = os.path.join(ROOT, ".claude", "skills", "cartoon-explainer", "scripts", "qa_check.py")
r = subprocess.run([sys.executable, qa, os.path.join(ROOT, "out", "desafio.mp4"), "--alvo", str(cfg["duracaoFrames"] / 30), "--timeline", "desafios/sem-narracao.json"])
sys.exit(r.returncode)
