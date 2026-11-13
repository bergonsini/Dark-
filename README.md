# 🦴 Como era a vida de um homem das cavernas: Reels/TikTok em Remotion

Vídeo animado vertical **1080x1920 (9:16), 30 fps, cerca de 45 s**, com personagens cartoon originais
(Ugo, Nara e um mamute), narração masculina neural em português brasileiro, legendas sincronizadas palavra por palavra,
trilha e efeitos sonoros próprios (gerados por síntese, então sem direitos autorais) e transições dinâmicas.

O vídeo pronto fica em **`video/homem-das-cavernas.mp4`**.

## Roteiro / estrutura

| Tempo | Cena | O que acontece |
|---|---|---|
| 0–3,6 s | **Gancho** | Pergunta "VOCÊ SOBREVIVERIA 1 DIA COMO HOMEM DAS CAVERNAS?" aparece toda nos primeiros 0,5 s. Tem tremida de câmera, BOOM, raios girando e o Ugo em pânico. |
| 3,6–8,2 s | Apresentação | O sol nasce, um vulcão solta fumaça, pterossauros passam no céu e o Ugo sai da caverna andando, se espreguiça, boceja e acena. Um contador vai até "100.000 ANOS ATRÁS". |
| 8,2–12,2 s | Fome | Barriga ronca ("RONC!"), mercado e geladeira são riscados com um X vermelho e aparece "SE VIRA!". |
| 12,2–18,2 s | **Duas escolhas** | Tela dividida: CAÇAR (mamute que levanta a tromba) **VS** COLETAR (frutas e raízes). O Ugo olha para um lado e para o outro e coça a cabeça. |
| 18,2–22,5 s | Caçar | Barras de COMIDA e RISCO DE VIDA. O mamute investe e o Ugo foge suando: "PERIGO!". |
| 22,5–26,5 s | Coletar | O Ugo anda pela floresta (parallax) colhendo frutas. Barras SEGURANÇA e CANSAÇO e contador de KM. |
| 26,5–31,3 s | Fogo | Noite estrelada e fogueira animada com faíscas. Olhos de lobos somem quando o fogo cresce. Aparecem CALOR, PROTEÇÃO e COMIDA. |
| 31,3–40,7 s | **Curiosidade** | "VOCÊ SABIA?": carne cozida → seta → cérebro que cresce com raios → "+ ENERGIA". |
| 40,7–45,7 s | **Pergunta final** | "E VOCÊ? CAÇADOR ou COLETOR?". O Ugo fala, com a boca sincronizada à narração, e aparecem um balão de comentário e setas: "COMENTA AÍ!". |

## Como visualizar e exportar

### 1. Instalar

Requisitos: Node 18+, Python 3.10+ e ffmpeg.

```bash
npm install
pip install kokoro-onnx soundfile numpy   # só precisa se for regerar a narração
```

### 2. Ver e editar ao vivo (Remotion Studio)

```bash
npm run studio
```

Abra o endereço que aparecer (normalmente http://localhost:3000) e selecione a composição **CavemanLife**.
Dá para dar play, avançar quadro a quadro e ver cada cena na timeline.

### 3. Exportar o MP4 final

```bash
npm run render
```

O comando gera `out/homem-das-cavernas.mp4`: H.264, CRF 18, AAC, áudio masterizado em -14 LUFS (o padrão das redes sociais).
Na primeira vez, o Remotion baixa sozinho o Chrome headless que ele usa.
Se você já tiver um Chrome/Chromium e estiver sem internet, use `REMOTION_CHROME=/caminho/do/chrome npm run render`.

Outros comandos:

```bash
npm run still          # gera uma miniatura (out/thumb.png)
npm run audio          # regera a narração, a música e os efeitos
npm run build          # audio + render, tudo de uma vez
node scripts/preview-frames.mjs out/preview 30 300 900   # prévia de quadros específicos
```

## Narração (voz masculina natural)

- Motor: **Kokoro TTS v1.0** (modelo neural open source, licença Apache-2.0), voz **`pm_alex`** (masculina, PT-BR).
  Roda 100% offline e não precisa de chave de API.
- Na primeira execução, `tts/generate_narration.py` baixa o modelo (cerca de 330 MB) para `tts/models/`.
- A voz passa por uma masterização leve (EQ de presença, compressor e loudnorm) para soar mais natural e encorpada.
- O mesmo script detecta as pausas reais do áudio e gera `src/data/timings.json` com o tempo de cada palavra.
  As legendas, a boca do Ugo e todas as animações usam esses tempos. Por isso, **se você mudar o texto, tudo se ressincroniza sozinho**.

Para mudar o texto, a voz ou a velocidade, edite `tts/script.json` e rode `npm run audio`.
As vozes disponíveis são `pm_alex` e `pm_santa` (masculinas) e `pf_dora` (feminina).

> Quer outra voz, por exemplo ElevenLabs ou Azure? Basta gerar um WAV por trecho, substituir a chamada `kokoro.create(...)`
> em `tts/generate_narration.py` e manter o resto: o cálculo de tempos funciona com qualquer áudio.

## Música e efeitos

`tts/generate_sfx_music.py` cria tudo por síntese matemática (numpy). Por isso **não há nenhum material de terceiros**
e não existe risco de direitos autorais:

- **Música:** batida tribal (tambores graves, shaker), baixo, marimba na escala pentatônica e flauta.
- **Efeitos:** whoosh, boom, pop, ding, ronco de barriga, barrido de mamute, estalos de fogueira, passos, "dun-dun" de suspense, bolha e riser.

## Estrutura do projeto

```
src/
  Root.tsx              composição 1080x1920 @30fps
  Video.tsx             monta as cenas, transições, legendas, narração, música e efeitos
  lib.ts                tempos, piscar automático, lip-sync, molas, fontes
  characters/
    Caveman.tsx         personagem riggado (Ugo/Nara): pernas com joelho, braços com cotovelo,
                        olhos que piscam e olham, sobrancelhas, 8 bocas, caminhada, objetos na mão
    Mammoth.tsx         mamute com tromba animada, orelha, rabo, patas e piscar
  components/
    Backgrounds.tsx     amanhecer, caverna, campo, floresta, noite (com parallax)
    Elements.tsx        textos grandes, fogueira, barras, ícones, brilhos, tremida de câmera
    Captions.tsx        legendas karaokê (palavra ativa colorida)
    Transition.tsx      zoom, círculo, chicote, slide, wipe, giro + flash
  scenes/Scenes.tsx     as 9 cenas
tts/
  script.json           texto da narração
  generate_narration.py narração + tempos das legendas
  generate_sfx_music.py música + efeitos
public/audio, public/fonts   áudios gerados e fontes (Bangers e Baloo 2, licença OFL)
```
