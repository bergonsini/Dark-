# Narração, legendas, efeitos e música

## Voz em português brasileiro (estilo documentário)
Código: `scripts/voz.py` (motores e alinhamento) chamado por `scripts/generate_audio.py`.
Instalação das vozes gratuitas: `npm run voz:instalar` (= `python3 scripts/instalar_voz.py`).

| Motor | Custo | Qualidade | Tempo das palavras | Requisitos |
|---|---|---|---|---|
| `edge` | gratuito, sem chave | neural, muito natural (`pt-BR-AntonioNeural`, `pt-BR-FranciscaNeural`) | exato (do serviço) | `pip install edge-tts` + internet |
| `kokoro` | gratuito, Apache 2.0, **offline** | neural, natural (`pm_alex`, `pm_santa`, `pf_dora`) | alinhamento acústico | `pip install kokoro-onnx soundfile` + modelo (~350 MB, GitHub) |
| `mbrola` | gratuito, offline | robótico (só reserva) | alinhamento acústico | `apt install espeak-ng mbrola mbrola-br3` |
| `espeak` | gratuito, offline | muito robótico | alinhamento acústico | `apt install espeak-ng` |
| `elevenlabs` | **PAGO** | premium | exato (do serviço) | chave + autorização explícita (abaixo) |

`"motor": "auto"` tenta **só os gratuitos**, nesta ordem: edge → kokoro → mbrola → espeak. Um único motor é
escolhido para o vídeo inteiro (nunca mistura vozes). Forçar: `npm run audio -- --engine kokoro`.

### Configuração no roteiro.json
```json
"voz": {
  "motor": "auto",
  "estilo": "documentario",
  "kokoro": { "voz": "pm_alex", "velocidade": 0.9 },
  "edge": { "voz": "pt-BR-AntonioNeural", "velocidade": "-6%", "tom": "-3Hz" },
  "elevenlabs": { "voiceId": "", "modelo": "eleven_multilingual_v2", "estabilidade": 0.45, "similaridade": 0.8, "estilo": 0.35, "velocidade": 0.95 },
  "mbrola": "mb-br3", "espeakSpeed": 160, "espeakPitch": 48
}
```
- Kokoro aceita mistura de vozes: `"kokoro": { "mistura": { "pm_alex": 0.6, "pm_santa": 0.4 } }`.
- `estilo`: `documentario` (padrão) ou `animado`.

### Estilo "documentario"
- Ritmo: voz um pouco mais lenta (Kokoro 0.9, edge -6%, tom -3 Hz), ajustada depois à duração alvo.
- Pausas por pontuação entre falas: vírgula 0,14 s, ponto 0,38 s, pergunta 0,5 s; entre cenas ≥ 0,55 s.
- Cadeia de locução (ffmpeg): passa-alta 75 Hz, corpo +2,5 dB em 140 Hz, menos "embolado" em 320 Hz,
  **presença +3 dB em 3,2 kHz (dicção)**, brilho leve em 9 kHz, de-esser, compressor e loudness -16 LUFS.
- Ajuste de duração: se a fala não cabe nos 60 s, a velocidade sobe até ×1.12; se sobra muito, desce até ×0.9.
  Se ainda assim não couber, o script avisa: **encurte o texto** (alvo ~150–160 palavras por minuto de vídeo).

### Controle fino por fala
Uma fala pode ser objeto em vez de texto:
```json
{ "texto": "Há 10.000 anos…", "pronuncia": "Há dez mil anos…", "velocidade": 0.9, "pausaDepois": 0.6 }
```
`texto` vai para a legenda; `pronuncia` é o que a voz fala (números por extenso, siglas, ênfase com
vírgulas e reticências); `velocidade` multiplica o ritmo só dessa fala; `pausaDepois` define a pausa seguinte.
Dica de dicção: frases curtas, vírgulas onde se respira, evite siglas e números escritos.

### Cache
Cada fala sintetizada fica em `.cache/tts/falas/` (chave = motor + texto + configurações). Rodar de novo
sem mudar o texto não sintetiza de novo, o que é importante para não gastar créditos de serviços pagos.

## ElevenLabs (preparado, DESLIGADO por padrão)
Nunca é usado no modo auto. Para usar (apenas com autorização do usuário):
1. Crie a chave na conta ElevenLabs do usuário e exporte só no terminal: `export ELEVENLABS_API_KEY=...`
   (nunca grave a chave no roteiro, no código ou no git).
2. Preencha `voz.elevenlabs.voiceId` no `roteiro.json` (ID de uma voz pt-BR da biblioteca).
3. Rode `npm run audio -- --engine elevenlabs`: o script mostra quantos caracteres serão cobrados e **não envia
   nada**. Só depois de o usuário autorizar: `npm run audio -- --engine elevenlabs --autorizo-custo`.
A integração usa `/v1/text-to-speech/{voice_id}/with-timestamps` (tempo exato por caractere → por palavra),
envia `previous_text`/`next_text` para manter a entonação entre frases e não refaz chamadas para ajustar duração.

## timeline.json (gerado) e sincronia
Para cada cena: `startFrame`/`endFrame`; para cada fala: frames e **cada palavra** com seu frame; e o array
`mouth` (abertura da boca por frame, calculada do áudio real) para o lip-sync.
- Tempo das palavras: exato no edge/ElevenLabs; no Kokoro/MBROLA vem do **alinhamento acústico** (pausas
  reais do áudio casadas com a pontuação + distribuição por fonemas da frase inteira + encaixe nos vales de energia).
- As cenas usam `lineStart(scene, i)` e `wordAt(scene, "palavra")`; as legendas e a boca leem o mesmo arquivo.
  Mudou o roteiro ou a voz → `npm run audio` e tudo se re-sincroniza sozinho.
- O `qa_check.py` confere a sincronia no áudio final: ≥ 95% das palavras precisam cair sobre fala real e
  nenhuma fala pode ficar sem legenda.
- Para precisão máxima com voz gravada por uma pessoa, transcreva com Whisper (skill `remotion-captions`).

## Legendas
`components/Captions.tsx`: blocos de até 3 palavras, palavra falada em amarelo, mola na entrada,
ocultas no gancho (que já tem o texto na tela).

## Efeitos sonoros (sintetizados, livres de direitos)
`whoosh`, `boom`, `pop`, `ding`, `sparkle`, `boing`, `click`, `riser`, `tada`.
Uso: `<Sfx at={frameLocal} name="pop" volume={0.6} />`, 2–6 por cena, volume 0.2–0.7.

## Música de fundo
Trilha original sintetizada (`public/audio/music.wav`), com *ducking*: 0.09 durante a fala, 0.2 nas pausas,
fade-out no final. Para usar uma faixa do usuário, substitua o arquivo (precisa ter licença).
