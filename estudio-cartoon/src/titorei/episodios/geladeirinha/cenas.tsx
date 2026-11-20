import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { CuboGelo, Geladeira, Leite } from "../../objetos/Cozinha";
import { Porta } from "../../objetos/Clima";
import { MicroOndas } from "../../objetos/MicroOndas";
import { CascaOvo, Congelada, MarDePipoca, OvoGigante, PipocasPulando, SilhuetaFreezer } from "../../objetos/Pipoca";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Caixa, Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 7 — "Nasceu a geladeirinha" (responde "o que vai nascer do ovo?" do ep. 6). */

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
const mola = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 9, stiffness: 180 } });
type V3 = [number, number, number];
const ME = 1.3;
const ROSTO_M = 0.82 * ME;
const PM: V3 = [1.6, 0, -1.0];
const PG: V3 = [-1.1, 0, -1.0];
const PB: V3 = [0.2, 0, 0.6]; // bebê
const PC: V3 = [-0.9, 0, 1.6];
const PT: V3 = [1.2, 0, 0.8];
const EB = 0.38; // escala da geladeirinha
const NIVEL = 0.3;

/** A GELADEIRINHA: geladeira bebê (escala pequena) com chupeta. */
const Geladeirinha: React.FC<{ pos?: V3; rotY?: number; expr?: "feliz" | "bravo" | "chocado" | "nervoso" | "zen" | "triste"; boca?: number; pulo?: number; tremendo?: boolean }> = ({
  pos = PB,
  rotY = 0,
  expr = "feliz",
  boca = 0,
  pulo = 0,
  tremendo = false,
}) => (
  <group position={[pos[0], pos[1] + pulo, pos[2]]} rotation={[0, rotY, 0]} scale={EB}>
    <Geladeira expr={expr} boca={boca} cor="#DFF3FF" tremendo={tremendo} bracos={1} />
    <Caixa p={[0, 1.2, 0.62]} s={[0.36, 0.22, 0.08]} c="#FF7AB6" />
  </group>
);

/** 1. GANCHO: o ovo rachou… e nasceu uma GELADEIRINHA! */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const nasceu = wordAt(scene, "nasceu");
  const gel = wordAt(scene, "geladeirinha!");
  const s = mola(f, gel - 4);
  return (
    <>
      <Canvas fundo={f >= gel ? "#7FC8A9" : "#2A1A2E"}>
        <Luzes quente={f >= gel} />
        <CameraRig
          keys={[
            { f: 0, ...frente([0, 0, -0.2], 0, 9.0, 1.9, 40) },
            { f: nasceu, ...frente([0, 0, -0.2], 0, 7.2, 1.9, 36), corte: true },
            { f: gel, ...frente(PB, 0, 2.6, 0.55, 34), corte: true },
          ]}
          shakes={[nasceu, gel]}
        />
        <Cozinha3D />
        {f < gel - 4 ? <OvoGigante pos={[0, 0, -0.2]} escala={1.3} racha={lerp(f, 0, nasceu, 0.5, 1)} treme /> : <CascaOvo pos={[0, 0, -0.6]} escala={1.2} abre={s} />}
        {f >= gel - 4 && (
          <group scale={[1, 0.6 + 0.4 * s, 1]} position={[0, 0, 0]}>
            <Geladeirinha pos={PB} expr="feliz" pulo={Math.abs(Math.sin(f * 0.3)) * 0.1} />
          </group>
        )}
        <MarDePipoca nivel={NIVEL} n={50} />
      </Canvas>
      {f >= nasceu && f < gel && <Onomatopeia texto="CREC CREC!" at={nasceu} x={540} y={600} dur={gel - nasceu} cor="#fff" />}
      {f >= gel && <Placa texto="GELADEIRINHA!" at={gel} y={1430} />}
      <Sfx at={0} nome="click" vol={0.5} />
      <Sfx at={nasceu} nome="click" vol={0.6} />
      <Sfx at={gel - 4} nome="pop" vol={0.6} />
      <Sfx at={gel} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 2. MAMÃE: ela chama a geladeira de mamãe; a geladeira chora… cubos de gelo. */
export const Mamae: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const mae = wordAt(scene, "mamãe!");
  const l1 = lineStart(scene, 1);
  const gelo = wordAt(scene, "gelo.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.2, 2.2, 7.2], alvo: [-0.4, 1.0, -0.2], fov: 44 },
            { f: mae, ...frente(PB, -0.5, 2.4, 0.6, 32), corte: true },
            { f: l1, ...frente(PG, 0.3, 6.6, 1.5, 38), corte: true },
            { f: gelo, ...frente(PG, 0.3, 5.4, 1.7, 34), corte: true },
          ]}
          shakes={[mae]}
        />
        <Cozinha3D />
        <Geladeira pos={PG} rotY={0.3} expr={f >= l1 ? "triste" : "chocado"} boca={f >= l1 ? 0.3 : 0} />
        <Geladeirinha rotY={-0.5} expr="feliz" boca={f >= mae - 10 && f < l1 ? 0.7 : 0} pulo={f >= mae && f < mae + 10 ? 0.12 : 0} />
        {f >= l1 &&
          [0, 1, 2, 3, 4, 5].map((i) => {
            const q = ((f - l1 + i * 7) % 24) / 24;
            return <CuboGelo key={i} pos={[PG[0] + (i % 2 ? 0.35 : -0.35) * 0.9, 1.9 - q * 1.6, PG[2] + 0.75]} />;
          })}
        <MarDePipoca nivel={NIVEL} n={50} />
      </Canvas>
      {f >= mae && f < l1 && <Onomatopeia texto="MAMÃE!" at={mae} x={540} y={600} dur={l1 - mae} cor="#FF7AB6" />}
      {f >= gelo && <Placa texto="LÁGRIMA DE GELO" at={gelo} y={1430} />}
      <Sfx at={mae} nome="boing" vol={0.45} />
      <Sfx at={l1} nome="borbulha" vol={0.35} />
      <Sfx at={gelo} nome="click" vol={0.4} />
    </>
  );
};

