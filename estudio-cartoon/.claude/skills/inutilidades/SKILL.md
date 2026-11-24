---
name: inutilidades
description: Vídeos do INUTILIDADES 0800 (3º canal) — comerciais de TELEVENDAS fictícios de produtos absurdos e inúteis, em 2D com filtro VHS anos 80/90. Apresentador Doutor Oferta, cliente fiel Seu Kuka Beludo (sempre se dá mal) e o rato (participação de vez em quando). Formato 9:16, 1080x1920, 30 fps, 30–45 s, MP4. Use SEMPRE que o usuário pedir "vídeo do Inutilidades", "Inutilidades 0800", "comercial de produto absurdo", "canal 3" ou um novo produto da loja. NÃO use para "vídeo do Tito" (explicativo 2D, skill cartoon-explainer) nem "vídeo do Titorei" (humor 3D, skill titorei).
---

# INUTILIDADES 0800 — o 3º canal

Loja de televendas **fictícia** (nada é vendido de verdade, é só humor). Cada vídeo é um comercial de TV
"Ligue já!" de um produto absurdo que "funciona"… e dá tudo errado.

## Identidade (não mude sem o usuário pedir)
- **Estilo:** 2D (contorno escuro grosso, cores fortes) + **filtro VHS** sempre: aberração cromática, linhas de TV,
  vinheta, faixa de tracking, "PLAY ▶" e contador "SP 0:00:00". Transições: "a fita embola" (glitch + "◀◀ REW").
- **Duração:** 30–45 s (padrão 40 s, em `duracaoSegundos`).
- **Personagens fixos** (`src/inutilidades/Personagens.tsx` — use sempre estes componentes):
  - **Doutor Oferta** (`DoutorOferta`): apresentador, terno roxo, gravata dourada, topete, sorrisão brilhante, microfone de cabeça.
    Poses: parado, apontando, bracosAbertos, apresentando, joinha. Expr: sorriso, piscando, gritando, chocado. `queimado`.
    **Desde o ep. 10 usa o TOPETE DE GALÃ (cabelo bonito, sem `curativo`)**, a pedido do usuário. Só use `curativo` se a piada pedir.
    Voz: **Carlos** (ElevenLabs `xJ8U5HgW3Zps75qgYrFw`) — locutor de oferta empolgado.
  - **Seu Kuka Beludo** (`SeuKuka`): cliente fiel, black power volumoso (o "Beludo"), bigodão, camiseta verde.
    Compra TUDO e sempre se dá mal; o cabelo termina destruído. Estados: normal, faminto, tostado (sem sobrancelha!).
    A tarja "produtos comprados: N" SOBE a cada vídeo (piada recorrente). Voz: **Silas** (`mP51FBaz7jxNEIeFJwxX`).
  - **O rato** (`Rato`): participação especial de vez em quando (não é rival, não aparece sempre).
    Voz: Silas **afinado** (`"afinar": 1.45`, processamento local, sem custo extra).
- **Bordão final:** letrinhas miúdas lidas bem rápido ("Não nos responsabilizamos…") + logo INUTILIDADES 0800.

## Elenco extra
- **Dona Cleide** (`DonaCleide`, voz Raquel `CS2gH5fPqUCmkVNpHsy4`): cliente nova desde o ep. 5.

## Formato atual (pedido do usuário no ep. 5)
Sem gancho separado e sem depoimento: **problema (P&B, já é o gancho) → produto → demonstração → oferta → letrinhas**.
O formato antigo (gancho + depoimento) fica para quando o usuário pedir.

## Estrutura de cada comercial (formato antigo, completo)
1. **Gancho (0–2 s)**: imagem absurda e forte logo de cara (ep. 1: o rato almoçando: "Faltou sal.").
2. **Problema exagerado** em PRETO E BRANCO (`<Tela pb>`): "Cansado de…?"
3. **A solução**: estúdio colorido, "Seus problemas ACABARAM!", nome do produto gigante (`NomeProduto`).
4. **Demonstração**: o produto "funciona"… e o desastre acontece.
5. **Depoimento** do Seu Kuka (tarja `Terco`, selo "DEPOIMENTO REAL*"), destruído e feliz.
6. **Oferta**: `EstrelaPreco` ("DE R$ 999 / R$ 19,90"), brinde, "Ligue já!" (`LigueJa`, número-piada por produto).
7. **Letrinhas miúdas** + logo (+ eventual participação do rato).

## Humor (regras)
- Produto **absurdo**, apresentado com **confiança total** como se fosse útil. O desastre é sempre de DESENHO:
  sem sangue, sem violência real, ninguém se machuca de verdade (fica tostado, despenteado, zonzo).
- Ideias originais; nunca copie personagens, bordões ou piadas de outros criadores/comerciais reais.
- Sem marcas reais. O Instagram deve dizer na bio que a loja é fictícia (humor).

## Arquivos
- Roteiro ativo: `inutilidades/roteiro.json` (arquive cada um em `inutilidades/roteiros/<id>.json`); catálogo em `inutilidades/catalogo.md`.
- Cada fala tem `"quem"`: `doutor`, `kuka` ou `rato` (vozes em `"personagens"` do roteiro; o gerador troca o dublador por fala).
- Kit: `src/inutilidades/` — `Personagens.tsx`, `Objetos.tsx` (Cozinha, Estudio, Mesa, ParedeTijolos, Ratoeira, Explosao, Fumaca),
  `Overlay.tsx` (Faixa, NomeProduto, EstrelaPreco, LigueJa, Selo, Terco, Onomatopeia, Legenda, VHSInterface),
  `Tela.tsx` (câmera 2D: zoom/foco/tremida/preto e branco), `common.tsx` (Sfx, mola, lerp, tremor, passo).
- Episódios: `src/inutilidades/episodios/<id>/cenas.tsx` + `index.ts`, registrados em `src/inutilidades/episodios.ts`
  (`glitch: true` = a fita embola no começo da cena; `semLegenda` = cenas sem a legenda padrão).
- Efeitos extras deste canal: `caixa` (cha-ching) e `vhs` (chiado/rebobinar).

## Fluxo (igual aos outros canais)
1. Roteiro → `npm run inutilidades:audio -- --engine kokoro` (rascunho GRÁTIS).
2. Cenas → `npx tsc --noEmit` → quadros-chave → `npm run inutilidades:render` → `npm run inutilidades:qa` (+ folha de contato).
3. Mandar o rascunho e pedir **"autorizo"** informando o custo em caracteres (o gerador imprime).
4. Com autorização: `ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY:-proxy-injected} npm run inutilidades:audio -- --autorizo-custo`,
   render, QA, `cp out/inutilidades.mp4 out/inutilidades-epN-<id>.mp4`, atualizar `inutilidades/catalogo.md`, commit + push.
- Ajustes depois da voz paga: só locais (`--somente-cache`, `aceleraLocal`, `pausaDepois`) — nunca pagar de novo sem pedir.
