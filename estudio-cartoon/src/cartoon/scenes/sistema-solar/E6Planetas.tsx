import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { SistemaSolar } from "../../components/Cosmos";
import { Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** DESENVOLVIMENTO 4: a poeira gruda e vira planetas; rochosos perto do Sol, gigantes longe. */
export const E6Planetas: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const grudaram = wordAt(scene, "grudaram");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const acrecao = interpolate(f, [grudaram, l1 - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rochosos = useSpringAt(l1 - 10, { damping: 10, stiffness: 140 });
  const gigantes = useSpringAt(l2, { damping: 10, stiffness: 140 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 20, zoom: 1.7 }, { f: l2, zoom: 1.7 }, { f: l2 + 22, zoom: 1.0 }]} origin="50% 40%">
        <Espaco topo="#0E0A24" base="#1E1650" />
        <SistemaSolar cx={540} cy={770} disco={1} acrecao={acrecao} rochosos={f < l1 - 10 ? 0 : rochosos} gigantes={f < l2 ? 0 : gigantes} centro={<Sol x={540} y={770} r={62} />} />
      </Camera>
      <PersonagemEm x={180} pe={1270} altura={380} boca={mouth} expressao={f >= l2 ? "encantado" : "feliz"} pose={f >= l1 ? "apontando" : "explicando"} olharX={0.8} olharY={-0.6} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 14} />
      {f >= grudaram && f < l1 && <Tag text="POEIRA GRUDA" x={540} y={260} at={grudaram} bg={C.pink} size={50} />}
      {f >= l1 && f < l2 && <Tag text="PLANETAS DE ROCHA" x={540} y={260} at={l1} bg="#E8C47A" size={50} />}
      {f >= l2 && <Tag text="GIGANTES DE GÁS E GELO" x={540} y={260} at={l2} bg="#8FE3E8" size={46} />}
      {f >= l2 && <Tag text="FRIO" x={900} y={1120} at={l2 + 10} bg={C.white} size={40} />}
      <Sfx at={grudaram} name="sparkle" volume={0.5} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={l1 - 10 + i * 4} name="pop" volume={0.35} />)}
      <Sfx at={l2} name="whoosh" volume={0.45} />
      {[0, 1, 2, 3].map((i) => <Sfx key={`g${i}`} at={l2 + 4 + i * 4} name="pop" volume={0.35} />)}
    </Full>
  );
};
