#!/usr/bin/env python3
"""
cartoon-explainer: motores de voz (TTS) em português brasileiro + alinhamento palavra a palavra.

Motores (todos GRATUITOS, exceto ElevenLabs):
  kokoro      Kokoro-82M (Apache 2.0), neural, OFFLINE. Vozes pt-BR: pm_alex, pm_santa (masc.), pf_dora (fem.).
              pip install kokoro-onnx soundfile  +  python3 scripts/instalar_voz.py  (baixa o modelo ~350 MB)
  edge        Voz neural da Microsoft via edge-tts (gratuito, sem chave; precisa de internet).
              pip install edge-tts. Dá o tempo EXATO de cada palavra.
  mbrola      espeak-ng + MBROLA br3/br4, offline (robótico, só como reserva).
  espeak      espeak-ng puro (último recurso).
  elevenlabs  PAGO. Nunca é escolhido no modo auto. Exige:
                --engine elevenlabs  +  --autorizo-custo  +  variável de ambiente ELEVENLABS_API_KEY
              e mostra a contagem de caracteres antes de chamar a API.

Tempo das palavras (legendas e animações):
  edge / elevenlabs  -> tempos vindos do próprio serviço (exatos)
  kokoro / mbrola    -> alinhamento acústico: pausas detectadas no áudio são casadas com a pontuação,
                        e dentro de cada trecho as palavras são distribuídas pelo número de fonemas e
                        "encaixadas" nos vales de energia do áudio (fronteiras reais entre palavras).
"""
import asyncio
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
CACHE = os.path.join(ROOT, ".cache", "tts")
KOKORO_MODEL = os.path.join(CACHE, "kokoro-v1.0.onnx")
KOKORO_VOICES = os.path.join(CACHE, "voices-v1.0.bin")

# --------------------------------------------------------------------------- estilos de locução
# "documentario": ritmo um pouco mais lento, pausas marcadas, voz encorpada e dicção clara.
ESTILOS = {
    "documentario": {
        "kokoroVelocidade": 0.9,
        "edgeVelocidade": "-6%",
        "edgeTom": "-3Hz",
        "pausaVirgula": 0.14,   # pausa extra entre falas terminadas em vírgula (s)
        "pausaPonto": 0.38,     # depois de "." ou "!"
        "pausaPergunta": 0.5,   # depois de "?" (deixa a pergunta "respirar")
        "eq": "highpass=f=75,equalizer=f=140:t=q:w=1.0:g=2.5,equalizer=f=320:t=q:w=1.2:g=-1.5,"
              "equalizer=f=3200:t=q:w=1.4:g=3,equalizer=f=9000:t=q:w=1.5:g=1,deesser=i=0.35,"
              "acompressor=threshold=-20dB:ratio=3.2:attack=4:release=80:makeup=2",
    },
    "animado": {
        "kokoroVelocidade": 1.02,
        "edgeVelocidade": "+8%",
        "edgeTom": "+0Hz",
        "pausaVirgula": 0.1,
        "pausaPonto": 0.25,
        "pausaPergunta": 0.32,
        "eq": "highpass=f=75,equalizer=f=3000:t=q:w=1.4:g=2,acompressor=threshold=-18dB:ratio=3:attack=5:release=60",
    },
}


def estilo(cfg):
    base = dict(ESTILOS.get(cfg.get("estilo", "documentario"), ESTILOS["documentario"]))
    return base


# --------------------------------------------------------------------------- utilidades de áudio
def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_wav(path):
    with wave.open(path, "rb") as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() > 1:
            data = data.reshape(-1, w.getnchannels()).mean(axis=1)
        return data


def finalizar(src, dst, eq):
    """Converte para mono 48 kHz com a cadeia de locução (EQ, de-esser, compressor) + loudness -16 LUFS."""
    run(["ffmpeg", "-y", "-i", src, "-af", f"{eq},loudnorm=I=-16:TP=-1.5:LRA=7", "-ac", "1", "-ar", str(SR), dst])


def trim_silence(x, thr=0.015):
    """Corta silêncio das pontas. Devolve (áudio, amostra inicial cortada)."""
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x, 0
    a = max(0, idx[0] - int(0.03 * SR))
    b = min(len(x), idx[-1] + int(0.08 * SR))
    return x[a:b], a


