import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Bola, Caixa, Cilindro, Cone, Mat, Olho, usePiscar } from "../lowpoly";

/**
 * TITO.REI — o protagonista do Titorei (humor absurdo). É o MESMO Tito do canal explicativo, em 3D low-poly,
 * com a COROA dourada como marca registrada. Use sempre este componente; nunca recrie o personagem na cena.
 *
 * Pés em y = 0, altura ~2,6 (com a coroa). Frente olhando para +z.
 */
export type Expr = "neutro" | "feliz" | "animado" | "chocado" | "bravo" | "malandro" | "triste";
export type Braco = [number, number]; // [frente (rot x), abertura lateral (rot z)] em radianos

const EXPR: Record<Expr, { sob: number; sobY: number; olho: number; sorri: number }> = {
  neutro: { sob: 0, sobY: 0, olho: 1, sorri: 0.3 },
  feliz: { sob: -0.1, sobY: 0.02, olho: 1, sorri: 1 },
  animado: { sob: -0.2, sobY: 0.05, olho: 1.15, sorri: 1 },
  chocado: { sob: -0.25, sobY: 0.08, olho: 1.35, sorri: 0 },
  bravo: { sob: 0.4, sobY: -0.02, olho: 0.9, sorri: -1 },
  malandro: { sob: 0.25, sobY: 0, olho: 0.75, sorri: 1 },
  triste: { sob: -0.35, sobY: 0.03, olho: 1, sorri: -1 },
};

export const POSES: Record<string, { E: Braco; D: Braco }> = {
  parado: { E: [0, 0.12], D: [0, -0.12] },
  acenando: { E: [0, 0.12], D: [0, -2.6] },
  apontando: { E: [0, 0.12], D: [-1.5, -0.1] },
  bracosPraCima: { E: [0, 2.7], D: [0, -2.7] },
  chocado: { E: [-0.6, 1.2], D: [-0.6, -1.2] },
  maosNaCintura: { E: [0, 0.7], D: [0, -0.7] },
  pensando: { E: [0, 0.15], D: [-2.3, -0.5] },
  explicando: { E: [-0.9, 0.3], D: [-0.9, -0.3] },
};

