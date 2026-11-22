import React from "react";
import { useCurrentFrame } from "remotion";
import { Bola, Caixa, Cilindro, Rostinho } from "../lowpoly";
import { Geladeira } from "./Cozinha";

type V3 = [number, number, number];
type Expr = "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste";

/** GELINHA, a geladeirinha bebê (Geladeira em escala pequena + chupeta). */
export const Geladeirinha: React.FC<{ pos?: V3; rotY?: number; expr?: Expr; boca?: number; pulo?: number; tremendo?: boolean; escala?: number }> = ({ pos = [0, 0, 0], rotY = 0, expr = "feliz", boca = 0, pulo = 0, tremendo = false, escala = 0.38 }) => (
  <group position={[pos[0], pos[1] + pulo, pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
    <Geladeira expr={expr} boca={boca} cor="#DFF3FF" tremendo={tremendo} bracos={1} />
    <Caixa p={[0, 1.2, 0.62]} s={[0.36, 0.22, 0.08]} c="#FF7AB6" />
  </group>
);

/**
 * FREEZER: alto, azul-gelo, com porta de cima e de baixo, puxadores e rostinho.
 * `desligado` 0..1: perde a cor, a tomada cai do lado e ele vira um ARMÁRIO de madeira (`armario` 0..1).
 */
export const Freezer: React.FC<{ pos?: V3; rotY?: number; expr?: Expr; boca?: number; desligado?: number; armario?: number; tremendo?: boolean }> = ({
  pos = [0, 0, 0],
  rotY = 0,
  expr = "feliz",
  boca = 0,
  desligado = 0,
  armario = 0,
  tremendo = false,
}) => {
  const f = useCurrentFrame();
  const t = tremendo ? Math.sin(f * 2.2) * 0.03 : 0;
  const mix = (a: string, b: string, k: number) => {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",")})`;
  };
  const corpo = armario > 0 ? mix("#9fb3c4", "#9a6236", armario) : mix("#bfe6ff", "#9fb3c4", desligado);
  return (
    <group position={[pos[0] + t, pos[1], pos[2]]} rotation={[0, rotY, 0]}>
      <Caixa p={[0, 1.45, 0]} s={[1.3, 2.9, 0.9]} c={corpo} />
      <Caixa p={[0, 2.2, 0.46]} s={[1.2, 1.2, 0.04]} c={armario > 0.5 ? "#b97a44" : "#e6f6ff"} />
      <Caixa p={[0, 0.85, 0.46]} s={[1.2, 1.4, 0.04]} c={armario > 0.5 ? "#b97a44" : "#e6f6ff"} />
      <Caixa p={[0.48, 2.2, 0.5]} s={[0.06, 0.5, 0.06]} c="#6b7b8a" />
      <Caixa p={[0.48, 1.15, 0.5]} s={[0.06, 0.5, 0.06]} c="#6b7b8a" />
      {armario < 0.5 && <Rostinho p={[-0.1, 2.25, 0.5]} s={1.6} boca={boca} expr={expr} seed={21} />}
      {desligado > 0 && (
        <group>
          <Cilindro p={[0.75, 0.05, 0.3]} r={[0, 0, Math.PI / 2]} r1={0.03} h={0.6} c="#222" />
          <Caixa p={[1.1, 0.05, 0.3]} s={[0.14, 0.1, 0.12]} c="#eee" />
        </group>
      )}
      {desligado === 0 &&
        [0, 1, 2].map((i) => {
          const q = ((f + i * 12) % 36) / 36;
          return <Bola key={i} p={[-0.4 + i * 0.4, 2.95 + q * 0.6, 0.2]} raio={0.06 + q * 0.06} d={0} c="#eaf8ff" o={1 - q} />;
        })}
    </group>
  );
};

/** Termômetro gigante (o "exame"): `nivel` 0..1 do líquido; vermelho = quente, azul = frio. */
export const Termometro: React.FC<{ pos?: V3; nivel: number; cor?: string; escala?: number }> = ({ pos = [0, 0, 0], nivel, cor = "#E23B3B", escala = 1 }) => (
  <group position={pos} scale={escala}>
    <Cilindro p={[0, 1.3, 0]} r1={0.16} h={2.2} lados={10} c="#f4f8fb" o={0.85} />
    <Bola p={[0, 0.2, 0]} raio={0.3} d={1} c={cor} />
    <Cilindro p={[0, 0.3 + nivel * 1.0, 0.0]} r1={0.08} h={0.2 + nivel * 2.0} lados={8} c={cor} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Caixa key={i} p={[0.17, 0.6 + i * 0.32, 0.1]} s={[0.12, 0.03, 0.02]} c="#333" />
    ))}
  </group>
);

/** Envelope do resultado (abre a aba com `abre` 0..1 e sai um papel). */
export const Envelope: React.FC<{ pos?: V3; abre: number; escala?: number; rot?: V3 }> = ({ pos = [0, 0, 0], abre, escala = 1, rot = [0, 0, 0] }) => (
  <group position={pos} scale={escala} rotation={rot}>
    <Caixa p={[0, 0, 0]} s={[1.0, 0.62, 0.05]} c="#f2e3c4" />
    <group position={[0, 0.31, 0.03]} rotation={[-abre * 2.6, 0, 0]}>
      <mesh position={[0, -0.18, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.56, 0.36, 3]} />
        <meshStandardMaterial color="#e8d3ab" flatShading />
      </mesh>
    </group>
    {abre > 0.6 && <Caixa p={[0, 0.2 + (abre - 0.6) * 1.2, -0.01]} s={[0.86, 0.6, 0.02]} c="#ffffff" />}
    <Bola p={[0, 0.06, 0.05]} raio={0.08} d={0} c="#E23B3B" />
  </group>
);

/** Bloco de gelo transparente envolvendo alguém (o Tito congelado). `k` 0..1 cresce. */
export const BlocoGelo: React.FC<{ pos?: V3; k: number; alto?: number }> = ({ pos = [0, 0, 0], k, alto = 2.7 }) =>
  k <= 0 ? null : (
    <group position={pos}>
      <Caixa p={[0, (alto * k) / 2, 0]} s={[1.3, alto * k, 1.0]} c="#bfeaff" o={0.55} />
      <Caixa p={[-0.45, alto * k * 0.7, 0.51]} s={[0.08, alto * k * 0.4, 0.01]} c="#ffffff" o={0.7} />
    </group>
  );
