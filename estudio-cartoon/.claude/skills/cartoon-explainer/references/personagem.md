# Personagem consistente

Arquivo: `src/cartoon/characters/Personagem.tsx`. O protagonista padrão é o **Tito**: menino de óculos
redondos, cabelo cacheado escuro, camiseta amarela com estrela laranja, short azul e tênis vermelho.

## Regras de consistência
1. Um protagonista por vídeo, sempre o mesmo componente. Nunca copie o SVG para dentro de uma cena.
2. Cores e proporções vêm só do objeto `VISUAL`. Não passe cores por props nas cenas.
3. Mesmo contorno (`OUTLINE_W`, `C.outline`) em personagem, objetos e cenários: estilo coeso.
4. Altura parecida entre cenas (420–700 px). Mudar de escala só como escolha de câmera.
5. Acessórios temáticos (capacete, chapéu, jaleco) por cima do personagem, sem alterar o corpo.
6. Personagens secundários (Sol com rosto, moléculas com carinha) também mantêm o mesmo visual em todas as cenas.

## API
```tsx
<PersonagemEm
  x={540} pe={1290} altura={680}   // pés no ponto (x, pe)
  boca={mouth}                      // lip-sync: mouth vem de useSceneFrame(scene)
  expressao="feliz"                 // neutro | feliz | animado | surpreso | pensativo | preocupado | encantado | bravo
  pose="explicando"                 // parado | acenando | apontando | apontandoCima | pensando | explicando |
                                    // comemorando | assustado | andando | maosNaCintura
  poseDe="parado" poseT={(f - t0) / 8}  // transição suave entre poses (0→1 em ~8 frames)
  olharX={0.5} olharY={-0.8}        // para onde os olhos olham (-1..1)
  cabeca={6}                        // inclinação da cabeça (graus)
  corpoY={-40}                      // pulo / deslocamento vertical
  squash={-0.15}                    // squash & stretch (-0.25..0.25)
  andando                           // ciclo de caminhada (pernas, braços, balanço)
  espelhar                          // vira para a esquerda
/>
```
Automático: piscar (com piscada dupla ocasional), respiração, leve balanço da cabeça e da fala.

## Atuação
- A expressão acompanha o sentido da fala: dúvida → `pensativo`; descoberta → `surpreso` e depois `encantado`; conclusão → `animado`.
- Olhe para o que está sendo explicado (`olharX/olharY` na direção do objeto).
- Troque pose no início de cada fala (`lineStart`) ou na palavra-chave (`wordAt`), sempre com `poseDe`/`poseT`.
- Antecipação e exagero: antes de um pulo, `squash` negativo por 4–6 frames; ao cair, esticar e voltar.
- Entrada em cena andando (`andando` + `interpolate` no x) e não "aparecendo do nada".

## Criar outro protagonista
Se o tema pedir (ex.: uma cientista, um animal), edite `VISUAL` e, se preciso, o desenho em
`Personagem.tsx`, mantendo a mesma API (expressões, poses, boca). Faça isso antes de criar as cenas e
gere um still de referência (`npx remotion still … --frame=…`) para validar o visual.
