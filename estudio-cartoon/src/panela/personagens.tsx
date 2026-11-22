import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloco, Bolota, Expr, Massa, Rolo, Rosto, Tubo, V3 } from "./massinha";

/**
 * Elenco fixo do PANELA DEPRESSÃO, todo em massinha. Base comum (Boneco) + acessórios de cada um.
 * Pés em y = 0, frente para +z. Altura ≈ 2,1 unidades.
 */
type Pose = "parado" | "bracosAbertos" | "apontando" | "bracosPraCima" | "provando" | "maosNaCabeca" | "segurando";
const POSES: Record<Pose, { E: [number, number]; D: [number, number] }> = {
  // [rotação X (frente/trás), rotação Z (abre para o lado)] do ombro
  parado: { E: [0, 0.18], D: [0, -0.18] },
  bracosAbertos: { E: [0, 1.25], D: [0, -1.25] },
  apontando: { E: [0, 0.18], D: [-1.35, -0.25] },
  bracosPraCima: { E: [0, 2.6], D: [0, -2.6] },
  provando: { E: [0, 0.18], D: [-2.3, 0.35] },
  maosNaCabeca: { E: [-0.4, 2.3], D: [-0.4, -2.3] },
  segurando: { E: [-1.1, 0.25], D: [-1.1, -0.25] },
};

export type BonecoProps = {
  pos?: V3;
  rotY?: number;
  escala?: number;
  boca?: number;
  expr?: Expr;
  pose?: Pose;
  pulo?: number;
  desmaio?: number; // 0..1 desmaia de cara na mesa (cai para a frente)
  treme?: boolean;
  olhar?: [number, number];
};

type Visual = {
  pele: string;
  roupa: string;
  roupa2?: string;
  calca: string;
  sapato: string;
  corpoLargura?: number;
  seed?: number;
  cabeca?: React.ReactNode; // cabelo/chapéu (coordenadas relativas ao centro da cabeça)
  torso?: React.ReactNode; // gravata, avental etc. (relativo ao centro do tronco)
  maoD?: React.ReactNode; // objeto na mão direita
  rostoExtra?: React.ReactNode; // bigode, óculos, bochechas
  oculosEscuros?: boolean;
  olhosX?: boolean;
};

const Boneco: React.FC<BonecoProps & Visual> = ({
  pos = [0, 0, 0],
  rotY = 0,
  escala = 1,
  boca = 0,
  expr = "feliz",
  pose = "parado",
  pulo = 0,
  desmaio = 0,
  treme = false,
  olhar = [0, 0],
  pele,
  roupa,
  roupa2,
  calca,
  sapato,
  corpoLargura = 1,
  seed = 1,
  cabeca,
  torso,
  maoD,
  rostoExtra,
  oculosEscuros = false,
  olhosX = false,
}) => {
  const f = useCurrentFrame();
  const resp = Math.sin(f * 0.11 + seed) * 0.012;
  const tr = treme ? Math.sin(f * 2.2) * 0.03 : 0;
  const fala = boca * Math.sin(f * 0.8) * 0.02;
  const P = POSES[pose];
  return (
    <group position={[pos[0] + tr, pos[1] + pulo, pos[2]]} rotation={[desmaio * 0.62, rotY, 0]} scale={escala}>
      {/* pernas e sapatos */}
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 0.16 * corpoLargura, 0, 0]}>
          <Rolo p={[0, 0.38, 0]} raio={0.1} comp={0.42} c={calca} />
          <Bolota p={[0, 0.08, 0.07]} raio={0.13} esc={[1, 0.6, 1.4]} c={sapato} seed={seed + l} />
        </group>
      ))}
      {/* tronco */}
      <group position={[0, 1.0 + resp, 0]}>
        <Bolota raio={0.42} esc={[1.0 * corpoLargura, 1.05, 0.78]} c={roupa} seed={seed} />
        {roupa2 && <Bolota p={[0, -0.25, 0]} raio={0.4} esc={[1.02 * corpoLargura, 0.45, 0.8]} c={roupa2} seed={seed + 3} />}
        {torso}
      </group>
      {/* braços (pivô no ombro) */}
      {([
        [-1, P.E],
        [1, P.D],
      ] as [number, [number, number]][]).map(([l, [rx, rz]]) => (
        <group key={l} position={[l * 0.42 * corpoLargura, 1.3, 0]} rotation={[rx, 0, rz]}>
          <Rolo p={[0, -0.27, 0]} raio={0.095} comp={0.36} c={roupa} />
          <Bolota p={[0, -0.56, 0]} raio={0.11} c={pele} seed={seed + 7} />
          {l === 1 && maoD && <group position={[0, -0.62, 0.05]}>{maoD}</group>}
        </group>
      ))}
      {/* cabeça */}
      <group position={[0, 1.82 + fala, 0]}>
        <Bolota raio={0.4} esc={[1, 0.98, 0.92]} c={pele} seed={seed + 11} />
        <Bolota p={[0, -0.02, 0.37]} raio={0.07} esc={[1.1, 0.9, 0.8]} c={pele} seed={seed + 2} />
        <Rosto p={[0, 0.02, 0.3]} s={0.95} boca={boca} expr={expr} olhar={olhar} seed={seed} oculosEscuros={oculosEscuros} olhos={olhosX ? "x" : "normal"} />
        {rostoExtra}
        {cabeca}
      </group>
    </group>
  );
};

