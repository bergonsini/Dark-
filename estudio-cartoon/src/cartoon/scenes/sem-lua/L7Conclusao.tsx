import React from "react";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { CeuNoturno, LuaPersonagem } from "../../components/Lua";
import { BalaoComentario, Brilhos, Seta } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** CONCLUSÃO: a Lua volta (de capacete, "funcionária do mês") + pergunta para comentar. */
export const L7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const enfeite = wordAt(scene, "enfeite,");
  const trabalha = wordAt(scene, "trabalha");
  const l1 = lineStart(scene, 1);
  const comenta = wordAt(scene, "comenta");
  const volta = useSpringAt(0, { damping: 9, stiffness: 140 });
  const balao = useSpringAt(comenta, { damping: 9, stiffness: 180 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.12 }, { f: trabalha, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 20, zoom: 1.05, y: -20 }]}>
        <CeuNoturno luar={volta} />
        <div style={{ position: "absolute", inset: 0, transform: `scale(${volta})`, transformOrigin: "560px 640px" }}>
          <LuaPersonagem x={560} y={640} r={170} expr="orgulhosa" capacete={f >= trabalha} />
        </div>
        <Brilhos x={560} y={640} at={2} cor={C.yellow} n={14} raio={320} />
        <PersonagemEm x={220} pe={1330} altura={480} boca={mouth} expressao="animado" pose={f >= l1 ? "acenando" : "comemorando"} poseDe="comemorando" poseT={(f - l1) / 8} olharX={0.5} olharY={-0.6} />
      </Camera>
      {f < l1 && f >= enfeite && <TitleSlam text="NÃO É SÓ ENFEITE!" top={190} size={92} color={C.yellow} at={enfeite} />}
      {f >= trabalha && f < l1 && <Tag text="FUNCIONÁRIA DO MÊS" x={560} y={900} at={trabalha + 4} bg={C.yellow} size={44} />}
      {f >= l1 && <TitleSlam text="SENTIRIA FALTA DE QUÊ?" top={190} size={88} color={C.white} at={l1} />}
      {f >= comenta && <BalaoComentario x={680} y={1000} s={balao} texto="COMENTA AQUI!" />}
      <Seta x={680} y={1170} at={comenta + 6} />
      <Sfx at={0} name="sparkle" volume={0.6} />
      <Sfx at={enfeite} name="pop" volume={0.5} />
      <Sfx at={trabalha + 4} name="tada" volume={0.45} />
      <Sfx at={l1} name="whoosh" volume={0.5} />
      <Sfx at={comenta} name="boing" volume={0.6} />
    </Full>
  );
};
