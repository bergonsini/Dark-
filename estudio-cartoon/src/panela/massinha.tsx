import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";

/**
 * PANELA DEPRESSÃO · kit "massinha de modelar" 3D: formas arredondadas com leve irregularidade (grumos),
 * sombreamento suave e brilho de massinha. Unidades: 1 ≈ 50 cm; personagens com os pés em y = 0, frente para +z.
 */
export type V3 = [number, number, number];

/** Material de massinha: cor saturada, brilho suave. */
export const Massa: React.FC<{ c: string; e?: string; brilho?: number; o?: number }> = ({ c, e, brilho = 0.42, o }) => (
  <meshStandardMaterial color={c} roughness={1 - brilho} metalness={0} emissive={e ?? "#000000"} transparent={o !== undefined} opacity={o ?? 1} />
);

const cacheGeo = new Map<string, THREE.BufferGeometry>();
/** Esfera "amassada à mão": deslocamento suave e determinístico (grumos). */
const geoGrumo = (grumo: number, seed: number) => {
  const k = `${grumo}-${seed}`;
  const c = cacheGeo.get(k);
  if (c) return c;
  const g = new THREE.SphereGeometry(1, 40, 28);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = Math.sin(x * 3.1 + seed) * Math.sin(y * 2.7 + seed * 1.3) * Math.sin(z * 3.3 + seed * 0.7) + 0.5 * Math.sin(x * 6.3 + y * 5.1 + seed);
    const s = 1 + n * grumo;
    p.setXYZ(i, x * s, y * s, z * s);
  }
  g.computeVertexNormals();
  cacheGeo.set(k, g);
  return g;
};

type Base = { p?: V3; r?: V3; c: string; e?: string; brilho?: number; o?: number };
/** Bolota de massinha (esfera grumosa), escalável em 3 eixos. */
export const Bolota: React.FC<Base & { raio?: number; esc?: V3; grumo?: number; seed?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], raio = 0.5, esc = [1, 1, 1], grumo = 0.035, seed = 1, c, e, brilho, o }) => {
  const geo = useMemo(() => geoGrumo(grumo, seed), [grumo, seed]);
  return (
    <mesh position={p} rotation={r} scale={[raio * esc[0], raio * esc[1], raio * esc[2]]} geometry={geo}>
      <Massa c={c} e={e} brilho={brilho} o={o} />
    </mesh>
  );
};
/** "Salsicha" de massinha (cápsula), usada em braços, pernas, miojo, bigode. */
export const Rolo: React.FC<Base & { raio?: number; comp?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], raio = 0.1, comp = 0.5, c, e, brilho, o }) => (
  <mesh position={p} rotation={r}>
    <capsuleGeometry args={[raio, comp, 8, 16]} />
    <Massa c={c} e={e} brilho={brilho} o={o} />
  </mesh>
);
/** Bloco de massinha com cantos arredondados (bancada, caixa, placa). */
export const Bloco: React.FC<Base & { s?: V3; raio?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], raio = 0.08, c, e, brilho, o }) => {
  const geo = useMemo(() => {
    const k = `b${s.join(",")}-${raio}`;
    const ch = cacheGeo.get(k);
    if (ch) return ch;
    const shape = new THREE.Shape();
    const w = s[0], h = s[1], rr = Math.min(raio, w / 2, h / 2);
    shape.moveTo(-w / 2 + rr, -h / 2);
    shape.lineTo(w / 2 - rr, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + rr);
    shape.lineTo(w / 2, h / 2 - rr);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - rr, h / 2);
    shape.lineTo(-w / 2 + rr, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - rr);
    shape.lineTo(-w / 2, -h / 2 + rr);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + rr, -h / 2);
    const d = Math.max(0.001, s[2] - 2 * rr);
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: rr, bevelSize: rr * 0.6, bevelSegments: 4, curveSegments: 6 });
    g.translate(0, 0, -d / 2);
    cacheGeo.set(k, g);
    return g;
  }, [s, raio]);
  return (
    <mesh position={p} rotation={r} geometry={geo}>
      <Massa c={c} e={e} brilho={brilho} o={o} />
    </mesh>
  );
};
/** Cilindro de massinha (panela, prato, chapéu). */
export const Tubo: React.FC<Base & { r1?: number; r2?: number; h?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], r1 = 0.3, r2, h = 0.3, c, e, brilho, o }) => (
  <mesh position={p} rotation={r}>
    <cylinderGeometry args={[r2 ?? r1, r1, h, 28]} />
    <Massa c={c} e={e} brilho={brilho} o={o} />
  </mesh>
);

/** Piscada automática 0..1. */
export const usePiscar = (seed = 0) => {
  const f = useCurrentFrame();
  const t = (f + seed * 41) % 110;
  return t < 5 ? Math.sin((t / 5) * Math.PI) : 0;
};

