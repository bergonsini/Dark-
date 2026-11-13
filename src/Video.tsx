import React from "react";
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./components/Captions";
import { SceneTransition, TRANSITION_FRAMES, TransitionKind } from "./components/Transition";
import { DURATION_FRAMES, FPS, SCENE_ORDER, SceneId, clamp, f, loadFonts, sceneEnd, sceneStart, seg, wordAt } from "./lib";
import { ChoiceScene, CtaScene, FactScene, FireScene, GatherScene, HookScene, HungerScene, HuntScene, IntroScene } from "./scenes/Scenes";

loadFonts();

const SCENES: Record<SceneId, { el: (absStart: number) => React.ReactNode; tr: TransitionKind }> = {
  hook: { el: () => <HookScene />, tr: "none" },
  intro: { el: () => <IntroScene />, tr: "circle" },
  hunger: { el: () => <HungerScene />, tr: "whip" },
  choice: { el: () => <ChoiceScene />, tr: "zoom" },
  hunt: { el: () => <HuntScene />, tr: "slideLeft" },
  gather: { el: () => <GatherScene />, tr: "wipe" },
  fire: { el: () => <FireScene />, tr: "slideUp" },
  fact: { el: () => <FactScene />, tr: "spin" },
  cta: { el: (s) => <CtaScene absStart={s} />, tr: "zoom" },
};

// ---------------------------------------------------------------- efeitos sonoros (tempo absoluto em s)
type Sfx = { file: string; at: number; vol: number; dur?: number };
const buildSfx = (): Sfx[] => {
  const list: Sfx[] = [
    { file: "sfx_boom", at: 0, vol: 0.9 },
    { file: "sfx_whoosh", at: 0.0, vol: 0.6 },
    { file: "sfx_pop", at: 0.17, vol: 0.7 },
    { file: "sfx_pop", at: 0.33, vol: 0.7 },
  ];
  SCENE_ORDER.slice(1).forEach((id, i) => list.push({ file: i % 2 ? "sfx_whoosh_down" : "sfx_whoosh", at: sceneStart(id), vol: 0.55 }));
  // intro
  list.push({ file: "sfx_ding", at: wordAt("intro", "Ugo."), vol: 0.45 });
  list.push({ file: "sfx_pop", at: wordAt("intro", "Ugo."), vol: 0.7 });
  // fome
  list.push({ file: "sfx_growl", at: sceneStart("hunger") + 0.05, vol: 0.9 });
  list.push({ file: "sfx_pop", at: wordAt("hunger", "mercado,"), vol: 0.7 });
  list.push({ file: "sfx_thud", at: wordAt("hunger", "mercado,") + 8 / FPS, vol: 0.9 });
  list.push({ file: "sfx_pop", at: wordAt("hunger", "geladeira..."), vol: 0.7 });
  list.push({ file: "sfx_thud", at: wordAt("hunger", "geladeira...") + 8 / FPS, vol: 0.9 });
  list.push({ file: "sfx_boom", at: wordAt("hunger", "virar.") - 0.1, vol: 0.5 });
  // escolha
  list.push({ file: "sfx_mammoth", at: wordAt("choice", "mamute"), vol: 0.55 });
  list.push({ file: "sfx_stab", at: wordAt("choice", "ou"), vol: 0.7 });
  list.push({ file: "sfx_pop", at: wordAt("choice", "coletar"), vol: 0.7 });
  // caça
  list.push({ file: "sfx_pop", at: wordAt("hunt", "barriga"), vol: 0.6 });
  list.push({ file: "sfx_mammoth", at: wordAt("hunt", "erro") - 0.13, vol: 0.7 });
  list.push({ file: "sfx_stab", at: wordAt("hunt", "erro"), vol: 0.6 });
  for (let t = wordAt("hunt", "erro"); t < seg("hunt").end + 0.2; t += 0.28) list.push({ file: "sfx_thud", at: t, vol: 0.55 });
  // coleta
  list.push({ file: "sfx_ding", at: wordAt("gather", "seguro,"), vol: 0.35 });
  for (let t = sceneStart("gather") + 0.2; t < sceneEnd("gather"); t += 0.42) list.push({ file: "sfx_thud", at: t, vol: 0.25 });
  list.push({ file: "sfx_pop", at: wordAt("gather", "quilômetros,"), vol: 0.6 });
  // fogo
  list.push({ file: "sfx_crackle", at: sceneStart("fire"), vol: 0.7, dur: sceneEnd("fire") - sceneStart("fire") + 0.3 });
  list.push({ file: "sfx_whoosh", at: wordAt("fire", "espantava"), vol: 0.6 });
  for (const w of ["aquecia,", "espantava", "cozinhava"]) list.push({ file: "sfx_pop", at: wordAt("fire", w), vol: 0.65 });
  // curiosidade
  list.push({ file: "sfx_ding", at: sceneStart("fact") + 0.1, vol: 0.55 });
  list.push({ file: "sfx_pop", at: wordAt("fact", "cozinhar"), vol: 0.6 });
  list.push({ file: "sfx_riser", at: wordAt("fact", "crescer,") - 1.0, vol: 0.4 });
  list.push({ file: "sfx_boom", at: wordAt("fact", "crescer,"), vol: 0.45 });
  list.push({ file: "sfx_ding", at: wordAt("fact", "libera"), vol: 0.4 });
  // final
  list.push({ file: "sfx_pop", at: wordAt("cta", "caçador"), vol: 0.7 });
  list.push({ file: "sfx_pop", at: wordAt("cta", "coletor?"), vol: 0.7 });
  list.push({ file: "sfx_bubble", at: wordAt("cta", "Comenta"), vol: 0.8 });
  list.push({ file: "sfx_bubble", at: wordAt("cta", "embaixo!"), vol: 0.6 });
  return list;
};
const SFX = buildSfx();

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 14, width: `${(frame / DURATION_FRAMES) * 100}%`, background: "linear-gradient(90deg,#ffd60a,#ff6b35)" }} />
  );
};

export const CavemanVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const endFade = interpolate(frame, [DURATION_FRAMES - 10, DURATION_FRAMES], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {SCENE_ORDER.map((id) => {
        const from = f(sceneStart(id));
        const isLast = id === "cta";
        const dur = f(sceneEnd(id)) - from + (isLast ? 0 : TRANSITION_FRAMES + 2);
        return (
          <Sequence key={id} from={from} durationInFrames={dur} name={id}>
            <SceneTransition kind={SCENES[id].tr}>{SCENES[id].el(from)}</SceneTransition>
          </Sequence>
        );
      })}

      <Captions y={(t) => (t >= sceneStart("choice") && t < sceneStart("hunt") ? 1170 : 1520)} />
      <ProgressBar />
      <AbsoluteFill style={{ background: "black", opacity: endFade }} />

      {/* ---------------- áudio ---------------- */}
      <Html5Audio src={staticFile("audio/narration.wav")} volume={0.78} />
      <Html5Audio
        src={staticFile("audio/music.wav")}
        volume={(fr) =>
          interpolate(fr, [0, 10, DURATION_FRAMES - 45, DURATION_FRAMES], [0, 0.13, 0.13, 0], clamp)
        }
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s.at))} durationInFrames={s.dur ? f(s.dur) : f(2)} name={`sfx ${s.file}`}>
          <Html5Audio src={staticFile(`audio/${s.file}.wav`)} volume={s.vol * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
