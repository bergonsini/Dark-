import React from "react";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Nebulosa } from "../../components/Cosmos";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** COMEÇO: 4,6 bilhões de anos atrás, só uma nuvem gigante de gás e poeira. */
export const E2Nuvem: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const gas = wordAt(scene, "gás");
  const poeira = wordAt(scene, "poeira.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25 }, { f: l1, zoom: 1.05 }, { f: 220, zoom: 1.12 }]}>
        <Espaco topo="#0E0A24" base="#2A1E5C" />
        <Nebulosa cx={520} cy={760} R={430} gira={0.15} />
        <PersonagemEm x={830} pe={1260} altura={430} boca={mouth} expressao={f >= l1 ? "encantado" : "feliz"} pose={f >= l1 ? "apontando" : "explicando"} espelhar olharX={-0.7} olharY={-0.5} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 16} rot={Math.sin(f * 0.05) * 4} />
      </Camera>
      <Tag text="4,6 BILHÕES DE ANOS ATRÁS" x={540} y={250} at={lineStart(scene, 0)} bg={C.yellow} size={46} />
      {f >= l1 && <Tag text="NUVEM GIGANTE" x={540} y={360} at={l1 + 4} bg={C.violet} color={C.white} size={48} />}
      {f >= gas && <Tag text="GÁS" x={300} y={600} at={gas} bg={C.pink} size={50} />}
      {f >= poeira && <Tag text="POEIRA" x={720} y={1000} at={poeira} bg="#8FD3FF" size={50} />}
      <Sfx at={0} name="whoosh" volume={0.5} />
      <Sfx at={lineStart(scene, 0)} name="riser" volume={0.3} />
      <Sfx at={l1 + 4} name="sparkle" volume={0.5} />
      <Sfx at={gas} name="pop" volume={0.5} />
      <Sfx at={poeira} name="pop" volume={0.5} />
    </Full>
  );
};