export type Expr = "feliz" | "bravo" | "chocado" | "nervoso" | "triste" | "neutro" | "nojo" | "apaixonado";
/**
 * Rosto de massinha: olhos grandes brancos com pupila e brilho, sobrancelhas de "salsicha" e boca escura.
 * Fica na frente (+z) do ponto p. `boca` 0..1 abre na fala.
 */
export const Rosto: React.FC<{ p?: V3; s?: number; boca?: number; expr?: Expr; olhar?: [number, number]; seed?: number; oculosEscuros?: boolean; olhos?: "x" | "normal" }> = ({
  p = [0, 0, 0],
  s = 1,
  boca = 0,
  expr = "feliz",
  olhar = [0, 0],
  seed = 0,
  oculosEscuros = false,
  olhos = "normal",
}) => {
  const f = useCurrentFrame();
  const pisc = usePiscar(seed);
  const ab = Math.max(boca, expr === "chocado" ? 0.8 : 0);
  const sob = { feliz: 0.15, bravo: -0.45, chocado: 0.35, nervoso: 0.3, triste: 0.35, neutro: 0, nojo: -0.25, apaixonado: 0.2 }[expr];
  const treme = expr === "nervoso" ? Math.sin(f * 1.7) * 0.01 : 0;
  const tamOlho = expr === "chocado" ? 0.13 : 0.11;
  return (
    <group position={p} scale={s}>
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 0.16 + treme, 0.08, 0]}>
          {olhos === "x" ? (
            <group position={[0, 0, 0.04]}>
              <Rolo r={[0, 0, 0.785]} raio={0.022} comp={0.14} c="#1d1a24" />
              <Rolo r={[0, 0, -0.785]} raio={0.022} comp={0.14} c="#1d1a24" />
            </group>
          ) : (
            <group scale={[1, Math.max(0.1, 1 - pisc), 1]}>
              <Bolota raio={tamOlho} esc={[1, 1.15, 0.7]} grumo={0} c="#fffdf6" brilho={0.7} />
              {expr === "apaixonado" ? (
                <Bolota p={[0, 0, tamOlho * 0.7]} raio={tamOlho * 0.55} esc={[1, 0.9, 0.5]} grumo={0} c="#e8285c" brilho={0.7} />
              ) : (
                <group position={[olhar[0] * 0.04, olhar[1] * 0.04, tamOlho * 0.66]}>
                  <Bolota raio={tamOlho * 0.5} esc={[1, 1.1, 0.5]} grumo={0} c="#1d1a24" brilho={0.8} />
                  <Bolota p={[0.025, 0.03, 0.03]} raio={0.018} grumo={0} c="#ffffff" brilho={0.9} />
                </group>
              )}
            </group>
          )}
          <Rolo p={[0, 0.17 + (l < 0 ? 0 : 0), 0.06]} r={[0, 0, Math.PI / 2 + l * sob]} raio={0.022} comp={0.12} c="#2a1c14" />
        </group>
      ))}
      {oculosEscuros && (
        <group position={[0, 0.09, 0.12]}>
          <Bloco s={[0.6, 0.18, 0.05]} raio={0.06} c="#111" brilho={0.9} />
        </group>
      )}
      {ab > 0.08 ? (
        <Bolota p={[0, -0.17, 0.06]} raio={0.09} esc={[1.1, 0.35 + ab * 0.85, 0.45]} grumo={0} c="#5a1020" />
      ) : expr === "triste" || expr === "nojo" || expr === "bravo" ? (
        <mesh position={[0, -0.22, 0.07]}>
          <torusGeometry args={[0.07, 0.022, 8, 16, Math.PI]} />
          <Massa c="#5a1020" />
        </mesh>
      ) : expr === "neutro" ? (
        <Rolo p={[0, -0.18, 0.07]} r={[0, 0, Math.PI / 2]} raio={0.018} comp={0.1} c="#5a1020" />
      ) : (
        <mesh position={[0, -0.14, 0.07]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.09, 0.024, 8, 16, Math.PI]} />
          <Massa c="#5a1020" />
        </mesh>
      )}
    </group>
  );
};

/** Luzes de estúdio de TV (quentes, com contraluz colorida). */
export const LuzesEstudio: React.FC<{ suspense?: boolean }> = ({ suspense = false }) => (
  <>
    <ambientLight intensity={suspense ? 0.45 : 0.85} />
    <hemisphereLight args={["#fff1e0", "#5a2a4a", suspense ? 0.35 : 0.6]} />
    <directionalLight position={[3, 6, 6]} intensity={suspense ? 0.9 : 1.6} color="#fff6ea" />
    <pointLight position={[-4, 3, -2]} intensity={suspense ? 14 : 8} color="#ff3fa4" distance={14} />
    <pointLight position={[4, 3, -2]} intensity={suspense ? 14 : 8} color="#3fd6ff" distance={14} />
  </>
);
