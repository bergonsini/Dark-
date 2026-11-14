---
name: cartoon-explainer
description: Produz vídeos educativos animados em 2D (cartoon) com Remotion, prontos para Reels/TikTok/Shorts. Formato 9:16, 1080x1920, 30 fps, 60 s por padrão, com personagem cartoon consistente, cenários vetoriais coloridos, expressões faciais, movimentos naturais, objetos animados, câmera, transições, narração em português brasileiro, legendas sincronizadas, efeitos sonoros e música de fundo. Gera MP4. Use quando o usuário pedir um vídeo explicativo, educativo, animado, cartoon, desenho, explainer, curiosidade ou "vídeo ensinando X".
---

# cartoon-explainer

Você é um estúdio de animação 2D. A cada pedido, entregue um **MP4 animado de verdade**: tudo é
desenhado em SVG/React e animado frame a frame no Remotion. **Nunca substitua animação por imagens
aleatórias**, fotos de banco, GIFs prontos, clip-arts baixados ou slides estáticos.

Este projeto (`estudio-cartoon/`) já traz o kit pronto e um vídeo de exemplo funcionando
("Por que o céu é azul?"). Reaproveite o kit; crie só as cenas novas.

## Especificação fixa (não mude sem o usuário pedir)

| Item | Valor |
|---|---|
| Formato | vertical 9:16, **1080x1920** |
| Taxa de quadros | **30 fps** |
| Duração | **60 s** (`duracaoSegundos` no `roteiro.json`; aceite outra se o usuário pedir) |
| Saída | **MP4** H.264 + AAC (`out/video.mp4`) |
| Idioma | narração e legendas em **português brasileiro** |
| Composição Remotion | `CartoonExplainer` (`src/Root.tsx`) |

## Mapa do projeto

```
roteiro.json                       ← o roteiro (você escreve): cenas, falas, voz, música
.claude/skills/cartoon-explainer/
  scripts/generate_audio.py        ← narração + música + SFX + src/cartoon/timeline.json
  scripts/voz.py                   ← motores de voz pt-BR (edge, kokoro, elevenlabs, mbrola) + alinhamento
  scripts/instalar_voz.py          ← instala as vozes gratuitas
  scripts/qa_check.py              ← conferência final do MP4
  references/*.md                  ← detalhes (leia quando indicado abaixo)
src/Root.tsx                       ← registra a composição CartoonExplainer
src/cartoon/
  config.ts                        ← 1080x1920, 30 fps, área segura, duração de transição
  theme.ts / fonts.ts              ← paleta única e fontes locais
  timeline.ts / timeline.json      ← tempos GERADOS (nunca edite os frames à mão)
  characters/Personagem.tsx        ← O protagonista (único) com expressões, poses, lip-sync
  components/Camera.tsx            ← câmera virtual: pan, zoom, tremida, parallax
  components/Backgrounds.tsx       ← cenários vetoriais (céu/campo, espaço, nuvens)
  components/Props.tsx             ← objetos animados (sol, feixe, raio, prisma, molécula, olho, planeta, seta…)
  components/Text.tsx              ← TitleSlam (título com impacto) e Tag (etiqueta)
  components/Captions.tsx          ← legendas palavra a palavra
  scenes/common.tsx                ← useSceneFrame, Sfx, Pos, helpers
  scenes/S*.tsx                    ← uma cena por arquivo
  CartoonExplainer.tsx             ← monta cenas + transições + áudio + legendas
```

Comandos (rode na raiz `estudio-cartoon/`):

```bash
npm run voz:instalar  # 1ª vez: vozes gratuitas (Kokoro offline + edge-tts)
npm run audio      # roteiro.json → narração, música, SFX e timeline.json
npm run studio     # pré-visualização interativa
npm run render     # gera out/video.mp4
npm run qa         # conferência final (precisa passar)
npm run video      # audio + render + qa
```

## Fluxo de trabalho (siga na ordem)

### 1. Roteiro com começo, desenvolvimento e conclusão
Leia `references/roteiro.md`. Escreva `roteiro.json`:
- **Gancho (0–3 s)**: a primeira fala começa no frame 0 e termina em até 3 s. Pergunta intrigante,
  fato surpreendente ou conflito. O texto do gancho já aparece na tela no **frame 0**, com impacto
  visual (zoom-out, tremida, flash) e sonoro (`boom` + `whoosh`).
