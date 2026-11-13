# 🦴 Como era a vida de um homem das cavernas — Reels/TikTok com Remotion

Vídeo animado vertical **1080x1920 (9:16), 30 fps, ~34 s**, com personagens cartoon originais
(Gruk, Una e um mamute) desenhados em SVG e animados quadro a quadro: piscar, olhar, lip-sync
com a narração, braços, caminhada, pulo com squash & stretch, tromba ondulando, fogo etc.

## Estrutura do vídeo
| Tempo | Cena | O que acontece |
|---|---|---|
| 0–3,4 s | **Gancho** | Pergunta gigante já no 1º quadro: "Você sobreviveria 1 dia como homem das cavernas?" + Gruk pulando na tela |
| 3,4–8,8 s | Intro | Conheça o Gruk, 40 mil anos atrás, sem casa/mercado/celular (ícones riscados) |
| 8,8–16,6 s | **Duas escolhas** | Tela dividida: A) caçar o mamute × B) coletar frutas, com medidor de perigo e "VS" |
| 16,6–22,9 s | **Curiosidade** | "Você sabia?" — o fogo e cozinhar ajudaram o cérebro a crescer |
| 22,9–27,8 s | Noite | Caverna, arte rupestre se desenhando, todos dormindo |
| 27,8–33,9 s | **Final** | "E aí? Caçar ou coletar? Comenta aqui!" |

Transições entre cenas: swipe diagonal, persianas, zoom de estrela, íris e "soco" de zoom.
Legendas sincronizadas palavra a palavra (a palavra falada fica amarela).

## Requisitos
- Node 18+ e Python 3.10+ e `ffmpeg`
- `npm install`
- `pip install -r requirements.txt`

## Como gerar
```bash
npm run audio     # narração PT-BR + música + efeitos + src/timeline.json
npm run studio    # pré-visualizar no navegador (http://localhost:3000)
npm run render    # exporta out/homem-das-cavernas.mp4 (H.264 + AAC)
npm run build     # audio + render
```
O áudio já gerado está em `public/audio/`, então `npm run render` funciona direto.

## Narração (voz)
O script `scripts/generate_audio.py` tem 3 provedores. O roteiro fica no topo do arquivo (`SCRIPT`);
mudou o texto → rode `npm run audio` e cenas, legendas e lip-sync se ajustam sozinhos.

| Provedor | Como usar | Observação |
|---|---|---|
| `kokoro` (padrão) | `npm run audio` | Voz neural **offline** (`pm_alex`; também `pm_santa`, `pf_dora` via `KOKORO_VOICE`). Baixa o modelo (~350 MB) para `models/` na 1ª vez |
| `edge` | `pip install edge-tts` e `TTS_PROVIDER=edge EDGE_VOICE=pt-BR-AntonioNeural npm run audio` | Vozes neurais da Microsoft, muito naturais. Precisa de internet |
| `elevenlabs` | `TTS_PROVIDER=elevenlabs ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run audio` | A mais natural/expressiva. Use uma voz PT-BR da sua biblioteca |

## Música e efeitos
Trilha "tribal" (tambores, chocalho, marimba pentatônica) e efeitos (whoosh, pop, ding, rugido do
mamute, fogo, boing, tambor) são **sintetizados por código** em `generate_audio.py` — 100% originais,
sem direitos autorais. A música abaixa durante a narração e sobe no final.

## Arquivos
- `src/characters/` — Gruk/Una (`Character.tsx`) e `Mammoth.tsx`
- `src/scenes/Scenes.tsx` — as 6 cenas
- `src/components/` — cenários, textos/legendas, transições
- `src/Video.tsx` — montagem, transições e mixagem de áudio
- `scripts/preview-frames.mjs` — gera PNGs de quadros para revisão: `node scripts/preview-frames.mjs 30 300 600`