# --------------------------------------------------------------------------- texto
PUNCT_END = re.compile(r"[,.;:!?…]+[\"')\]]*$")


def palavras(texto):
    return texto.split()


def limpa(w):
    return re.sub(r"[^\wÀ-ÿ'-]", "", w)


_tok = None


def _peso_ortografico(w):
    core = limpa(w).lower()
    if not core:
        return 0.5
    sil = len(re.findall(r"[aeiouáéíóúâêôãõàü]+", core))
    return max(1.0, len(core) * 0.5 + sil * 1.2)


def pesos_foneticos(ws):
    """Peso de duração de cada palavra. A frase inteira é fonetizada de uma vez (contexto real da fala;
    palavras soltas como "é" viram nome de letra) e dividida por espaço. Sem fonetizador, usa sílabas."""
    global _tok
    try:
        if _tok is None:
            from kokoro_onnx.tokenizer import Tokenizer  # espeak-ng embutido
            _tok = Tokenizer()
        ph = _tok.phonemize(" ".join(limpa(w) or "," for w in ws), lang="pt-br")
        parts = ph.replace("ˈ", "").replace("ˌ", "").split()
        if len(parts) != len(ws):
            raise ValueError("contagem de palavras diferente")
        out = []
        for p in parts:
            vog = len(re.findall(r"[aeiouɐɛɔəɪʊæyõãẽĩũ]", p))
            out.append(max(1.0, len(p) * 0.55 + vog * 0.9))
        return out
    except Exception:
        return [_peso_ortografico(w) for w in ws]


