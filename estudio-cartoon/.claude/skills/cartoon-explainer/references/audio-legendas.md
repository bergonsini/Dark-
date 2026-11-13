# Narração, legendas, efeitos e música

## Narração em português brasileiro
`scripts/generate_audio.py` lê `roteiro.json` e tenta, nesta ordem:
1. **edge-tts** (`pip install edge-tts`): voz neural natural (`pt-BR-AntonioNeural`, `pt-BR-FranciscaNeural`). Precisa de internet.
2. **espeak-ng + MBROLA** (`apt install espeak-ng mbrola mbrola-br3`): offline, aceitável.
3. **espeak-ng** puro: último recurso (o QA avisa).
Forçar: `python3 .claude/skills/cartoon-explainer/scripts/generate_audio.py --engine edge`.
Se o usuário fornecer um arquivo de voz gravado, transcreva com Whisper (skill `remotion-captions`) e
adapte o `timeline.json` (mesmo formato) em vez de usar TTS.

O áudio é normalizado (-16 LUFS), cortado e montado em `public/audio/narration.wav`. A duração total é
esticada até `duracaoSegundos` distribuindo pausas entre cenas (até 1,6 s) e o resto no final.

## timeline.json (gerado)
Para cada cena: `startFrame`/`endFrame`; para cada fala: frames e **cada palavra** com seu frame.
Mais o array `mouth` (abertura da boca por frame, do volume da narração) usado no lip-sync.
Nas cenas: `lineStart(scene, i)`, `lineEnd(scene, i)`, `wordAt(scene, "palavra")`, `mouthAt(g)`.

## Legendas sincronizadas
`components/Captions.tsx` mostra blocos de até 3 palavras, com a palavra falada em amarelo e mola na
entrada. Ficam ocultas na cena do gancho (que já tem o texto na tela). O tempo das palavras é estimado
proporcionalmente ao tamanho delas; para precisão total, transcreva com Whisper (`remotion-captions`).

## Efeitos sonoros (sintetizados, livres de direitos)
`whoosh` (troca de cena, movimento rápido), `boom` (impacto, gancho), `pop` (algo aparece),
`ding` (acerto, conclusão), `sparkle` (descoberta, magia), `boing` (quique, humor), `click` (passos,
detalhes), `riser` (tensão antes de revelar), `tada` (grande conclusão).
Uso: `<Sfx at={frameLocal} name="pop" volume={0.6} />` dentro da cena, sincronizado à ação.
Densidade: 2–6 SFX por cena. Não cubra a voz: volumes de 0.2 a 0.7.

## Música de fundo
Trilha original sintetizada (bumbo, caixa, chimbal, baixo, pad e melodia; progressão I–V–vi–IV),
em `public/audio/music.wav`. Volume com *ducking*: 0.09 durante a fala, 0.2 nas pausas, fade-out no final.
Para usar uma faixa do usuário, substitua `public/audio/music.wav` (precisa ter licença).
