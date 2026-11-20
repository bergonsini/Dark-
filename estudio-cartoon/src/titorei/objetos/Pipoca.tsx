import React from "react";
import { useCurrentFrame } from "remotion";
import { Bola, Caixa } from "../lowpoly";

type V3 = [number, number, number];
const BRANCO = "#FFF6DE";
const CASCA = "#F2B632";

/** Uma pipoca low-poly (3 bolinhas brancas + casquinha amarela). */
export const Pipoca: React.FC<{ p?: V3; escala?: number; rot?: V3 }> = ({ p = [0, 0, 0], escala = 1, rot = [0, 0, 0] }) => (
  <group position={p} rotation={rot} scale={escala}>
    <Bola p={[0, 0, 0]} raio={0.12} d={0} c={BRANCO} />
    <Bola p={[0.09, 0.05, 0.03]} raio={0.09} d={0} c={BRANCO} />
    <Bola p={[-0.08, 0.06, -0.02]} raio={0.085} d={0} c={BRANCO} />
    <Bola p={[0, -0.09, 0.04]} raio={0.05} d={0} c={CASCA} />
  </group>
);

/** pseudo-aleatório determinístico */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Mar de pipoca cobrindo o chão da cozinha até a altura `nivel` (0 = nada). */
export const MarDePipoca: React.FC<{ nivel: number; largura?: number; prof?: number; n?: number }> = ({ nivel, largura = 9, prof = 7, n = 90 }) => {
  const f = useCurrentFrame();
  if (nivel <= 0.01) return null;
  return (
    <group>
      <Caixa p={[0, nivel / 2 - 0.05, -0.2]} s={[largura, nivel, prof]} c="#FBEBC4" />
      {Array.from({ length: n }).map((_, i) => {
        const x = (rnd(i, 1) - 0.5) * largura;
        const z = (rnd(i, 2) - 0.5) * prof - 0.2;
        const bob = Math.sin(f * 0.15 + i) * 0.03;
        return <Pipoca key={i} p={[x, nivel + bob, z]} escala={1.3 + rnd(i, 3)} rot={[rnd(i, 4) * 6, rnd(i, 5) * 6, 0]} />;
      })}
    </group>
  );
};

/** Pipocas pulando (estourando) a partir de um ponto. `t` = frames desde o início. */
export const PipocasPulando: React.FC<{ de: V3; n?: number; forca?: number }> = ({ de, n = 18, forca = 1 }) => {
  const f = useCurrentFrame();
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const per = 24 + Math.floor(rnd(i, 7) * 14);
        const q = ((f + i * 5) % per) / per;
        const vx = (rnd(i, 8) - 0.5) * 3 * forca;
        const vz = rnd(i, 9) * 1.5 * forca;
        const vy = (2 + rnd(i, 10) * 2) * forca;
        return <Pipoca key={i} p={[de[0] + vx * q, de[1] + vy * q - 3 * q * q, de[2] + vz * q]} escala={1.1} rot={[q * 8, q * 5, 0]} />;
      })}
    </group>
  );
};

/** Ovo gigante (pintado) com rachaduras. `racha` 0..1, `treme` balança. */
export const OvoGigante: React.FC<{ pos?: V3; escala?: number; racha?: number; treme?: boolean }> = ({ pos = [0, 0, 0], escala = 1, racha = 0, treme = false }) => {
  const f = useCurrentFrame();
  const t = treme ? Math.sin(f * 1.8) * 0.08 : 0;
  const n = Math.round(racha * 6);
  return (
    <group position={pos} rotation={[0, 0, t]} scale={escala}>
      <Bola p={[0, 1.0, 0]} raio={0.8} d={2} esc={[0.85, 1.15, 0.85]} c="#F4ECD8" />
      {[0.7, 1.15, 1.5].map((y, i) => (
        <Bola key={i} p={[0.3 - i * 0.25, y, 0.6]} raio={0.1} d={0} c={["#8E5CF7", "#3DDC84", "#FF7AB6"][i]} />
      ))}
      {Array.from({ length: n }).map((_, i) => (
        <Caixa key={i} p={[-0.25 + i * 0.1, 1.45 + (i % 2 ? -0.07 : 0.07), 0.68 - Math.abs(i - 2.5) * 0.03]} r={[0, 0, i % 2 ? 0.7 : -0.7]} s={[0.17, 0.03, 0.03]} c="#3A2A20" />
      ))}
      {racha >= 1 && <Bola p={[0, 1.45, 0.62]} raio={0.09} d={0} c="#FFE45C" e="#FFB300" />}
    </group>
  );
};

