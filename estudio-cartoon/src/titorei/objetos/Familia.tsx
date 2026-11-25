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

/**
 * PANELA DE PRESSÃO (a "verdadeira rainha"): corpo prateado, tampa com alça, válvula que apita e gira.
 * `apito` 0..1 intensidade (vapor + tremor + válvula girando); `inchada` 0..1 estufa (vai explodir?); `coroa` antiga.
 */
export const PanelaPressao: React.FC<{ pos?: V3; rotY?: number; escala?: number; expr?: Expr; boca?: number; apito?: number; inchada?: number; coroa?: boolean; semTampa?: boolean; chora?: boolean }> = ({
  pos = [0, 0, 0],
  rotY = 0,
  escala = 1,
  expr = "bravo",
  boca = 0,
  apito = 0,
  inchada = 0,
  coroa = false,
  semTampa = false,
  chora = false,
}) => {
  const f = useCurrentFrame();
  const tr = apito > 0 ? Math.sin(f * 2.6) * 0.025 * apito : 0;
  const inf = 1 + inchada * 0.25;
  return (
    <group position={[pos[0] + tr, pos[1], pos[2]]} rotation={[0, rotY, tr * 2]} scale={escala}>
      <group scale={[inf, 1 + inchada * 0.12, inf]}>
        <Cilindro p={[0, 0.5, 0]} r1={0.62} r2={0.6} h={1.0} lados={14} c={inchada > 0.6 ? "#d98c8c" : "#c9d0d8"} />
        {!semTampa && <Cilindro p={[0, 1.05, 0]} r1={0.66} r2={0.5} h={0.14} lados={14} c="#aeb7c0" />}
        {semTampa && <Cilindro p={[0, 1.0, 0]} r1={0.56} r2={0.56} h={0.02} lados={14} c="#7a4a2a" />}
      </group>
      {chora &&
        [-1, 1].map((l) =>
          [0, 1].map((i) => {
            const q = ((f + i * 12 + (l > 0 ? 6 : 0)) % 24) / 24;
            return <Bola key={`${l}${i}`} p={[l * 0.32, 0.62 - q * 0.6, 0.66 * inf]} raio={0.06} d={0} c="#7fd6ff" o={1 - q * 0.6} />;
          }),
        )}
      <Caixa p={[0.95, 0.85, 0]} s={[0.75, 0.12, 0.16]} c="#2b2b2b" />
      <Caixa p={[-0.85, 0.85, 0]} s={[0.4, 0.12, 0.16]} c="#2b2b2b" />
      <group visible={!semTampa} position={[0, 1.18 + inchada * 0.1, 0]} rotation={[0, apito > 0 ? f * 0.9 * apito : 0, 0]}>
        <Cilindro p={[0, 0.06, 0]} r1={0.07} h={0.14} lados={8} c="#555" />
        <Caixa p={[0, 0.16, 0]} s={[0.22, 0.05, 0.05]} c="#333" />
      </group>
      {apito > 0 &&
        [0, 1, 2, 3].map((i) => {
          const q = ((f * (1 + apito) + i * 8) % 30) / 30;
          return <Bola key={i} p={[Math.sin(i * 2.1) * 0.15 * q, 1.35 + q * 1.1 * (0.6 + apito), Math.cos(i * 1.3) * 0.1]} raio={0.09 + q * 0.18} d={0} c="#f4f8fb" o={(1 - q) * 0.9} />;
        })}
      <Rostinho p={[0, 0.55, 0.62 * inf]} s={1.5} boca={boca} expr={expr} seed={33} />
      {coroa && (
        <group position={[0, 1.45 + inchada * 0.1, 0]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.22, 0.12, Math.sin((i / 5) * Math.PI * 2) * 0.22]}>
              <coneGeometry args={[0.07, 0.28, 4]} />
              <meshStandardMaterial color="#b8952a" flatShading />
            </mesh>
          ))}
          <Cilindro p={[0, 0, 0]} r1={0.28} h={0.08} lados={10} c="#b8952a" />
        </group>
      )}
    </group>
  );
};

