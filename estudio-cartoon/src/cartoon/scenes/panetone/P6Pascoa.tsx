import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Colomba, Engrenagem, Panetone } from "../../components/Natal";
import { Brilhos } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** CURIOSIDADE: na Páscoa, a mesma massa vira colomba pascal, para as máquinas não pararem. */
export const P6Pascoa: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const colomba = wordAt(scene, "colomba");
  const maquinas = wordAt(scene, "máquinas");
  const vira = interpolate(f, [colomba - 6, colomba + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const giro = Math.sin(vira * Math.PI) * 360;
  const ovos = [
    [130, 1300, C.pink],
    [260, 1330, C.yellow],
    [820, 1310, C.teal],
    [960, 1340, C.violet],
  ] as const;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: colomba, zoom: 1.0 }, { f: maquinas, zoom: 1.0 }, { f: maquinas + 20, zoom: 1.06 }]} shakes={[colomba + 10]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #A8E6CF 0%, #DCF5E8 65%, #7CCB6A 65%)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {ovos.map(([x, y, c], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y - 50} rx={44} ry={58} fill={c} stroke={C.outline} strokeWidth={6} />
              <path d={`M ${x - 40} ${y - 50} l 16 -14 16 14 16 -14 16 14 16 -14`} stroke={C.white} strokeWidth={6} fill="none" />
            </g>
          ))}
        </svg>
        {f >= maquinas && (
          <>
            <Engrenagem x={140} y={400} r={80} vel={4} />
            <Engrenagem x={940} y={420} r={100} vel={-3.5} cor="#A8B0C2" />
          </>
        )}
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(${giro}deg)`, transformOrigin: "540px 1000px" }}>
          {vira < 0.5 ? <Panetone x={540} y={1150} s={1.2} /> : <Colomba x={560} y={1150} s={1.5} />}
        </div>
        <Brilhos x={540} y={950} at={colomba + 4} cor={C.yellow} n={14} raio={340} />
        <PersonagemEm x={170} pe={1320} altura={380} boca={mouth} expressao={f >= colomba ? "animado" : "pensativo"} pose={f >= colomba ? "comemorando" : "pensando"} olharX={0.7} olharY={-0.3} acessorio="gorroNatal" />
      </Camera>
      <Tag text="E NA PÁSCOA?" x={540} y={260} at={2} bg={C.white} size={60} />
      {f >= colomba && <Tag text="COLOMBA PASCAL" x={540} y={380} at={colomba + 6} bg={C.yellow} size={56} />}
      {f >= maquinas && <Tag text="MASSA PARECIDA, MÁQUINAS LIGADAS" x={540} y={500} at={maquinas} bg={C.teal} color={C.white} size={40} />}
      <Sfx at={2} name="pop" />
      <Sfx at={colomba - 6} name="whoosh" volume={0.6} />
      <Sfx at={colomba + 6} name="sparkle" volume={0.6} />
      <Sfx at={maquinas} name="click" volume={0.5} />
      <Sfx at={maquinas + 6} name="click" volume={0.5} />
    </Full>
  );
};
