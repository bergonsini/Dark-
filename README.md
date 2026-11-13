# Homem das Cavernas: vídeo animado para Reels e TikTok (Remotion)

Vídeo vertical **1080x1920 (9:16)**, **~31 s**, 30 fps, com personagens cartoon originais animados,
narração em PT-BR, legendas sincronizadas, trilha e efeitos sonoros próprios.

**Vídeo pronto:** `out/homem-das-cavernas.mp4` (H.264 + AAC)

## Roteiro / estrutura
| Tempo | Cena | O que acontece |
|---|---|---|
| 0–2,4 s | **Gancho** | Pergunta *"Você sobreviveria 1 dia como homem das cavernas?"* já na tela no frame 0, boom + tremida, Ugo em pânico, mamute aparece |
| 2,4–6 s | Intro | Contador "há mais de 10.000 anos", Ugo entra andando; casa, mercado e celular levam um X carimbado |
| 6–8,5 s | Fome | "Bateu a fome?", barriga roncando, balão de pensamento com carne, "2 jeitos de comer" |
| 8,5–14,5 s | **Duas escolhas** | Tela dividida A (caçar mamute) vs B (coletar frutas), com VS; o lado ativo acende; cogumelo venenoso |
| 14,5–20,8 s | **Curiosidade** | Fogo usado há ~1 milhão de anos; comida cozida pode ter ajudado o cérebro a crescer |
| 20,8–25,2 s | Noite | Caverna, fogueira, Lia desenhando pinturas rupestres, que aparecem traço a traço |
| 25,2–31,3 s | **Pergunta final** | "E você? Caçaria o mamute ou coletaria frutas? Comenta aqui embaixo!" + seta animada |

Personagens: **Ugo** (homem das cavernas), **Lia** (mulher das cavernas) e o **mamute**, todos em SVG
com olhos que piscam e olham, sobrancelhas, boca sincronizada com a narração (lip-sync pelo volume do
áudio), braços, pernas (ciclo de caminhada), respiração, squash & stretch e objetos (lança, clava,
carne, cesta de frutas, pincel).

Transições: slide, wipe, flip 3D, iris, clock-wipe, mais punch-zoom e flash a cada corte.

## Como usar
Requisitos: Node 18+, Python 3 com `numpy`, `ffmpeg`.

```bash
npm install
pip install numpy edge-tts          # edge-tts = voz neural (opcional, recomendado)

npm run audio     # gera narração, música, efeitos e src/timeline.json
npm run studio    # pré-visualização interativa em http://localhost:3000
npm run render    # exporta out/homem-das-cavernas.mp4
npm run build     # audio + render de uma vez
```

### Narração
`scripts/generate_audio.py` tenta, nesta ordem:
1. **edge-tts** (voz neural `pt-BR-AntonioNeural`, mais natural): precisa de internet.
2. **espeak-ng + MBROLA br3** (offline): `sudo apt install espeak-ng mbrola mbrola-br3`
3. **espeak-ng** puro.

Forçar um motor: `python3 scripts/generate_audio.py --engine edge`.
A versão incluída foi gerada com **MBROLA**, porque o ambiente de nuvem onde o projeto foi criado não tinha acesso
ao serviço de voz neural. Na sua máquina, com `edge-tts` instalado, rode `npm run build` para gerar o vídeo
com a voz neural. Cenas, legendas e lip-sync se reajustam sozinhos aos novos tempos.

Para trocar o texto, edite `scripts/narration.json` (cada frase vira um trecho de legenda sincronizado) e rode `npm run build`.

### Música e efeitos
São **sintetizados pelo próprio script** (tambores, shaker, marimba pentatônica, whoosh, boom, pop,
ding, brilho, fogo, carimbo), então não têm direitos autorais de terceiros. Para usar uma faixa sua, substitua
`public/audio/music.wav`.

## Estrutura
```
scripts/narration.json      roteiro da narração (texto + voz)
scripts/generate_audio.py   TTS + trilha + SFX + timeline/lip-sync
src/CavemanReel.tsx         composição principal (cenas, transições, áudio, SFX)
src/characters/             Caveperson (Ugo/Lia) e Mammoth
src/scenes/                 7 cenas
src/components/             legendas, títulos, cenários, objetos
remotion.config.ts          H.264 / AAC / yuv420p / CRF 18
```
