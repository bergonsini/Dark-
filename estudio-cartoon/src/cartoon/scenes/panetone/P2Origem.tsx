import React from "react";
import { AbsoluteFill } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Carimbo, Italia, Panetone, Pergaminho, Toni } from "../../components/Natal";
import { Brilhos } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** COMEÇO: nasceu em Milão; a lenda do Toni (contada como lenda) e o carimbo "LENDA". */
export const P2Origem: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const milao = wordAt(scene, "milão,");
  const l1 = lineStart(scene, 1);
  const toni = wordAt(scene, "toni");
  const l2 = lineStart(scene, 2);
  const lenda = wordAt(scene, "lenda.");
  const pin = useSpringAt(milao, { damping: 9, stiffness: 160 });
  const livro = useSpringAt(l1, { damping: 12, stiffness: 140 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.15 }, { f: milao, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 20, zoom: 1.05 }, { f: lenda, zoom: 1.05 }]} shakes={[lenda]}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #8FD3FF, ${C.skyDeep} 80%)` }} />
        <Italia x={540} y={820} s={1.35} pin={pin} />
        <PersonagemEm x={860} pe={1340} altura={420} boca={mouth} expressao={f >= l2 ? "pensativo" : "feliz"} pose={f >= l2 ? "pensando" : "apontando"} espelhar olharX={-0.6} acessorio="gorroNatal" cabeca={f >= lenda ? Math.sin(f * 0.5) * 8 : 0} />
      </Camera>
      {f < l1 && <Tag text="MILÃO, ITÁLIA" x={540} y={260} at={milao} bg={C.yellow} size={58} />}
      {f >= l1 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - livro) * 1400}px) rotate(${(1 - livro) * 8}deg)` }}>
          <Pergaminho x={540} y={680} w={820} h={620}>
            <svg width={820} height={620} style={{ position: "absolute", inset: 0 }}>
              <rect x={60} y={450} width={700} height={40} rx={10} fill="#9C6A3A" stroke={C.outline} strokeWidth={6} />
              {[150, 670].map((cx) => (
                <g key={cx}>
                  <rect x={cx - 12} y={360} width={24} height={90} fill={C.white} stroke={C.outline} strokeWidth={5} />
                  <path d={`M ${cx} 330 q 14 18 0 32 q -14 -14 0 -32 z`} fill={C.yellow} stroke={C.outline} strokeWidth={3} />
                </g>
              ))}
            </svg>
            <Toni x={290} y={450} s={1.1} feliz={f >= toni ? 1 : 0} />
            <Panetone x={540} y={450} s={0.75} />
            <Brilhos x={540} y={330} at={toni} cor={C.yellow} n={10} raio={180} />
          </Pergaminho>
          <Tag text="A LENDA DO TONI" x={540} y={330} at={l1 + 6} bg="#F2DFB4" size={50} />
        </div>
      )}
      <Carimbo x={540} y={700} at={lenda} texto="LENDA" />
      <Sfx at={milao} name="pop" volume={0.6} />
      <Sfx at={l1} name="whoosh" volume={0.5} />
      <Sfx at={toni} name="sparkle" volume={0.5} />
      <Sfx at={lenda} name="boom" volume={0.45} />
    </Full>
  );
};
