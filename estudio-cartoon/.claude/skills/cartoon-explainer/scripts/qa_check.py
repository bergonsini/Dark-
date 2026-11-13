#!/usr/bin/env python3
"""
cartoon-explainer: CONFERÊNCIA FINAL do MP4 (cenas, áudio, legendas e qualidade).

Uso (na raiz do projeto Remotion):
    python3 .claude/skills/cartoon-explainer/scripts/qa_check.py out/video.mp4 [--alvo 60]

Verifica:
  VÍDEO     codec H.264, yuv420p, 1080x1920, 30 fps, duração ≈ alvo (±1 s)
  ÁUDIO     faixa AAC presente, loudness integrada entre -20 e -11 LUFS, pico ≤ -0.5 dBTP,
            sem silêncio longo (> 2.5 s)
  ANIMAÇÃO  nenhum trecho congelado > 1.5 s (imagem parada = animação substituída) e sem tela preta
  ROTEIRO   gancho: primeira fala começa em ≤ 0.5 s e termina em ≤ 3.2 s; cenas cobrem o vídeo todo;
            legendas: toda fala tem palavras, em ordem, dentro da própria fala
  VISUAL    gera out/qa/contato.png (folha de contato: 0,5 s, 1,5 s, 2,5 s e o meio de cada cena)
            para inspeção visual. ABRA E OLHE esta imagem antes de entregar.
Sai com código 1 se algum item obrigatório falhar.
"""
import argparse
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
TIMELINE = os.path.join(ROOT, "src", "cartoon", "timeline.json")

results = []


