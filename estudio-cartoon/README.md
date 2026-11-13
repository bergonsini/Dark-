# Estúdio Cartoon: vídeos educativos animados 2D (Remotion)

Projeto Remotion com a skill **`cartoon-explainer`** (`.claude/skills/cartoon-explainer/SKILL.md`):
vídeos verticais 9:16 (1080x1920, 30 fps, 60 s), com personagem cartoon consistente, cenários vetoriais,
câmera, transições, narração em pt-BR, legendas sincronizadas, efeitos sonoros e música, exportados em MP4.

Exemplo incluído: **"Por que o céu é azul?"** (`roteiro.json` + `src/cartoon/scenes/`).

## Requisitos
Node 20+, Python 3 com `numpy`, `ffmpeg`. Vozes gratuitas em pt-BR: `npm run voz:instalar`
(Kokoro neural offline + edge-tts). ElevenLabs (pago) está preparado, mas só roda com autorização explícita
(veja `.claude/skills/cartoon-explainer/references/audio-legendas.md`).

## Comandos
```bash
npm install
npm run voz:instalar  # 1ª vez
npm run audio    # roteiro.json → narração, música, SFX, src/cartoon/timeline.json
npm run studio   # pré-visualização
npm run render   # out/video.mp4
npm run qa       # conferência final + out/qa/contato.png
npm run video    # tudo de uma vez
```

Para pedir um vídeo novo ao Claude Code, abra-o nesta pasta e peça, por exemplo:
"Use a skill cartoon-explainer para fazer um vídeo sobre como as abelhas fazem mel".
