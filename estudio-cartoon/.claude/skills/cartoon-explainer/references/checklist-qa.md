# Conferência final (antes de entregar)

Rode `npm run render && npm run qa` (ou `npm run video`). O script reprova automaticamente se falhar:

| Grupo | Verificação automática |
|---|---|
| Vídeo | MP4, H.264, yuv420p, 1080x1920, 30 fps, duração = alvo ± 1 s |
| Áudio | AAC presente, -20 a -11 LUFS, pico ≤ -0,5 dBTP, sem silêncio > 2,5 s |
| Animação | nenhum trecho congelado > 1,5 s, nenhuma tela preta |
| Roteiro | gancho começa ≤ 0,5 s e termina ≤ 3,2 s; ≥ 5 cenas cobrindo o vídeo todo |
| Legendas | todas as falas com palavras em ordem, dentro da fala e da cena |

Depois, **abra `out/qa/contato.png`** (Read) e confira manualmente:

**Cenas**
- [ ] O gancho é legível sem som no primeiro frame e tem movimento forte.
- [ ] Começo, desenvolvimento e conclusão estão claros; a conclusão responde à pergunta do gancho.
- [ ] Cada cena tem cenário vetorial, personagem e pelo menos um objeto animado ilustrando a fala.
- [ ] Nenhuma imagem aleatória, foto ou slide estático.

**Personagem**
- [ ] É o mesmo em todas as cenas (cores, roupa, óculos, proporções).
- [ ] Expressões mudam de acordo com a fala; boca mexe quando há narração.

**Texto e legendas**
- [ ] Nada cortado nas bordas; nada importante fora da área segura (y 220–1560).
- [ ] Legenda não cobre o rosto do personagem nem o objeto principal.
- [ ] Português correto (acentos, ortografia) em títulos, tags e legendas.

**Áudio** (ouça trechos se possível, ou confira os números do QA)
- [ ] Narração clara e acima da música; SFX nos momentos certos; música termina com fade.

**Qualidade**
- [ ] Transições suaves; nenhum "pulo" de posição entre o fim de uma cena e o início da próxima.
- [ ] Fatos conferidos.

Se algo falhar: corrija → `npm run render` → `npm run qa` → olhe a folha de contato de novo.
Para inspecionar um momento específico: `npx remotion still CartoonExplainer out/qa/f.png --frame=N --scale=0.5`.
