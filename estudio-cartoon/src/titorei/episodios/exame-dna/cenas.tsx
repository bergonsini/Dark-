import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Geladeira, Leite, Sorvete } from "../../objetos/Cozinha";
import { MicroOndas } from "../../objetos/MicroOndas";
import { BlocoGelo, Envelope, Freezer, Geladeirinha, Termometro } from "../../objetos/Familia";
import { MarDePipoca, PipocasPulando } from "../../objetos/Pipoca";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 8 — "O exame de DNA" (responde "quem é o pai?" do ep. 7). */

const Canvas: React.FC<{ children: React.ReactNode; fundo?: string }> = ({ children, fundo = "#7FC8A9" }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: fundo }}>
      <ThreeCanvas width={width} height={height} flat camera={{ fov: 40, position: [0, 2, 6] }}>
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
const lerp = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
type V3 = [number, number, number];
const ME = 1.3;
const ROSTO_M = 0.82 * ME;
const PF: V3 = [0.9, 0, -1.7]; // freezer
const PG: V3 = [-1.3, 0, -1.0]; // geladeira (mãe)
const PB: V3 = [0.0, 0, 0.7]; // Gelinha
const PC: V3 = [-1.0, 0, 1.7]; // capivara rainha
const PM: V3 = [2.0, 0, -0.3]; // micro-ondas
const PT: V3 = [1.3, 0, 1.2]; // Tito
const NIVEL = 0.25;

/** 1. GANCHO: "Era um FREEZER… dizendo que era o PAI!" */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const fr = wordAt(scene, "freezer…");
  const pai = wordAt(scene, "pai!");
  return (
    <>
      <Canvas fundo={f >= pai ? "#7FC8A9" : "#2A1A2E"}>
        <Luzes quente={f >= pai} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PF, 0, 9.6, 1.5, 40) },
            { f: fr, ...frente(PF, 0, 7.8, 1.8, 38), corte: true },
            { f: pai, ...frente(PF, 0, 6.2, 2.1, 34), corte: true },
          ]}
          shakes={[pai]}
        />
        <Cozinha3D />
        <Freezer pos={PF} expr={f >= pai ? "feliz" : "zen"} boca={mouth * 0} />
        <Geladeirinha pos={PB} expr="chocado" />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= pai && <Onomatopeia texto="PAPAI?!" at={pai} x={540} y={600} dur={40} cor="#FFD23F" />}
      <Sfx at={0} nome="riser" vol={0.35} />
      <Sfx at={fr} nome="tum" vol={0.45} />
      <Sfx at={pai} nome="boom" vol={0.4} />
    </>
  );
};

/** 2. NOVELA: a geladeira desmaia, o leite derruba tudo, o sorvete chora… a capivara nem pisca. */
export const Novela: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const desm = wordAt(scene, "desmaiou.");
  const tudo = wordAt(scene, "tudo.");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const cai = lerp(f, desm, desm + 10);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PG, 0.3, 6.4, 1.4, 38) },
            { f: tudo - 4, ...frente([-0.2, NIVEL, 0.2], 0, 3.6, 0.6, 36), corte: true },
            { f: l1, ...frente([0.9, NIVEL, 0.3], -0.2, 4.6, 0.7, 36), corte: true },
            { f: l2, ...frente(PC, 0.3, 5.4, 1.0, 36), corte: true },
            { f: l2 + 30, ...frente(PC, 0.3, 4.4, 0.9, 34), corte: true },
          ]}
          shakes={[desm, tudo]}
        />
        <Cozinha3D />
        <group position={PG} rotation={[0, 0.3, 0]}>
          <group rotation={[-cai * 1.3, 0, 0]}>
            <Geladeira expr={f >= desm ? "chocado" : "nervoso"} />
          </group>
        </group>
        <Freezer pos={PF} expr="feliz" />
        <group position={[-0.2, NIVEL, 0.2]} rotation={[0, 0, f >= tudo ? 1.4 : 0]}>
          <Leite expr="chocado" />
        </group>
        <Sorvete pos={[0.9, NIVEL, 0.3]} expr={f >= l1 ? "nervoso" : "feliz"} escala={1.3} />
        {f >= l1 &&
          [0, 1, 2].map((i) => {
            const q = ((f + i * 10) % 30) / 30;
            return (
              <mesh key={i} position={[0.9 + (i - 1) * 0.12, NIVEL + 0.75 - q * 0.6, 0.6]}>
                <icosahedronGeometry args={[0.05, 0]} />
                <meshStandardMaterial color="#5AA9FF" flatShading />
              </mesh>
            );
          })}
        <Capivara pos={PC} rotY={0.3} zen fechado={0.85} coroa />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= desm && f < tudo && <Onomatopeia texto="PLOFT!" at={desm} x={540} y={600} dur={tudo - desm} cor="#fff" />}
      {f >= tudo && f < l1 && <Onomatopeia texto="SPLASH!" at={tudo} x={540} y={600} dur={l1 - tudo} cor="#9fd8ff" />}
      {f >= l2 + 30 && <Placa texto="NEM PISCOU" at={l2 + 30} y={1430} />}
      <Sfx at={desm} nome="tum" vol={0.5} />
      <Sfx at={tudo} nome="borbulha" vol={0.45} />
      <Sfx at={l1} nome="boing" vol={0.35} />
    </>
  );
};

