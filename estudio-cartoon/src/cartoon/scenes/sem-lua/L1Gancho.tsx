import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { CeuNoturno, LuaPersonagem } from "../../components/Lua";
import { TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** 0-3 s: GANCHO. Lua cheia sorrindo + "E se a Lua sumisse... AGORA?" no frame 0. */
export const L1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const agora = wordAt(scene, "agora?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.4, y: 120 }, { f: 30, zoom: 1.05 }, { f: 80, zoom: 1.1 }]} shakes={[agora]}>
        <CeuNoturno luar={1} />
        <LuaPersonagem x={560} y={700} r={200} expr={f >= agora ? "nervosa" : "feliz"} />
        <PersonagemEm x={230} pe={1330} altura={500} boca={mouth} expressao="surpreso" pose="apontandoCima" olharX={0.6} olharY={-0.8} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="E SE A LUA SUMISSE…" top={170} size={96} color={C.white} at={0} />
      <TitleSlam text="AGORA?" top={1390} size={150} color={C.yellow} at={Math.max(0, agora - 4)} rotate={3} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={0} name="riser" volume={0.4} />
      <Sfx at={Math.max(0, agora - 4)} name="boom" volume={0.6} />
    </Full>
  );
};