# --------------------------------------------------------------------------- alinhamento acústico
def alinhar(audio, texto):
    """Estimativa precisa de (início, fim) em segundos de cada palavra, usando o próprio áudio."""
    ws = palavras(texto)
    n = len(ws)
    dur = len(audio) / SR
    if n == 0:
        return []
    hop = int(0.01 * SR)
    win = int(0.025 * SR)
    frames = max(1, (len(audio) - win) // hop + 1)
    rms = np.array([np.sqrt(np.mean(audio[i * hop:i * hop + win] ** 2)) for i in range(frames)])
    rms = np.convolve(rms, np.ones(3) / 3, mode="same")
    thr = max(0.012, np.percentile(rms, 95) * 0.09)
    silent = rms < thr

    # trechos de silêncio internos (>= 70 ms)
    runs = []
    i = 0
    while i < frames:
        if silent[i]:
            j = i
            while j < frames and silent[j]:
                j += 1
            if i > 3 and j < frames - 3 and (j - i) >= 7:
                runs.append((i * 0.01, j * 0.01))
            i = j
        else:
            i += 1

    w = pesos_foneticos(ws)
    cum = np.concatenate([[0], np.cumsum(w)])
    tot = cum[-1]
    # fronteiras de pontuação (depois da palavra k) e seu tempo estimado
    bounds = [k for k in range(n - 1) if PUNCT_END.search(ws[k])]
    est = {k: dur * cum[k + 1] / tot for k in bounds}
    anchors = {}  # k -> (fim da palavra k, início da palavra k+1)
    used = set()
    for r in sorted(runs, key=lambda r: -(r[1] - r[0])):
        mid = (r[0] + r[1]) / 2
        cands = [k for k in bounds if k not in anchors and abs(est[k] - mid) < dur * 0.3]
        if not cands:
            continue
        k = min(cands, key=lambda k: abs(est[k] - mid))
        ok = all((kk < k and anchors[kk][1] <= r[0]) or (kk > k and anchors[kk][0] >= r[1]) for kk in anchors)
        if ok:
            anchors[k] = r
            used.add(r)
    # pausas longas sem pontuação (respiração) também viram âncoras, se couberem
    for r in sorted(runs, key=lambda r: r[0]):
        if r in used or (r[1] - r[0]) < 0.14:
            continue
        mid = (r[0] + r[1]) / 2
        k = int(np.argmin([abs(dur * cum[q + 1] / tot - mid) for q in range(n - 1)])) if n > 1 else None
        if k is None or k in anchors:
            continue
        ok = all((kk < k and anchors[kk][1] <= r[0]) or (kk > k and anchors[kk][0] >= r[1]) for kk in anchors)
        if ok:
            anchors[k] = r

    starts = [0.0] * n
    ends = [0.0] * n
    seg_start_word = 0
    seg_t0 = 0.0
    keys = sorted(anchors) + [n - 1]
    for k in keys:
        seg_t1 = anchors[k][0] if k in anchors else dur
        idxs = list(range(seg_start_word, k + 1))
        ww = [w[q] for q in idxs]
        tw = sum(ww)
        t = seg_t0
        for q, wq in zip(idxs, ww):
            starts[q] = t
            t += (seg_t1 - seg_t0) * wq / tw
            ends[q] = t
        # encaixa fronteiras internas no vale de energia mais próximo (±60 ms)
        for q in idxs[1:]:
            c = int(starts[q] / 0.01)
            lo, hi = max(1, c - 6), min(frames - 1, c + 6)
            if hi > lo:
                m = lo + int(np.argmin(rms[lo:hi]))
                tm = m * 0.01
                if starts[q - 1] + 0.06 < tm < ends[q] - 0.04:
                    ends[q - 1] = tm
                    starts[q] = tm
        if k in anchors:
            seg_t0 = anchors[k][1]
        seg_start_word = k + 1
    return [(ws[q], round(starts[q], 3), round(ends[q], 3)) for q in range(n)]


# --------------------------------------------------------------------------- motores
class Motor:
    nome = "?"
    pago = False

    def disponivel(self):
        return True

    def sintetizar(self, texto, ctx, cfg, tmp):
        """Devolve (caminho_audio_bruto, palavras_com_tempo | None)."""
        raise NotImplementedError


class Kokoro(Motor):
    nome = "kokoro"
    _k = None

    def disponivel(self):
        try:
            import kokoro_onnx  # noqa: F401
        except Exception:
            return False
        return os.path.exists(KOKORO_MODEL) and os.path.exists(KOKORO_VOICES)

    def sintetizar(self, texto, ctx, cfg, tmp):
        import soundfile as sf
        from kokoro_onnx import Kokoro as K
        if Kokoro._k is None:
            Kokoro._k = K(KOKORO_MODEL, KOKORO_VOICES)
        kc = cfg.get("kokoro", {})
        voz = kc.get("voz", "pm_alex")
        speed = float(ctx.get("velocidade", 1.0)) * float(kc.get("velocidade", estilo(cfg)["kokoroVelocidade"]))
        mix = kc.get("mistura")  # ex.: {"pm_alex": 0.7, "pm_santa": 0.3}
        if mix:
            style = sum(Kokoro._k.get_voice_style(v) * float(p) for v, p in mix.items())
            samples, sr = Kokoro._k.create(texto, voice=style, speed=speed, lang="pt-br")
        else:
            samples, sr = Kokoro._k.create(texto, voice=voz, speed=speed, lang="pt-br")
        out = os.path.join(tmp, "k.wav")
        sf.write(out, samples, sr)
        return out, None


class Edge(Motor):
    nome = "edge"

    def disponivel(self):
        try:
            import edge_tts  # noqa: F401
            return True
        except Exception:
            return False

    def sintetizar(self, texto, ctx, cfg, tmp):
        import edge_tts
        ec = cfg.get("edge", {}) if isinstance(cfg.get("edge"), dict) else {"voz": cfg.get("edge")}
        st = estilo(cfg)
        voz = ec.get("voz") or "pt-BR-AntonioNeural"
        rate = ec.get("velocidade") or st["edgeVelocidade"]
        pitch = ec.get("tom") or st["edgeTom"]
        if ctx.get("velocidade", 1.0) != 1.0:
            base = int(rate.replace("%", "")) if rate else 0
            rate = f"{base + round((ctx['velocidade'] - 1) * 100):+d}%"
        out = os.path.join(tmp, "e.mp3")
        words = []

        async def go():
            kw = {}
            proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
            if proxy:
                kw["proxy"] = proxy
            try:
                com = edge_tts.Communicate(texto, voz, rate=rate, pitch=pitch, boundary="WordBoundary", **kw)
            except TypeError:
                com = edge_tts.Communicate(texto, voz, rate=rate, pitch=pitch, **kw)
            with open(out, "wb") as f:
                async for ch in com.stream():
                    if ch["type"] == "audio":
                        f.write(ch["data"])
                    elif ch["type"] == "WordBoundary":
                        words.append((ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7))

        asyncio.run(asyncio.wait_for(go(), timeout=40))
        if os.path.getsize(out) < 1000:
            raise RuntimeError("edge-tts não gerou áudio")
        return out, words or None


class ElevenLabs(Motor):
    """PAGO. Só roda com --engine elevenlabs --autorizo-custo. Usa o SDK oficial (elevenlabs_tts.mjs).
    Chave: ELEVENLABS_API_KEY no ambiente ou no .env.local do projeto (criado por `elevenlabs onboard`).
    Em ambiente de nuvem com a chave nos segredos de rede, use ELEVENLABS_API_KEY=proxy-injected."""
    nome = "elevenlabs"
    pago = True
    caracteres = 0  # total cobrado nesta execução (cabeçalho x-character-count)

    def disponivel(self):
        if os.environ.get("ELEVENLABS_API_KEY"):
            return True
        env = os.path.join(ROOT, ".env.local")
        if os.path.exists(env):  # só verifica se a linha tem valor; nunca imprime a chave
            for line in open(env, encoding="utf-8"):
                if line.strip().startswith("ELEVENLABS_API_KEY=") and line.split("=", 1)[1].strip():
                    return True
        return False

    def sintetizar(self, texto, ctx, cfg, tmp):
        ec = cfg.get("elevenlabs", {})
        voice_id = ec.get("voiceId")
        if not voice_id:
            raise RuntimeError('defina "voz.elevenlabs.voiceId" no roteiro.json')
        out = os.path.join(tmp, "x.mp3")
        req = {
            "text": texto,
            "voiceId": voice_id,
            "modelId": ec.get("modelo", "eleven_v4"),
            "languageCode": ec.get("idioma", "pt"),
            "voiceSettings": {
                "stability": ec.get("estabilidade", 0.6),
                "similarityBoost": ec.get("similaridade", 0.6),
                "style": ec.get("estilo", 0.3),
                "speed": float(ec.get("velocidade", 1.0)) * float(ctx.get("velocidade", 1.0)),
            },
            "previousText": ctx.get("anterior"),  # entonação contínua entre as frases
            "nextText": ctx.get("proxima"),
            "out": out,
        }
        env = dict(os.environ)
        if env.get("HTTPS_PROXY") or env.get("https_proxy"):
            env["NODE_USE_ENV_PROXY"] = "1"  # o fetch do Node passa a respeitar o proxy
        env["NODE_NO_WARNINGS"] = "1"
        r = subprocess.run(["node", os.path.join(ROOT, "scripts", "elevenlabs_tts.mjs")], input=json.dumps(req), text=True,
                           capture_output=True, env=env, cwd=ROOT, timeout=120)
        if r.returncode != 0:
            raise RuntimeError(r.stderr.strip()[-300:] or "falha na ElevenLabs")
        res = json.loads(r.stdout)
        ElevenLabs.caracteres += int(res.get("characters", 0))
        return out, [tuple(w) for w in res["words"]] or None


class Espeak(Motor):
    def __init__(self, mbrola):
        self.mbrola = mbrola
        self.nome = "mbrola" if mbrola else "espeak"

    def disponivel(self):
        exe = shutil.which("espeak-ng") or shutil.which("espeak")
        if not exe:
            return False
        return (not self.mbrola) or os.path.isdir("/usr/share/mbrola/br3") or os.path.isdir("/usr/share/mbrola/br4")

    def sintetizar(self, texto, ctx, cfg, tmp):
        exe = shutil.which("espeak-ng") or shutil.which("espeak")
        mc = cfg.get("mbrola", "mb-br3")
        voz = (mc if isinstance(mc, str) else mc.get("voz", "mb-br3")) if self.mbrola else "pt-br"
        spd = int(cfg.get("espeakSpeed", 160) * float(ctx.get("velocidade", 1.0)) * (0.94 if cfg.get("estilo", "documentario") == "documentario" else 1))
        out = os.path.join(tmp, "s.wav")
        run([exe, "-v", voz, "-s", str(spd), "-p", str(cfg.get("espeakPitch", 45)), "-w", out, texto])
        return out, None


def esticar(audio, words, fator):
    """Muda o ritmo de um áudio já gerado SEM mudar o tom (ffmpeg atempo). fator > 1 = mais rápido.
    Usado com motores pagos, para caber na duração sem pagar outra geração."""
    if abs(fator - 1) < 0.005:
        return audio, words
    with tempfile.TemporaryDirectory() as tmp:
        a, b = os.path.join(tmp, "a.wav"), os.path.join(tmp, "b.wav")
        pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
        with wave.open(a, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        run(["ffmpeg", "-y", "-i", a, "-af", f"atempo={fator:.4f}", "-ar", str(SR), b])
        out = read_wav(b)
    return out, [(t, round(s0 / fator, 3), round(e0 / fator, 3)) for (t, s0, e0) in words]


MOTORES = {"kokoro": Kokoro(), "edge": Edge(), "elevenlabs": ElevenLabs(), "mbrola": Espeak(True), "espeak": Espeak(False)}
# ordem do modo automático: só motores gratuitos
AUTO = ["edge", "kokoro", "mbrola", "espeak"]


def chave_cache(motor, texto, ctx, cfg):
    sub = {k: cfg.get(k) for k in ("estilo", "kokoro", "edge", "elevenlabs", "mbrola", "espeakSpeed", "espeakPitch")}
    raw = json.dumps([motor, texto, ctx.get("velocidade", 1.0), ctx.get("anterior"), ctx.get("proxima") if motor == "elevenlabs" else None, sub], sort_keys=True, ensure_ascii=False)
    return hashlib.sha1(raw.encode()).hexdigest()[:16]


def gerar_fala(motor_nome, texto, ctx, cfg):
    """Sintetiza uma fala (com cache em .cache/tts/falas). Devolve (audio float32 48k, [(palavra, ini, fim)])."""
    motor = MOTORES[motor_nome]
    os.makedirs(os.path.join(CACHE, "falas"), exist_ok=True)
    key = chave_cache(motor_nome, texto, ctx, cfg)
    wav_c = os.path.join(CACHE, "falas", key + ".wav")
    js_c = os.path.join(CACHE, "falas", key + ".json")
    if os.path.exists(wav_c) and os.path.exists(js_c):
        return read_wav(wav_c), [tuple(x) for x in json.load(open(js_c, encoding="utf-8"))]
    with tempfile.TemporaryDirectory() as tmp:
        raw, words = motor.sintetizar(texto, ctx, cfg, tmp)
        fin = os.path.join(tmp, "fin.wav")
        finalizar(raw, fin, estilo(cfg)["eq"])
        audio, cut = trim_silence(read_wav(fin))
    off = cut / SR
    dur = len(audio) / SR
    if words and len(words) == len(palavras(ctx.get("legenda", texto))):
        # tempos do serviço, deslocados pelo corte de silêncio; textos da legenda
        leg = palavras(ctx.get("legenda", texto))
        al = [(leg[i], round(max(0, a - off), 3), round(min(dur, b - off), 3)) for i, (_, a, b) in enumerate(words)]
    else:
        al = alinhar(audio, ctx.get("legenda", texto))
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    with wave.open(wav_c, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    json.dump(al, open(js_c, "w", encoding="utf-8"), ensure_ascii=False)
    return audio, al


def escolher_motor(pedido, cfg, teste="Olá."):
    """Escolhe UM motor para o vídeo inteiro (nunca mistura vozes)."""
    if pedido != "auto":
        m = MOTORES[pedido]
        if not m.disponivel():
            raise RuntimeError(f"motor '{pedido}' indisponível (veja references/audio-legendas.md)")
        return pedido
    erros = []
    for nome in AUTO:
        m = MOTORES[nome]
        if not m.disponivel():
            erros.append(f"{nome}: não instalado")
            continue
        try:
            with tempfile.TemporaryDirectory() as tmp:
                m.sintetizar(teste, {}, cfg, tmp)
            return nome
        except Exception as e:  # sem rede, bloqueado, etc.
            erros.append(f"{nome}: {str(e)[:80]}")
    raise RuntimeError("nenhum motor de voz funcionou:\n  " + "\n  ".join(erros))
