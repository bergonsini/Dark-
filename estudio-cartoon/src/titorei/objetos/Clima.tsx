import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Bola, Caixa, Cilindro, Cone, Rostinho } from "../lowpoly";

type V3 = [number, number, number];
const hash = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Nuvem funcionária: flutua, pode escurecer (tempestade), dançar e mudar de expressão. Centro em pos. */
export const Nuvem: React.FC<{
  pos?: V3;
  escala?: number;
  escura?: number;
  expr?: "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste";
  boca?: number;
  danca?: number;
  espirro?: number;
}> = ({ pos = [0, 2.5, 0], escala = 1, escura = 0, expr = "feliz", boca = 0, danca = 0, espirro = 0 }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(1, escura));
  const cor = `rgb(${Math.round(245 - 150 * k)},${Math.round(248 - 145 * k)},${Math.round(255 - 130 * k)})`;
  const bob = Math.sin(f * 0.08) * 0.08;
  const sway = Math.sin(f * 0.3) * 0.35 * danca;
  const inf = 1 + espirro * 0.25;
  return (
    <group position={[pos[0] + sway, pos[1] + bob, pos[2]]} scale={[escala * inf, escala * (2 - inf), escala]} rotation={[0, 0, sway * 0.4]}>
      {[
        [0, 0, 0, 0.55],
        [-0.55, -0.1, 0, 0.42],
        [0.55, -0.1, 0, 0.45],
        [-0.25, 0.32, -0.05, 0.4],
        [0.3, 0.3, -0.05, 0.38],
        [-0.95, -0.2, -0.05, 0.3],
        [0.95, -0.2, -0.05, 0.3],
      ].map(([x, y, z, r], i) => (
        <Bola key={i} p={[x, y, z]} raio={r} d={1} c={cor} />
      ))}
      <Rostinho p={[0, -0.02, 0.5]} s={1.1} boca={boca} expr={expr} seed={13} />
    </group>
  );
};

/** Chuva: gotas (caixinhas finas) caindo numa área (centro, largura, profundidade), de uma altura. */
export const Chuva: React.FC<{ centro?: V3; largura?: number; prof?: number; altura?: number; intensidade?: number; cor?: string; velocidade?: number }> = ({
  centro = [0, 0, 0],
  largura = 2,
  prof = 1,
  altura = 2.5,
  intensidade = 1,
  cor = "#5AA9FF",
  velocidade = 1,
}) => {
  const f = useCurrentFrame();
  const n = Math.round(60 * intensidade);
  return (
    <group position={centro}>
      {Array.from({ length: n }).map((_, i) => {
        const x = (hash(i, 1) - 0.5) * largura;
        const z = (hash(i, 2) - 0.5) * prof;
        const y = altura - ((f * 0.22 * velocidade + hash(i, 3) * altura) % altura);
        return <Caixa key={i} p={[x, y, z]} s={[0.03, 0.22, 0.03]} c={cor} o={0.85} />;
      })}
    </group>
  );
};

/** Raio em zigue-zague (aparece só no frame `at` por alguns frames). */
export const Raio: React.FC<{ pos?: V3; at: number; dur?: number; escala?: number }> = ({ pos = [0, 2, 0], at, dur = 6, escala = 1 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const seg: [number, number, number][] = [
    [0, 0, 0.3],
    [0.15, -0.35, -0.5],
    [-0.1, -0.7, 0.4],
    [0.1, -1.05, -0.4],
  ];
  return (
    <group position={pos} scale={escala}>
      {seg.map(([x, y, r], i) => (
        <Caixa key={i} p={[x, y, 0]} r={[0, 0, r]} s={[0.1, 0.42, 0.06]} c="#FFE066" e="#806000" />
      ))}
    </group>
  );
};

/** Arco-íris low-poly (meio toro em faixas). mostra 0..1 faz o arco "crescer". */
export const ArcoIris: React.FC<{ pos?: V3; raio?: number; mostra?: number; rotY?: number }> = ({ pos = [0, 0, 0], raio = 2.2, mostra = 1, rotY = 0 }) => {
  const cores = ["#E23B3B", "#FF8C42", "#FFD23F", "#3DDC84", "#3A86FF", "#8E5CF7"];
  const k = Math.max(0.001, Math.min(1, mostra));
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {cores.map((c, i) => (
        <mesh key={c} rotation={[0, 0, 0]}>
          <torusGeometry args={[raio - i * 0.12, 0.06, 4, 24, Math.PI * k]} />
          <meshStandardMaterial color={c} flatShading />
        </mesh>
      ))}
    </group>
  );
};

