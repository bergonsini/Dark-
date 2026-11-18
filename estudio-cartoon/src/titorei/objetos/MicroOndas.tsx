import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Caixa, Cilindro, Rostinho } from "../lowpoly";
import { Coroa } from "./Clima";

type V3 = [number, number, number];

/**
 * REI MICRO-ONDAS (ep. 5): o candidato misterioso da coroa gigante. Pés em y = 0, frente +z.
 * `girando`: o prato gira lá dentro e a luz acende (nervoso). `apito`: o visor pisca. Altura ≈ 1.6 (sem a coroa).
 */
export const MicroOndas: React.FC<{
  pos?: V3;
  rotY?: number;
  escala?: number;
  boca?: number;
  expr?: "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste";
  girando?: boolean;
  apito?: boolean;
  coroa?: boolean;
  treme?: boolean;
}> = ({ pos = [0, 0, 0], rotY = 0, escala = 1, boca = 0, expr = "feliz", girando = false, apito = false, coroa = true, treme = false }) => {
  const f = useCurrentFrame();
  const t = treme ? Math.sin(f * 2.4) * 0.03 : 0;
  const pisca = apito && Math.floor(f / 4) % 2 === 0;
  return (
    <group position={[pos[0] + t, pos[1], pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {/* perninhas */}
      {[-0.35, 0.35].map((x) => (
        <Caixa key={x} p={[x, 0.15, 0]} s={[0.12, 0.3, 0.12]} c="#555" />
      ))}
      {/* corpo */}
      <Caixa p={[0, 0.8, 0]} s={[1.3, 0.9, 0.8]} c="#E8E8EE" />
      {/* porta + vidro */}
      <Caixa p={[-0.2, 0.8, 0.41]} s={[0.82, 0.7, 0.03]} c="#2B2B33" />
      <Caixa p={[-0.2, 0.8, 0.43]} s={[0.7, 0.58, 0.01]} c={girando ? "#FFD86B" : "#3C4A5A"} />
      {/* prato girando lá dentro */}
      <group position={[-0.2, 0.6, 0.3]} rotation={[0, girando ? f * 0.4 : 0, 0]}>
        <Cilindro r1={0.26} h={0.03} lados={10} c="#CFD8DC" />
        <Caixa p={[0.12, 0.06, 0]} s={[0.08, 0.08, 0.08]} c="#E57373" />
      </group>
      {/* painel */}
      <Caixa p={[0.45, 0.8, 0.41]} s={[0.3, 0.7, 0.03]} c="#CFCFD6" />
      <Caixa p={[0.45, 1.02, 0.43]} s={[0.22, 0.12, 0.02]} c={pisca ? "#FF3B30" : "#2E7D32"} />
      {[0, 1, 2].map((i) => (
        <Caixa key={i} p={[0.45, 0.82 - i * 0.12, 0.43]} s={[0.16, 0.07, 0.02]} c={P.branco} />
      ))}
      <Rostinho p={[-0.2, 0.82, 0.46]} s={0.75} expr={expr} boca={boca} seed={31} />
      {coroa && <Coroa p={[0, 1.27, 0]} escala={1.6} brilho />}
    </group>
  );
};
