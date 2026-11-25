import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Geladeira, Leite, Mesa, Queijo } from "../../objetos/Cozinha";
import { MicroOndas } from "../../objetos/MicroOndas";
import { RelogioGerente } from "../../objetos/Relogio";
import { BlocoGelo, Geladeirinha, MapaTesouro, PanelaPressao, TampaPanela } from "../../objetos/Familia";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Bola, Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 11 — "A coroa de tampa" (responde "a panela vai explodir?" do ep. 10). */

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
const PP: V3 = [0.9, 0, -0.6]; // panela
const PM: V3 = [-1.6, 0, -0.9]; // micro-ondas
const PT: V3 = [1.7, 0, 1.2]; // Tito
const PG: V3 = [-2.6, 0, -2.0]; // geladeira (mamãe)
const PMESA: V3 = [-1.3, 0, 0.9];
const NIVEL = 0.86; // tampo da mesa
const ROSTO_P = 0.55;

/** Nuvem de vapor saindo de um ponto (bolas brancas subindo e abrindo). `forca` 0..1. */
const Vapor: React.FC<{ de: V3; f: number; forca: number; n?: number }> = ({ de, f, forca, n = 10 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const q = ((f * 1.4 + i * (40 / n)) % 40) / 40;
      const a = i * 2.4;
      return <Bola key={i} p={[de[0] + Math.cos(a) * q * 2.2 * forca, de[1] + q * 3.2 * forca, de[2] + Math.sin(a) * q * 1.2 * forca]} raio={0.15 + q * 0.6 * forca} d={0} c="#f4f8fb" o={(1 - q) * 0.95} />;
    })}
  </>
);

/** 1. GANCHO: "A panela de pressão ia EXPLODIR! E ninguém sabia desligar." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const expl = wordAt(scene, "explodir!");
  const l1 = lineStart(scene, 1);
  const desl = wordAt(scene, "desligar.");
  return (
    <>
      <Canvas fundo="#4a1a1a">
        <Luzes quente />
        <CameraRig
          keys={[
            { f: 0, ...frente(PP, 0, 6.0, ROSTO_P + 0.5, 34) },
            { f: expl, ...frente(PP, 0, 4.6, ROSTO_P + 0.6, 30), corte: true },
            { f: l1, pos: [0.2, 2.6, 7.8], alvo: [0.4, 1.0, -0.2], fov: 46, corte: true },
            { f: desl, ...frente(PT, -0.5, 4.4, 1.9, 30), corte: true },
          ]}
          shakes={[0, expl, l1]}
          amp={0.12}
        />
        <Cozinha3D />
        <PanelaPressao pos={PP} expr="bravo" apito={1.5} inchada={1} />
        {f >= l1 && <TitoRei pos={PT} rotY={-0.5} expr="chocado" pose={f >= desl ? "pensando" : "chocado"} semCoroa />}
        <MicroOndas pos={PM} rotY={0.4} escala={ME} expr="chocado" coroa={false} treme />
      </Canvas>
      {f < l1 && <Onomatopeia texto="FIIIIIIU!" at={0} x={540} y={600} dur={l1} cor="#fff" />}
      {f >= desl && <Placa texto="CADÊ O BOTÃO?" at={desl} y={1430} />}
      <Sfx at={0} nome="apito" vol={0.45} />
      <Sfx at={expl} nome="boom" vol={0.3} />
      <Sfx at={desl} nome="tum" vol={0.45} />
    </>
  );
};

/** 2. PÂNICO: relógio acorda "EVACUAR!", o leite sua até virar IOGURTE, a Gelinha congela de medo. */
export const Panico: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const ev = wordAt(scene, "evacuar!");
  const l1 = lineStart(scene, 1);
  const iog = wordAt(scene, "iogurte.");
  const l2 = lineStart(scene, 2);
  const cong = wordAt(scene, "congelou");
  const PR: V3 = [-0.6, NIVEL, 0.7];
  const PL: V3 = [-1.7, NIVEL, 0.9];
  const PB: V3 = [0.6, 0, 1.5];
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PR, 0, 3.6, 0.5, 30) },
            { f: ev, ...frente(PR, 0, 2.6, 0.5, 28), corte: true },
            { f: l1, ...frente(PL, 0, 2.6, 0.4, 28), corte: true },
            { f: iog, ...frente(PL, 0, 2.0, 0.35, 26), corte: true },
            { f: l2, ...frente(PB, 0, 3.6, 0.6, 30), corte: true },
            { f: cong, ...frente(PB, 0, 3.0, 0.6, 28), corte: true },
          ]}
          shakes={[ev, iog, cong]}
        />
        <Cozinha3D />
        <Mesa pos={PMESA} />
        <RelogioGerente pos={PR} escala={0.8} toca={f >= ev - 6} dorme={f < ev - 10} expr="chocado" boca={f < l1 ? mouth : 0} pulo={f >= ev && f < ev + 10 ? 0.3 : 0} />
        <group position={PL} rotation={[0, 0, f >= iog ? 0.3 : 0]}>
          <Leite expr={f >= iog ? "zen" : "nervoso"} />
        </group>
        <Geladeirinha pos={PB} expr="chocado" tremendo={f < cong} />
        {f >= cong && <BlocoGelo pos={PB} k={lerp(f, cong, cong + 8)} alto={1.0} />}
        <PanelaPressao pos={PP} expr="bravo" apito={1.2} inchada={1} />
      </Canvas>
      {f >= ev && f < l1 && <Onomatopeia texto="EVACUAR!!" at={ev} x={540} y={560} dur={l1 - ev} cor="#FF6B6B" />}
      {f >= iog && f < l2 && <Placa texto="IOGURTE" at={iog} y={1430} />}
      {f >= cong && <Onomatopeia texto="CRECK!" at={cong} x={540} y={560} dur={40} cor="#BFE6FF" />}
      <Sfx at={ev - 6} nome="alarme" vol={0.3} />
      <Sfx at={iog} nome="pop" vol={0.45} />
      <Sfx at={cong} nome="click" vol={0.5} />
    </>
  );
};