/** 3. FOME: bebê geladeira come gelo, MUITO gelo… e congela a cozinha inteira. O leite vira picolé. */
export const Fome: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const muito = wordAt(scene, "muito");
  const l1 = lineStart(scene, 1);
  const cong = wordAt(scene, "congelou");
  const l2 = lineStart(scene, 2);
  const pic = wordAt(scene, "picolé.");
  const k = lerp(f, cong - 4, cong + 26, 0, 1);
  return (
    <>
      <Canvas fundo={k > 0.5 ? "#BFE6F5" : "#7FC8A9"}>
        <Luzes quente={k < 0.5} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PB, 0, 2.6, 0.55, 34) },
            { f: muito, ...frente(PB, 0, 2.0, 0.5, 30), corte: true },
            { f: l1, pos: [0, 2.6, 8.0], alvo: [0, 1.2, -0.4], fov: 46, corte: true },
            { f: l2, ...frente([-0.4, NIVEL, 1.4], 0.2, 3.6, 0.7, 34), corte: true },
          ]}
          shakes={[muito, cong, pic]}
        />
        <Cozinha3D />
        <Geladeira pos={PG} rotY={0.3} expr={k > 0.5 ? "chocado" : "feliz"} />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={k > 0.5 ? "chocado" : "feliz"} coroa={false} />
        <Geladeirinha expr="feliz" boca={f < l1 ? Math.abs(Math.sin(f * 0.6)) : 0} />
        {f < cong &&
          [0, 1, 2].map((i) => {
            const q = ((f + i * 9) % 26) / 26;
            return <CuboGelo key={i} pos={[PB[0] + 0.6 - q * 0.6, 0.6 + Math.sin(q * Math.PI) * 0.5, PB[2] + 0.3]} />;
          })}
        <group position={[-0.4, NIVEL, 1.4]}>
          <Leite expr={f >= l2 ? "chocado" : "nervoso"} />
          {f >= l2 && (
            <>
              <Caixa p={[0, 0.5, 0]} s={[0.55, 1.05, 0.55]} c="#BFE9FF" o={0.55} />
              <Caixa p={[0, -0.15, 0]} s={[0.08, 0.35, 0.08]} c="#E8C29A" />
            </>
          )}
        </group>
        <Congelada k={k} />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= muito && f < l1 && <Onomatopeia texto="NHAC NHAC NHAC!" at={muito} x={540} y={600} dur={l1 - muito} cor="#fff" />}
      {f >= cong && f < l2 && <Onomatopeia texto="BRRRR!" at={cong} x={540} y={600} dur={l2 - cong} cor="#4FC3F7" />}
      {f >= pic && <Placa texto="PICOLÉ DE LEITE" at={pic} y={1430} />}
      <Sfx at={muito} nome="pop" vol={0.4} />
      <Sfx at={cong} nome="whoosh" vol={0.5} />
      <Sfx at={pic} nome="tum" vol={0.45} />
    </>
  );
};

