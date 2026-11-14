import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Nebulosa, Supernova } from "../../components/Cosmos";
import { Seta } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** DESENVOLVIMENTO 1: uma estrela explode perto (talvez), empurra a nuvem; a gravidade puxa tudo ao centro. */
export const E3Colapso: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const boom = wordAt(scene, "explodindo");
  const l1 = lineStart(scene, 1);
  const grav = wordAt(scene, "gravidade");
  const contrai = interpolate(f, [grav, grav + 60], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const empurra = interpolate(f, [boom + 6, boom + 20, boom + 50], [0, 40, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: boom, zoom: 1.05 }, { f: boom + 30, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 60, zoom: 1.15 }]} shakes={[boom + 8]}>
        <Espaco topo="#0E0A24" base="#2A1E5C" />
        <Supernova x={150} y={380} at={boom} />
        <Nebulosa cx={560 + empurra} cy={780} R={420} contrai={contrai} gira={0.2} centro={contrai * 0.5} />
        {f >= l1 && (
          <>
            <Seta x={560} y={380} rot={0} cor={C.yellow} at={grav} />
            <Seta x={560} y={1200} rot={180} cor={C.yellow} at={grav} />
            <Seta x={150} y={780} rot={-90} cor={C.yellow} at={grav} />
            <Seta x={970} y={780} rot={90} cor={C.yellow} at={grav} />
          </>
        )}
        <PersonagemEm x={860} pe={1270} altura={400} boca={mouth} expressao={f >= boom ? "surpreso" : "pensativo"} pose={f >= boom && f < l1 ? "assustado" : "explicando"} espelhar olharX={f >= boom && f < l1 ? -1 : -0.5} olharY={-0.6} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 16} rot={Math.sin(f * 0.05) * 4} />
      </Camera>
      {f >= boom && f < l1 + 10 && <Tag text="ESTRELA EXPLODINDO" x={420} y={250} at={boom + 4} bg={C.white} size={46} />}
      {f >= grav && <Tag text="GRAVIDADE" x={540} y={250} at={grav} bg={C.yellow} size={60} />}
      <Sfx at={boom - 10} name="riser" volume={0.35} />
      <Sfx at={boom} name="boom" volume={0.7} />
      <Sfx at={boom + 8} name="whoosh" volume={0.5} />
      <Sfx at={grav} name="ronco" volume={0.35} />
    </Full>
  );
};
