import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../config";
import { Bola, Caixa, Cilindro, Cone, Rostinho } from "../lowpoly";

type V3 = [number, number, number];

/** Geladeira com rosto: porta abre (abertura 0..1), pode tremer de frio, usar óculos escuros e andar. */
export const Geladeira: React.FC<{
  pos?: V3;
  rotY?: number;
  rotZ?: number;
  boca?: number;
  expr?: "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste";
  abertura?: number;
  tremendo?: boolean;
  oculos?: number;
  andando?: boolean;
}> = ({ pos = [0, 0, 0], rotY = 0, rotZ = 0, boca = 0, expr = "feliz", abertura = 0, tremendo = false, oculos = 0, andando = false }) => {
  const f = useCurrentFrame();
  const tx = tremendo ? Math.sin(f * 2.3) * 0.03 : 0;
  const passo = andando ? Math.sin(f * 0.4) : 0;
  const pe = andando ? 0.35 : 0;
  return (
    <group position={[pos[0] + tx, pos[1] + pe + Math.abs(passo) * 0.06, pos[2]]} rotation={[0, rotY, rotZ + passo * 0.05]}>
      {andando &&
        [-1, 1].map((l) => (
          <group key={l} position={[l * 0.3, 0, 0]} rotation={[l * passo * 0.6, 0, 0]}>
            <Caixa p={[0, -0.18, 0]} s={[0.14, 0.36, 0.14]} c="#9AA3B5" />
            <Caixa p={[0, -0.36, 0.06]} s={[0.22, 0.08, 0.3]} c={P.tenis} />
          </group>
        ))}
      <Caixa p={[0, 1.1, 0]} s={[1.1, 2.2, 0.9]} c="#EEF3F8" />
      {/* porta com dobradiça à esquerda */}
      <group position={[-0.55, 1.1, 0.46]} rotation={[0, -abertura * 1.9, 0]}>
        <Caixa p={[0.55, 0, 0.03]} s={[1.1, 2.18, 0.08]} c="#F7FAFC" />
        <Caixa p={[1.0, 0.25, 0.1]} s={[0.06, 0.6, 0.06]} c="#9AA3B5" />
        <Rostinho p={[0.55, 0.45, 0.08]} s={1.6} boca={boca} expr={expr} seed={2} />
        {oculos > 0 && (
          <group position={[0.55, 0.58, 0.3]} scale={oculos}>
            <Caixa p={[-0.22, 0, 0]} s={[0.4, 0.3, 0.05]} c={P.preto} />
            <Caixa p={[0.22, 0, 0]} s={[0.4, 0.3, 0.05]} c={P.preto} />
            <Caixa p={[0, 0.08, 0]} s={[0.12, 0.05, 0.05]} c={P.preto} />
            <Caixa p={[-0.3, 0.07, 0.03]} s={[0.1, 0.05, 0.02]} c="#FFFFFF" />
          </group>
        )}
      </group>
      {/* interior (aparece com a porta aberta) */}
      <Caixa p={[0, 1.1, 0.35]} s={[0.98, 2.05, 0.2]} c="#CFE6FF" />
      {[0.6, 1.2, 1.7].map((y) => (
        <Caixa key={y} p={[0, y, 0.4]} s={[0.96, 0.03, 0.2]} c="#B7CFEA" />
      ))}
    </group>
  );
};

/** Caixinha de leite com rosto (suando quando nervosa). */
export const Leite: React.FC<{ pos?: V3; rotY?: number; boca?: number; expr?: "feliz" | "nervoso" | "chocado" | "zen" | "triste"; escala?: number }> = ({ pos = [0, 0, 0], rotY = 0, boca = 0, expr = "nervoso", escala = 1 }) => {
  const f = useCurrentFrame();
  const gota = ((f % 30) / 30) * 0.4;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa p={[0, 0.4, 0]} s={[0.45, 0.8, 0.45]} c={P.branco} />
      <Caixa p={[0, 0.25, 0.23]} s={[0.45, 0.3, 0.02]} c="#3A86FF" />
      <mesh position={[0, 0.93, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.33, 0.26, 4]} />
        <meshStandardMaterial color={P.branco} flatShading />
      </mesh>
      <Rostinho p={[0, 0.55, 0.235]} s={0.85} boca={boca} expr={expr} seed={5} />
      {expr === "nervoso" && <Bola p={[0.2, 0.75 - gota, 0.26]} raio={0.04} d={0} c="#8FD3FF" />}
    </group>
  );
};