/** 4. MINISTRO AO RESGATE: o micro-ondas tenta esquentar tudo… estoura pipoca de NOVO; a bebê pede BIS. */
export const Microondas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const esq = wordAt(scene, "esquentar");
  const novo = wordAt(scene, "novo.");
  const l2 = lineStart(scene, 2);
  const bis = wordAt(scene, "bis!");
  const k = lerp(f, esq, novo, 1, 0.2);
  return (
    <>
      <Canvas fundo="#9FD8D0">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, -0.3, 7.0, ROSTO_M + 0.3, 36) },
            { f: esq, ...frente(PM, -0.3, 6.0, ROSTO_M + 0.25, 34), corte: true },
            { f: novo, pos: [0, 2.6, 8.0], alvo: [0.3, 1.3, -0.4], fov: 46, corte: true },
            { f: l2, ...frente(PB, 0, 2.6, 0.55, 34), corte: true },
            { f: bis, ...frente(PB, 0, 2.0, 0.5, 30), corte: true },
          ]}
          shakes={[novo, bis]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={f >= novo ? "chocado" : "bravo"} girando={f >= esq} apito={f >= esq && f < novo} coroa={false} />
        <Geladeira pos={PG} rotY={0.3} expr="feliz" />
        <Geladeirinha expr="feliz" boca={f >= bis - 6 ? 0.8 : 0} pulo={f >= l2 ? Math.abs(Math.sin(f * 0.5)) * 0.15 : 0} />
        {f >= novo - 6 && <PipocasPulando de={[PM[0] - 0.2, 1.2, PM[2] + 0.6]} n={22} forca={1.3} />}
        <Congelada k={k} />
        <MarDePipoca nivel={NIVEL + (f >= novo ? 0.2 : 0)} n={60} />
      </Canvas>
      {f >= esq && f < novo && <Onomatopeia texto="ESQUENTANDO…" at={esq} x={540} y={600} dur={novo - esq} cor="#FF8A2B" />}
      {f >= novo && f < l2 && <Onomatopeia texto="POC POC POC!" at={novo} x={540} y={600} dur={l2 - novo} cor="#FFD23F" />}
      {f >= bis && <Onomatopeia texto="BIS!" at={bis} x={540} y={600} dur={60} cor="#FF7AB6" />}
      <Sfx at={esq} nome="apito" vol={0.3} />
      <Sfx at={novo} nome="pop" vol={0.5} />
      <Sfx at={novo + 6} nome="pop" vol={0.4} />
      <Sfx at={bis} nome="tada" vol={0.4} />
    </>
  );
};

/** 5. BATISMO REAL: a rainha capivara escolhe o nome… bem devagarinho. Três dias. GELINHA. */
export const Batismo: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const devag = wordAt(scene, "devagarinho.");
  const l1 = lineStart(scene, 1);
  const tres = wordAt(scene, "três");
  const nome = wordAt(scene, "gelinha.");
  const dias = tres >= 0 ? Math.min(3, Math.floor(lerp(f, tres - 2, tres + 20, 1, 3.99))) : 1;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PC, 0.2, 4.2, 1.0, 36) },
            { f: devag, ...frente(PC, 0.2, 3.0, 0.9, 32), corte: true },
            { f: l1, pos: [0, 2.2, 7.4], alvo: [-0.3, 1.0, 0.6], fov: 44, corte: true },
            { f: nome, ...frente(PB, 0, 2.6, 0.55, 34), corte: true },
          ]}
          shakes={[nome]}
        />
        <Cozinha3D />
        <Capivara pos={PC} rotY={0.4} zen fechado={0.9} coroa boca={f >= l1 && f >= nome - 4 ? mouth : 0} />
        <Geladeirinha expr={f >= nome ? "feliz" : "zen"} pulo={f >= nome ? Math.abs(Math.sin(f * 0.5)) * 0.15 : 0} />
        <Geladeira pos={PG} rotY={0.3} expr="feliz" />
        <MarDePipoca nivel={NIVEL} n={50} />
      </Canvas>
      {f >= devag && f < l1 && <Placa texto="1 LETRA POR DIA" at={devag} y={1430} ate={l1} />}
      {f >= tres && f < nome && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 150, color: "#FFD23F", WebkitTextStroke: "12px #1F1B2E", paintOrder: "stroke fill" }}>
          DIA {dias}
        </div>
      )}
      {f >= nome && <Placa texto="GELINHA" at={nome} y={1430} />}
      <Sfx at={devag} nome="click" vol={0.35} />
      <Sfx at={tres} nome="tum" vol={0.4} />
      <Sfx at={nome} nome="tada" vol={0.5} />
    </>
  );
};

