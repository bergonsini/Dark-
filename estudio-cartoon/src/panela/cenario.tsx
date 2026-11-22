import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloco, Bolota, Massa, Rolo, Tubo, V3 } from "./massinha";

/** Estúdio do PANELA DEPRESSÃO em massinha: piso xadrez, parede com arcos e luzes, bancadas com fogão. */

export const Fogo: React.FC<{ p?: V3; s?: number; forte?: number }> = ({ p = [0, 0, 0], s = 1, forte = 1 }) => {
  const f = useCurrentFrame();
  return (
    <group position={p} scale={s}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        const h = (0.35 + Math.sin(f * 0.9 + i * 1.7) * 0.12) * forte;
        return (
          <group key={i} position={[Math.cos(a) * 0.12, h / 2, Math.sin(a) * 0.12]}>
            <mesh>
              <coneGeometry args={[0.09, h, 10]} />
              <Massa c="#ff7a1a" e="#ff4d00" brilho={0.6} />
            </mesh>
            <mesh position={[0, -h * 0.15, 0]}>
              <coneGeometry args={[0.05, h * 0.6, 10]} />
              <Massa c="#ffe14a" e="#ffb000" brilho={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/** Bancada de cozinha com cooktop (2 bocas) e uma panela; `fogo` liga as chamas. */
export const Bancada: React.FC<{ p?: V3; cor?: string; fogo?: number; panela?: boolean }> = ({ p = [0, 0, 0], cor = "#3fb7a8", fogo = 0, panela = true }) => (
  <group position={p}>
    <Bloco p={[0, 0.5, 0]} s={[1.5, 1.0, 0.8]} raio={0.1} c={cor} />
    <Bloco p={[0, 1.04, 0]} s={[1.62, 0.1, 0.9]} raio={0.04} c="#f4efe6" />
    {[-0.38, 0.38].map((x) => (
      <Tubo key={x} p={[x, 1.1, 0.05]} r1={0.2} h={0.03} c="#2a2a30" />
    ))}
    {fogo > 0 && <Fogo p={[-0.38, 1.1, 0.05]} s={0.8} forte={fogo} />}
    {panela && (
      <group position={[-0.38, 1.13 + (fogo > 0 ? 0.25 : 0), 0.05]}>
        <Tubo p={[0, 0.16, 0]} r1={0.26} r2={0.28} h={0.32} c="#9aa3ae" brilho={0.75} />
        <Rolo p={[0.42, 0.25, 0]} r={[0, 0, Math.PI / 2]} raio={0.035} comp={0.22} c="#1c1c1c" />
      </group>
    )}
    <Bolota p={[0.42, 1.35, 0.25]} raio={0.0001} c="#fff" />
  </group>
);

/** Estúdio: piso xadrez de massinha, parede de fundo com arcos coloridos e "lâmpadas" de camarim. */
export const Estudio: React.FC<{ suspense?: boolean }> = ({ suspense = false }) => {
  const f = useCurrentFrame();
  const tiles: React.ReactNode[] = [];
  for (let i = -5; i <= 5; i++)
    for (let j = -4; j <= 3; j++) if ((i + j) % 2 === 0) tiles.push(<Bloco key={`${i}${j}`} p={[i * 1.0, 0.005, j * 1.0]} s={[0.98, 0.02, 0.98]} raio={0.008} c="#f6e9d7" />);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 12]} />
        <Massa c={suspense ? "#5a2244" : "#e8475f"} />
      </mesh>
      {!suspense && tiles}
      <Bloco p={[0, 3, -4.2]} s={[14, 6, 0.3]} raio={0.05} c={suspense ? "#24102a" : "#5b2a86"} />
      {[-3.6, -1.2, 1.2, 3.6].map((x, i) => (
        <group key={x} position={[x, 2.6, -4.0]}>
          <mesh>
            <torusGeometry args={[0.9, 0.12, 12, 32, Math.PI]} />
            <Massa c={["#ffd23f", "#3fd6ff", "#ff3fa4", "#7cf25a"][i]} e={suspense ? "#000" : ["#5a4a00", "#00404a", "#4a002a", "#1e4a00"][i]} />
          </mesh>
          {Array.from({ length: 7 }).map((_, k) => {
            const a = (k / 6) * Math.PI;
            const aceso = (Math.floor(f / 6) + k + i) % 3 !== 0;
            return <Bolota key={k} p={[Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0.14]} raio={0.07} grumo={0} c={aceso ? "#fff7c2" : "#a99b6a"} e={aceso && !suspense ? "#ffe680" : "#000"} />;
          })}
        </group>
      ))}
    </group>
  );
};

/** Mesa dos jurados (com tecido vermelho e plaquinhas coloridas). */
export const MesaJurados: React.FC<{ p?: V3 }> = ({ p = [0, 0, 0] }) => (
  <group position={p}>
    <Bloco p={[0, 0.55, 0]} s={[3.6, 1.1, 0.8]} raio={0.1} c="#c2185b" />
    <Bloco p={[0, 1.13, 0]} s={[3.8, 0.08, 0.95]} raio={0.03} c="#f7f2ea" />
    {[-1.2, 0, 1.2].map((x, i) => (
      <Bloco key={x} p={[x, 0.65, 0.42]} s={[0.7, 0.3, 0.04]} raio={0.03} c={["#ffd23f", "#3fd6ff", "#7cf25a"][i]} />
    ))}
  </group>
);

/** Relógio gigante de parede (contagem regressiva): `p` 0..1 do ponteiro. */
export const Relogio: React.FC<{ p?: V3; prog: number }> = ({ p = [0, 0, 0], prog }) => (
  <group position={p}>
    <Tubo r={[Math.PI / 2, 0, 0]} r1={0.7} h={0.12} c="#ffffff" />
    <mesh position={[0, 0, 0.07]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.7, 0.08, 10, 40]} />
      <Massa c="#e53935" />
    </mesh>
    <group position={[0, 0, 0.1]} rotation={[0, 0, -prog * Math.PI * 2]}>
      <Rolo p={[0, 0.25, 0]} raio={0.035} comp={0.45} c="#1c1c1c" />
    </group>
    <Bolota p={[0, 0, 0.12]} raio={0.06} c="#1c1c1c" />
  </group>
);

/** Alçapão no chão (o eliminado cai). `abre` 0..1. */
export const Alcapao: React.FC<{ p?: V3; abre: number }> = ({ p = [0, 0, 0], abre }) => (
  <group position={p}>
    <Tubo p={[0, 0.012, 0]} r1={0.75 * abre} h={0.01} c="#0a0508" />
    {abre > 0.05 && (
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75 * abre, 0.85 * abre, 40]} />
        <Massa c="#ffd23f" />
      </mesh>
    )}
  </group>
);
