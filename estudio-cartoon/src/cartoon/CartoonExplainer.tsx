import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { linearTiming, springTiming, TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { iris } from "@remotion/transitions/iris";
import { fade } from "@remotion/transitions/fade";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import "./fonts";
import { HEIGHT, TRANSITION_FRAMES as T, WIDTH } from "./config";
import { Captions } from "./components/Captions";
import { C } from "./theme";
import { getScene, isSpeaking, timeline } from "./timeline";
import { SceneProps } from "./scenes/common";
import { S1Gancho } from "./scenes/S1Gancho";
import { S2Problema } from "./scenes/S2Problema";
import { S3Prisma } from "./scenes/S3Prisma";
import { S4Espalhamento } from "./scenes/S4Espalhamento";
import { S5Violeta } from "./scenes/S5Violeta";
import { S6PorDoSol } from "./scenes/S6PorDoSol";
import { S7Marte } from "./scenes/S7Marte";
import { S8Conclusao } from "./scenes/S8Conclusao";

/**
 * Lista de cenas na ordem do roteiro.json (ids precisam bater com "cenas[].id").
 * Para um vídeo novo: crie novas cenas em ./scenes e troque esta lista.
 */
export const SCENES: { id: string; Comp: React.FC<SceneProps> }[] = [
  { id: "gancho", Comp: S1Gancho },
  { id: "problema", Comp: S2Problema },
  { id: "prisma", Comp: S3Prisma },
  { id: "espalhamento", Comp: S4Espalhamento },
  { id: "violeta", Comp: S5Violeta },
  { id: "por-do-sol", Comp: S6PorDoSol },
  { id: "marte", Comp: S7Marte },
  { id: "conclusao", Comp: S8Conclusao },
];

// Uma transição por corte (variar mantém o ritmo; não repita a mesma 3x seguidas).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: TransitionPresentation<any>[] = [
  slide({ direction: "from-right" }),
  iris({ width: WIDTH, height: HEIGHT }),
  wipe({ direction: "from-top" }),
  slide({ direction: "from-bottom" }),
  clockWipe({ width: WIDTH, height: HEIGHT }),
  fade(),
  wipe({ direction: "from-left" }),
];

const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: "rgba(0,0,0,0.3)" }}>
      <div style={{ width: `${(f / (timeline.durationInFrames - 1)) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.yellow}, ${C.pink})` }} />
    </div>
  );
};

export const CartoonExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.dark }}>
      <TransitionSeries>
        {SCENES.map(({ id, Comp }, i) => {
          const scene = getScene(id);
          const isLast = i === SCENES.length - 1;
          const len = (isLast ? timeline.durationInFrames : scene.endFrame) - scene.startFrame;
          return (
            <React.Fragment key={id}>
              <TransitionSeries.Sequence durationInFrames={isLast ? len : len + T} name={id}>
                <Comp scene={scene} />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={TRANSITIONS[i % TRANSITIONS.length]}
                  timing={i % 2 ? linearTiming({ durationInFrames: T }) : springTiming({ durationInFrames: T, config: { damping: 200 } })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      <Captions hideScenes={["gancho"]} />
      <ProgressBar />

      {/* ÁUDIO: narração + música com ducking (abaixa quando a voz fala) + SFX dentro de cada cena */}
      <Audio src={staticFile("audio/narration.wav")} volume={1} />
      <Audio
        src={staticFile("audio/music.wav")}
        volume={(f) => {
          const base = isSpeaking(f) ? 0.09 : 0.2;
          const fadeOut = interpolate(f, [timeline.durationInFrames - 45, timeline.durationInFrames], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return base * fadeOut;
        }}
      />
    </AbsoluteFill>
  );
};