/** Fatia de queijo (prisma) com rosto; `medita` faz flutuar de olhos fechados. */
export const Queijo: React.FC<{ pos?: V3; rotY?: number; medita?: boolean; boca?: number }> = ({ pos = [0, 0, 0], rotY = 0, medita = false, boca = 0 }) => {
  const f = useCurrentFrame();
  const fl = medita ? 0.25 + Math.sin(f * 0.08) * 0.08 : 0;
  return (
    <group position={[pos[0], pos[1] + fl, pos[2]]} rotation={[0, rotY, 0]}>
      {/* fatia triangular deitada: a face triangular (com rosto e furinhos) fica de frente (+z) */}
      <Cilindro p={[0, 0.25, 0]} r={[-Math.PI / 2, 0, 0]} r1={0.5} h={0.5} lados={3} c="#FFD23F" />
      {[
        [0.16, 0.08, 0.04],
        [-0.17, 0.1, 0.035],
        [0.0, 0.5, 0.03],
      ].map(([x, y, rr], i) => (
        <Bola key={i} p={[x, y, 0.255]} raio={rr} d={0} esc={[1, 1, 0.3]} c="#E0A800" />
      ))}
      <Rostinho p={[0, 0.2, 0.26]} s={0.55} boca={boca} expr={medita ? "zen" : "feliz"} seed={8} />
    </group>
  );
};

/** Bloco de manteiga com bracinhos; `ioga` faz a pose da árvore (equilibrado numa ponta). */
export const Manteiga: React.FC<{ pos?: V3; ioga?: number }> = ({ pos = [0, 0, 0], ioga = 0 }) => {
  const f = useCurrentFrame();
  const bal = Math.sin(f * 0.1) * 0.06 * ioga;
  return (
    <group position={pos} rotation={[0, 0, ioga * 0.35 + bal]}>
      <Caixa p={[0, 0.25, 0]} s={[0.7, 0.4, 0.4]} c="#FFEB99" />
      <Caixa p={[0, 0.25, 0.21]} s={[0.7, 0.14, 0.02]} c="#3A86FF" />
      <Rostinho p={[0, 0.3, 0.22]} s={0.6} expr={ioga > 0.5 ? "zen" : "feliz"} seed={9} />
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 0.3, 0.42, 0]} rotation={[0, 0, l * (-0.3 - ioga * 2.4)]}>
          <Caixa p={[0, 0.18, 0]} s={[0.06, 0.36, 0.06]} c="#E8D38A" />
        </group>
      ))}
    </group>
  );
};

/** Cubo de gelo que derrete (0 = inteiro, 1 = poça). */
export const CuboGelo: React.FC<{ pos?: V3; derrete?: number }> = ({ pos = [0, 0, 0], derrete = 0 }) => {
  const k = Math.max(0, 1 - derrete);
  return (
    <group position={pos}>
      {k > 0.05 && <Caixa p={[0, 0.15 * k, 0]} r={[0, 0.4, 0]} s={[0.3 * (0.6 + 0.4 * k), 0.3 * k, 0.3 * (0.6 + 0.4 * k)]} c="#CFF0FF" o={0.85} />}
      <Cilindro p={[0, 0.005, 0]} r1={0.12 + derrete * 0.35} h={0.01} lados={10} c="#8FD3FF" o={0.7} />
    </group>
  );
};

/** Pequeno conjunto de bancada (balcão + pia) para a cozinha. */
export const Bancada: React.FC<{ pos?: V3 }> = ({ pos = [0, 0, 0] }) => (
  <group position={pos}>
    <Caixa p={[0, 0.5, 0]} s={[2.4, 1, 0.8]} c="#C98B5E" />
    <Caixa p={[0, 1.03, 0]} s={[2.5, 0.08, 0.9]} c="#EFE6D6" />
    <Cilindro p={[0.6, 1.25, -0.2]} r1={0.04} h={0.4} c="#9AA3B5" />
    <Cone p={[-0.7, 1.25, 0]} raio={0.15} h={0.35} lados={6} c={P.verde} />
  </group>
);
