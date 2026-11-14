import React from "react";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { ImpactoLua } from "../../components/Cosmos";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** CURIOSIDADE: a Lua nasceu de uma batida gigante na Terra jovem. */
export const E7Lua: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const batida = wordAt(scene, "batida");
  const hit = batida + 8;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: hit, zoom: 1.0 }, { f: hit + 40, zoom: 1.08 }]} shakes={[hit]} shakeAmp={24}>
        <Espaco />
        <ImpactoLua cx={560} cy={800} hit={hit} />
        <PersonagemEm x={190} pe={1270} altura={380} boca={mouth} expressao={f >= hit ? "surpreso" : "pensativo"} pose={f >= hit ? "assustado" : "pensando"} olharX={0.8} olharY={-0.6} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 14} />
      </Camera>
      <Tag text="E A LUA?" x={540} y={250} at={2} bg={C.white} size={60} />
      <Tag text="TERRA JOVEM" x={560} y={1060} at={10} bg={C.orange} color={C.white} size={44} />
      {f >= hit - 30 && f < hit && <Tag text="PLANETA THEIA" x={830} y={400} at={hit - 30} bg="#8C7B6B" color={C.white} size={40} />}
      {f >= hit + 26 && <Tag text="LUA!" x={880} y={680} at={hit + 26} bg={C.yellow} size={56} />}
      <Sfx at={2} name="pop" />
      <Sfx at={hit - 30} name="riser" volume={0.4} />
      <Sfx at={hit} name="boom" volume={0.75} />
      <Sfx at={hit + 26} name="sparkle" volume={0.6} />
    </Full>
  );
};
