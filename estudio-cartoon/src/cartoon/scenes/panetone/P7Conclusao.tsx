import React from "react";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Arvore, Neve, Panetone, SalaNatal } from "../../components/Natal";
import { BalaoComentario, Brilhos, Seta } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** CONCLUSÃO: é tradição, pão de festa que virou símbolo + "time panetone ou chocotone?" */
export const P7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const simbolo = wordAt(scene, "símbolo.");
  const choco = wordAt(scene, "chocotone?");
  const comenta = wordAt(scene, "comenta");
  const vs = useSpringAt(l1, { damping: 9, stiffness: 160 });
  const balao = useSpringAt(comenta, { damping: 9, stiffness: 180 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: simbolo, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 20, zoom: 1.04 }]}>
        <SalaNatal chao={1330} />
        <Neve n={30} />
        <Arvore x={920} y={1330} s={0.8} />
        {f < l1 ? (
          <Panetone x={540} y={1330} s={1.3} rosto boca={Math.abs(Math.sin(f * 0.3)) * 0.4} />
        ) : (
          <>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - vs) * -600}px)` }}>
              <Panetone x={330} y={1300} s={1.0} rosto />
            </div>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - vs) * 600}px)` }}>
              <Panetone x={760} y={1300} s={1.0} rosto chocolate />
            </div>
          </>
        )}
        <Brilhos x={540} y={950} at={simbolo} cor={C.yellow} n={14} raio={380} />
        {f < l1 && <PersonagemEm x={170} pe={1330} altura={460} boca={mouth} expressao="animado" pose="comemorando" olharX={0.6} acessorio="gorroNatal" />}
      </Camera>
      {f < l1 && <TitleSlam text="VIROU SÍMBOLO DO NATAL!" top={200} size={90} color={C.yellow} at={simbolo - 4} />}
      {f >= l1 && (
        <>
          <Tag text="TIME PANETONE" x={300} y={880} at={l1 + 4} bg={C.orange} color={C.white} size={38} />
          <Tag text="TIME CHOCOTONE" x={780} y={880} at={choco} bg="#6B3A1E" color={C.white} size={38} />
          <TitleSlam text="VS" top={700} size={130} color={C.white} at={choco} />
        </>
      )}
      {f >= comenta && <BalaoComentario x={540} y={420} s={balao} texto="COMENTA AQUI!" />}
      <Seta x={540} y={620} at={comenta + 6} />
      <Sfx at={simbolo - 4} name="tada" volume={0.5} />
      <Sfx at={l1} name="whoosh" volume={0.6} />
      <Sfx at={choco} name="boom" volume={0.4} />
      <Sfx at={comenta} name="boing" volume={0.6} />
    </Full>
  );
};
