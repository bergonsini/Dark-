#!/usr/bin/env python3
"""
Gera TODA a trilha sonora por síntese (numpy) -> 100% original e livre de direitos autorais.

Saídas em public/audio/:
  music.wav   -> música de fundo "tribal cartoon" (tambores, marimba, baixo, flauta)
  sfx_*.wav   -> efeitos sonoros (whoosh, boom, pop, ding, ronco de barriga, mamute, fogo...)
"""
import os

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "audio")
SR = 48000
rng = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def lowpass(x, cutoff):
    """Filtro passa-baixa de 1 polo (cutoff pode ser array por amostra)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=np.float64), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def lowpass_fast(x, cutoff):
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    # filtro IIR de 1 polo via recursão vetorizada em blocos simples
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass_fast(x, cutoff)


def env_ad(n, attack, decay_tau):
    t = np.arange(n) / SR
    e = np.exp(-t / decay_tau)
    a = int(attack * SR)
    if a > 0:
        e[:a] *= np.linspace(0, 1, a)
    return e


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) + 1e-9
    return x / m * peak


def save(name, x, stereo_width=0.0):
    x = np.asarray(x, dtype=np.float32)
    if stereo_width:
        d = int(0.012 * SR)
        r = np.concatenate([np.zeros(d, dtype=np.float32), x[:-d]])
        st = np.stack([x, x * (1 - stereo_width) + r * stereo_width], axis=1)
    else:
        st = np.stack([x, x], axis=1)
    sf.write(os.path.join(OUT, name), st, SR)


# ---------------------------------------------------------------- instrumentos
def tom(freq, dur=0.5, pitch_drop=0.5, noise=0.15):
    t = t_axis(dur)
    f = freq * (1 + pitch_drop * np.exp(-t * 25))
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_ad(len(t), 0.002, dur / 4)
    hit = rng.standard_normal(len(t)) * env_ad(len(t), 0, 0.012) * noise
    return body + hit


def shaker(dur=0.09, amp=0.3):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    x = highpass(x, 5000)
    return x * env_ad(n, 0.004, dur / 3) * amp


def marimba(freq, dur=0.6):
    t = t_axis(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 30)
    x += 0.15 * np.sin(2 * np.pi * freq * 10 * t) * np.exp(-t * 80)
    return x * env_ad(len(t), 0.002, 0.18)


def flute(freq, dur):
    t = t_axis(dur)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t * 3, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    x = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = highpass(rng.standard_normal(len(t)), 2500) * 0.04
    e = np.clip(t / 0.08, 0, 1) * np.clip((dur - t) / 0.15, 0, 1)
    return (x + breath) * e


def bass(freq, dur):
    t = t_axis(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)
    return x * env_ad(len(t), 0.005, 0.35)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


# ---------------------------------------------------------------- música
def make_music(total=50.0, bpm=104):
    beat = 60 / bpm
    buf = np.zeros(int(total * SR))
    # escala pentatônica menor em Ré
    D = 146.83
    penta = [1, 6 / 5, 4 / 3, 3 / 2, 9 / 5, 2]
    melody = [  # (grau, oitava, duração em batidas)
        (0, 2, 0.5), (2, 2, 0.5), (3, 2, 1), (4, 2, 0.5), (3, 2, 0.5), (2, 2, 1),
        (0, 2, 0.5), (2, 2, 0.5), (3, 2, 0.5), (2, 2, 0.5), (0, 2, 2),
        (3, 2, 0.5), (4, 2, 0.5), (5, 2, 1), (4, 2, 0.5), (3, 2, 0.5), (2, 2, 1),
        (1, 2, 0.5), (2, 2, 0.5), (1, 2, 0.5), (0, 2, 0.5), (0, 2, 2),
    ]
    bassline = [0, 0, 3, 2]  # graus por compasso
    tom_hi = tom(220, 0.35, 0.4)
    tom_lo = tom(95, 0.6, 0.8, 0.25)
    tom_mid = tom(150, 0.45, 0.6)
    t = 0.0
    bar = 0
    while t < total:
        section = bar % 16
        # tambores tribais
        for b in range(4):
            bt = t + b * beat
            place(buf, tom_lo, bt, 0.9 if b in (0, 2) else 0.0)
            if b == 3:
                place(buf, tom_mid, bt + beat / 2, 0.55)
            if b in (1, 3):
                place(buf, tom_hi, bt, 0.45)
            for s in range(2):
                place(buf, shaker(), bt + s * beat / 2, 0.5 if s else 0.25)
        if section % 4 == 3:  # virada a cada 4 compassos
            for k in range(4):
                place(buf, tom_mid, t + 3 * beat + k * beat / 4, 0.35 + 0.1 * k)
        # baixo
        deg = bassline[bar % 4]
        for b in (0, 1.5, 2.5):
            place(buf, bass(D / 2 * penta[deg], beat * 1.2), t + b * beat, 0.55)
        bar += 1
        t += 4 * beat
    # melodia de marimba (loop)
    t = 4 * 4 * beat  # entra depois de 4 compassos
    mi = 0
    while t < total:
        g, o, d = melody[mi % len(melody)]
        f = D * penta[g] * (o / 2)
        place(buf, marimba(f * 2), t, 0.32)
        if (mi // len(melody)) % 2 == 1:  # na segunda volta, flauta dobra a melodia
            place(buf, flute(f, d * beat * 0.95), t, 0.16)
        t += d * beat
        mi += 1
    # fade in/out
    fade_in = int(0.3 * SR)
    buf[:fade_in] *= np.linspace(0, 1, fade_in)
    fade_out = int(2.5 * SR)
    buf[-fade_out:] *= np.linspace(1, 0, fade_out)
    # "cola" leve: soft clip
    buf = np.tanh(norm(buf, 1.0) * 1.3)
    return norm(buf, 0.85)


# ---------------------------------------------------------------- efeitos
def sfx_whoosh(dur=0.45, up=True):
    t = t_axis(dur)
    n = rng.standard_normal(len(t))
    sweep = np.linspace(400, 5000, len(t)) if up else np.linspace(5000, 400, len(t))
    x = lowpass(n, sweep) - lowpass(n, sweep * 0.25)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return norm(x * e, 0.8)


def sfx_boom(dur=1.2):
    t = t_axis(dur)
    f = 40 + 90 * np.exp(-t * 12)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.002, 0.35)
    x += lowpass_fast(rng.standard_normal(len(t)), 900) * env_ad(len(t), 0, 0.08) * 1.5
    return norm(np.tanh(x * 1.8), 0.95)


def sfx_pop(dur=0.15):
    t = t_axis(dur)
    f = 500 + 900 * np.exp(-t * 40)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.001, 0.035)
    return norm(x, 0.8)


def sfx_ding(dur=1.4):
    t = t_axis(dur)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d)
            for f, a, d in [(1318.5, 1, 3), (1975.5, 0.5, 4), (2637, 0.3, 6), (3951, 0.15, 9)])
    return norm(x * np.clip(t / 0.003, 0, 1), 0.7)


def sfx_growl(dur=1.1):
    t = t_axis(dur)
    f = 70 + 25 * np.sin(2 * np.pi * 3 * t) + 30 * t
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5
    x = lowpass_fast(x, 400) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t))
    x += lowpass_fast(rng.standard_normal(len(t)), 300) * 0.4
    e = np.clip(t / 0.1, 0, 1) * np.clip((dur - t) / 0.3, 0, 1)
    return norm(x * e, 0.8)


def sfx_mammoth(dur=1.6):
    t = t_axis(dur)
    f = 300 + 180 * np.sin(np.pi * np.clip(t / dur, 0, 1)) + 12 * np.sin(2 * np.pi * 7 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 14))
    x = lowpass(saw, 600 + 2500 * np.sin(np.pi * np.clip(t / dur, 0, 1)))
    x += highpass(rng.standard_normal(len(t)), 1500) * 0.15
    e = np.clip(t / 0.06, 0, 1) * np.clip((dur - t) / 0.4, 0, 1)
    return norm(np.tanh(x * 2.2) * e, 0.85)


def sfx_crackle(dur=6.0):
    t = t_axis(dur)
    roar = lowpass_fast(rng.standard_normal(len(t)), 500) * 0.35
    x = roar * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t))
    for _ in range(int(dur * 22)):
        at = rng.uniform(0, dur - 0.05)
        n = int(rng.uniform(0.002, 0.012) * SR)
        click = highpass(rng.standard_normal(n), 2000) * env_ad(n, 0, 0.003) * rng.uniform(0.3, 1.2)
        place(x, click, at)
    e = np.clip(t / 0.3, 0, 1) * np.clip((dur - t) / 0.5, 0, 1)
    return norm(x * e, 0.7)


def sfx_thud(dur=0.25):
    return norm(tom(70, dur, 0.4, 0.4), 0.8)


def sfx_stab(dur=1.2):
    """'Dun-dun' de suspense."""
    x = np.zeros(int(dur * SR))
    for at, f in ((0, 73.4), (0.32, 69.3)):
        tt = t_axis(0.8)
        s = sum(np.sin(2 * np.pi * f * k * tt) / k for k in range(1, 8)) * env_ad(len(tt), 0.003, 0.25)
        place(x, s, at)
    return norm(np.tanh(x * 1.5), 0.85)


def sfx_bubble(dur=0.22):
    t = t_axis(dur)
    f = 600 + 1400 * (t / dur) ** 0.6
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.003, 0.06)
    return norm(x, 0.7)


def sfx_riser(dur=1.0):
    t = t_axis(dur)
    n = rng.standard_normal(len(t))
    x = n - lowpass(n, np.linspace(200, 6000, len(t)))
    f = np.linspace(200, 900, len(t))
    x = x * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    return norm(x * (t / dur) ** 2, 0.7)


def main():
    os.makedirs(OUT, exist_ok=True)
    print("Gerando música de fundo ...")
    save("music.wav", make_music(), stereo_width=0.35)
    sfx = {
        "sfx_whoosh.wav": sfx_whoosh(),
        "sfx_whoosh_down.wav": sfx_whoosh(0.35, up=False),
        "sfx_boom.wav": sfx_boom(),
        "sfx_pop.wav": sfx_pop(),
        "sfx_ding.wav": sfx_ding(),
        "sfx_growl.wav": sfx_growl(),
        "sfx_mammoth.wav": sfx_mammoth(),
        "sfx_crackle.wav": sfx_crackle(),
        "sfx_thud.wav": sfx_thud(),
        "sfx_stab.wav": sfx_stab(),
        "sfx_bubble.wav": sfx_bubble(),
        "sfx_riser.wav": sfx_riser(),
    }
    for name, x in sfx.items():
        print("  ->", name)
        save(name, x)
    print("Trilha e efeitos prontos em", OUT)


if __name__ == "__main__":
    main()
