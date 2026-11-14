import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { LuaPersonagem, TerraMares } from "../../components/Lua";
import { Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** Marés: a Lua puxa a água; sem ela, só o Sol (metade da força) → marés bem menores. */
export const L4Mares: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const metade = wordAt(scene, "metade");
  const menores = wordAt(scene, "menores.");
  const some = interpolate(f, [l1, l1 + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l1, zoom: 1.0 }, { f: menores, zoom: 1.0 }, { f: menores + 20, zoom: 1.1, x: -30 }]}>
        <Espaco />
        <LuaPersonagem x={240} y={760} r={95} expr="feliz" opacity={some} brilho={some} />
        <TerraMares cx={620} cy={760} r={160} puxaoLua={some} lua={some} />
        <Sol x={1010} y={760} r={55} />
        <PersonagemEm x={180} pe={1340} altura={380} boca={mouth} expressao={f >= menores ? "surpreso" : "feliz"} pose="apontando" olharX={0.7} olharY={-0.5} />
      </Camera>
      {f < l1 && <Tag text="A LUA PUXA OS OCEANOS" x={540} y={300} at={6} bg={C.yellow} size={50} />}
      {f < l1 && <Tag text="MARÉ" x={620} y={540} at={30} bg={C.blue} color={C.white} size={44} />}
      {f >= l1 && <Tag text="SÓ O SOL PUXA" x={540} y={300} at={l1 + 4} bg={C.orange} color={C.white} size={52} />}
      {f >= metade && <Tag text="½ DA FORÇA" x={900} y={980} at={metade} bg={C.white} size={48} />}
      {f >= menores && <Tag text="MARÉS BEM MENORES" x={600} y={1100} at={menores} bg={C.blue} color={C.white} size={50} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={l1} name="sparkle" volume={0.4} />
      <Sfx at={metade} name="pop" volume={0.5} />
      <Sfx at={menores} name="ding" volume={0.5} />
    </Full>
  );
};
