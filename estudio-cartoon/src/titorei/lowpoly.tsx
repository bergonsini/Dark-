import React from "react";
import type { ThreeElements } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { P } from "./config";

/**
 * Peças low-poly: tudo com sombreamento facetado (flatShading) e cores chapadas.
 * Unidades: 1 = ~50 cm. Personagens têm os pés em y = 0.
 */
type V3 = [number, number, number];
export const Mat: React.FC<{ c: string; e?: string; o?: number }> = ({ c, e, o }) => (
  <meshStandardMaterial color={c} flatShading roughness={0.85} metalness={0} emissive={e ?? "#000000"} transparent={o !== undefined} opacity={o ?? 1} />
);

type Base = { p?: V3; r?: V3; c: string; e?: string; o?: number } & Omit<ThreeElements["mesh"], "position" | "rotation">;
export const Caixa: React.FC<Base & { s?: V3 }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], c, e, o }) => (
  <mesh position={p} rotation={r}>
    <boxGeometry args={s} />
    <Mat c={c} e={e} o={o} />
  </mesh>
);
export const Bola: React.FC<Base & { raio?: number; d?: number; esc?: V3 }> = ({ p = [0, 0, 0], r = [0, 0, 0], raio = 0.5, d = 1, esc = [1, 1, 1], c, e, o }) => (
  <mesh position={p} rotation={r} scale={esc}>
    <icosahedronGeometry args={[raio, d]} />
    <Mat c={c} e={e} o={o} />
  </mesh>
);
export const Cone: React.FC<Base & { raio?: number; h?: number; lados?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], raio = 0.5, h = 1, lados = 6, c, e }) => (
  <mesh position={p} rotation={r}>
    <coneGeometry args={[raio, h, lados]} />
    <Mat c={c} e={e} />
  </mesh>
);
export const Cilindro: React.FC<Base & { r1?: number; r2?: number; h?: number; lados?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], r1 = 0.5, r2, h = 1, lados = 8, c, e, o }) => (
  <mesh position={p} rotation={r}>
    <cylinderGeometry args={[r2 ?? r1, r1, h, lados]} />
    <Mat c={c} e={e} o={o} />
  </mesh>
);

/** Olho: bola branca + pupila que olha (olhar -1..1) + pálpebra (piscar). */
export const Olho: React.FC<{ p: V3; raio?: number; olhar?: [number, number]; fechado?: number; cor?: string }> = ({ p, raio = 0.1, olhar = [0, 0], fechado = 0, cor = P.preto }) => (
  <group position={p}>
    <group scale={[1, Math.max(0.08, 1 - fechado), 1]}>
      <Bola raio={raio} c={P.branco} d={1} />
      <Bola p={[olhar[0] * raio * 0.45, olhar[1] * raio * 0.45, raio * 0.78]} raio={raio * 0.48} c={cor} d={1} />
    </group>
  </group>
);

/** Piscada automática (0..1) a partir do frame e de uma semente. */
export const usePiscar = (seed = 0) => {
  const f = useCurrentFrame();
  const t = (f + seed * 37) % 104;
  return t < 5 ? Math.sin((t / 5) * Math.PI) : 0;
};

/**
 * Rostinho para dar vida a QUALQUER objeto (geladeira, leite, queijo...). Fica na face +z do objeto.
 * boca 0..1 (fala), expr muda sobrancelhas/boca, fechado = olhos fechados (calma, meditando).
 */
export const Rostinho: React.FC<{
  p?: V3;
  s?: number;
  boca?: number;
  expr?: "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste";
  olhar?: [number, number];
  seed?: number;
}> = ({ p = [0, 0, 0], s = 1, boca = 0, expr = "feliz", olhar = [0, 0], seed = 0 }) => {
  const f = useCurrentFrame();
  const pisc = usePiscar(seed);
  const fech = expr === "zen" ? 0.9 : pisc;
  const ab = Math.max(boca, expr === "chocado" ? 0.7 : 0);
  const sob = expr === "bravo" ? 0.35 : expr === "triste" || expr === "nervoso" ? -0.35 : 0;
  const tremor = expr === "nervoso" ? Math.sin(f * 1.6) * 0.01 : 0;
  return (
    <group position={p} scale={s}>
      <Olho p={[-0.13 + tremor, 0.08, 0]} raio={0.085} olhar={olhar} fechado={fech} />
      <Olho p={[0.13 + tremor, 0.08, 0]} raio={0.085} olhar={olhar} fechado={fech} />
      <Caixa p={[-0.13, 0.22, 0.02]} r={[0, 0, sob]} s={[0.15, 0.03, 0.03]} c={P.preto} />
      <Caixa p={[0.13, 0.22, 0.02]} r={[0, 0, -sob]} s={[0.15, 0.03, 0.03]} c={P.preto} />
      {ab > 0.08 ? (
        <Caixa p={[0, -0.12, 0.02]} s={[0.16, 0.04 + ab * 0.14, 0.03]} c={P.boca} />
      ) : expr === "triste" || expr === "nervoso" || expr === "bravo" ? (
        <mesh position={[0, -0.16, 0.02]}>
          <torusGeometry args={[0.07, 0.016, 4, 10, Math.PI]} />
          <Mat c={P.preto} />
        </mesh>
      ) : (
        <mesh position={[0, -0.1, 0.02]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.07, 0.016, 4, 10, Math.PI]} />
          <Mat c={P.preto} />
        </mesh>
      )}
    </group>
  );
};

/** Luzes padrão do Titorei (claras, sem tom escuro). Use dentro de cada ThreeCanvas. */
export const Luzes: React.FC<{ quente?: boolean }> = ({ quente = true }) => (
  <>
    <ambientLight intensity={1.0} />
    <hemisphereLight args={[quente ? "#FFF4E0" : "#E8F4FF", "#8A5A3A", 0.6]} />
    <directionalLight position={[4, 7, 6]} intensity={1.5} />
  </>
);