/** 3. OPERAÇÃO CALMA: só a rainha capivara não correu… vai até a panela bem devagarinho. 1 cm por hora. */
export const CapivaraCena: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const nao = wordAt(scene, "não");
  const l1 = lineStart(scene, 1);
  const dev = wordAt(scene, "devagarinho.");
  const cm = wordAt(scene, "centímetro");
  const end = scene.endFrame - scene.startFrame;
  const pc: V3 = [-1.2 + lerp(f, l1, end, 0, 0.25), 0, 0.2];
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(pc, 0.3, 4.4, 0.8, 32) },
            { f: nao, ...frente(pc, 0.3, 4.6, 0.9, 30), corte: true },
            { f: l1, pos: [-0.2, 2.4, 6.8], alvo: [-0.1, 0.9, -0.2], fov: 44, corte: true },
            { f: dev, ...frente(pc, 1.2, 3.6, 0.6, 30), corte: true },
            { f: cm, pos: [-0.2, 2.4, 6.8], alvo: [-0.1, 0.9, -0.2], fov: 44, corte: true },
          ]}
          shakes={[]}
        />
        <Cozinha3D />
        <Capivara pos={pc} rotY={0.9} zen fechado={0.85} coroa />
        <PanelaPressao pos={PP} expr="bravo" apito={1.2} inchada={1} />
        {f >= l1 && f < dev && <TitoRei pos={PT} rotY={-0.6} expr="chocado" pose="bracosPraCima" semCoroa />}
      </Canvas>
      {f >= nao && f < l1 && <Placa texto="ZEN TOTAL" at={nao} y={1430} />}
      {f >= cm && <Placa texto="1 CM POR HORA" at={cm} y={1430} />}
      {f >= dev && f < cm && <Onomatopeia texto="… … …" at={dev} x={540} y={600} dur={cm - dev} cor="#fff" rot={0} />}
      <Sfx at={nao} nome="ding" vol={0.35} />
      <Sfx at={l1} nome="apito" vol={0.3} />
      <Sfx at={cm} nome="tum" vol={0.4} />
    </>
  );
};