def check(ok, name, detail, required=True):
    results.append((ok, name, detail, required))


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--alvo", type=float, default=None, help="duração alvo em segundos (padrão: timeline.json)")
    args = ap.parse_args()
    if not os.path.exists(args.video):
        print(f"Arquivo não encontrado: {args.video}")
        sys.exit(1)
    tl = json.load(open(TIMELINE, encoding="utf-8")) if os.path.exists(TIMELINE) else None
    alvo = args.alvo or (tl["durationSeconds"] if tl else 60)

    # ---------------- vídeo / container
    pr = json.loads(sh(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", args.video]).stdout)
    v = next((s for s in pr["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in pr["streams"] if s["codec_type"] == "audio"), None)
    dur = float(pr["format"]["duration"])
    check(args.video.lower().endswith(".mp4"), "formato MP4", os.path.basename(args.video))
    check(v is not None and v["codec_name"] == "h264", "codec de vídeo H.264", v and v["codec_name"])
    check(v is not None and v.get("pix_fmt") in ("yuv420p", "yuvj420p"), "pixel yuv420p (compatível com celulares)", v and v.get("pix_fmt"))
    check(v is not None and (v["width"], v["height"]) == (1080, 1920), "resolução 1080x1920 (9:16)", v and f'{v["width"]}x{v["height"]}')
    fps = eval(v["r_frame_rate"]) if v else 0  # noqa: S307 (fração vinda do ffprobe)
    check(abs(fps - 30) < 0.01, "30 fps", f"{fps:.2f}")
    check(abs(dur - alvo) <= 1.0, f"duração ≈ {alvo:.0f} s", f"{dur:.2f} s")
    check(a is not None and a["codec_name"] == "aac", "áudio AAC presente", a and a["codec_name"])

    # ---------------- loudness / silêncio
    if a is not None:
        eb = sh(["ffmpeg", "-nostats", "-i", args.video, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
        summ = eb[eb.rfind("Summary:"):]
        m_i = re.search(r"I:\s+(-?[\d.]+) LUFS", summ)
        m_p = re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ)
        lufs = float(m_i.group(1)) if m_i else -99
        peak = float(m_p.group(1)) if m_p else 0
        check(-20 <= lufs <= -11, "volume integrado entre -20 e -11 LUFS", f"{lufs:.1f} LUFS")
        check(peak <= -0.5, "pico ≤ -0.5 dBTP (sem estourar)", f"{peak:.1f} dBTP")
        sil = sh(["ffmpeg", "-nostats", "-i", args.video, "-af", "silencedetect=n=-45dB:d=2.5", "-f", "null", "-"]).stderr
        n_sil = len(re.findall(r"silence_start", sil))
        check(n_sil == 0, "sem silêncio > 2,5 s", f"{n_sil} trecho(s)")

    # ---------------- animação contínua (sem imagem congelada) e sem tela preta
    fr = sh(["ffmpeg", "-nostats", "-i", args.video, "-vf", "scale=270:480,freezedetect=n=0.002:d=1.5", "-an", "-f", "null", "-"]).stderr
    freezes = re.findall(r"freeze_start: ([\d.]+)", fr)
    check(len(freezes) == 0, "sem imagem congelada > 1,5 s (tudo animado)", ", ".join(f"{float(x):.1f}s" for x in freezes) or "ok")
    bl = sh(["ffmpeg", "-nostats", "-i", args.video, "-vf", "scale=270:480,blackdetect=d=0.3:pix_th=0.08", "-an", "-f", "null", "-"]).stderr
    blacks = re.findall(r"black_start:([\d.]+)", bl)
    check(len(blacks) == 0, "sem tela preta", ", ".join(blacks) or "ok")

    # ---------------- roteiro / legendas
    if tl:
        f = tl["fps"]
        first = tl["scenes"][0]["lines"][0]
        check(first["startFrame"] / f <= 0.5, "gancho: fala começa em ≤ 0,5 s", f'{first["startFrame"] / f:.2f} s')
        check(first["endFrame"] / f <= 3.2, "gancho: pergunta/afirmação termina em ≤ 3,2 s", f'{first["endFrame"] / f:.2f} s')
        sc = tl["scenes"]
        contiguous = sc[0]["startFrame"] == 0 and all(sc[i]["endFrame"] == sc[i + 1]["startFrame"] for i in range(len(sc) - 1))
        check(contiguous and sc[-1]["endFrame"] == tl["durationInFrames"], "cenas cobrem o vídeo inteiro, sem buracos", f"{len(sc)} cenas")
        check(len(sc) >= 5, "história com começo, desenvolvimento e conclusão (≥ 5 cenas)", f"{len(sc)} cenas")
        bad = []
        for s in sc:
            for ln in s["lines"]:
                ws = ln["words"]
                if not ws or ws[0]["startFrame"] < ln["startFrame"] or ws[-1]["endFrame"] > ln["endFrame"] + 1:
                    bad.append(ln["text"][:30])
                if any(ws[i]["startFrame"] > ws[i + 1]["startFrame"] for i in range(len(ws) - 1)):
                    bad.append(ln["text"][:30])
                if not (s["startFrame"] <= ln["startFrame"] and ln["endFrame"] <= s["endFrame"]):
                    bad.append("fora da cena: " + ln["text"][:30])
        check(not bad, "legendas sincronizadas com a narração", "; ".join(bad) or "ok")
        check(tl.get("engine") != "espeak", "voz natural (edge ou mbrola, não espeak puro)", tl.get("engine"), required=False)

    # ---------------- folha de contato para inspeção visual
    qa = os.path.join(os.path.dirname(os.path.abspath(args.video)), "qa")
    os.makedirs(qa, exist_ok=True)
    times = [0.5, 1.5, 2.5]
    if tl:
        times += [((s["startFrame"] + s["endFrame"]) / 2) / tl["fps"] for s in tl["scenes"][1:]]
    for old in [x for x in os.listdir(qa) if x.startswith("c_")]:
        os.remove(os.path.join(qa, old))
    for i, t in enumerate(times):
        sh(["ffmpeg", "-y", "-ss", f"{t:.2f}", "-i", args.video, "-frames:v", "1", "-vf", "scale=270:480", os.path.join(qa, f"c_{i:02d}.png")])
    cols = 6
    rows = (len(times) + cols - 1) // cols
    sh(["ffmpeg", "-y", "-i", os.path.join(qa, "c_%02d.png"), "-vf", f"tile={cols}x{rows}:padding=6:color=white", "-frames:v", "1",
        os.path.join(qa, "contato.png")])

    # ---------------- relatório
    print("\n=== CONFERÊNCIA cartoon-explainer ===")
    fail = False
    for ok, name, detail, req in results:
        mark = "OK  " if ok else ("FALHA" if req else "AVISO")
        print(f"[{mark}] {name}: {detail}")
        fail |= (not ok and req)
    print(f"\nFolha de contato: {os.path.join(qa, 'contato.png')}  (abra e confira personagem, cenários, textos e legendas)")
    print("RESULTADO:", "REPROVADO, corrija e renderize de novo" if fail else "APROVADO")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
