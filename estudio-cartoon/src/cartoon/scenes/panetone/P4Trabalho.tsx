import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Cozinha, PanetonesInvertidos, Relogio, Tigela } from "../../components/Natal";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** DESENVOLVIMENTO 2: fermentação de mais de um dia; esfria de cabeça para baixo. */
export const P4Trabalho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const massa = wordAt(scene, "massa");
  const dia = wordAt(scene, "dia,");
  const l1 = lineStart(scene, 1);
  const baixo = wordAt(scene, "baixo,");
  const cresce = interpolate(f, [massa, l1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sai = interpolate(f, [l1, l1 + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pend = interpolate(f, [l1 + 4, baixo + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rel = useSpringAt(massa, { damping: 10, stiffness: 160 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1 - 10, zoom: 1.12, y: 60 }, { f: l1 + 10, zoom: 1.0 }, { f: 270, zoom: 1.06 }]}>
        <Cozinha bancada={1320} />
        {sai > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: sai }}>
            <Tigela x={600} y={1240} cresce={cresce} s={1.15} />
            <div style={{ position: "absolute", inset: 0, transform: `scale(${rel})`, transformOrigin: "800px 520px" }}>
              <Relogio x={800} y={520} vel={f >= massa ? 2.5 : 0} s={1.1} />
            </div>
          </div>
        )}
        {f >= l1 && <PanetonesInvertidos y={560} vis={pend} />}
        <PersonagemEm x={180} pe={1330} altura={420} boca={mouth} expressao={f >= baixo ? "encantado" : "pensativo"} pose={f >= l1 ? "apontandoCima" : "pensando"} olharX={0.7} olharY={f >= l1 ? -0.7 : 0} acessorio="gorroNatal" cabeca={f >= baixo ? 18 : 0} />
      </Camera>
      {f >= dia && f < l1 + 6 && <Tag text="+ DE 1 DIA" x={420} y={300} at={dia} bg={C.yellow} size={66} />}
      {f >= l1 && f < baixo && <Tag text="ESFRIA..." x={540} y={300} at={l1 + 4} bg={C.white} size={56} />}
      {f >= baixo && <Tag text="DE CABEÇA PRA BAIXO!" x={540} y={300} at={baixo} bg={C.pink} size={54} />}
      <Sfx at={massa} name="borbulha" volume={0.5} />
      <Sfx at={massa + 6} name="click" volume={0.3} />
      <Sfx at={dia} name="ding" volume={0.5} />
      <Sfx at={l1} name="whoosh" volume={0.5} />
      <Sfx at={baixo} name="boing" volume={0.6} />
    </Full>
  );
};