/** 4. O ABRAÇO: chegou e abraçou a panela. PSSSSH: soltou todo o vapor de uma vez. */
export const Abraco: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const abr = wordAt(scene, "abraço");
  const l1 = lineStart(scene, 1);
  const vap = wordAt(scene, "vapor");
  const pc: V3 = [PP[0] - 1.1, 0, PP[2] + 0.4];
  const solta = f >= vap ? lerp(f, vap, vap + 10) : 0;
  return (
    <>
      <Canvas fundo={f >= vap ? "#dfe8e4" : "#7FC8A9"}>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.2, 2.2, 5.6], alvo: [0.3, 0.9, -0.3], fov: 40 },
            { f: abr, ...frente([PP[0] - 0.5, 0, PP[2]], 0, 5.8, 0.8, 34, 0.7), corte: true },
            { f: l1, ...frente(PP, 0, 4.4, ROSTO_P + 0.5, 32), corte: true },
            { f: vap, pos: [0.4, 2.4, 6.0], alvo: [0.6, 1.5, -0.5], fov: 46, corte: true },
          ]}
          shakes={[vap]}
          amp={0.1}
        />
        <Cozinha3D />
        <Capivara pos={pc} rotY={1.3} zen fechado={0.9} coroa />
        <PanelaPressao pos={PP} expr={f >= vap ? "zen" : f >= abr ? "chocado" : "bravo"} apito={f >= vap ? 0 : 1.0} inchada={f >= vap ? 1 - solta : 1} />
        {f >= vap && <Vapor de={[PP[0], 1.3, PP[2]]} f={f} forca={1} n={14} />}
      </Canvas>
      {f >= abr && f < l1 && <Onomatopeia texto="AWN ♥" at={abr} x={540} y={600} dur={l1 - abr} cor="#FF7AB6" rot={6} />}
      {f >= vap && <Onomatopeia texto="PSSSSSSHHH!" at={vap} x={540} y={600} dur={60} cor="#fff" />}
      <Sfx at={abr} nome="pop" vol={0.4} />
      <Sfx at={vap} nome="whoosh" vol={0.6} />
      <Sfx at={vap + 2} nome="borbulha" vol={0.4} />
    </>
  );
};

/** 5. SAUNA REAL: a cozinha virou sauna; o queijo adorou (meditando no vapor). */
export const Sauna: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const qj = wordAt(scene, "queijo");
  const ad = wordAt(scene, "adorou.");
  return (
    <>
      <Canvas fundo="#e9efec">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.4, 7.2], alvo: [0, 1.1, 0], fov: 46 },
            { f: qj, ...frente([PMESA[0], NIVEL, PMESA[2]], 0, 2.6, 0.5, 28), corte: true },
            { f: ad, ...frente([PMESA[0], NIVEL, PMESA[2]], 0.4, 2.0, 0.5, 26), corte: true },
          ]}
        />
        <Cozinha3D />
        <Mesa pos={PMESA} />
        <Queijo pos={[PMESA[0], NIVEL + 0.25 + Math.sin(f * 0.1) * 0.05, PMESA[2]]} medita />
        <TitoRei pos={PT} rotY={-0.6} expr="triste" pose="parado" semCoroa molhado />
        <PanelaPressao pos={PP} expr="zen" semTampa={false} />
        <Vapor de={[0, 0.2, 0]} f={f} forca={1.6} n={16} />
      </Canvas>
      <AbsoluteFill style={{ background: "rgba(255,255,255,.35)", pointerEvents: "none" }} />
      <Onomatopeia texto="SAUNA!" at={4} x={540} y={600} dur={qj - 4} cor="#FF8C42" />
      {f >= ad && <Placa texto="O QUEIJO ADOROU" at={ad} y={1430} />}
      <Sfx at={4} nome="borbulha" vol={0.35} />
      <Sfx at={ad} nome="ding" vol={0.4} />
    </>
  );
};

