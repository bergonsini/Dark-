---
name: titorei
description: Vídeos do TITOREI (2º canal) — humor PURO, absurdo e aleatório em 3D low-poly, com o Tito.rei (o Tito de coroa). Histórias que escalam de forma ridícula, cortes secos rápidos, closes exagerados, legenda de UMA palavra por vez, títulos de capítulo amarelos, onomatopeias e objetos com rostinho. Formato 9:16, 1080x1920, 30 fps, MP4. Use SEMPRE que o usuário pedir "vídeo do Titorei", "Tito.rei", "Tito rei" ou humor absurdo. NÃO use para "vídeo do Tito" (esse é o explicativo 2D da skill cartoon-explainer).
---

# Titorei (2º canal: humor absurdo 3D)

O estúdio tem **dois canais** com o mesmo personagem-base:

| Pedido | Canal | Skill | Estilo |
|---|---|---|---|
| "vídeo do **Tito**" | 1º Tito | `cartoon-explainer` | explicativo, 2D, fatos conferidos |
| "vídeo do **Titorei**" | 2º Titorei | **esta** | humor puro, absurdo, aleatório, 3D low-poly |

Inspiração de FORMATO: esquetes absurdas em 3D low-poly do tipo que o usuário mostrou (cortes rápidos,
legenda palavra por palavra, capítulos). **Nunca copie personagens, piadas ou histórias de outros criadores**:
cada episódio é uma história original com o elenco do Titorei.

## Especificação

| Item | Valor |
|---|---|
| Formato | 9:16, **1080x1920**, **30 fps**, MP4 H.264 + AAC |
| Duração | **60 s** (padrão pedido pelo usuário; aceite outra se ele pedir) |
| Composição Remotion | `TitoRei` (`src/Root.tsx`) |
| Roteiro ativo | `titorei/roteiro.json` (episódios antigos em `titorei/roteiros/`) |
| Saída | `out/titorei.mp4` → copie para `out/titorei-<episodio>.mp4` ao entregar |

## Mapa
```
titorei/roteiro.json              ← roteiro do episódio (você escreve) — "saida" aponta p/ src/titorei e public/titorei
src/titorei/
  TitoReiVideo.tsx                ← cortes secos entre cenas + legenda 1 palavra + capítulos + áudio
  episodios.ts                    ← catálogo: "video" do roteiro → cenas
  episodios/<video>/cenas.tsx     ← as cenas do episódio (uma função por cena) + index.ts (CENAS)
  personagens/TitoRei.tsx         ← O PROTAGONISTA (único): Tito low-poly de coroa
  personagens/Capivara.tsx        ← elenco fixo
  objetos/Cozinha.tsx             ← Geladeira, Leite, Queijo, Manteiga, CuboGelo, Bancada (com rostinho)
  cenarios/Cenarios.tsx           ← Cozinha3D, Praia3D
  lowpoly.tsx                     ← Caixa, Bola, Cone, Cilindro, Olho, Rostinho, Luzes (tudo facetado)
  CameraRig.tsx                   ← câmera com cortes secos + frente() p/ close de rosto
  Overlay.tsx                     ← LegendaPalavra, Capitulo, Onomatopeia, Placa
  common.tsx                      ← useCena, Sfx (efeitos), passo()
```
Áudio, voz e conferência reaproveitam os scripts da skill do Tito
(`.claude/skills/cartoon-explainer/scripts/`): leia `cartoon-explainer/references/audio-legendas.md`.

Comandos (na raiz `estudio-cartoon/`):
```bash
npm run titorei:audio    # roteiro → narração, música, SFX, src/titorei/timeline.json
npm run titorei:render   # out/titorei.mp4
npm run titorei:qa       # conferência (precisa APROVADO)
```

## Série contínua (PADRÃO pedido pelo usuário)
- Os episódios formam uma **história contínua**. Leia `titorei/serie.md` (bíblia da série) antes de escrever:
  o episódio novo RETOMA o gancho deixado no fim do anterior.
- Todo episódio **termina com um gancho de mistério** para o próximo (pergunta/objeto/personagem misterioso +
  "Descobre no próximo episódio!") e o título **"CONTINUA…"** na tela no último plano.
- Depois de entregar, **atualize `titorei/serie.md`** (episódio, título, gancho deixado, novos personagens/piadas).

## Fluxo
1. **Roteiro** (`references/humor.md`): história original que ESCALA de forma absurda, **~140–150 palavras para 60 s**,
   frases curtas, 6–9 cenas (capítulos). Gancho absurdo nos 3 primeiros segundos, com o texto na tela no frame 0
   (`capitulo` da cena de gancho). Cada cena pode ter `capitulo` (título amarelo, ex.: "CAPIVARA REFRIGERADORA").
   Termine com chamada ("Segue pra ver o que o Tito... amanhã!"). Arquive o anterior em `titorei/roteiros/`.
2. **Áudio**: rascunho grátis `npm run titorei:audio -- --engine kokoro`. **Voz do Titorei: Jonas** (ElevenLabs,
   `wTABSOIKENuRDeLiHYDF`, pt-BR dinâmico; estabilidade 0.35, similaridade 0.75) — diferente do Lax do Tito.
   Voz paga só com autorização explícita do usuário informando o custo (mesma regra do Tito):
   `npm run titorei:audio -- --autorizo-custo`. Narração viva: tags
   `[excited]`, `[laughs]`, `[deadpan]`, `[sighs]` e MAIÚSCULAS na `pronuncia`.
3. **Cenas** (`references/kit3d.md`): uma função por cena em `src/titorei/episodios/<video>/cenas.tsx`,
   registradas em `index.ts` e em `src/titorei/episodios.ts`. Regras de ritmo:
   - **corte seco a cada ~1–2 s**, nenhum plano com mais de ~2,5 s; cortes sincronizados com `wordAt()`;
   - alterne plano aberto ↔ **close exagerado** (`frente(pos, rotY, dist, altura)`);
   - pelo menos 1 onomatopeia/placa por cena, `Sfx` cômicos (`tum`, `apito`, `boing`, `pop`, `whoosh`);
   - objetos ganham vida com `Rostinho`; o Tito.rei reage com expressões fortes (`chocado`, `malandro`...).
4. **Conferir**: `npx tsc --noEmit`, stills (`npx remotion still TitoRei out/qa/x.png --frame=N --scale=0.3`),
   olhe as imagens (enquadramento vertical é estreito: nada cortado na borda), render, `npm run titorei:qa`,
   folha de contato e medição de cortes (ver `references/kit3d.md`).
5. **Entrega**: MP4, duração, voz usada, resultado da conferência.

## Proibido
- Copiar personagens, piadas, nomes de quadros ou histórias de outros criadores.
- Trocar o visual do Tito.rei (coroa, óculos, cabelo cacheado, camiseta amarela, short azul, tênis vermelho).
- Planos parados/longos (> 3 s sem corte), animação fora de `useCurrentFrame()` (`useFrame` é proibido).
- Gerar voz paga sem autorização.
