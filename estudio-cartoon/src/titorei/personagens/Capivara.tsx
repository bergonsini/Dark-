import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Bola, Caixa, Olho, usePiscar } from "../lowpoly";

/** Capivara low-poly: calma absoluta (olhos meio fechados), respira devagar. Pés em y = 0, frente +z. */
export const Capivara: React.FC<{ pos?: [number, number, number]; rotY?: number; escala?: number; boca?: number; zen?: boolean; fechado?: number }> = ({ pos = [0, 0, 0], rotY = 0, escala = 1, boca = 0, zen = true, fechado }) => {
  const f = useCurrentFrame();
  const resp = 1 + Math.sin(f * 0.06) * 0.02;
  const pisc = usePiscar(7);
  const marrom = "#8B5A3C";
  const escuro = "#6B4228";
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <group scale={[1, resp, 1]}>
        <Bola p={[0, 0.62, 0]} raio={0.6} d={1} esc={[1.05, 0.85, 1.35]} c={marrom} />
        {[
          [-0.32, 0.45],
          [0.32, 0.45],
          [-0.32, -0.45],
          [0.32, -0.45],
        ].map(([x, z], i) => (
          <Caixa key={i} p={[x, 0.16, z]} s={[0.2, 0.32, 0.22]} c={escuro} />
        ))}
        {/* cabeça quadradona */}
        <group position={[0, 0.98, 0.72]}>
          <Caixa s={[0.62, 0.5, 0.62]} c={marrom} />
          <Caixa p={[0, -0.08, 0.36]} s={[0.5, 0.36, 0.2]} c={escuro} />
          <Caixa p={[-0.12, -0.02, 0.47]} s={[0.07, 0.05, 0.03]} c={P.preto} />
          <Caixa p={[0.12, -0.02, 0.47]} s={[0.07, 0.05, 0.03]} c={P.preto} />
          <Caixa p={[0, -0.2, 0.47]} s={[0.16, 0.02 + boca * 0.1, 0.03]} c={P.boca} />
          <Olho p={[-0.22, 0.12, 0.31]} raio={0.06} fechado={fechado ?? (zen ? 0.75 : pisc)} />
          <Olho p={[0.22, 0.12, 0.31]} raio={0.06} fechado={fechado ?? (zen ? 0.75 : pisc)} />
          <Bola p={[-0.25, 0.3, -0.1]} raio={0.08} d={0} c={escuro} />
          <Bola p={[0.25, 0.3, -0.1]} raio={0.08} d={0} c={escuro} />
        </group>
      </group>
    </group>
  );
};