/** 3. EXAME DE DNA… ou melhor, de TEMPERATURA. Três dias; a capivara abre o envelope bem devagarinho. */
export const Exame: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const dna = wordAt(scene, "dna");
  const l1 = lineStart(scene, 1);
  const temp = wordAt(scene, "temperatura.");
  const l2 = lineStart(scene, 2);
  const tres = wordAt(scene, "três");
  const env = wordAt(scene, "envelope");
  const devag = wordAt(scene, "devagarinho.");
  const dias = Math.min(3, 1 + Math.floor(lerp(f, tres, env, 0, 2.99)));
  const abre = lerp(f, env + 10, devag + 40) * 0.55;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PC, 0.3, 5.6, 1.0, 38) },
            { f: dna, pos: [0, 2.6, 7.4], alvo: [0, 1.3, -0.4], fov: 44, corte: true },
            { f: l1, pos: [0, 2.2, 6.0], alvo: [0, 1.6, -0.4], fov: 42, corte: true },
            { f: l2, ...frente(PC, 0.3, 5.6, 1.1, 38), corte: true },
            { f: env, ...frente(PC, 0.3, 4.6, 1.0, 34), corte: true },
            { f: devag, ...frente(PC, 0.3, 3.9, 1.0, 32), corte: true },
          ]}
          shakes={[temp]}
        />
        <Cozinha3D />
        <Freezer pos={PF} expr="nervoso" />
        <MicroOndas pos={PM} rotY={-0.6} escala={ME} expr="nervoso" coroa={false} treme={f >= l1} />
        <Geladeirinha pos={PB} expr="feliz" />
        {f >= temp - 6 && f < l2 && (
          <>
            <Termometro pos={[-0.5, NIVEL, 0.2]} nivel={lerp(f, temp, temp + 30, 0, 0.35)} cor="#3a86ff" />
            <Termometro pos={[0.5, NIVEL, 0.2]} nivel={lerp(f, temp, temp + 30, 0, 0.8)} cor="#E23B3B" />
          </>
        )}
        <Capivara pos={PC} rotY={0.3} zen fechado={0.85} coroa />
        {f >= l2 && <Envelope pos={[PC[0] + 0.85, 0.5, PC[2] + 0.7]} rot={[-0.3, -0.2, 0]} abre={abre} escala={0.65} />}
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= dna && f < l1 && <Placa texto="EXAME DE DNA" at={dna} y={1430} ate={l1} />}
      {f >= temp && f < l2 && <Placa texto="DE TEMPERATURA" at={temp} y={1430} ate={l2} />}
      {f >= tres && f < env && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 150, color: "#FFD23F", WebkitTextStroke: "12px #1F1B2E", paintOrder: "stroke fill" }}>
          DIA {dias}
        </div>
      )}
      {f >= devag && <Onomatopeia texto="1 CM POR HORA" at={devag} x={540} y={620} dur={80} cor="#fff" />}
      <Sfx at={dna} nome="ding" vol={0.4} />
      <Sfx at={temp} nome="borbulha" vol={0.4} />
      <Sfx at={tres} nome="tum" vol={0.4} />
      <Sfx at={env} nome="click" vol={0.4} />
    </>
  );
};

