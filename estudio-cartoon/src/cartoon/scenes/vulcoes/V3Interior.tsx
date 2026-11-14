import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { CorteTerra, GEO, Termometro } from "../../components/Geo";
import { Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** DESENVOLVIMENTO 1: dentro da Terra é quente como a superfície do Sol, e o calor quer sair. */
export const V3Interior: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const quente = wordAt(scene, "quente");
  const sol = wordAt(scene, "sol.");
  const l1 = lineStart(scene, 1);
  const revela = interpolate(f, [4, 34], [0, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const nivel = interpolate(f, [quente, quente + 40], [0.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.15 }, { f: 40, zoom: 1 }, { f: l1, zoom: 1 }, { f: l1 + 30, zoom: 1.08, y: 30 }]}>
        <Espaco topo="#1A0F2E" base="#3A1E3C" />
        <CorteTerra cx={560} cy={760} r={380} revela={revela} calor={f >= l1 ? 1 : 0} />
        <Termometro x={60} y={760} nivel={nivel} h={340} />
        <PersonagemEm x={880} pe={1290} altura={440} boca={mouth} expressao={f >= l1 ? "encantado" : f >= quente ? "surpreso" : "feliz"} pose={f >= sol ? "apontando" : "explicando"} espelhar olharX={-0.7} olharY={-0.4} />
      </Camera>
      <Tag text="CROSTA" x={900} y={330} at={14} bg={GEO.crosta} color={C.white} size={36} />
      <Tag text="MANTO" x={780} y={600} at={22} bg={GEO.manto} color={C.white} size={36} />
      <Tag text="NÚCLEO" x={640} y={720} at={30} bg={GEO.nucleoInt} size={36} />
      <Tag text="≈ 5.000 °C" x={240} y={680} at={quente + 10} bg={C.red} color={C.white} size={48} />
      {f >= sol && (
        <>
          <Sol x={300} y={1180} r={60} />
          <Tag text="= SUPERFÍCIE DO SOL" x={600} y={1180} at={sol} bg={C.yellow} size={42} />
        </>
      )}
      {f >= l1 && <Tag text="O CALOR QUER SAIR!" x={540} y={240} at={l1} bg={C.orange} color={C.white} size={54} />}
      <Sfx at={4} name="whoosh" volume={0.5} />
      {[14, 22, 30].map((a) => <Sfx key={a} at={a} name="pop" volume={0.4} />)}
      <Sfx at={quente} name="riser" volume={0.35} />
      <Sfx at={sol} name="ding" volume={0.5} />
      <Sfx at={l1} name="borbulha" volume={0.5} />
    </Full>
  );
};