/** WANDERLEY FRITURA, o apresentador: terno laranja-fogo, topete gigante e microfone. */
export const Apresentador: React.FC<BonecoProps> = (p) => (
  <Boneco
    {...p}
    seed={2}
    pele="#e9a77c"
    roupa="#ef4a2a"
    calca="#2b2440"
    sapato="#111"
    torso={
      <>
        <Bolota p={[0, 0.12, 0.3]} raio={0.1} esc={[0.9, 1.2, 0.5]} c="#fffaf0" />
        <Rolo p={[0, 0.0, 0.34]} raio={0.045} comp={0.28} c="#ffd23f" />
      </>
    }
    maoD={
      <group rotation={[-0.4, 0, 0]}>
        <Rolo p={[0, 0.12, 0]} raio={0.035} comp={0.2} c="#222" />
        <Bolota p={[0, 0.3, 0]} raio={0.08} c="#9aa3ae" brilho={0.8} />
      </group>
    }
    cabeca={
      <>
        <Bolota p={[0, 0.28, 0.08]} raio={0.36} esc={[1, 0.55, 1]} c="#1c1410" seed={5} />
        <Bolota p={[0, 0.42, 0.28]} raio={0.24} esc={[0.9, 0.8, 1.2]} c="#1c1410" seed={6} />
      </>
    }
  />
);

/** CHEF FRANÇOIS BISTECA: dólmã branca, chapéu alto e bigode enrolado. Ofende-se com tudo. */
export const Francois: React.FC<BonecoProps> = (p) => (
  <Boneco
    {...p}
    seed={4}
    pele="#f2c9a6"
    roupa="#f7f5ee"
    calca="#2a2a2a"
    sapato="#111"
    torso={
      <>
        {[0.15, -0.05, -0.25].map((y) => (
          <Bolota key={y} p={[0.12, y, 0.32]} raio={0.035} c="#1c1c1c" />
        ))}
        <Bolota p={[0, 0.34, 0.12]} raio={0.2} esc={[1.4, 0.4, 1]} c="#e53935" />
      </>
    }
    rostoExtra={
      <group position={[0, -0.12, 0.38]}>
        <Rolo p={[-0.11, 0, 0]} r={[0, 0, 1.2]} raio={0.035} comp={0.14} c="#111" />
        <Rolo p={[0.11, 0, 0]} r={[0, 0, -1.2]} raio={0.035} comp={0.14} c="#111" />
        <Bolota p={[-0.22, 0.05, 0]} raio={0.04} c="#111" />
        <Bolota p={[0.22, 0.05, 0]} raio={0.04} c="#111" />
      </group>
    }
    cabeca={
      <group position={[0, 0.32, -0.02]}>
        <Tubo p={[0, 0.25, 0]} r1={0.3} r2={0.33} h={0.5} c="#ffffff" />
        <Bolota p={[0, 0.6, 0]} raio={0.42} esc={[1, 0.6, 1]} c="#ffffff" seed={9} />
      </group>
    }
  />
);

