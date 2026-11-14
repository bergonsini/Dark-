import React from "react";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Palmeira, Vulcao } from "../../components/Geo";
import { BalaoComentario, Brilhos, Seta } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** CONCLUSÃO: vulcões soltam o calor da Terra, criam ilhas e solo fértil + chamada para comentar. */
export const V7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const [l1, l2] = [1, 2].map((i) => lineStart(scene, i));
  const ilhas = wordAt(scene, "ilhas");
  const fertil = wordAt(scene, "fértil.");
  const comenta = wordAt(scene, "comenta");
  const cresce1 = useSpringAt(ilhas, { damping: 9, stiffness: 120 });
  const cresce2 = useSpringAt(fertil, { damping: 9, stiffness: 120 });
  const balao = useSpringAt(comenta, { damping: 9, stiffness: 180 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.12 }, { f: l1, zoom: 1 }, { f: l2, zoom: 1 }, { f: l2 + 20, zoom: 1.05, y: -30 }]}>
        <CeuCampo chao={1300} />
        <Vulcao x={700} y={1300} s={0.85} verde fumaca={0.35} />
        <Palmeira x={930} y={1330} s={1.1} cresce={cresce1} />
        <Palmeira x={470} y={1320} s={0.8} cresce={cresce2} />
        <PersonagemEm x={250} pe={1300} altura={600} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l2 ? "acenando" : f >= l1 ? "comemorando" : "explicando"} poseDe={f >= l2 ? "comemorando" : "explicando"} poseT={f >= l2 ? (f - l2) / 8 : (f - l1) / 8} olharX={0.4} />
        <Brilhos x={700} y={800} at={ilhas} cor={C.green} n={12} raio={300} />
      </Camera>
      {f < l2 && <TitleSlam text="A TERRA SOLTANDO CALOR" top={200} size={86} color={C.yellow} at={8} />}
      {f >= ilhas && f < l2 && <Tag text="ILHAS" x={300} y={500} at={ilhas} bg={C.teal} color={C.white} size={56} />}
      {f >= fertil && f < l2 && <Tag text="SOLO FÉRTIL" x={760} y={560} at={fertil} bg={C.green} size={52} />}
      {f >= l2 && <TitleSlam text="QUE FENÔMENO EU EXPLICO?" top={200} size={86} color={C.white} at={l2} />}
      {f >= comenta && <BalaoComentario x={540} y={520} s={balao} texto="COMENTA AQUI!" />}
      <Seta x={540} y={1180} at={comenta + 6} />
      <Sfx at={8} name="pop" />
      <Sfx at={ilhas} name="sparkle" volume={0.6} />
      <Sfx at={fertil} name="pop" volume={0.6} />
      <Sfx at={l1} name="tada" volume={0.5} />
      <Sfx at={l2} name="whoosh" volume={0.5} />
      <Sfx at={comenta} name="boing" volume={0.6} />
    </Full>
  );
};