/** 6. VAGA DE BABÁ: o Tito ganha mais um cargo. Trocar fralda de geladeira = degelar. Sem salário. */
export const Baba: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const baba = wordAt(scene, "babá.");
  const l1 = lineStart(scene, 1);
  const deg = wordAt(scene, "degelar.");
  const l2 = lineStart(scene, 2);
  const sal = wordAt(scene, "salário.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PT, -0.3, 5.4, 1.6, 38) },
            { f: baba, ...frente(PT, -0.3, 4.0, 1.7, 34), corte: true },
            { f: l1, ...frente(PB, 0, 2.8, 0.55, 34), corte: true },
            { f: deg, ...frente(PB, 0, 2.2, 0.5, 30), corte: true },
            { f: l2, ...frente(PT, -0.3, 4.6, 1.7, 36), corte: true },
            { f: sal, ...frente(PT, -0.3, 3.6, 1.75, 32), corte: true },
          ]}
          shakes={[baba, sal]}
        />
        <Cozinha3D />
        <TitoRei pos={PT} rotY={-0.4} expr={f >= l2 ? "triste" : f >= baba ? "chocado" : "neutro"} pose={f >= baba && f < l2 ? "bracosPraCima" : "parado"} semCoroa />
        <Geladeirinha expr={f >= deg ? "feliz" : "nervoso"} tremendo={f >= l1 && f < deg} />
        {f >= deg &&
          [0, 1, 2, 3].map((i) => {
            const q = ((f - deg + i * 8) % 30) / 30;
            return (
              <mesh key={i} position={[PB[0] - 0.2 + i * 0.13, 0.5 - q * 0.4, PB[2] + 0.3]}>
                <icosahedronGeometry args={[0.04, 0]} />
                <meshStandardMaterial color="#4FC3F7" flatShading />
              </mesh>
            );
          })}
        <Capivara pos={PC} rotY={0.4} zen fechado={0.9} coroa />
        <MarDePipoca nivel={NIVEL} n={50} />
      </Canvas>
      <Placa texto="TITO: MINISTRO DO PIRUÁ + BABÁ" at={baba} y={1430} ate={l1} />
      {f >= deg && f < l2 && <Onomatopeia texto="PLIC PLIC" at={deg} x={540} y={600} dur={l2 - deg} cor="#4FC3F7" />}
      {f >= sal && <Placa texto="SALÁRIO: R$ 0,00" at={sal} y={1430} />}
      <Sfx at={baba} nome="tum" vol={0.4} />
      <Sfx at={deg} nome="borbulha" vol={0.35} />
      <Sfx at={sal} nome="tum" vol={0.45} />
    </>
  );
};

/** 7. FINAL (gancho do ep. 8): se a geladeira é a mãe… quem é o PAI? Toc toc: um FREEZER na porta. */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const pai = wordAt(scene, "pai?");
  const l2 = lineStart(scene, 2);
  const porta = wordAt(scene, "porta.");
  const proximo = wordAt(scene, "próximo");
  const PP: V3 = [1.6, 0, -2.6];
  const abre = f >= porta + 10;
  return (
    <>
      <Canvas fundo="#2A1A2E">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PG, 0.3, 4.4, 1.6, 36) },
            { f: l1, ...frente(PB, 0, 2.4, 0.55, 32), corte: true },
            { f: pai, ...frente(PB, 0, 1.8, 0.5, 28), corte: true },
            { f: l2, ...frente(PP, -0.2, 9.0, 1.5, 44), corte: true },
            { f: proximo, ...frente(PP, -0.2, 7.0, 1.6, 42), corte: true },
          ]}
          shakes={[pai, porta, proximo]}
        />
        <Cozinha3D />
        <Geladeira pos={PG} rotY={0.3} expr={f >= l1 ? "nervoso" : "feliz"} />
        <Geladeirinha expr={f >= pai ? "chocado" : "feliz"} />
        {!abre && <Porta pos={[PP[0], 0, -2.88]} batida={porta} />}
        {abre && <SilhuetaFreezer pos={[PP[0], 0, PP[2] + 0.4 * mola(f, porta + 10)]} escala={1.0} />}
        <Capivara pos={PC} rotY={0.4} zen fechado={0.9} coroa />
        <MarDePipoca nivel={NIVEL} n={50} />
      </Canvas>
      {f >= pai && f < l2 && <Onomatopeia texto="?!" at={pai} x={540} y={600} dur={l2 - pai} cor="#FFD23F" />}
      {f >= porta && f < porta + 20 && <Onomatopeia texto="TOC TOC!" at={porta} x={540} y={600} dur={20} cor="#fff" />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={pai} nome="tum" vol={0.5} />
      <Sfx at={porta} nome="tum" vol={0.4} />
      <Sfx at={porta + 8} nome="tum" vol={0.4} />
      <Sfx at={porta + 12} nome="riser" vol={0.35} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
