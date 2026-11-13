# Animação, câmera e transições

Base técnica: tudo deriva de `useCurrentFrame()`. Use `interpolate` (com `extrapolateLeft/Right: "clamp"`),
`spring` e `Easing`. Proibido: CSS `animation`/`transition`, `setTimeout`, `Math.random()` sem semente.
Para mais detalhes técnicos, veja as skills oficiais: `remotion-best-practices/remotion-markup/`
(`timing.md`, `sequencing.md`, `transitions.md`, `motion-blur.md`, `effects.md`).

## Princípios de movimento natural
- **Easing sempre**: nada se move linearmente, exceto feixes de luz e esteiras.
- **Molas** (`spring`, damping 8–14) para objetos entrando: passam um pouco do ponto e voltam.
- **Antecipação → ação → acomodação**: recuo antes do pulo, *overshoot* na chegada.
- **Squash & stretch** em impactos e pulos.
- **Movimento secundário**: algo sempre vivo (nuvens, estrelas, respiração, brilho, tremor das moléculas).
- **Escalonar** entradas de grupos (5–8 frames entre itens) em vez de tudo de uma vez.
- Nada parado por mais de 1,5 s (o QA reprova trechos congelados).

## Câmera (`components/Camera.tsx`)
```tsx
<Camera keys={[{ f: 0, zoom: 1.35, y: -60 }, { f: 40, zoom: 1.05 }]} shakes={[0, wordAt(scene, "boom")]}>
  …cenário, personagem e objetos…
</Camera>
```
- Gancho: zoom-out rápido (1.3 → 1.05) + tremida no frame 0.
- Explicação: push-in lento (1.0 → 1.1) no objeto que importa; pan (`x`, `y`) para mostrar algo novo.
- Impacto: `shakes` no frame da batida (sincronize com SFX `boom`).
- Textos/legendas que devem ficar fixos ficam **fora** da `<Camera>`.

## Cenários vetoriais
- `CeuCampo` (céu em degradê, nuvens em parallax, colinas), `Espaco` (estrelas cintilando), `Nuvem`.
- Para mudar o clima ao longo da cena use `interpolateColors` (ex.: dia → pôr do sol).
- Novos cenários: SVG com 2–3 planos de profundidade, contorno `C.outline`, cores de `theme.ts`.
- Paleta saturada e alegre; contraste alto entre personagem e fundo.

## Objetos animados (`components/Props.tsx`)
Sol (rosto, piscadela), Feixe (luz que se desenha), RaioZigue (trajeto com "fóton"), Prisma,
LequeCores, Molecula (reage a `hit`), OlhoGrande, Planeta (gira), Brilhos, Interrogacoes, Seta,
BalaoComentario. Crie novos no mesmo padrão: posição por props, animação interna por frame,
reação a um frame de evento.

## Transições entre cenas
Configuradas em `CartoonExplainer.tsx` com `@remotion/transitions` (12 frames): slide, iris, wipe,
clock-wipe, fade. Varie; reserve as mais chamativas (iris, clock-wipe) para mudanças de assunto.
Cada cena dura `len + 12` frames por causa da sobreposição; o frame local 0 da cena = `scene.startFrame`.

## Layout 9:16
- Área segura: y 220–1560 (topo e base têm UI do aplicativo).
- Títulos no topo (y 170–460), personagem no meio (pés em ~1290), legendas em y ≈ 1300–1500.
- Texto na tela: no máximo 5 palavras por `Tag`, fonte ≥ 40 px, contorno grosso.