/** 4. RESULTADO: o freezer NÃO é o pai! O pai é… o MICRO-ONDAS! E ele apita de alegria. */
export const Resultado: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const nao = wordAt(scene, "não");
  const l1 = lineStart(scene, 1);
  const mo = wordAt(scene, "micro-ondas!");
  const l2 = lineStart(scene, 2);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PF, 0, 8.6, 1.8, 40) },
            { f: nao, ...frente(PF, 0, 6.4, 2.1, 34), corte: true },
            { f: l1, pos: [0, 2.6, 7.6], alvo: [0.5, 1.3, -0.4], fov: 44, corte: true },
            { f: mo, ...frente(PM, -0.6, 6.6, ROSTO_M + 0.3, 36), corte: true },
            { f: l2, ...frente(PM, -0.6, 5.6, ROSTO_M + 0.3, 34), corte: true },
          ]}
          shakes={[nao, mo]}
        />
        <Cozinha3D />
        <Freezer pos={PF} expr={f >= nao ? "chocado" : "nervoso"} tremendo={f >= nao && f < l1} />
        <MicroOndas pos={PM} rotY={-0.6} escala={ME} expr={f >= l2 ? "feliz" : f >= mo ? "chocado" : "nervoso"} coroa={false} apito={f >= l2} girando={f >= l2} />
        <Geladeirinha pos={PB} expr={f >= mo ? "feliz" : "chocado"} pulo={f >= l2 ? Math.abs(Math.sin(f * 0.4)) * 0.15 : 0} />
        <Capivara pos={PC} rotY={0.3} zen fechado={0.85} coroa />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= nao && f < l1 && <Placa texto="NÃO É O PAI" at={nao} y={1430} />}
      {f >= mo && f < l2 && <Onomatopeia texto="MICRO-ONDAS?!" at={mo} x={540} y={600} dur={l2 - mo} cor="#FFD23F" />}
      {f >= l2 && <Onomatopeia texto="PIM PIM PIM!" at={l2} x={540} y={600} dur={60} cor="#fff" />}
      <Sfx at={nao} nome="boom" vol={0.4} />
      <Sfx at={mo} nome="tada" vol={0.45} />
      <Sfx at={l2} nome="apito" vol={0.35} />
    </>
  );
};

/** 5. FAZ SENTIDO: por isso ela ama pipoca! Meio gelada, meio quentinha: MORNA. */
export const Explica: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const pip = wordAt(scene, "pipoca!");
  const l1 = lineStart(scene, 1);
  const morna = wordAt(scene, "morna.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PB, 0, 3.2, 0.55, 36) },
            { f: pip, ...frente(PB, 0, 2.6, 0.55, 32), corte: true },
            { f: l1, pos: [0.6, 1.6, 4.0], alvo: [0.6, 0.6, 0.2], fov: 40, corte: true },
            { f: morna, ...frente(PB, 0, 2.2, 0.5, 30), corte: true },
          ]}
          shakes={[morna]}
        />
        <Cozinha3D />
        <MicroOndas pos={[1.3, 0, 0.3]} rotY={-0.4} escala={ME * 0.8} expr="feliz" coroa={false} />
        <Geladeira pos={[-1.2, 0, 0]} rotY={0.4} expr="feliz" />
        <Geladeirinha pos={PB} expr="feliz" pulo={Math.abs(Math.sin(f * 0.4)) * 0.1} />
        {f >= pip - 6 && f < l1 && <PipocasPulando de={[PB[0], 0.9, PB[2] + 0.2]} n={12} />}
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= l1 && f < morna && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 380, display: "flex", justifyContent: "space-between", fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 96, WebkitTextStroke: "10px #1F1B2E", paintOrder: "stroke fill" }}>
          <span style={{ color: "#7fd6ff" }}>❄ 50%</span>
          <span style={{ color: "#ff6b4a" }}>🔥 50%</span>
        </div>
      )}
      {f >= morna && <Placa texto="MORNA" at={morna} y={1430} />}
      <Sfx at={pip} nome="pop" vol={0.45} />
      <Sfx at={l1} nome="whoosh" vol={0.4} />
      <Sfx at={morna} nome="tum" vol={0.45} />
    </>
  );
};