/** 6. COROA DE TAMPA: a tampa voa, gira… e cai na cabeça do Tito. Coroa de novo! De alumínio. */
export const CoroaCena: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const voou = wordAt(scene, "voou,");
  const girou = wordAt(scene, "girou…");
  const tito = wordAt(scene, "tito!");
  const l1 = lineStart(scene, 1);
  const alu = wordAt(scene, "alumínio.");
  const k = lerp(f, voou, tito, 0, 1);
  const cab: V3 = [PT[0], 2.42, PT[2]];
  const tp: V3 = f < voou ? [PP[0], 1.1, PP[2]] : [PP[0] + (cab[0] - PP[0]) * k, 1.1 + Math.sin(k * Math.PI) * 2.6 + (cab[1] - 1.1) * k, PP[2] + (cab[2] - PP[2]) * k];
  const naCabeca = f >= tito;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PP, 0, 4.6, 0.9, 32) },
            { f: voou, pos: [-1.2, 2.6, 7.6], alvo: [1.2, 2.0, 0.2], fov: 50, corte: true },
            { f: tito, ...frente(PT, -0.5, 4.0, 2.0, 30), corte: true },
            { f: l1, ...frente(PT, -0.5, 3.0, 2.1, 28), corte: true },
            { f: alu, ...frente(PT, -0.5, 4.6, 1.6, 32), corte: true },
          ]}
          shakes={[tito]}
        />
        <Cozinha3D />
        <PanelaPressao pos={PP} expr="chocado" semTampa={f >= voou} />
        <TampaPanela pos={naCabeca ? cab : tp} rot={naCabeca ? [0, 0, -0.12] : [k * 6, k * 12, 0]} escala={naCabeca ? 0.62 : 1} />
        <TitoRei pos={PT} rotY={-0.5} expr={naCabeca ? (f >= l1 ? "animado" : "chocado") : "chocado"} pose={f >= l1 ? "bracosPraCima" : "chocado"} semCoroa />
      </Canvas>
      {f >= girou && f < tito && <Onomatopeia texto="FLIU FLIU FLIU" at={girou} x={540} y={560} dur={tito - girou} cor="#fff" />}
      {f >= tito && f < l1 && <Onomatopeia texto="PLONC!" at={tito} x={540} y={560} dur={l1 - tito} cor="#FFD23F" />}
      {f >= alu && <Placa texto="COROA DE ALUMÍNIO" at={alu} y={1430} />}
      <Sfx at={voou} nome="whoosh" vol={0.5} />
      <Sfx at={tito} nome="boing" vol={0.5} />
      <Sfx at={l1} nome="tada" vol={0.4} />
    </>
  );
};

