import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Bola, Caixa, Cilindro, Cone } from "../lowpoly";

/** Cozinha low-poly: piso, duas paredes, janela, azulejos. Origem no centro do piso. */
export const Cozinha3D: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#E8D3B0" flatShading />
    </mesh>
    {Array.from({ length: 7 }).map((_, i) =>
      Array.from({ length: 7 }).map((__, j) =>
        (i + j) % 2 ? <Caixa key={`${i}-${j}`} p={[-6 + i * 2, 0.005, -6 + j * 2]} s={[2, 0.01, 2]} c="#D4BC94" /> : null,
      ),
    )}
    <Caixa p={[0, 3, -3]} s={[14, 6, 0.2]} c="#7FC8A9" />
    <Caixa p={[-5, 3, 2]} s={[0.2, 6, 10]} c="#6DB896" />
    <Caixa p={[1.8, 3.2, -2.88]} s={[1.6, 1.2, 0.05]} c="#BFE6FF" />
    <Caixa p={[1.8, 3.2, -2.86]} s={[1.7, 0.08, 0.05]} c={P.branco} />
    <Caixa p={[1.8, 3.2, -2.86]} s={[0.08, 1.3, 0.05]} c={P.branco} />
  </group>
);

/** Praia low-poly: areia, mar ondulando, sol, palmeira, guarda-sol. */
export const Praia3D: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F2D49B" flatShading />
      </mesh>
      <Caixa p={[0, 0.02 + Math.sin(f * 0.08) * 0.03, -6]} s={[24, 0.06, 6]} c="#2F9BE0" />
      <Caixa p={[0, 0.03, -2.9 + Math.sin(f * 0.08) * 0.15]} s={[24, 0.04, 0.3]} c={P.branco} />
      <Caixa p={[0, 6, -9]} s={[30, 14, 0.2]} c={P.ceu} />
      <Bola p={[3.5, 5.5, -8.5]} raio={1} d={1} c="#FFD23F" e="#7A5A00" />
      {/* palmeira */}
      <group position={[-3, 0, -1.5]}>
        {[0, 1, 2, 3].map((i) => (
          <Cilindro key={i} p={[i * 0.08, 0.4 + i * 0.75, 0]} r1={0.16 - i * 0.02} h={0.8} lados={6} c="#9C6A3A" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <Cone key={i} p={[0.25, 3.2, 0]} r={[0.9 * Math.cos((i / 5) * Math.PI * 2), (i / 5) * Math.PI * 2, 1.2]} raio={0.25} h={1.6} lados={4} c={P.verde} />
        ))}
      </group>
      {/* guarda-sol */}
      <group position={[2.2, 0, 0]}>
        <Cilindro p={[0, 1, 0]} r1={0.04} h={2} c={P.branco} />
        <Cone p={[0, 2.1, 0]} raio={1.2} h={0.5} lados={8} c="#E23B3B" />
      </group>
    </group>
  );
};