export const TitoRei: React.FC<{
  pos?: [number, number, number];
  rotY?: number;
  escala?: number;
  boca?: number;
  expr?: Expr;
  pose?: keyof typeof POSES;
  bracoE?: Braco;
  bracoD?: Braco;
  andando?: boolean;
  pulo?: number;
  olhar?: [number, number];
  cabeca?: [number, number];
  coroa?: number;
  brilhoCoroa?: number;
  /** encharcado: gotas pingando do corpo */
  molhado?: boolean;
}> = ({ pos = [0, 0, 0], rotY = 0, escala = 1, boca = 0, expr = "feliz", pose = "parado", bracoE, bracoD, andando = false, pulo = 0, olhar = [0, 0], cabeca = [0, 0], coroa = 0, brilhoCoroa = 0, molhado = false }) => {
  const f = useCurrentFrame();
  const e = EXPR[expr];
  const pisc = usePiscar(3);
  const passo = andando ? Math.sin(f * 0.45) : 0;
  const bob = andando ? Math.abs(passo) * 0.08 : Math.sin(f * 0.12) * 0.015;
  const fala = boca * Math.sin(f * 0.9) * 0.05;
  const E = bracoE ?? (andando ? ([passo * 0.6, 0.12] as Braco) : POSES[pose].E);
  const D = bracoD ?? (andando ? ([-passo * 0.6, -0.12] as Braco) : POSES[pose].D);
  const ab = Math.max(boca, expr === "chocado" ? 0.75 : 0);
  return (
    <group position={[pos[0], pos[1] + pulo + bob, pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {molhado &&
        [
          [-0.35, 1.9, 0.3],
          [0.3, 1.7, 0.35],
          [-0.2, 1.2, 0.25],
          [0.4, 1.0, 0.2],
          [0.0, 2.4, 0.2],
          [-0.45, 0.6, 0.1],
        ].map(([x, y, z], i) => {
          const q = ((f + i * 9) % 24) / 24;
          return <Bola key={`g${i}`} p={[x, y - q * 0.6, z]} raio={0.05} d={0} c="#5AA9FF" />;
        })}
      {/* pernas e tênis */}
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 0.17, 0.62, 0]} rotation={[l * passo * 0.6, 0, 0]}>
          <Caixa p={[0, -0.3, 0]} s={[0.2, 0.6, 0.2]} c={P.pele} />
          <Caixa p={[0, -0.6, 0.06]} s={[0.26, 0.14, 0.36]} c={P.tenis} />
          <Caixa p={[0, -0.66, 0.06]} s={[0.27, 0.04, 0.37]} c={P.branco} />
        </group>
      ))}
      {/* short */}
      <Caixa p={[0, 0.72, 0]} s={[0.62, 0.3, 0.38]} c={P.short} />
      {/* tronco (camiseta) */}
      <Caixa p={[0, 1.17, 0]} s={[0.68, 0.64, 0.4]} c={P.camisa} />
      <Cone p={[0, 1.22, 0.21]} r={[Math.PI / 2, 0, 0]} raio={0.1} h={0.04} lados={5} c="#FF8C42" />
      {/* braços: pivô no ombro */}
      {([
        [-1, E],
        [1, D],
      ] as [number, Braco][]).map(([l, b]) => (
        <group key={l} position={[l * 0.43, 1.42, 0]} rotation={[b[0], 0, b[1]]}>
          <Caixa p={[0, -0.1, 0]} s={[0.22, 0.22, 0.24]} c={P.camisa} />
          <Caixa p={[0, -0.38, 0]} s={[0.15, 0.42, 0.15]} c={P.pele} />
          <Bola p={[0, -0.64, 0]} raio={0.11} d={0} c={P.pele} />
        </group>
      ))}
      {/* pescoço */}
      <Cilindro p={[0, 1.56, 0]} r1={0.1} h={0.14} lados={6} c={P.peleSombra} />
      {/* CABEÇA */}
      <group position={[0, 1.98 + fala, 0]} rotation={[cabeca[1], cabeca[0], 0]}>
        <Bola raio={0.43} d={1} c={P.pele} />
        {/* cabelo cacheado */}
        {[
          [-0.25, 0.25, -0.05],
          [0, 0.33, -0.02],
          [0.25, 0.25, -0.05],
          [-0.15, 0.3, 0.15],
          [0.15, 0.3, 0.15],
          [-0.32, 0.05, -0.15],
          [0.32, 0.05, -0.15],
          [0, 0.15, -0.3],
          [-0.2, 0.1, -0.3],
          [0.2, 0.1, -0.3],
        ].map(([x, y, z], i) => (
          <Bola key={i} p={[x, y, z]} raio={0.17} d={0} c={P.cabelo} />
        ))}
        {/* orelhas */}
        <Bola p={[-0.43, -0.02, 0]} raio={0.08} d={0} c={P.pele} />
        <Bola p={[0.43, -0.02, 0]} raio={0.08} d={0} c={P.pele} />
        {/* olhos + óculos redondos (marca do Tito) */}
        {[-0.15, 0.15].map((x) => (
          <group key={x}>
            <Olho p={[x, 0.03, 0.36]} raio={0.085 * e.olho} olhar={olhar} fechado={expr === "malandro" ? 0.45 : pisc} />
            <mesh position={[x, 0.03, 0.42]}>
              <torusGeometry args={[0.12, 0.022, 4, 10]} />
              <Mat c={P.contorno} />
            </mesh>
          </group>
        ))}
        <Caixa p={[0, 0.04, 0.43]} s={[0.07, 0.025, 0.025]} c={P.contorno} />
        {/* sobrancelhas */}
        <Caixa p={[-0.15, 0.2 + e.sobY, 0.4]} r={[0, 0, -e.sob]} s={[0.16, 0.035, 0.03]} c={P.cabelo} />
        <Caixa p={[0.15, 0.2 + e.sobY, 0.4]} r={[0, 0, e.sob]} s={[0.16, 0.035, 0.03]} c={P.cabelo} />
        {/* nariz */}
        <Bola p={[0, -0.07, 0.42]} raio={0.05} d={0} c={P.peleSombra} />
        {/* boca: aberta (fala/choque) ou sorriso/careta */}
        {ab > 0.08 ? (
          <Caixa p={[0, -0.2, 0.39]} s={[0.17, 0.035 + ab * 0.15, 0.03]} c={P.boca} />
        ) : (
          <mesh position={[0, e.sorri >= 0 ? -0.17 : -0.22, 0.4]} rotation={[0, 0, e.sorri >= 0 ? Math.PI : 0]}>
            <torusGeometry args={[0.08, 0.018, 4, 10, Math.PI]} />
            <Mat c={P.contorno} />
          </mesh>
        )}
        {/* COROA dourada (Tito.rei) */}
        <group position={[0.04, 0.45, 0]} rotation={[0, 0, -0.12 + coroa]}>
          <Cilindro r1={0.27} h={0.16} lados={7} c={P.ouro} e={brilhoCoroa > 0 ? "#7A5200" : undefined} />
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return <Cone key={i} p={[Math.cos(a) * 0.24, 0.15, Math.sin(a) * 0.24]} raio={0.06} h={0.16} lados={4} c={P.ouro} />;
          })}
          <mesh position={[0, 0.02, 0.27]}>
            <octahedronGeometry args={[0.055, 0]} />
            <Mat c={P.rubi} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
