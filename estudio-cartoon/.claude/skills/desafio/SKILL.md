---
name: desafio
description: Vídeos do 4º CANAL (nome ainda a definir) — DESAFIO DO PAUSE em visual NEON/ARCADE, sem personagem fixo e SEM narração. O espectador tenta pausar no momento exato (ex.: "Pause antes do foguete bater na Lua", cronômetro no 0:00.00); várias tentativas cada vez mais rápidas com painel "CEDO DEMAIS / CEDO / PERTO / BATEU", e um QUADRO SECRETO de vitória que dura 1 frame. 9:16, 1080x1920, 30 fps, 15–20 s, MP4. Use quando o usuário pedir "desafio do pause", "vídeo do canal 4", "pause no 0:00" ou um novo desafio desse tipo. NÃO tem relação com os canais Tito, Titorei e Inutilidades.
---

# Canal 4 — Desafio do pause (nome a definir)

Formato pedido pelo usuário a partir de um vídeo de referência ("corte o fio no 0:00.00", "salve o astronauta"),
MELHORADO: arte própria neon/arcade, tensão sonora, quadro secreto de vitória, final que convida a repetir/comentar.

## Regras fixas
- **Sem relação** com os outros canais (nada de Tito, Titorei, Kuka, Doutor…). **Sem personagem fixo**: cada desafio tem
  seu próprio "herói" (foguete, astronauta, bomba, ovo…).
- **Sem narração** (custo zero de voz): só texto na tela, efeitos sonoros e música arcade.
- Visual **neon/arcade**: fundo roxo escuro com grade rosa em perspectiva, estrelas, contornos que brilham (`filter="url(#neon)"`),
  textos com `brilho(cor)`. Cuidado: filtro de brilho em LINHA reta (bbox de altura 0) some — use `rect` fino.
- **O VÍDEO NUNCA PAUSA SOZINHO (regra do usuário):** ele roda em LOOP contínuo e quem pausa é o ESPECTADOR. Nada de
  "pausa simulada", "PAUSOU" ou resultado pré-definido: o PAINEL É AO VIVO e mostra, a cada frame, o que aconteceria se a pessoa
  pausasse ali ("CEDO DEMAIS -1833 ms" → "CEDO" → "PERTO! -33 ms" → "BATEU! +33 ms").
- Sem abertura nem cartão final (quebram o loop): título fixo no topo, 4–6 tentativas seguidas cada vez mais rápidas, e o fim
  emenda no começo. 12–20 s.
- **Quadro secreto**: exatamente 1 frame (no 0:00.00) de CADA tentativa, com "PERFEITO! COMENTA '…' 👇".

## Arquivos
- `desafios/ativo.json` — desafio ativo (`desafio`, `duracaoFrames`, `musica`).
- `src/desafio/neon.tsx` — kit: `FundoNeon`, `DefsNeon`, `brilho`, `Cronometro`, `PainelResultado`, `Som`, cores `NEON`.
- `src/desafio/desafios/<id>.tsx` — cada desafio (ex.: `foguete.tsx`, com `RODADAS` e `DURACAO`), registrado em
  `src/desafio/DesafioVideo.tsx` (`DESAFIOS`). Composição: `Desafio`.
- Áudio: `npm run desafio:audio` (música + efeitos, sem custo) → `public/desafio/audio`.
- `npm run desafio:render` → `out/desafio.mp4`; `npm run desafio:qa` (formato, duração, volume, pico, congelamento, tela preta).
  Sem narração o volume tende a ficar baixo: música ~0.6 e efeitos ×1.5 no `Som`.
- Confira o quadro secreto extraindo os frames exatos (`ffmpeg -vf select=eq(n\,N)`).
- Entrega: `cp out/desafio.mp4 out/desafio-<id>.mp4`.

## Desafios feitos
| # | id | Desafio |
|---|---|---|
| 1 | foguete | Pause antes do foguete bater na Lua (0:00.00), 5 tentativas em loop, painel ao vivo, quadro secreto "SALVEI" |

## Zonas seguras (pedido do usuário, depois do 1º post)
Ao pausar, o Instagram/TikTok põe o **ícone de PLAY no centro** da tela (e o de som logo acima); os **botões** (curtir,
comentar, compartilhar) ficam na **direita, da metade pra baixo**; o **nome do perfil e a legenda** cobrem o **rodapé**
(y ≳ 1580). Então:
- **Cronômetro no topo**, logo abaixo do painel (painel y≈270, cronômetro y≈505). Nada importante no rodapé.
- A ação (foguete, Lua, linha do 0:00.00) fica **fora do centro** (ex.: `X_ACAO = 300`, à esquerda).
- O **quadro secreto** ("PERFEITO!…") vai na faixa **y≈1070–1450**, em `left: 40, width: 860` (não encosta nos botões).
- Confira com a simulação dos ícones (círculos no centro, faixa na direita e no rodapé) antes de renderizar.
