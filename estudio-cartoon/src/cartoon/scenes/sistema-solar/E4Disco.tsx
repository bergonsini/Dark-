import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Nebulosa } from "../../components/Cosmos";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** Massa de pizza girando acima da cabeça do Tito: a analogia do disco. */
const Pizza: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const f = useCurrentFrame();
  if (s <= 0) return null;
  const a = f * 0.35;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y + Math.sin(f * 0.3) * 8}) scale(${s})`}>
        <ellipse rx={130} ry={34} fill="#F2D49B" stroke={C.outline} strokeWidth={6} />
        <ellipse rx={105} ry={24} fill="#E8574A" />
        {[0, 1, 2, 3, 4].map((i) => {
          const t = a + (i * Math.PI * 2) / 5;
          return <ellipse key={i} cx={Math.cos(t) * 70} cy={Math.sin(t) * 14} rx={14} ry={6} fill={i % 2 ? "#FFE680" : "#3DDC84"} />;
        })}
        <path d="M -150 -40 q 20 -20 40 -6 M 120 -46 q 25 -10 40 8" stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** DESENVOLVIMENTO 2: a nuvem gira cada vez mais rápido e achata, como massa de pizza. */
export const E4Disco: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const girar = wordAt(scene, "girar");
  const achatou = wordAt(scene, "achatou,");
  const pizza = wordAt(scene, "pizza");
  const gira = interpolate(f, [girar, achatou], [0.25, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const achata = interpolate(f, [achatou, achatou + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ps = useSpringAt(pizza, { damping: 10, stiffness: 160 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: achatou, zoom: 1.05 }, { f: achatou + 40, zoom: 1.12, y: 40 }]}>
        <Espaco topo="#0E0A24" base="#2A1E5C" />
        <Nebulosa cx={540} cy={680} R={420} contrai={0.7} gira={gira} achata={achata} centro={0.4} gas={1 - achata * 0.5} />
        <PersonagemEm x={760} pe={1280} altura={420} boca={mouth} expressao={f >= pizza ? "animado" : "encantado"} pose={f >= pizza ? "comemorando" : "explicando"} poseDe="explicando" poseT={(f - pizza) / 8} olharY={f >= pizza ? -0.8 : -0.4} olharX={f >= pizza ? 0 : -0.5} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 14} />
        <Pizza x={760} y={810} s={ps} />
      </Camera>
      {f >= girar && <Tag text="GIRA MAIS RÁPIDO" x={540} y={250} at={girar} bg={C.pink} size={50} />}
      {f >= achatou && <Tag text="ACHATA: VIRA UM DISCO" x={540} y={360} at={achatou} bg={C.yellow} size={46} />}
      <Sfx at={girar} name="whoosh" volume={0.5} />
      <Sfx at={achatou} name="whoosh" volume={0.5} />
      <Sfx at={pizza} name="boing" volume={0.5} />
    </Full>
  );
};
