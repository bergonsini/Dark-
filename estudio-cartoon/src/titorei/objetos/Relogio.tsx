import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Bola, Caixa, Cilindro, Rostinho } from "../lowpoly";

type V3 = [number, number, number];

/**
 * Relógio-gerente (despertador vermelho com gravata). Pés em y = 0, frente +z.
 * toca: campainhas tremendo; quente 0..1: avermelha e solta vapor; dorme: olhos fechados; turbo: ponteiros girando rápido.
 */
export const RelogioGerente: React.FC<{
  pos?: V3;
  rotY?: number;
  escala?: number;
  boca?: number;
  expr?: "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste";
  toca?: boolean;
  quente?: number;
  dorme?: boolean;
  turbo?: boolean;
  pulo?: number;
}> = ({ pos = [0, 0, 0], rotY = 0, escala = 1, boca = 0, expr = "bravo", toca = false, quente = 0, dorme = false, turbo = false, pulo = 0 }) => {
  const f = useCurrentFrame();
  const tre = toca ? Math.sin(f * 2.6) * 0.07 : 0;
  const k = Math.max(0, Math.min(1, quente));
  const corpo = `rgb(${Math.round(226 + 29 * k)},${Math.round(59 - 30 * k)},${Math.round(59 - 30 * k)})`;
  const vel = turbo ? 0.9 : 0.02;
  return (
    <group position={[pos[0], pos[1] + pulo, pos[2]]} rotation={[0, rotY, tre]} scale={escala}>
      {/* pezinhos */}
      <Cilindro p={[-0.25, 0.08, 0]} r1={0.06} h={0.16} lados={6} c={P.contorno} />
      <Cilindro p={[0.25, 0.08, 0]} r1={0.06} h={0.16} lados={6} c={P.contorno} />
      {/* corpo (disco deitado de frente) */}
      <group position={[0, 0.62, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.32, 12]} />
          <meshStandardMaterial color={corpo} flatShading />
        </mesh>
        <mesh position={[0, 0, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 12]} />
          <meshStandardMaterial color="#FFF6E3" flatShading />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <Caixa key={i} p={[Math.sin(a) * 0.34, Math.cos(a) * 0.34, 0.18]} s={[0.03, 0.06, 0.01]} r={[0, 0, -a]} c={P.contorno} />;
        })}
        {/* ponteiros (no topo do mostrador, acima do rosto) */}
        <group position={[0, 0, 0.19]} rotation={[0, 0, -f * vel]}>
          <Caixa p={[0, 0.13, 0]} s={[0.03, 0.26, 0.01]} c={P.contorno} />
        </group>
        <group position={[0, 0, 0.19]} rotation={[0, 0, -f * vel / 12 - 1]}>
          <Caixa p={[0, 0.09, 0]} s={[0.04, 0.18, 0.01]} c={P.contorno} />
        </group>
        <Bola p={[0, 0, 0.2]} raio={0.03} d={0} c={P.contorno} />
        <Rostinho p={[0, -0.05, 0.2]} s={0.75} boca={boca} expr={dorme ? "zen" : expr} seed={21} />
        {/* campainhas + martelinho */}
        {[-1, 1].map((l) => (
          <group key={l} position={[l * 0.3, 0.42, 0]} rotation={[0, 0, l * -0.5 + (toca ? Math.sin(f * 3 + l) * 0.15 : 0)]}>
            <mesh>
              <sphereGeometry args={[0.17, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={P.ouro} flatShading />
            </mesh>
          </group>
        ))}
        <Caixa p={[0, 0.5, 0]} s={[0.05, 0.14, 0.05]} c={P.contorno} />
        {/* botão de soneca no topo */}
        <Cilindro p={[0, 0.56, -0.05]} r1={0.08} h={0.06} lados={8} c="#3A86FF" />
        {/* gravata de gerente */}
        <group position={[0, -0.47, 0.17]}>
          <Caixa p={[0, 0.02, 0]} s={[0.1, 0.06, 0.03]} c="#3A86FF" />
          <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.07, 0.22, 4]} />
            <meshStandardMaterial color="#3A86FF" flatShading />
          </mesh>
        </group>
        {/* vapor quando superaquece */}
        {k > 0.2 &&
          [0, 1, 2].map((i) => {
            const q = ((f + i * 10) % 30) / 30;
            return <Bola key={i} p={[(i - 1) * 0.25, 0.6 + q * 0.6, 0]} raio={0.08 + q * 0.12} d={0} c="#FFFFFF" o={(1 - q) * 0.8 * k} />;
          })}
      </group>
    </group>
  );
};

/** Quadro branco na parede (o texto vem por cima, em 2D). */
export const QuadroBranco: React.FC<{ pos?: V3 }> = ({ pos = [0, 2, -2.85] }) => (
  <group position={pos}>
    <Caixa s={[2.6, 1.7, 0.06]} c="#8A93A6" />
    <Caixa p={[0, 0, 0.04]} s={[2.45, 1.55, 0.02]} c="#FFFFFF" />
    <Caixa p={[0, -0.9, 0.08]} s={[2.2, 0.06, 0.12]} c="#8A93A6" />
  </group>
);

/** Pegadinhas misteriosas no chão (de `de` até `ate`), aparecendo uma a uma (mostra 0..1). */
export const Pegadas: React.FC<{ de: V3; ate: V3; n?: number; mostra?: number }> = ({ de, ate, n = 8, mostra = 1 }) => (
  <group>
    {Array.from({ length: n }).map((_, i) => {
      if (i / n > mostra) return null;
      const t = i / (n - 1);
      const x = de[0] + (ate[0] - de[0]) * t + (i % 2 ? 0.08 : -0.08);
      const z = de[2] + (ate[2] - de[2]) * t;
      const ang = Math.atan2(ate[0] - de[0], ate[2] - de[2]);
      return (
        <group key={i} position={[x, 0.012, z]} rotation={[0, ang, 0]}>
          <Caixa s={[0.1, 0.01, 0.16]} c="#3A2418" />
          <Caixa p={[0, 0, 0.11]} s={[0.12, 0.01, 0.05]} c="#3A2418" />
        </group>
      );
    })}
  </group>
);