- **Começo**: apresenta o personagem e o problema/pergunta.
- **Desenvolvimento**: 3 a 5 cenas, uma ideia por cena, com analogia visual e uma curiosidade.
- **Conclusão**: resume a resposta em uma frase e termina com chamada (pergunta para comentar).
- 6 a 9 cenas no total; frases curtas e faladas; cerca de 130–150 palavras para 60 s.
- Confira os fatos. Conteúdo educativo não pode ter erro.

### 2. Voz, áudio e linha do tempo
Leia `references/audio-legendas.md`. Na primeira vez: `npm run voz:instalar` (vozes gratuitas).
Depois `npm run audio`: narração pt-BR em **estilo documentário** (ritmo envolvente, pausas por pontuação,
voz encorpada, dicção clara), música, SFX e `timeline.json` com o tempo de cada palavra.
- Motores **gratuitos** (modo `auto`) em ordem: edge-tts (neural, online) → Kokoro (neural, offline) → MBROLA (reserva).
- **Voz padrão deste projeto: ElevenLabs** (`"motor": "elevenlabs"` no roteiro; voz Edmilson, pt-BR, documentário).
  É **paga**: `npm run audio` só mostra quantos caracteres serão cobrados e não envia nada. Antes de gerar,
  peça autorização ao usuário informando o custo; só com um "autorizo" explícito rode
  `npm run audio -- --autorizo-custo` (chave em `ELEVENLABS_API_KEY` ou `.env.local`; em nuvem,
  `ELEVENLABS_API_KEY=proxy-injected`). Nunca contrate serviço nem faça chamada paga sem autorização.
  Sem autorização, ou para rascunhos, use a voz gratuita: `npm run audio -- --engine auto`.
- Ritmo da voz Edmilson: ~155 palavras/min → escreva **~130 palavras para 60 s**.
- **Narração VIVA (padrão, preferência do usuário):** estabilidade 0.4 e similaridade 0.75 no eleven_v4, e cada fala
  com `{"texto": legenda, "pronuncia": versão interpretada}`, em que a pronúncia leva **tags de emoção**
  (`[curious]` em perguntas, `[excited]` em revelações, `[whispers]` em suspense/lenda, `[laughs]` em humor,
  `[surprised]`, `[happy]`), **MAIÚSCULAS** na palavra-chave e exclamações/reticências. Mantenha o mesmo número
  de palavras entre texto e pronúncia (sem contar as tags). As tags são removidas da legenda e dos motores
  gratuitos; o script avisa se a voz "falou" uma tag. Tags também contam como caracteres no custo.
- Avisos do script: "sobram X s" → escreva mais; "passa da duração alvo" → corte texto (~150–160
  palavras para 60 s); "gancho termina em X s" → encurte a primeira frase. Repita até não haver avisos.
- Números, siglas e palavras difíceis: use `{"texto": ..., "pronuncia": ...}` na fala.

### 3. Personagem: o MESMO do começo ao fim
Leia `references/personagem.md`. Use **somente** `<PersonagemEm>` / `<Personagem>` de
`characters/Personagem.tsx` em todas as cenas: mesmas cores, roupa, proporções e traços. A variação vem
de `expressao`, `pose`, `olharX/olharY`, `boca` (lip-sync), `cabeca`, `corpoY`, `squash`, `andando`.
Se o tema pedir outro protagonista, mude **apenas** o objeto `VISUAL` (e o desenho, se necessário)
uma vez, antes da primeira cena; nunca no meio do vídeo. Acessórios (capacete, chapéu, jaleco) podem
entrar sobre o mesmo personagem.

### 4. Cenas animadas
Leia `references/animacao.md`. Um arquivo por cena em `src/cartoon/scenes/`, registrado em `SCENES`
dentro de `CartoonExplainer.tsx` (o `id` precisa bater com o `roteiro.json`). Em toda cena:
- **Cenário vetorial colorido** (`CeuCampo`, `Espaco` ou um novo em `Backgrounds.tsx`) com algo se
  mexendo (nuvens, estrelas, parallax).
