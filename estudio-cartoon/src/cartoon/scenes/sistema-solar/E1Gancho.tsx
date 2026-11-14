import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { SistemaSolar } from "../../components/Cosmos";
import { Sol } from "../../components/Props";
import { TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** 0-3 s: GANCHO. O Sistema Solar inteiro girando + a pergunta na tela no frame 0. */
export const E1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const solar = wordAt(scene, "solar?");
  const flash = interpolate(f, [0, 3, 12], [0.7, 0.4, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.45 }, { f: 32, zoom: 1.05 }, { f: 90, zoom: 1.1 }]} shakes={[0]}>
        <Espaco />
        <SistemaSolar cx={540} cy={820} centro={<Sol x={540} y={820} r={80} />} />
        <PersonagemEm x={250} pe={1260} altura={520} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.7} olharY={-0.7} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 18} rot={Math.sin(f * 0.05) * 5} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="DE ONDE VEIO" top={170} size={104} color={C.white} at={0} />
      <TitleSlam text="O SISTEMA SOLAR?" top={1400} size={112} color={C.yellow} at={Math.max(0, solar - 8)} rotate={2} />
      <Sfx at={0} name="boom" volume={0.7} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={Math.max(0, solar - 8)} name="sparkle" volume={0.6} />
    </Full>
  );
};
