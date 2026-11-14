import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Brilhos, Planeta, Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** DESENVOLVIMENTO 5 (curiosidade): em Marte o céu é caramelo e o pôr do sol é azul. */
export const S7Marte: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const caramelo = wordAt(scene, "caramelo,");
  const azul = wordAt(scene, "azul!");
  const l1 = lineStart(scene, 1);
  const k = interpolate(f, [azul - 6, azul + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const intro = interpolate(f, [0, 30], [1, 0], { extrapolateRight: "clamp" });
  const capacete = useSpringAt(26);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: 30, zoom: 1.0 }, { f: azul, zoom: 1.0 }, { f: azul + 25, zoom: 1.12, x: -80, y: 80 }]} shakes={[l1 + 4]}>
        <CeuCampo
          topo={interpolateColors(k, [0, 1], ["#C98F5A", "#4A3B5E"])}
          base={interpolateColors(k, [0, 1], ["#EBC08E", "#8F7A8C"])}
          colina1={interpolateColors(k, [0, 1], ["#B5532E", "#6E3A2A"])}
          colina2={interpolateColors(k, [0, 1], ["#8E3B22", "#552B20"])}
          nuvens={false}
          chao={1300}
        />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: `radial-gradient(circle at 760px ${interpolate(k, [0, 1], [420, 1110])}px, rgba(120,190,255,${k * 0.85}) 0%, rgba(120,190,255,0) 28%)` }} />
        <Sol x={760} y={interpolate(k, [0, 1], [420, 1110])} r={interpolate(k, [0, 1], [70, 60])} cor={interpolateColors(k, [0, 1], ["#FFF2D6", "#CFE8FF"])} />
        <PersonagemEm x={380} pe={1290} altura={620} boca={mouth} expressao={f >= azul ? "encantado" : f >= caramelo ? "surpreso" : "feliz"} pose={f >= azul ? "apontando" : "acenando"} poseDe="acenando" poseT={(f - azul) / 8} olharX={0.7} olharY={-0.3} />
        {/* capacete de astronauta: acessório, o personagem continua o mesmo */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: capacete }}>
          <circle cx={380} cy={875} r={138} fill="rgba(200,235,255,0.08)" stroke={C.white} strokeWidth={10} />
          <path d="M 300 800 q -26 50 -10 110" stroke={C.white} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.7} />
        </svg>
        <Brilhos x={760} y={1110} at={azul + 10} cor={C.sky} />
      </Camera>
      {/* abertura: zoom do planeta */}
      <div style={{ position: "absolute", inset: 0, background: "#120C2E", opacity: intro, transform: `scale(${1 + (1 - intro) * 2})` }}>
        <Planeta x={540} y={900} r={260} cor="#C1440E" detalhe="#8E2F09" atmosfera="#E8A06A" />
      </div>
      <Tag text="MARTE" x={540} y={230} at={4} bg={C.red} color={C.white} size={70} />
      {f >= caramelo && f < azul && <Tag text="CÉU CARAMELO" x={540} y={360} at={caramelo} bg="#EBC08E" size={50} />}
      {f >= azul && <Tag text="PÔR DO SOL AZUL!" x={540} y={360} at={azul} bg={C.blue} color={C.white} size={54} />}
      {f >= l1 && <Tag text="POEIRA FINA" x={760} y={760} at={l1 + 6} bg={C.orange} size={44} />}
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={4} name="pop" />
      <Sfx at={caramelo} name="pop" volume={0.5} />
      <Sfx at={azul} name="sparkle" volume={0.7} />
      <Sfx at={l1 + 4} name="boom" volume={0.35} />
    </Full>
  );
};
