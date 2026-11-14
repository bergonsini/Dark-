import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Subsolo } from "../../components/Geo";
import { TITLE_FONT } from "../../fonts";
import { C } from "../../theme";
import { lineEnd, lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** COMEÇO: Tito põe o capacete e "desce" até o centro da Terra (o chão rola para cima). */
export const V2Descida: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const descer = wordAt(scene, "descer");
  const fim = lineEnd(scene, 1) + 10;
  const p = interpolate(f, [descer, fim], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const desce = -440 + p * 3700;
  const km = Math.round(p * 6371);
  const capacete = useSpringAt(lineStart(scene, 0) + 4);
  const caindo = f >= descer;
  const wob = caindo ? Math.sin(f * 0.35) * 10 : 0;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: descer, zoom: 1.05 }, { f: descer + 20, zoom: 1.12 }]}>
        <Subsolo desce={desce} />
        <PersonagemEm
          x={540}
          pe={1150}
          altura={520}
          boca={mouth}
          expressao={caindo ? "animado" : "feliz"}
          pose={caindo ? "comemorando" : "explicando"}
          poseDe="explicando"
          poseT={(f - descer) / 8}
          olharY={caindo ? 0.8 : 0}
          rot={wob}
          corpoY={caindo ? Math.sin(f * 0.2) * 20 : 0}
        />
        {/* capacete de mineiro com lanterna (acessório; o personagem é o mesmo) */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(540 ${745 + (caindo ? Math.sin(f * 0.2) * 20 : 0)}) rotate(${wob}) scale(${capacete})`}>
            {caindo && <path d="M 0 -20 L -140 320 L 140 320 Z" fill={C.yellow} opacity={0.18} />}
            <path d="M -95 10 Q -95 -85 0 -90 Q 95 -85 95 10 Z" fill={C.yellow} stroke={C.outline} strokeWidth={7} />
            <rect x={-110} y={0} width={220} height={22} rx={10} fill={C.orange} stroke={C.outline} strokeWidth={6} />
            <circle cx={0} cy={-40} r={24} fill={C.white} stroke={C.outline} strokeWidth={6} />
          </g>
        </svg>
      </Camera>
      {caindo && (
        <div
          style={{
            position: "absolute",
            top: 230,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: TITLE_FONT,
            fontWeight: 800,
            fontSize: 84,
            color: C.white,
            WebkitTextStroke: `14px ${C.outline}`,
            paintOrder: "stroke fill",
          }}
        >
          ↓ {km.toLocaleString("pt-BR")} km
        </div>
      )}
      <Sfx at={lineStart(scene, 0) + 4} name="pop" />
      <Sfx at={descer} name="whoosh" volume={0.7} />
      <Sfx at={descer + 4} name="riser" volume={0.4} />
      <Sfx at={fim - 30} name="ronco" volume={0.5} />
    </Full>
  );
};