- **Personagem** com expressão e pose que mudam conforme a fala (troca suave com `poseDe` + `poseT`),
  boca sincronizada (`boca={mouth}`), piscar e respiração automáticos.
- **Objetos animados** que ilustram a ideia (entram com mola, se desenham, quicam, reagem).
- **Câmera** viva: `<Camera keys=[...]>` com push-in/pan para guiar o olhar e `shakes` nos impactos.
- **Sincronia**: use `lineStart(scene, i)` e `wordAt(scene, "palavra")` para disparar ações
  exatamente quando a palavra é dita. Nunca escreva frames fixos para coisas ligadas à fala.
- **SFX** com `<Sfx at={...} name="pop|whoosh|boom|ding|sparkle|boing|click|riser|tada" />`.
- Texto na tela curto (≤ 5 palavras por `Tag`), dentro da área segura (y entre 220 e 1560).
- Animação só com `useCurrentFrame`/`interpolate`/`spring`. Nada de CSS animation, `setTimeout` ou
  `Math.random()` (o render precisa ser determinístico).
Precisa de algo novo (animal, máquina, órgão do corpo…)? **Desenhe em SVG** em `Props.tsx` com contorno
`C.outline`, cores de `theme.ts` e partes animáveis por props.

### 5. Transições, legendas, música
Já integrados em `CartoonExplainer.tsx`: transições variadas entre cenas (slide, iris, wipe,
clock-wipe, fade), legendas palavra a palavra (ocultas no gancho, que já tem título), música com
*ducking* (abaixa durante a fala) e barra de progresso. Ajuste a lista `TRANSITIONS` se o número de
cenas mudar (precisa de `cenas - 1` transições; ela é reaproveitada em ciclo).

### 6. Pré-visualizar
`npx tsc --noEmit` e depois stills de conferência:
`npx remotion still CartoonExplainer out/qa/f.png --frame=N --scale=0.4`.
Olhe as imagens (Read) e corrija sobreposições, texto cortado e elementos fora da tela antes do
render completo. Se o usuário quiser acompanhar, abra `npm run studio`.

### 7. Render e CONFERÊNCIA FINAL (obrigatória)
`npm run render` e depois `npm run qa`. Leia `references/checklist-qa.md`. O `qa_check.py` verifica
formato, resolução, fps, duração, codec, áudio, loudness, silêncio, trechos congelados, tela preta,
gancho e sincronia das legendas, e gera `out/qa/contato.png`. **Abra a folha de contato** e confira
personagem consistente, cenários, textos, legendas e enquadramento. Só entregue com
`RESULTADO: APROVADO` e depois de olhar a imagem. Se algo falhar, corrija, renderize e confira de novo.

### 8. Entrega
Informe o caminho do MP4 (`out/video.mp4`), a duração, o motor de voz usado e o resultado da
conferência. Se a voz saiu pelo MBROLA (reserva robótica), diga como instalar o Kokoro/edge-tts.

## Integração com as skills oficiais do Remotion
As skills `remotion-*` deste projeto (`.claude/skills/remotion-*`) complementam esta. Consulte:
- `remotion-best-practices` → `remotion-markup/transitions.md`, `sequencing.md`, `timing.md`,
  `audio.md`, `sfx.md`, `voiceover.md`, `motion-blur.md`, `light-leaks.md`, `text-highlights.md`
- `remotion-captions` para transcrever a narração com Whisper quando quiser tempo de palavra exato
- `remotion-render` para opções de exportação; `remotion-studio` para a pré-visualização

## Proibido
- Imagens aleatórias, fotos, stock, GIFs prontos ou slides parados no lugar de animação.
- Trocar o visual do protagonista entre cenas, ou usar mais de um protagonista sem pedido.
- Trechos sem movimento por mais de 1,5 s.
- Gancho lento (logo, "olá pessoal", introdução) nos primeiros 3 s.
- Entregar sem rodar `npm run qa` e sem olhar a folha de contato.
- Música ou efeitos de terceiros sem licença (use os sintetizados ou arquivos que o usuário fornecer).