/** 7. OBRIGADO, PANELA: chorou (40 anos de feijão e ninguém disse obrigado); todos agradecem e ela para de apitar. */
export const Obrigado: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const chor = wordAt(scene, "chorou:");
  const obg = wordAt(scene, "obrigado.");
  const l1 = lineStart(scene, 1);
  const agr = wordAt(scene, "agradeceu.");
  const parou = wordAt(scene, "parou");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PP, 0, 4.4, ROSTO_P + 0.4, 30) },
            { f: obg, ...frente(PP, 0, 3.4, ROSTO_P + 0.4, 28), corte: true },
            { f: l1, pos: [0, 2.6, 8.0], alvo: [0.1, 1.0, 0], fov: 50, corte: true },
            { f: parou, ...frente(PP, 0, 4.0, ROSTO_P + 0.5, 30), corte: true },
          ]}
          shakes={[agr]}
        />
        <Cozinha3D />
        <PanelaPressao pos={PP} expr={f >= agr ? "feliz" : "triste"} semTampa chora={f >= chor && f < parou} />
        {f >= l1 && (
          <>
            <TitoRei pos={PT} rotY={-0.5} expr="feliz" pose="acenando" semCoroa />
            <TampaPanela pos={[PT[0], 2.42, PT[2]]} rot={[0, 0, -0.12]} escala={0.62} />
            <Capivara pos={[-0.4, 0, 1.4]} rotY={0.4} zen fechado={0.85} coroa />
            <MicroOndas pos={PM} rotY={0.4} escala={ME} expr="feliz" coroa={false} />
            <Geladeirinha pos={[0.3, 0, 1.9]} expr="feliz" pulo={Math.abs(Math.sin(f * 0.4)) * 0.1} />
            <Geladeira pos={PG} rotY={0.5} expr="feliz" cor="#E8C29A" />
          </>
        )}
      </Canvas>
      {f >= chor && f < obg && <Placa texto="40 ANOS DE FEIJÃO" at={chor} y={1430} />}
      {f >= agr && f < parou && <Onomatopeia texto="OBRIGADO!" at={agr} x={540} y={560} dur={parou - agr} cor="#FFD23F" />}
      {f >= parou && <Onomatopeia texto="♥" at={parou} x={540} y={560} dur={90} cor="#FF7AB6" rot={0} />}
      <Sfx at={chor} nome="tum" vol={0.35} />
      <Sfx at={agr} nome="tada" vol={0.45} />
      <Sfx at={parou} nome="ding" vol={0.4} />
    </>
  );
};

/** 8. FINAL (gancho do ep. 12): no fundo da panela, um MAPA com um X atrás da geladeira. */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const mapa = wordAt(scene, "mapa…");
  const gel = wordAt(scene, "geladeira.");
  const l1 = lineStart(scene, 1);
  const proximo = wordAt(scene, "próximo");
  const sobe = lerp(f, mapa - 10, mapa + 10);
  const PMap: V3 = [PP[0], 1.0 + sobe * 1.1, PP[2] + 0.2];
  return (
    <>
      <Canvas fundo={f >= l1 ? "#2A1A2E" : "#7FC8A9"}>
        <Luzes quente={f < l1} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PP, 0, 4.6, 0.9, 32) },
            { f: mapa, ...frente(PMap, 0, 3.6, 0, 32), corte: true },
            { f: gel, ...frente(PG, 0.4, 7.0, 1.4, 38), corte: true },
            { f: l1, ...frente(PG, 0.4, 5.4, 1.3, 34), corte: true },
            { f: proximo, ...frente(PG, 0.4, 7.2, 1.2, 38), corte: true },
          ]}
          shakes={[mapa, l1]}
        />
        <Cozinha3D />
        <PanelaPressao pos={PP} expr="chocado" semTampa />
        <MapaTesouro pos={PMap} abre={sobe} escala={1.1} />
        <Geladeira pos={PG} rotY={0.5} expr="nervoso" cor="#E8C29A" />
        <TitoRei pos={PT} rotY={-0.5} expr="chocado" pose="chocado" semCoroa />
        <TampaPanela pos={[PT[0], 2.42, PT[2]]} rot={[0, 0, -0.12]} escala={0.62} />
      </Canvas>
      {f >= mapa && f < gel && <Onomatopeia texto="UM MAPA?!" at={mapa} x={540} y={560} dur={gel - mapa} cor="#FFD23F" />}
      {f >= gel && <Onomatopeia texto="?" at={gel} x={540} y={560} dur={300} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={mapa} nome="sparkle" vol={0.45} />
      <Sfx at={gel} nome="riser" vol={0.4} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
