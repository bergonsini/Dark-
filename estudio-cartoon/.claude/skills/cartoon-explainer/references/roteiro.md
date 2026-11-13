# Roteiro: história em 60 segundos

## Estrutura (arco narrativo)

| Tempo aprox. | Ato | Função | Exemplo ("Por que o céu é azul?") |
|---|---|---|---|
| 0–3 s | **Gancho** | Prender o polegar. Pergunta, paradoxo ou fato chocante | "Se a luz do Sol é branca, por que o céu é azul?" |
| 3–8 s | Começo | Personagem entra, apresenta o problema, promete a resposta | "Parece mágica, mas é física!" |
| 8–45 s | Desenvolvimento | 3 a 5 cenas, uma ideia cada, do simples ao surpreendente | prisma → partículas → violeta → pôr do sol |
| 45–52 s | Virada / curiosidade | Um "uau" extra que reforça a ideia | "Em Marte o pôr do sol é azul!" |
| 52–60 s | **Conclusão** | Resposta em 1 frase + chamada para comentar | "Resumindo… Comenta aqui!" |

## Regras do gancho (primeiros 3 s)
- Fala começa já no frame 0 (o script põe só 0,1 s de silêncio) e termina em até 3 s (≈ 8–12 palavras).
- O texto do gancho aparece **inteiro na tela no frame 0** (`TitleSlam at={0}`); quem assiste sem som também entende.
- Movimento forte desde o frame 0: câmera dando zoom-out, personagem com reação exagerada, tremida, flash.
- Proibido: logotipo, "Oi, pessoal", "Neste vídeo vamos…", tela parada.
- Fórmulas que funcionam: "Se X, por que Y?", "Você sabia que…?", "Isso aqui parece impossível…", "O que aconteceria se…?", "Pare de fazer X!".

## Escrita da narração (pt-BR falado)
- Frases curtas (≤ 14 palavras), voz ativa, "você", tom de conversa. Uma ideia por frase.
- Cada item de `falas` vira um trecho de áudio + legenda. Quebre frases longas em 2 itens.
- Escreva números e siglas por extenso ("dez mil", não "10.000"), porque o TTS lê melhor.
- Ritmo documentário: ~2,5–3 palavras/s. 60 s ≈ 140–160 palavras no total.
- Termine com pergunta aberta para gerar comentários.
- Verifique cada fato. Na dúvida, simplifique sem distorcer ("pode ter ajudado", "cerca de").

## Formato do roteiro.json
```json
{
  "titulo": "Por que o céu é azul?",
  "fps": 30,
  "duracaoSegundos": 60,
  "personagem": "tito",
  "voz": { "motor": "auto", "estilo": "documentario", "kokoro": { "voz": "pm_alex" } },
  "musica": { "bpm": 100, "tom": -9 },
  "cenas": [
    { "id": "gancho", "ato": "começo", "falas": ["…"] },
    { "id": "conclusao", "ato": "conclusão", "falas": ["…", "…"] }
  ]
}
```
- `id` = nome da cena no código (`SCENES` em `CartoonExplainer.tsx`). Use minúsculas e hífen.
- Voz: veja `audio-legendas.md` (motores, estilo documentário, `pronuncia`, ElevenLabs).
- `musica.bpm` 90–110 para explicação leve; `tom` em semitons relativos a Lá4 (-9 = Dó).

## Planejamento visual (antes de codar)
Para cada cena, anote: cenário, o que o personagem faz/sente, 1–3 objetos animados, movimento de câmera,
SFX e a palavra-gatilho de cada ação (`wordAt`). Toda ideia abstrata precisa de uma **metáfora visual**
(luz = feixe colorido, partícula = bolinha com carinha, tempo = relógio girando, força = seta).
