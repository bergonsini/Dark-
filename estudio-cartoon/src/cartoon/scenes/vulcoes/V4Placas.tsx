import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { GEO, Placas } from "../../components/Geo";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";
import { AbsoluteFill } from "remotion";

/** DESENVOLVIMENTO 2: a casca da Terra é um quebra-cabeça de placas que se movem como unhas crescendo. */
export const V4Placas: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const placas = wordAt(scene, "placas");
  const unhas = wordAt(scene, "unhas");
  const l1 = lineStart(scene, 1);
  const t = interpolate(f, [placas, scene.endFrame - scene.startFrame], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const unha = interpolate(f, [unhas, unhas + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.2, y: 60 }, { f: placas, zoom: 1.02 }, { f: l1 + 20, zoom: 1.02 }, { f: l1 + 50, zoom: 1.08, x: -30 }]}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #3A8FE0, ${GEO.oceano} 70%)` }} />
        <Placas t={t} x={90} y={310} />
        {f >= unhas && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {/* dedo com a unha crescendo: a analogia */}
            <g transform="translate(820 1180) rotate(-10)">
              <rect x={-70} y={-150} width={140} height={300} rx={70} fill="#C98B5E" stroke={C.outline} strokeWidth={7} />
              <rect x={-48} y={-140 - unha * 40} width={96} height={110 + unha * 40} rx={40} fill="#FFD9D0" stroke={C.outline} strokeWidth={6} />
              <rect x={-48} y={-140 - unha * 40} width={96} height={22} rx={10} fill={C.white} opacity={0.9} />
            </g>
          </svg>
        )}
        <PersonagemEm x={210} pe={1330} altura={380} boca={mouth} expressao={f >= unhas ? "encantado" : "feliz"} pose={f >= unhas ? "apontando" : "explicando"} olharX={0.6} olharY={-0.3} />
      </Camera>
      <Tag text="PLACAS TECTÔNICAS" x={540} y={250} at={placas} bg={C.yellow} size={58} />
      {f >= l1 && <Tag text="SE MOVEM DEVAGAR" x={560} y={1080} at={l1 + 6} bg={C.white} size={44} />}
      {f >= unhas && <Tag text="ALGUNS CM POR ANO" x={700} y={960} at={unhas + 12} bg={C.pink} size={40} />}
      <Sfx at={placas} name="ronco" volume={0.45} />
      <Sfx at={placas + 4} name="pop" volume={0.6} />
      <Sfx at={l1 + 6} name="whoosh" volume={0.35} />
      <Sfx at={unhas} name="boing" volume={0.5} />
    </Full>
  );
};
