import React from "react";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { PoeiraEstelar, SistemaSolar } from "../../components/Cosmos";
import { BalaoComentario, Seta, Sol } from "../../components/Props";
import { TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** CONCLUSÃO: tudo veio da mesma nuvem; você é poeira de estrelas. + chamada para comentar. */
export const E8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const [l1, l2] = [1, 2].map((i) => lineStart(scene, i));
  const comenta = wordAt(scene, "comenta");
  const balao = useSpringAt(comenta, { damping: 9, stiffness: 180 });
  const poeira = useSpringAt(l1);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: l1, zoom: 1.0 }, { f: l2, zoom: 1.0 }, { f: l2 + 20, zoom: 1.05, y: -30 }]}>
        <Espaco />
        <div style={{ position: "absolute", inset: 0, transform: "scale(0.62)", transformOrigin: "540px 760px", opacity: 0.9 }}>
          <SistemaSolar cx={540} cy={760} centro={<Sol x={540} y={760} r={70} />} />
        </div>
        {f >= l1 && <PoeiraEstelar x={300} y={780} w={480} h={560} forca={poeira} />}
        <PersonagemEm x={540} pe={1250} altura={560} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l2 ? "acenando" : f >= l1 ? "comemorando" : "explicando"} poseDe={f >= l2 ? "comemorando" : "explicando"} poseT={f >= l2 ? (f - l2) / 8 : (f - l1) / 8} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 16} />
      </Camera>
      {f < l1 && <TitleSlam text="TUDO VEIO DA MESMA NUVEM" top={190} size={86} color={C.white} at={6} />}
      {f >= l1 && f < l2 && <TitleSlam text="VOCÊ É POEIRA DE ESTRELAS!" top={190} size={86} color={C.yellow} at={l1} />}
      {f >= l2 && <TitleSlam text="QUE MISTÉRIO EU EXPLICO?" top={190} size={86} color={C.white} at={l2} />}
      {f >= comenta && <BalaoComentario x={540} y={500} s={balao} texto="COMENTA AQUI!" />}
      <Seta x={850} y={1200} at={comenta + 6} />
      <Sfx at={6} name="pop" />
      <Sfx at={l1} name="sparkle" volume={0.7} />
      <Sfx at={l1 + 4} name="tada" volume={0.45} />
      <Sfx at={l2} name="whoosh" volume={0.5} />
      <Sfx at={comenta} name="boing" volume={0.6} />
    </Full>
  );
};