/** Vaso com planta que cresce (0..1); pode segurar uma plaquinha. */
export const Vaso: React.FC<{ pos?: V3; cresce?: number; rosto?: boolean; expr?: "feliz" | "triste" | "chocado" }> = ({ pos = [0, 0, 0], cresce = 0, rosto = true, expr = "feliz" }) => {
  const f = useCurrentFrame();
  const h = 0.3 + cresce * 1.5;
  const sw = Math.sin(f * 0.1) * 0.05;
  return (
    <group position={pos}>
      <Cilindro p={[0, 0.2, 0]} r1={0.22} r2={0.28} h={0.4} lados={7} c="#C9683A" />
      <group rotation={[0, 0, sw]}>
        <Cilindro p={[0, 0.4 + h / 2, 0]} r1={0.04} h={h} lados={5} c="#2FA36B" />
        {[0.3, 0.55, 0.8].map((k, i) => (
          <Cone key={i} p={[(i % 2 ? 1 : -1) * 0.15, 0.4 + h * k, 0]} r={[0, 0, (i % 2 ? -1 : 1) * 1.1]} raio={0.1 + cresce * 0.06} h={0.3 + cresce * 0.15} lados={4} c="#3DDC84" />
        ))}
        <Bola p={[0, 0.45 + h, 0]} raio={0.16 + cresce * 0.12} d={1} c="#FF7AB6" />
        {rosto && <Rostinho p={[0, 0.45 + h, 0.16 + cresce * 0.12]} s={0.45 + cresce * 0.3} expr={expr} seed={17} />}
      </group>
    </group>
  );
};

/** Nota musical 3D (bolinha + haste + bandeirinha) que sobe e balança. */
export const NotaMusical: React.FC<{ pos: V3; at?: number; cor?: string }> = ({ pos, at = 0, cor = "#1F1B2E" }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  const sobe = (t % 60) / 60;
  return (
    <group position={[pos[0] + Math.sin(t * 0.2) * 0.15, pos[1] + sobe * 1.2, pos[2]]} rotation={[0, 0, Math.sin(t * 0.15) * 0.3]} scale={1 - sobe * 0.4}>
      <Bola raio={0.09} d={0} esc={[1.3, 1, 1]} c={cor} />
      <Caixa p={[0.09, 0.2, 0]} s={[0.03, 0.4, 0.03]} c={cor} />
      <Caixa p={[0.15, 0.36, 0]} r={[0, 0, -0.5]} s={[0.14, 0.04, 0.03]} c={cor} />
    </group>
  );
};

/** Porta (na parede) que treme quando batem (toc toc). */
export const Porta: React.FC<{ pos?: V3; rotY?: number; batida?: number }> = ({ pos = [0, 0, 0], rotY = 0, batida = -999 }) => {
  const f = useCurrentFrame();
  const t = f - batida;
  const treme = t >= 0 && t < 24 && Math.floor(t / 6) % 2 === 0 ? Math.sin(t * 3) * 0.02 : 0;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Caixa p={[treme, 1.05, 0]} s={[1.0, 2.1, 0.1]} c="#8A4B2A" />
      <Caixa p={[treme, 1.05, 0.06]} s={[0.8, 1.9, 0.02]} c="#A0603A" />
      <Bola p={[0.35 + treme, 1.0, 0.09]} raio={0.05} d={0} c={P.ouro} />
    </group>
  );
};

/** Caixa misteriosa de entrega que faz TIC-TAC (treme no ritmo). */
export const CaixaMisterio: React.FC<{ pos?: V3; escala?: number }> = ({ pos = [0, 0, 0], escala = 1 }) => {
  const f = useCurrentFrame();
  const tic = Math.floor(f / 15) % 2 === 0;
  const pulo = (f % 15) < 3 ? 0.05 : 0;
  return (
    <group position={[pos[0], pos[1] + pulo, pos[2]]} scale={escala} rotation={[0, 0, tic ? 0.04 : -0.04]}>
      <Caixa p={[0, 0.3, 0]} s={[0.7, 0.6, 0.6]} c="#C99A5E" />
      <Caixa p={[0, 0.3, 0.31]} s={[0.12, 0.62, 0.02]} c="#B07A43" />
      <Caixa p={[0, 0.61, 0]} s={[0.12, 0.02, 0.62]} c="#B07A43" />
      <Caixa p={[0, 0.3, 0.32]} s={[0.36, 0.2, 0.01]} c={P.branco} />
      <Caixa p={[-0.06, 0.3, 0.33]} s={[0.04, 0.12, 0.01]} c={P.preto} />
      <Caixa p={[0.06, 0.3, 0.33]} s={[0.04, 0.12, 0.01]} c={P.preto} />
    </group>
  );
};