/** Caixa de pizza aberta (ou fechada) com a pizza. */
export const CaixaPizza: React.FC<{ pos?: V3; aberta?: number; escala?: number; rotY?: number }> = ({ pos = [0, 0, 0], aberta = 1, escala = 1, rotY = 0 }) => (
  <group position={pos} scale={escala} rotation={[0, rotY, 0]}>
    <Caixa p={[0, 0.05, 0]} s={[0.9, 0.1, 0.9]} c="#d9b07a" />
    <Cilindro p={[0, 0.12, 0]} r1={0.4} h={0.04} lados={14} c="#f2b632" />
    {[[0.15, 0.1], [-0.12, 0.18], [0.05, -0.17], [-0.2, -0.05], [0.22, -0.12]].map(([x, z], i) => (
      <Cilindro key={i} p={[x, 0.15, z]} r1={0.06} h={0.02} lados={8} c="#c62828" />
    ))}
    <group position={[0, 0.1, -0.45]} rotation={[-aberta * 1.9, 0, 0]}>
      <Caixa p={[0, 0, 0.45]} s={[0.9, 0.04, 0.9]} c="#e2bd86" />
    </group>
  </group>
);

/** Prato de feijão (com vapor). */
export const PratoFeijao: React.FC<{ pos?: V3; escala?: number; congelado?: boolean }> = ({ pos = [0, 0, 0], escala = 1, congelado = false }) => {
  const f = useCurrentFrame();
  return (
    <group position={pos} scale={escala}>
      <Cilindro p={[0, 0.04, 0]} r1={0.4} r2={0.32} h={0.08} lados={14} c="#ffffff" />
      <Cilindro p={[0, 0.1, 0]} r1={0.3} h={0.06} lados={14} c={congelado ? "#bfe6f5" : "#5a2e1a"} />
      {!congelado &&
        [0, 1].map((i) => {
          const q = ((f + i * 15) % 30) / 30;
          return <Bola key={i} p={[(i - 0.5) * 0.2, 0.2 + q * 0.5, 0]} raio={0.05 + q * 0.06} d={0} c="#f4f8fb" o={1 - q} />;
        })}
    </group>
  );
};

/** Tampa da panela de pressão sozinha (vira a "coroa de alumínio" do Tito). Origem na base da tampa. */
export const TampaPanela: React.FC<{ pos?: V3; rot?: V3; escala?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], escala = 1 }) => (
  <group position={pos} rotation={rot} scale={escala}>
    <Cilindro p={[0, 0.07, 0]} r1={0.66} r2={0.5} h={0.14} lados={14} c="#c9d0d8" />
    <Cilindro p={[0, 0.2, 0]} r1={0.07} h={0.14} lados={8} c="#555" />
    <Caixa p={[0.7, 0.08, 0]} s={[0.5, 0.1, 0.14]} c="#2b2b2b" />
  </group>
);

/** Mapa do tesouro de papel (low-poly), com o X vermelho. `abre` 0..1 desenrola. */
export const MapaTesouro: React.FC<{ pos?: V3; rot?: V3; escala?: number; abre?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], escala = 1, abre = 1 }) => (
  <group position={pos} rotation={rot} scale={escala}>
    <Caixa p={[0, 0, 0]} s={[1.2 * Math.max(0.15, abre), 0.9, 0.02]} c="#F2DFB4" />
    {abre > 0.6 && (
      <>
        <Caixa p={[-0.3, 0.15, 0.02]} s={[0.4, 0.04, 0.01]} c="#8a6a3a" />
        <Caixa p={[-0.1, -0.15, 0.02]} s={[0.04, 0.4, 0.01]} c="#8a6a3a" />
        <Caixa p={[0.3, 0.05, 0.02]} s={[0.3, 0.06, 0.01]} c="#E8282B" r={[0, 0, 0.785]} />
        <Caixa p={[0.3, 0.05, 0.02]} s={[0.3, 0.06, 0.01]} c="#E8282B" r={[0, 0, -0.785]} />
      </>
    )}
  </group>
);
