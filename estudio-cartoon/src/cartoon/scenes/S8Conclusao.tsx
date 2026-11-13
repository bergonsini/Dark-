import React from "react";
import { PersonagemEm } from "../characters/Personagem";
import { CeuCampo } from "../components/Backgrounds";
import { Camera } from "../components/Camera";
import { BalaoComentario, Brilhos, Seta, Sol } from "../components/Props";
import { Tag, TitleSlam } from "../components/Text";
import { C } from "../theme";
import { lineStart, wordAt } from "../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "./common";

/** CONCLUSÃO: resumo da ideia + chamada para comentar. */
export const S8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const [l1, l2] = [1, 2].map((i) => lineStart(scene, i));
  const ar = wordAt(scene, "ar");
  const espalha = wordAt(scene, "espalha");
  const comenta = wordAt(scene, "comenta");
  const balao = useSpringAt(comenta, { damping: 9, stiffness: 180 });
  const pose = f >= l2 ? "acenando" : f >= l1 ? "apontandoCima" : "explicando";
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.12 }, { f: l1, zoom: 1 }, { f: l2, zoom: 1 }, { f: l2 + 20, zoom: 1.06, y: -40 }]}>
        <CeuCampo chao={1300} />
        <Sol x={910} y={760} r={66} piscadela={l1 + 30} />
        <PersonagemEm x={540} pe={1290} altura={700} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={pose} poseDe={f >= l2 ? "apontandoCima" : "explicando"} poseT={f >= l2 ? (f - l2) / 8 : (f - l1) / 8} olharY={f >= l1 && f < l2 ? -0.7 : 0} />
        <Brilhos x={540} y={600} at={l1} cor={C.yellow} n={14} raio={360} />
      </Camera>
      {f < l1 && (
        <>
          <Tag text="AR" x={230} y={300} at={ar} bg={C.white} size={70} />
          <Tag text="+" x={400} y={300} at={ar + 4} bg={C.yellow} size={60} />
          <Tag text="LUZ AZUL" x={680} y={300} at={espalha} bg={C.blue} color={C.white} size={64} />
          <Tag text="= CÉU AZUL!" x={540} y={450} at={espalha + 20} bg={C.yellow} size={74} />
        </>
      )}
      {f >= l1 && f < l2 && <TitleSlam text="AGORA VOCÊ SABE O SEGREDO!" top={220} size={90} at={l1} color={C.yellow} />}
      {f >= l2 && <TitleSlam text="QUE PERGUNTA EU RESPONDO?" top={200} size={90} at={l2} color={C.white} />}
      {f >= comenta && <BalaoComentario x={540} y={520} s={balao} texto="COMENTA AQUI!" />}
      <Seta x={540} y={1180} at={comenta + 6} />
      <Sfx at={ar} name="pop" />
      <Sfx at={espalha} name="pop" />
      <Sfx at={espalha + 20} name="ding" volume={0.6} />
      <Sfx at={l1} name="tada" volume={0.6} />
      <Sfx at={l2} name="whoosh" volume={0.5} />
      <Sfx at={comenta} name="boing" volume={0.6} />
      <Sfx at={comenta + 6} name="pop" volume={0.5} />
    </Full>
  );
};
