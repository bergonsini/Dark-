# Kit 3D low-poly (Titorei)

## Regras técnicas
- Cada cena tem seu próprio `<ThreeCanvas width height flat>` (flat = sem tone mapping: cores fiéis).
- Animação SÓ com `useCurrentFrame()` / `interpolate` / `spring`. `useFrame` do R3F é proibido.
- Render usa WebGL por software (`Config.setChromiumOpenGlRenderer("swangle")` no `remotion.config.ts`):
  funciona sem placa de vídeo; ~60 quadros a cada 10 s.
- Unidades: 1 ≈ 50 cm; personagens com os pés em y = 0, frente para +z.
- Use sempre `<Luzes />` (ambiente + hemisfério + direcional).

## Peças (`src/titorei/lowpoly.tsx`)
`Caixa`, `Bola` (icosaedro facetado), `Cone`, `Cilindro`, `Olho`, `Rostinho` (olhos + sobrancelhas + boca para
QUALQUER objeto; `expr`: feliz | bravo | chocado | nervoso | zen | triste; `boca` 0..1), `usePiscar`.

## Elenco
- `TitoRei` (`personagens/TitoRei.tsx`): `pos`, `rotY`, `expr` (neutro, feliz, animado, chocado, bravo, malandro,
  triste), `pose` (parado, acenando, apontando, bracosPraCima, chocado, maosNaCintura, pensando, explicando),
  `bracoE/bracoD` livres, `andando`, `pulo`, `olhar`, `cabeca`, `coroa` (inclinação), `brilhoCoroa`.
- `Capivara`: `zen` (olhos meio fechados), `boca`.
- Objetos (`objetos/Cozinha.tsx`): `Geladeira` (abertura, oculos, andando, tremendo, expr), `Leite` (nervoso suando),
  `Queijo` (medita = flutua), `Manteiga` (ioga 0..1), `CuboGelo` (derrete 0..1), `Bancada`.
- Cenários: `Cozinha3D`, `Praia3D`. Novos cenários/objetos: monte com as peças, cores chapadas, poucos polígonos.

## Câmera (`CameraRig.tsx`)
```tsx
<CameraRig keys={[
  { f: 0, pos: [0.9, 2.1, 8.2], alvo: [0.5, 1.2, 0.4], fov: 46 },          // aberto
  { f: wordAt(scene, "pediu"), pos: [0, 1.65, 3.6], alvo: [0, 1.6, 0.4], fov: 36, corte: true }, // corte seco
  { f: wordAt(scene, "demissão."), ...frente([1.1, 0, 1.2], -0.6, 2.6, 2.0, 34), corte: true },  // close no rosto
]} shakes={[...]} />
```
- `corte: true` = corte seco; sem `corte`, a câmera desliza (dolly/zoom).
- `frente(posDoPersonagem, rotY, distância, alturaDoAlvo, fov)` coloca a câmera DE FRENTE para o rosto.
- Vertical é estreito (largura visível ≈ 0,5 × altura): planos abertos com distância 7–8 e personagens a no máximo
  ±1,2 do centro; closes de rosto com distância 2,5–3.

## Textos (`Overlay.tsx`)
`LegendaPalavra` (automática na composição), `Capitulo` (vem do roteiro), `Onomatopeia` ("PLAU!", "BRRR!"),
`Placa` (amarela: "PEÇO DEMISSÃO").

## Conferência extra: ritmo de cortes
```bash
python3 - <<'PY'
import subprocess,numpy as np
w,h=108,192
raw=subprocess.run(['ffmpeg','-loglevel','error','-i','out/titorei.mp4','-vf',f'scale={w}:{h},format=gray','-f','rawvideo','-'],capture_output=True).stdout
fr=np.frombuffer(raw,np.uint8).reshape(-1,h,w).astype(float)
d=np.abs(np.diff(fr,axis=0)).mean(axis=(1,2)); c=[i/30 for i in np.where(d>25)[0]]
print(len(c),'cortes; 1 a cada',round(len(fr)/30/len(c),1),'s')
PY
```
Meta: 1 corte a cada ~1–2 s.
