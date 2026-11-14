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
| `elevenlabs` | **PAGO** | premium (voz Edmilson, `eleven_v4`) | exato (do serviço) | chave + autorização explícita (abaixo) |

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
- Cadeia de locução com foco em **clareza** (ffmpeg): passa-alta 100 Hz, -2,5 dB em 170 Hz (grave que embola),
  -4 dB em 380 Hz (som "de caixa"/sala fechada), +4 dB em 2,8 kHz (articulação), +3 dB em 5,5 kHz (presença),
  +2,5 dB de agudos a partir de 9 kHz (ar), de-esser, compressor 2,5:1 e loudness **-14 LUFS** (padrão das redes).
  A cadeia antiga reforçava 140 Hz e deixava a voz abafada, "de longe": não volte a reforçar graves.
- A conferência mede a nitidez: presença (1–6 kHz) ≥ 20% e graves (60–250 Hz) ≤ 28% da energia da fala.
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

### Cache (nunca pagar duas vezes)
Cada fala guarda o **áudio cru** do motor em `.cache/tts/falas/` (chave = motor + texto + configurações) e a versão
processada (chave + hash da equalização). Mudou a equalização? Só reprocessa, sem sintetizar de novo.
Para refazer o áudio de um vídeo pago com **custo zero garantido**: `npm run audio -- --somente-cache`
(falha em vez de chamar a ElevenLabs se faltar alguma fala). Falas antigas sem áudio cru recebem uma correção
de equalização sobre a versão processada (`CORRECAO_LEGADO` em `voz.py`).

## ElevenLabs (PADRÃO deste projeto, PAGA, só com autorização)
É o motor padrão do `roteiro.json` (`"motor": "elevenlabs"`), mas nunca é usada no modo `auto`. Configuração atual: SDK oficial `@elevenlabs/elevenlabs-js`
(`scripts/elevenlabs_tts.mjs` na raiz do projeto), modelo `eleven_v4`, idioma `pt`, voz **Edmilson**
(`9luRA11KwacKAVmLyqUs`, masculina, brasileira, feita para documentário e conteúdo educativo),
estabilidade 0.6 e similaridade 0.6 (perfil "narração" da ElevenLabs, um pouco mais expressivo).
Alternativa mais grave: Antônio (`oQtRiHTYSl1XeCm4tuUw`).

- Chave: `ELEVENLABS_API_KEY` no ambiente ou no `.env.local` (criado por `npx @elevenlabs/cli onboard init`,
  ignorado pelo Git). Em ambiente de nuvem com a chave nos segredos de rede, rode com
  `ELEVENLABS_API_KEY=proxy-injected` (o proxy troca pelo valor real). Nunca coloque a chave no código ou no chat.
- Gerar: `npm run audio -- --engine elevenlabs` mostra quantos caracteres serão cobrados e **não envia nada**.
  Só com autorização explícita do usuário: `npm run audio -- --engine elevenlabs --autorizo-custo`.
- Tempo exato de cada palavra vem do `convertWithTimestamps`; `previousText`/`nextText` mantêm a entonação
  contínua entre as frases.
- Sem novas cobranças: falas ficam em cache (`.cache/tts/falas/`), e o ajuste à duração alvo é feito
  localmente (ffmpeg `atempo`, ±7%, sem mudar o tom), nunca gerando de novo.
- O v4 não aceita `speed`/`style`: ritmo e emoção vêm da pontuação (reticências = pausa) e de tags como `[calmly]`.
- Verificar a integração: `ELEVENLABS_API_KEY=... npx -y @elevenlabs/cli@latest onboard check --answered --env-path .env.local`.

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
