import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../characters/Personagem";
import { CeuCampo } from "../components/Backgrounds";
import { Camera } from "../components/Camera";
import { Brilhos, Interrogacoes, Sol } from "../components/Props";
import { TitleSlam } from "../components/Text";
import { C } from "../theme";
import { wordAt } from "../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "./common";

/** COMEÇO, 0-3 s: GANCHO. Pergunta forte na tela no frame 0, impacto visual e sonoro. */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const azul = wordAt(scene, "azul?");
  const flash = interpolate(f, [azul, azul + 4, azul + 14], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.35, y: -60 }, { f: 40, zoom: 1.05, y: 0 }, { f: 90, zoom: 1.1 }]} shakes={[0, azul]}>
        <CeuCampo chao={1300} />
        <Sol x={860} y={640} r={90} cor={C.white} feliz={false} />
        <Interrogacoes x={460} y={560} at={8} />
        <PersonagemEm x={540} pe={1290} altura={700} boca={mouth} expressao={f < azul ? "surpreso" : "animado"} pose={f < azul ? "assustado" : "apontandoCima"} poseDe="assustado" poseT={(f - azul) / 8} olharX={0.5} olharY={-0.8} squash={f < 6 ? -0.15 + f * 0.025 : 0} />
        <Brilhos x={540} y={330} at={azul} cor={C.blue} n={12} raio={300} />
      </Camera>
      <TitleSlam text="SE O SOL É BRANCO..." top={170} size={92} color={C.white} at={0} />
      <TitleSlam text="POR QUE O CÉU É AZUL?" top={1340} size={112} color={C.yellow} at={azul - 6} rotate={2} />
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <Sfx at={0} name="boom" volume={0.9} />
      <Sfx at={0} name="whoosh" volume={0.7} />
      <Sfx at={azul - 6} name="pop" volume={0.8} />
      <Sfx at={azul} name="sparkle" volume={0.6} />
    </Full>
  );
};
