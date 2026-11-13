import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { linearTiming, TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { Captions } from "./components/Captions";
import { getScene, lineStart, timeline } from "./timeline";
import { HookScene, HOOK_MAMMOTH_AT } from "./scenes/HookScene";
import { IntroScene, STAMP_DELAY } from "./scenes/IntroScene";
import { HungerScene } from "./scenes/HungerScene";
import { ChoiceScene } from "./scenes/ChoiceScene";
import { CuriosityScene } from "./scenes/CuriosityScene";
import { NightScene } from "./scenes/NightScene";
import { CtaScene } from "./scenes/CtaScene";
import { SceneProps } from "./scenes/common";
import { C } from "./theme";

const W = 1080;
const H = 1920;
const T = 12; // duração das transições (frames)

const SCENES: { id: string; Comp: React.FC<SceneProps> }[] = [
  { id: "hook", Comp: HookScene },
  { id: "intro", Comp: IntroScene },
  { id: "hunger", Comp: HungerScene },
  { id: "choice", Comp: ChoiceScene },
  { id: "curiosity", Comp: CuriosityScene },
  { id: "night", Comp: NightScene },
  { id: "cta", Comp: CtaScene },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: TransitionPresentation<any>[] = [
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-left" }),
  flip({ direction: "from-right" }),
  iris({ width: W, height: H }),
  clockWipe({ width: W, height: H }),
  slide({ direction: "from-right" }),
];

type Sfx = { at: number; name: string; volume?: number; dur?: number };

const buildSfx = (): Sfx[] => {
  const s = (id: string) => getScene(id);
  const list: Sfx[] = [
    { at: 0, name: "boom", volume: 0.9 },
    { at: 0, name: "whoosh", volume: 0.7 },
    { at: HOOK_MAMMOTH_AT + 2, name: "stomp", volume: 0.9 },
  ];
  // whoosh em toda troca de cena
  timeline.scenes.slice(1).forEach((sc) => list.push({ at: sc.startFrame - 2, name: "whoosh", volume: 0.6 }));
  // ícones + carimbo do X
  const intro = s("intro");
  [1, 2, 3].forEach((i) => {
    const st = intro.startFrame + lineStart(intro, i);
    list.push({ at: st, name: "pop", volume: 0.6 });
    list.push({ at: st + STAMP_DELAY, name: "stamp", volume: 0.8 });
  });
  const hunger = s("hunger");
  list.push({ at: hunger.startFrame + lineStart(hunger, 1), name: "pop", volume: 0.7 });
  const choice = s("choice");
  list.push({ at: choice.startFrame + 8, name: "pop", volume: 0.6 });
  list.push({ at: choice.startFrame + lineStart(choice, 0), name: "ding", volume: 0.5 });
  list.push({ at: choice.startFrame + lineStart(choice, 0) + 10, name: "stomp", volume: 0.6 });
  list.push({ at: choice.startFrame + lineStart(choice, 0) + 30, name: "stomp", volume: 0.6 });
  list.push({ at: choice.startFrame + lineStart(choice, 1), name: "ding", volume: 0.5 });
  list.push({ at: choice.startFrame + lineStart(choice, 2), name: "boom", volume: 0.45 });
  const cur = s("curiosity");
  list.push({ at: cur.startFrame + 2, name: "sparkle", volume: 0.6 });
  list.push({ at: cur.startFrame + lineStart(cur, 1), name: "fire", volume: 0.5 });
  list.push({ at: cur.startFrame + lineStart(cur, 1) + 70, name: "fire", volume: 0.4 });
  list.push({ at: cur.startFrame + lineStart(cur, 2), name: "sparkle", volume: 0.6 });
  const night = s("night");
  list.push({ at: night.startFrame, name: "fire", volume: 0.35 });
  list.push({ at: night.startFrame + 70, name: "fire", volume: 0.35 });
  list.push({ at: night.startFrame + lineStart(night, 1), name: "sparkle", volume: 0.4 });
  const cta = s("cta");
  list.push({ at: cta.startFrame + lineStart(cta, 1), name: "pop", volume: 0.7 });
  list.push({ at: cta.startFrame + lineStart(cta, 1) + 14, name: "pop", volume: 0.7 });
  list.push({ at: cta.startFrame + lineStart(cta, 2), name: "ding", volume: 0.6 });
  return list.filter((x) => x.at >= 0);
};

const SFX = buildSfx();

/** volume da música abaixa enquanto a narração fala (ducking) */
const speaking = (f: number) =>
  timeline.scenes.some((s) => s.lines.some((l) => f >= l.startFrame - 4 && f <= l.endFrame + 4));

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  const p = f / (timeline.durationInFrames - 1);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, background: "rgba(0,0,0,0.35)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.yellow}, ${C.red})` }} />
    </div>
  );
};

/** flash branco rápido em cada corte de cena (impacto) */
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const cut = timeline.scenes.slice(1).map((s) => s.startFrame);
  const d = Math.min(...cut.map((c) => Math.abs(f - (c + T / 2))));
  const o = interpolate(d, [0, 3], [0.35, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#FFF", opacity: o, pointerEvents: "none" }} />;
};

export const CavemanReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {SCENES.map(({ id, Comp }, i) => {
          const scene = getScene(id);
          const len = (i === SCENES.length - 1 ? timeline.durationInFrames : scene.endFrame) - scene.startFrame;
          const isLast = i === SCENES.length - 1;
          return (
            <React.Fragment key={id}>
              <TransitionSeries.Sequence durationInFrames={isLast ? len : len + T}>
                <Comp scene={scene} />
              </TransitionSeries.Sequence>
              {!isLast && <TransitionSeries.Transition presentation={TRANSITIONS[i]} timing={linearTiming({ durationInFrames: T })} />}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      <Flash />
      <Captions hideScenes={["hook"]} />
      <ProgressBar />

      {/* ÁUDIO */}
      <Audio src={staticFile("audio/narration.wav")} volume={1} />
      <Audio
        src={staticFile("audio/music.wav")}
        volume={(f) => {
          const base = speaking(f) ? 0.1 : 0.2;
          const fadeOut = interpolate(f, [timeline.durationInFrames - 30, timeline.durationInFrames], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return base * fadeOut;
        }}
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={90} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.name}.wav`)} volume={s.volume ?? 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
