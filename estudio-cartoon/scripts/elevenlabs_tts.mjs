#!/usr/bin/env node
/**
 * cartoon-explainer: uma fala com a ElevenLabs (SDK oficial @elevenlabs/elevenlabs-js), com o tempo de cada palavra.
 *
 * SERVIÇO PAGO: chamado só por voz.py quando o usuário roda
 *   npm run audio -- --engine elevenlabs --autorizo-custo
 *
 * Entrada (stdin, JSON): { text, voiceId, modelId, languageCode, previousText, nextText, voiceSettings, out }
 * Saída  (stdout, JSON): { out, words: [[palavra, inicio_s, fim_s], ...], characters }
 *
 * A chave vem de ELEVENLABS_API_KEY (ambiente) ou do arquivo .env.local do projeto. Nunca coloque a chave no código.
 */
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = resolve(ROOT, ".env.local");
if (!process.env.ELEVENLABS_API_KEY && existsSync(envFile)) {
  process.loadEnvFile(envFile); // não sobrescreve variáveis já definidas
}
if (!process.env.ELEVENLABS_API_KEY) {
  console.error("ELEVENLABS_API_KEY não definida (ambiente ou .env.local).");
  process.exit(3);
}

const req = JSON.parse(readFileSync(0, "utf8"));
const client = new ElevenLabsClient();

const v4 = String(req.modelId).startsWith("eleven_v4");
const s = req.voiceSettings || {};
// Eleven v4 aceita só stability e similarity_boost; v2/v3 aceitam também style, speed e speaker boost.
const voiceSettings = v4
  ? { stability: s.stability, similarityBoost: s.similarityBoost }
  : { stability: s.stability, similarityBoost: s.similarityBoost, style: s.style, speed: s.speed, useSpeakerBoost: true };

const body = {
  text: req.text,
  modelId: req.modelId,
  voiceSettings,
  outputFormat: "mp3_44100_192",
  applyTextNormalization: "on",
  ...(req.languageCode && req.modelId !== "eleven_multilingual_v2" ? { languageCode: req.languageCode } : {}),
  ...(req.previousText ? { previousText: req.previousText } : {}),
  ...(req.nextText ? { nextText: req.nextText } : {}),
};

try {
  const { data, rawResponse } = await client.textToSpeech.convertWithTimestamps(req.voiceId, body).withRawResponse();
  writeFileSync(req.out, Buffer.from(data.audioBase64, "base64"));
  const al = data.alignment || {};
  const chars = al.characters || [];
  const st = al.characterStartTimesSeconds || [];
  const en = al.characterEndTimesSeconds || [];
  const words = [];
  let cur = "";
  let t0 = null;
  let t1 = null;
  chars.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (cur) words.push([cur, t0, t1]);
      cur = "";
      t0 = null;
    } else {
      cur += c;
      if (t0 === null) t0 = st[i];
      t1 = en[i];
    }
  });
  if (cur) words.push([cur, t0, t1]);
  const characters = Number(rawResponse.headers.get("x-character-count") || req.text.length);
  process.stdout.write(JSON.stringify({ out: req.out, words, characters }));
} catch (e) {
  console.error(`ElevenLabs: ${e.statusCode ?? ""} ${JSON.stringify(e.body ?? e.message).slice(0, 300)}`);
  process.exit(4);
}