/** 6. CORAÇÃO PARTIDO: o freezer desliga da tomada… e vira só um ARMÁRIO. */
export const CoracaoPartido: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const tom = wordAt(scene, "tomada…");
  const l1 = lineStart(scene, 1);
  const arm = wordAt(scene, "armário.");
  return (
    <>
      <Canvas fundo="#4b6a7a">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PF, 0, 8.6, 1.7, 40) },
            { f: tom, ...frente(PF, 0, 7.0, 1.5, 36), corte: true },
            { f: arm, ...frente(PF, 0, 8.0, 1.5, 38), corte: true },
          ]}
          shakes={[arm]}
        />
        <Cozinha3D />
        <Freezer pos={PF} expr="triste" desligado={lerp(f, tom - 6, tom + 10)} armario={lerp(f, arm - 4, arm + 6)} />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= tom && f < l1 && <Onomatopeia texto="PLOC." at={tom} x={540} y={600} dur={l1 - tom} cor="#fff" />}
      {f >= arm && <Placa texto="SÓ UM ARMÁRIO" at={arm} y={1430} />}
      <Sfx at={tom} nome="click" vol={0.5} />
      <Sfx at={arm} nome="tum" vol={0.45} />
    </>
  );
};

/** 7. FINAL (gancho do ep. 9): a Gelinha fala a primeira palavra… e CONGELA o Tito inteiro! */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const pal = wordAt(scene, "palavra…");
  const l1 = lineStart(scene, 1);
  const cong = wordAt(scene, "congelou");
  const l2 = lineStart(scene, 2);
  const proximo = wordAt(scene, "próximo");
  return (
    <>
      <Canvas fundo={f >= cong ? "#bfe6f5" : "#7FC8A9"}>
        <Luzes quente={f < cong} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PB, 0, 3.2, 0.55, 36) },
            { f: pal, ...frente(PB, 0, 2.4, 0.5, 30), corte: true },
            { f: l1, pos: [0.6, 2.0, 5.2], alvo: [0.8, 1.0, 0.8], fov: 40, corte: true },
            { f: cong, ...frente(PT, -0.3, 4.6, 1.5, 36), corte: true },
            { f: proximo, ...frente(PT, -0.3, 5.6, 1.5, 38), corte: true },
          ]}
          shakes={[cong, proximo]}
        />
        <Cozinha3D />
        <Geladeirinha pos={PB} rotY={0.4} expr={f >= pal ? "chocado" : "feliz"} boca={f >= pal - 6 && f < l1 ? 0.8 : 0} />
        <TitoRei pos={PT} rotY={-0.4} expr={f >= cong ? "chocado" : "feliz"} pose={f >= cong ? "chocado" : "acenando"} semCoroa />
        <BlocoGelo pos={PT} k={lerp(f, cong, cong + 10)} />
        {f >= cong - 6 &&
          f < cong + 14 &&
          [0, 1, 2, 3, 4].map((i) => {
            const q = (f - cong + 6) / 20;
            return (
              <mesh key={i} position={[PB[0] + q * (PT[0] - PB[0]) + (i - 2) * 0.1, 0.6 + Math.sin(q * Math.PI) * 0.5 + i * 0.05, PB[2] + q * (PT[2] - PB[2])]}>
                <icosahedronGeometry args={[0.08, 0]} />
                <meshStandardMaterial color="#ffffff" flatShading />
              </mesh>
            );
          })}
        <Capivara pos={PC} rotY={0.3} zen fechado={0.85} coroa />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= pal - 4 && f < l1 && <Onomatopeia texto="BRRR!" at={pal - 4} x={540} y={600} dur={l1 - pal + 4} cor="#7fd6ff" />}
      {f >= cong && f < l2 && <Onomatopeia texto="CONGELOU!" at={cong} x={540} y={600} dur={l2 - cong} cor="#fff" />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={pal} nome="whoosh" vol={0.4} />
      <Sfx at={cong} nome="boom" vol={0.4} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};