/** Casca do ovo aberta em duas metades (no chão). `abre` 0..1 afasta as metades. */
export const CascaOvo: React.FC<{ pos?: V3; escala?: number; abre?: number }> = ({ pos = [0, 0, 0], escala = 1, abre = 1 }) => (
  <group position={pos} scale={escala}>
    <group position={[-0.6 * abre, 0, 0]} rotation={[0, 0, 0.5 * abre]}>
      <Bola p={[0, 0.5, 0]} raio={0.8} d={1} esc={[0.85, 0.6, 0.85]} c="#F4ECD8" />
    </group>
    <group position={[0.6 * abre, 0, 0]} rotation={[0, 0, -0.5 * abre]}>
      <Bola p={[0, 0.5, 0]} raio={0.8} d={1} esc={[0.85, 0.6, 0.85]} c="#F4ECD8" />
    </group>
  </group>
);

/** Cozinha congelada: chão de gelo, cubos espalhados, pingentes no topo da parede e neve caindo. `k` 0..1. */
export const Congelada: React.FC<{ k: number }> = ({ k }) => {
  const f = useCurrentFrame();
  if (k <= 0.01) return null;
  return (
    <group>
      <Caixa p={[0, 0.03, -0.2]} s={[12 * k, 0.06, 10]} c="#BFE9FF" o={0.85} />
      {Array.from({ length: Math.round(14 * k) }).map((_, i) => (
        <Caixa key={i} p={[(rnd(i, 11) - 0.5) * 7, 0.15, (rnd(i, 12) - 0.5) * 5]} r={[0, rnd(i, 13) * 3, 0]} s={[0.3, 0.3, 0.3]} c="#DFF6FF" o={0.9} />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`p${i}`} position={[-6 + i * 0.8, 5.6 - 0.3 * k, -2.85]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.12, 0.6 * k, 4]} />
          <meshStandardMaterial color="#CFF1FF" flatShading />
        </mesh>
      ))}
      {Array.from({ length: 40 }).map((_, i) => {
        const q = ((f * 0.02 + rnd(i, 14)) % 1);
        return <Bola key={`n${i}`} p={[(rnd(i, 15) - 0.5) * 8, 5 - q * 5, (rnd(i, 16) - 0.5) * 6]} raio={0.04} d={0} c="#FFFFFF" />;
      })}
    </group>
  );
};

/** Silhueta alta e larga na porta (o "pai"): um FREEZER escuro com olhinhos brilhando. */
export const SilhuetaFreezer: React.FC<{ pos?: V3; escala?: number }> = ({ pos = [0, 0, 0], escala = 1 }) => (
  <group position={pos} scale={escala}>
    <Caixa p={[0, 1.4, 0]} s={[1.5, 2.8, 0.6]} c="#0D0B14" />
    <Caixa p={[0, 2.3, 0.31]} s={[1.4, 0.04, 0.02]} c="#1C1830" />
    <Bola p={[-0.3, 2.0, 0.33]} raio={0.08} d={0} c="#9BE8FF" e="#4FC3F7" />
    <Bola p={[0.3, 2.0, 0.33]} raio={0.08} d={0} c="#9BE8FF" e="#4FC3F7" />
  </group>
);
