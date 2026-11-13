#!/usr/bin/env python3
"""
Instala as vozes GRATUITAS em português brasileiro usadas pela skill cartoon-explainer.

  1. Kokoro-82M (Apache 2.0, roda offline): pip install kokoro-onnx soundfile + modelo (~350 MB) do GitHub
  2. edge-tts (voz neural Microsoft, gratuita, sem chave, precisa de internet): pip install edge-tts

Nada aqui é pago. A ElevenLabs (paga) não é instalada nem chamada por este script.
Uso: python3 .claude/skills/cartoon-explainer/scripts/instalar_voz.py
"""
import os
import subprocess
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import voz  # noqa: E402

BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
FILES = {"kokoro-v1.0.onnx": 300_000_000, "voices-v1.0.bin": 25_000_000}


def pip(*pkgs):
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", *pkgs], check=False)


def main():
    print("1/3 pacotes Python (kokoro-onnx, soundfile, edge-tts)...")
    pip("kokoro-onnx", "soundfile", "edge-tts")
    os.makedirs(voz.CACHE, exist_ok=True)
    print(f"2/3 modelo Kokoro em {voz.CACHE}")
    for name, min_size in FILES.items():
        dst = os.path.join(voz.CACHE, name)
        if os.path.exists(dst) and os.path.getsize(dst) >= min_size:
            print(f"   {name}: já instalado")
            continue
        print(f"   baixando {name}...")
        urllib.request.urlretrieve(BASE + name, dst + ".part")
        os.replace(dst + ".part", dst)
    print("3/3 testando motores gratuitos...")
    for nome in ("edge", "kokoro", "mbrola"):
        m = voz.MOTORES[nome]
        if not m.disponivel():
            print(f"   {nome}: não instalado")
            continue
        try:
            import tempfile
            with tempfile.TemporaryDirectory() as tmp:
                m.sintetizar("Teste de voz.", {}, {}, tmp)
            print(f"   {nome}: OK")
        except Exception as e:
            print(f"   {nome}: indisponível ({str(e)[:70]})")
    print("Pronto. Rode: npm run audio")


if __name__ == "__main__":
    main()