/** VÓ LURDINHA: coque grisalho, óculos redondos, xale rosa. Acha tudo uma delícia. */
export const Vo: React.FC<BonecoProps> = (p) => (
  <Boneco
    {...p}
    seed={6}
    pele="#eab593"
    roupa="#ff8fbf"
    roupa2="#8e5bd0"
    calca="#8e5bd0"
    sapato="#5a3a2a"
    corpoLargura={1.1}
    rostoExtra={
      <>
        {[-1, 1].map((l) => (
          <group key={l}>
            <mesh position={[l * 0.15, 0.1, 0.4]}>
              <torusGeometry args={[0.12, 0.018, 8, 24]} />
              <Massa c="#c9a227" brilho={0.8} />
            </mesh>
            <Bolota p={[l * 0.24, -0.1, 0.33]} raio={0.065} esc={[1, 0.7, 0.4]} c="#ff7aa8" />
          </group>
        ))}
      </>
    }
    cabeca={
      <>
        <Bolota p={[0, 0.22, -0.05]} raio={0.4} esc={[1.05, 0.6, 1]} c="#d9d9de" seed={8} />
        <Bolota p={[0, 0.48, -0.18]} raio={0.2} c="#cfcfd6" seed={10} />
      </>
    }
  />
);

/** JURADO MISTERIOSO: moletom preto com capuz e óculos escuros. Nunca fala. Às vezes desmaia. */
export const Misterioso: React.FC<BonecoProps> = (p) => (
  <Boneco
    {...p}
    seed={8}
    pele="#c58b62"
    roupa="#2a2833"
    calca="#1c1b22"
    sapato="#e6e6e6"
    oculosEscuros={(p.desmaio ?? 0) < 0.5}
    olhosX={(p.desmaio ?? 0) >= 0.5}
    cabeca={<Bolota p={[0, 0.06, -0.08]} raio={0.47} esc={[1.02, 1.04, 0.95]} c="#2a2833" seed={12} o={undefined} />}
  />
);

/** JUNINHO, o eterno perdedor: avental verde, boné virado e um curativo na bochecha. */
export const Juninho: React.FC<BonecoProps> = (p) => (
  <Boneco
    {...p}
    seed={10}
    pele="#c98b5e"
    roupa="#ffffff"
    roupa2="#2fb36b"
    calca="#3a6fd8"
    sapato="#e53935"
    torso={<Bloco p={[0, -0.05, 0.28]} s={[0.55, 0.6, 0.06]} raio={0.06} c="#2fb36b" />}
    rostoExtra={<Bloco p={[0.22, -0.08, 0.34]} r={[0, 0.5, 0.4]} s={[0.12, 0.05, 0.02]} raio={0.02} c="#ffd7a8" />}
    cabeca={
      <group position={[0, 0.24, 0]}>
        <Bolota raio={0.4} esc={[1, 0.45, 1]} c="#e53935" seed={14} />
        <Bolota p={[0, -0.05, -0.38]} raio={0.2} esc={[1.2, 0.25, 1]} c="#e53935" />
      </group>
    }
  />
);

/** DONA ZICA: cabelo roxo armado, avental amarelo, brincos de argola. Nunca cozinhou na vida. */
export const Zica: React.FC<BonecoProps> = (p) => (
  <Boneco
    {...p}
    seed={12}
    pele="#8d5a3c"
    roupa="#ff8a2a"
    roupa2="#ffd23f"
    calca="#3d2a5c"
    sapato="#111"
    corpoLargura={1.05}
    torso={<Bloco p={[0, -0.05, 0.29]} s={[0.55, 0.6, 0.06]} raio={0.06} c="#ffd23f" />}
    rostoExtra={
      <>
        {[-1, 1].map((l) => (
          <mesh key={l} position={[l * 0.4, -0.12, 0.05]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.07, 0.015, 8, 20]} />
            <Massa c="#ffc83d" brilho={0.85} />
          </mesh>
        ))}
      </>
    }
    cabeca={
      <>
        {[
          [0, 0.32, -0.05, 0.36],
          [-0.3, 0.18, -0.05, 0.26],
          [0.3, 0.18, -0.05, 0.26],
          [-0.2, 0.42, 0.1, 0.22],
          [0.2, 0.42, 0.1, 0.22],
          [0, 0.1, -0.3, 0.34],
        ].map(([x, y, z, r], i) => (
          <Bolota key={i} p={[x, y, z]} raio={r} c="#9b59d0" seed={20 + i} />
        ))}
      </>
    }
  />
);
