import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloco, Bolota, Massa, Rolo, Rosto, Tubo, V3 } from "./massinha";
import { Fogo } from "./cenario";

/** Ingredientes e pratos absurdos em massinha. */

export const Miojo: React.FC<{ p?: V3; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => (
  <group position={p} scale={s}>
    <Bloco s={[0.55, 0.16, 0.4]} raio={0.06} c="#f2c14e" />
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} position={[-0.22 + i * 0.09, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.016, 6, 12]} />
        <Massa c="#f7d37a" />
      </mesh>
    ))}
  </group>
);
export const Chiclete: React.FC<{ p?: V3; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => (
  <group position={p} scale={s}>
    <Bolota raio={0.22} esc={[1.2, 0.8, 1]} c="#ff7ac0" brilho={0.7} seed={31} />
    <Bolota p={[0.15, 0.18, 0.05]} raio={0.14} c="#ffa3d4" brilho={0.8} seed={32} />
  </group>
);
export const Sardinha: React.FC<{ p?: V3; s?: number; rot?: number }> = ({ p = [0, 0, 0], s = 1, rot = 0 }) => (
  <group position={p} scale={s} rotation={[0, 0, rot]}>
    <Bolota raio={0.25} esc={[1.8, 0.6, 0.5]} c="#8aa6c1" brilho={0.75} seed={33} />
    <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <coneGeometry args={[0.16, 0.22, 4]} />
      <Massa c="#6c87a2" />
    </mesh>
    <Bolota p={[0.3, 0.05, 0.1]} raio={0.04} grumo={0} c="#fff" />
    <Bolota p={[0.31, 0.05, 0.13]} raio={0.02} grumo={0} c="#111" />
  </group>
);
export const Gelatina: React.FC<{ p?: V3; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => {
  const f = useCurrentFrame();
  const j = 1 + Math.sin(f * 0.6) * 0.06;
  return (
    <group position={p} scale={s}>
      <group scale={[2 - j, j, 2 - j]}>
        <Bloco p={[0, 0.2, 0]} s={[0.45, 0.4, 0.45]} raio={0.12} c="#8e3bd6" o={0.82} brilho={0.9} />
      </group>
      <Bolota p={[0, 0.48, 0]} raio={0.06} c="#e53935" brilho={0.8} />
    </group>
  );
};

/** Caixa misteriosa: tampa abre (`abre` 0..1) e sai um brilho; dentro, os 4 ingredientes sobem em sequência (`sobe` 0..4). */
export const CaixaMisteriosa: React.FC<{ p?: V3; abre: number; sobe: number }> = ({ p = [0, 0, 0], abre, sobe }) => {
  const itens = [<Miojo key="m" s={1.4} />, <Chiclete key="c" s={1.3} />, <Sardinha key="s" s={1.1} />, <Gelatina key="g" s={1.3} />];
  return (
    <group position={p}>
      <Bloco p={[0, 0.4, 0]} s={[1.3, 0.8, 1.0]} raio={0.08} c="#1d1a2e" />
      {[-0.3, 0.3].map((x) => (
        <Bloco key={x} p={[x, 0.4, 0.5]} s={[0.12, 0.82, 0.04]} raio={0.02} c="#ffd23f" />
      ))}
      <group position={[0, 0.82, -0.5]} rotation={[-abre * 1.9, 0, 0]}>
        <Bloco p={[0, 0, 0.5]} s={[1.36, 0.12, 1.06]} raio={0.05} c="#2a2440" />
      </group>
      {abre > 0.3 && <Bolota p={[0, 0.9, 0]} raio={0.45} esc={[1, 0.3, 0.8]} c="#fff6b0" e="#ffd23f" o={0.55} />}
      {itens.map((it, i) => {
        const k = Math.max(0, Math.min(1, sobe - i));
        if (k <= 0) return null;
        const xs = [-1.05, -0.35, 0.35, 1.05][i];
        return (
          <group key={i} position={[xs * k, 0.9 + k * 0.9 - Math.abs(xs) * 0.15 * k, 0.2]} rotation={[0, 0, Math.sin(i + k * 3) * 0.2]}>
            {it}
          </group>
        );
      })}
    </group>
  );
};

/** Liquidificador batendo (Juninho). `liga` treme e gira; conteúdo cinza-rosado. */
export const Liquidificador: React.FC<{ p?: V3; s?: number; liga?: boolean }> = ({ p = [0, 0, 0], s = 1, liga = false }) => {
  const f = useCurrentFrame();
  const t = liga ? Math.sin(f * 2.4) * 0.03 : 0;
  return (
    <group position={[p[0] + t, p[1], p[2]]} scale={s} rotation={[0, 0, t * 2]}>
      <Bloco p={[0, 0.15, 0]} s={[0.5, 0.3, 0.5]} raio={0.06} c="#e53935" />
      <Tubo p={[0, 0.6, 0]} r1={0.2} r2={0.27} h={0.6} c="#dff3ff" o={0.55} brilho={0.9} />
      <Tubo p={[0, 0.48, 0]} r1={0.19} r2={0.23} h={0.36} c="#b78aa0" />
      {liga && <Bolota p={[0, 0.98, 0]} raio={0.16} esc={[1, 0.5, 1]} c="#b78aa0" />}
    </group>
  );
};

/** Prato do Juninho: "Mousse de Sardinha com Chiclete Flambado" (com fogo em cima!). */
export const PratoMousse: React.FC<{ p?: V3; s?: number; fogo?: boolean }> = ({ p = [0, 0, 0], s = 1, fogo = true }) => (
  <group position={p} scale={s}>
    <Tubo p={[0, 0.03, 0]} r1={0.55} r2={0.6} h={0.06} c="#ffffff" brilho={0.8} />
    <Bolota p={[0, 0.22, 0]} raio={0.34} esc={[1, 0.6, 1]} c="#c9a19a" seed={41} />
    <Bolota p={[-0.1, 0.42, 0.05]} raio={0.12} c="#ff7ac0" brilho={0.8} seed={42} />
    <group position={[0.22, 0.4, 0]} rotation={[0, 0, 0.9]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.18, 4]} />
        <Massa c="#6c87a2" />
      </mesh>
    </group>
    {fogo && <Fogo p={[0, 0.45, 0]} s={0.6} />}
  </group>
);

/** Prato da Dona Zica: "Miojo Sentimental ao Molho de Gelatina" (o miojo tem carinha triste). */
export const PratoMiojo: React.FC<{ p?: V3; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <group position={p} scale={s}>
      <Tubo p={[0, 0.03, 0]} r1={0.55} r2={0.6} h={0.06} c="#ffffff" brilho={0.8} />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.2, 0.15, Math.sin(a) * 0.2]} rotation={[Math.PI / 2, 0, a]}>
            <torusGeometry args={[0.12, 0.03, 8, 16]} />
            <Massa c="#f7d37a" />
          </mesh>
        );
      })}
      <Bolota p={[0, 0.2, 0]} raio={0.24} esc={[1, 0.35, 1]} c="#8e3bd6" o={0.85} brilho={0.9} />
      <Rosto p={[0, 0.26, 0.22]} s={0.55} expr="triste" seed={5} />
      <Bolota p={[0.18, 0.22 - ((f % 30) / 30) * 0.15, 0.3]} raio={0.03} grumo={0} c="#7fd6ff" />
    </group>
  );
};

/** Garfo com um pedaço de comida (para os jurados provarem). */
export const Garfo: React.FC<{ p?: V3; r?: V3; s?: number; comida?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, comida = "#c9a19a" }) => (
  <group position={p} rotation={r} scale={s}>
    <Rolo p={[0, 0, 0]} raio={0.025} comp={0.4} c="#c9d0dc" brilho={0.85} />
    <Bolota p={[0, 0.3, 0]} raio={0.08} c={comida} />
  </group>
);
