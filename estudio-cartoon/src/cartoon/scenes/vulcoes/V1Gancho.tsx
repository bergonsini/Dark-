import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { CeuVulcanico, Vulcao } from "../../components/Geo";
import { TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** 0-3 s: GANCHO. Vulcão já em erupção no frame 0, pergunta na tela, impacto. */
export const V1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const fogo = wordAt(scene, "fogo?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.35, 0], { extrapolateRight: "clamp" });
  const erup = interpolate(f, [0, 6], [0.6, 1], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.35, y: 40 }, { f: 30, zoom: 1.05 }, { f: 90, zoom: 1.1 }]} shakes={[0, fogo]} shakeAmp={22}>
        <CeuVulcanico chao={1300} brilho={1} />
        <Vulcao x={640} y={1320} s={1.1} erupcao={erup} lava={interpolate(f, [0, 50], [0.3, 1], { extrapolateRight: "clamp" })} />
        <PersonagemEm x={230} pe={1300} altura={560} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.8} olharY={-0.6} squash={f < 6 ? -0.15 + f * 0.025 : 0} corpoY={f < 10 ? -Math.sin((f / 10) * Math.PI) * 60 : 0} />
      </Camera>
      <AbsoluteFill style={{ background: C.orange, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE A TERRA" top={150} size={96} color={C.white} at={0} />
      <TitleSlam text="COSPE FOGO?" top={1360} size={130} color={C.yellow} at={Math.max(0, fogo - 6)} rotate={2} />
      <Sfx at={0} name="boom" volume={0.9} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={2} name="ronco" volume={0.7} />
      <Sfx at={Math.max(0, fogo - 6)} name="pop" volume={0.7} />
    </Full>
  );
};
