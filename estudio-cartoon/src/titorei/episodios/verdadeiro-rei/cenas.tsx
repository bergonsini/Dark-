import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Mesa } from "../../objetos/Cozinha";
import { MicroOndas } from "../../objetos/MicroOndas";
import { CaixaPizza, Geladeirinha, PanelaPressao, PratoFeijao } from "../../objetos/Familia";
import { PipocasPulando, Pipoca } from "../../objetos/Pipoca";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Caixa, Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 10 — "O verdadeiro rei" (responde "quem escreveu o bilhete?" do ep. 9). */

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
const PP: V3 = [0.9, 0, -0.6]; // panela
const PM: V3 = [-1.4, 0, -0.6]; // micro-ondas
const PC: V3 = [-0.1, 0, 1.4]; // capivara
const PCj: V3 = [-2.0, 0, 0.3]; // capivara no júri (fora da frente do Tito)
const PT: V3 = [1.6, 0, 1.1]; // Tito
const PB: V3 = [-1.6, 0, 1.3]; // Gelinha
const ROSTO_P = 0.55;

/** Armário de madeira (a panela sai dele). `abre` 0..1. */
const Armario: React.FC<{ pos: V3; abre: number }> = ({ pos, abre }) => (
  <group position={pos}>
    <Caixa p={[0, 1.1, 0]} s={[2.0, 2.2, 0.9]} c="#9a6236" />
    <group position={[-1.0, 1.1, 0.46]} rotation={[0, -abre * 1.6, 0]}>
      <Caixa p={[0.5, 0, 0]} s={[1.0, 2.1, 0.06]} c="#b97a44" />
    </group>
    <group position={[1.0, 1.1, 0.46]} rotation={[0, abre * 1.6, 0]}>
      <Caixa p={[-0.5, 0, 0]} s={[1.0, 2.1, 0.06]} c="#b97a44" />
    </group>
  </group>
);

/** 1. GANCHO: "O verdadeiro rei era… uma PANELA! De pressão." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const pan = wordAt(scene, "panela!");
  const l1 = lineStart(scene, 1);
  return (
    <>
      <Canvas fundo={f >= pan ? "#7FC8A9" : "#2A1A2E"}>
        <Luzes quente={f >= pan} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PP, 0, 8.5, 1.0, 40) },
            { f: pan, ...frente(PP, 0, 6.5, 0.9, 36), corte: true },
            { f: l1, ...frente(PP, 0, 5.1, 0.8, 32), corte: true },
          ]}
          shakes={[pan]}
        />
        <Cozinha3D />
        <PanelaPressao pos={PP} expr={f >= l1 ? "nervoso" : "bravo"} apito={f >= pan ? 0.8 : 0.3} coroa />
      </Canvas>
      {f >= pan && f < l1 && <Onomatopeia texto="PSSSSHHH!" at={pan} x={540} y={600} dur={l1 - pan} cor="#fff" />}
      {f >= l1 && <Placa texto="DE PRESSÃO" at={l1} y={1430} />}
      <Sfx at={0} nome="riser" vol={0.35} />
      <Sfx at={pan} nome="apito" vol={0.45} />
      <Sfx at={l1} nome="tum" vol={0.45} />
    </>
  );
};

/** 2. SAIU DO ARMÁRIO: apitando "essa cozinha era minha antes de vocês!"; feijão por 40 anos… aposentou. */
export const ArmarioCena: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const apit = wordAt(scene, "apitando:");
  const voces = wordAt(scene, "vocês!");
  const l1 = lineStart(scene, 1);
  const anos = wordAt(scene, "anos…");
  const apos = wordAt(scene, "aposentou.");
  const PA: V3 = [0.6, 0, -1.9];
  const sai = lerp(f, 6, apit, 0, 1);
  const pPan: V3 = [PA[0], 0, PA[2] + 0.2 + sai * 1.3];
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.6, 7.4], alvo: [0.4, 1.2, -1.2], fov: 44 },
            { f: apit, ...frente(pPan, 0, 6.5, 0.9, 36), corte: true },
            { f: voces, pos: [0, 2.4, 6.8], alvo: [0, 1.1, -0.4], fov: 44, corte: true },
            { f: l1, ...frente(pPan, 0, 5.8, 0.8, 34), corte: true },
            { f: apos, ...frente(pPan, 0, 7.5, 0.9, 38), corte: true },
          ]}
          shakes={[apit, voces]}
        />
        <Cozinha3D />
        <Armario pos={PA} abre={lerp(f, 0, 10)} />
        <PanelaPressao pos={pPan} expr={f >= apos ? "triste" : "bravo"} apito={f >= apit && f < l1 ? 1 : 0.2} coroa />
        {f >= voces - 4 && f < l1 && (
          <>
            <MicroOndas pos={PM} rotY={0.5} escala={ME} expr="chocado" coroa={false} />
            <Capivara pos={PC} rotY={0.2} zen fechado={0.85} coroa />
            <TitoRei pos={PT} rotY={-0.5} expr="chocado" pose="chocado" semCoroa />
          </>
        )}
        {f >= l1 && f < apos && <PratoFeijao pos={[pPan[0] + 1.0, 0, pPan[2] + 0.4]} escala={1.4} />}
      </Canvas>
      {f >= apit && f < voces && <Onomatopeia texto="FIIIIUUU!" at={apit} x={540} y={600} dur={voces - apit} cor="#fff" />}
      {f >= anos && f < apos && <Placa texto="40 ANOS DE FEIJÃO" at={anos} y={1430} />}
      {f >= apos && <Placa texto="APOSENTADA" at={apos} y={1430} />}
      <Sfx at={4} nome="click" vol={0.4} />
      <Sfx at={apit} nome="apito" vol={0.45} />
      <Sfx at={anos} nome="ding" vol={0.35} />
      <Sfx at={apos} nome="tum" vol={0.4} />
    </>
  );
};

/** 3. DUELO: a rainha capivara decide: duelo de culinária! Quem cozinhar melhor fica com a coroa. */
export const Duelo: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const duelo = wordAt(scene, "duelo");
  const l1 = lineStart(scene, 1);
  const coroa = wordAt(scene, "coroa.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PC, 0, 6.1, 0.9, 36) },
            { f: duelo, pos: [0, 2.6, 7.6], alvo: [0, 1.0, -0.2], fov: 46, corte: true },
            { f: l1, ...frente(PC, 0, 4.9, 0.9, 32), corte: true },
            { f: coroa, ...frente([PC[0], 0.9, PC[2]], 0, 3.5, 0.4, 30), corte: true },
          ]}
          shakes={[duelo]}
        />
        <Cozinha3D />
        <Capivara pos={PC} zen fechado={0.85} coroa />
        <MicroOndas pos={PM} rotY={0.4} escala={ME} expr="bravo" coroa={false} />
        <PanelaPressao pos={PP} rotY={-0.4} expr="bravo" apito={0.3} />
      </Canvas>
      {f >= duelo && f < l1 && <Onomatopeia texto="⚔ DUELO ⚔" at={duelo} x={540} y={600} dur={l1 - duelo} cor="#FFD23F" />}
      {f >= coroa && <Placa texto="EM JOGO: A COROA" at={coroa} y={1430} />}
      <Sfx at={duelo} nome="boom" vol={0.4} />
      <Sfx at={coroa} nome="sparkle" vol={0.45} />
    </>
  );
};

/** 4. OS PRATOS: pipoca em 30 s; feijão em 40 min; a capivara… pediu pizza. */
export const Pratos: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const pizza = wordAt(scene, "pizza.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, 0.4, 6.0, ROSTO_M + 0.3, 36) },
            { f: l1, ...frente(PP, -0.4, 7.8, 1.0, 36), corte: true },
            { f: l2, ...frente(PC, 0, 5.8, 0.9, 36), corte: true },
            { f: pizza, ...frente([PC[0] + 0.9, 0, PC[2] + 0.3], 0, 4.3, 0.6, 32), corte: true },
          ]}
          shakes={[pizza]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={0.4} escala={ME} expr="feliz" coroa={false} girando={f < l1} apito={f < 20} />
        {f < l1 && <PipocasPulando de={[PM[0] + 0.2, 1.2, PM[2] + 0.7]} n={14} />}
        <PanelaPressao pos={PP} rotY={-0.4} expr="feliz" apito={f >= l1 && f < l2 ? 1 : 0.2} />
        {f >= l1 && <PratoFeijao pos={[PP[0] - 0.4, 0, PP[2] + 1.0]} escala={1.3} />}
        <Capivara pos={PC} zen fechado={0.9} coroa />
        {f >= pizza - 6 && <CaixaPizza pos={[PC[0] + 0.9, 0, PC[2] + 0.3]} aberta={lerp(f, pizza, pizza + 10)} escala={1.2} />}
      </Canvas>
      {f < l1 && <Placa texto="PIPOCA: 30 s" at={4} y={1430} ate={l1} />}
      {f >= l1 && f < l2 && <Placa texto="FEIJÃO: 40 min" at={l1} y={1430} ate={l2} />}
      {f >= pizza && <Placa texto="PIZZA: DELIVERY" at={pizza} y={1430} />}
      <Sfx at={4} nome="pop" vol={0.4} />
      <Sfx at={l1} nome="apito" vol={0.35} />
      <Sfx at={pizza} nome="ding" vol={0.45} />
    </>
  );
};

/** 5. O JURADO: o Tito come tudo… vota na pizza. Micro-ondas apita de raiva; a Gelinha congela o feijão. A capivara segue rainha. */
export const Juri: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const tudo = wordAt(scene, "tudo…");
  const pizza = wordAt(scene, "pizza.");
  const l1 = lineStart(scene, 1);
  const feij = wordAt(scene, "feijão.");
  const l2 = lineStart(scene, 2);
  const nada = wordAt(scene, "nada.");
  const PTm: V3 = [0, 0, 0.6];
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PTm, 0, 5.9, 1.7, 36) },
            { f: tudo, ...frente(PTm, 0, 4.6, 1.8, 32), corte: true },
            { f: pizza, ...frente(PTm, 0, 5.0, 1.85, 32), corte: true },
            { f: l1, pos: [0, 2.6, 7.6], alvo: [0, 1.0, -0.2], fov: 46, corte: true },
            { f: feij, ...frente([0.7, 0.9, 1.4], 0, 2.4, 0.3, 32), corte: true },
            { f: l2, ...frente(PCj, 0.5, 5.8, 0.9, 36), corte: true },
            { f: nada, ...frente(PCj, 0.5, 4.6, 0.9, 32), corte: true },
          ]}
          shakes={[pizza, l1]}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 1.4]} />
        <PratoFeijao pos={[0.7, 0.9, 1.4]} escala={1.0} congelado={f >= feij} />
        <CaixaPizza pos={[-0.5, 0.9, 1.4]} escala={0.8} />
        <Pipoca p={[0.1, 1.0, 1.7]} escala={2} />
        <TitoRei pos={PTm} expr={f >= pizza ? "feliz" : "animado"} pose={f >= pizza ? "apontando" : "parado"} semCoroa />
        <MicroOndas pos={PM} rotY={0.4} escala={ME} expr={f >= l1 ? "bravo" : "nervoso"} coroa={false} apito={f >= l1 && f < l2} />
        <PanelaPressao pos={PP} rotY={-0.4} expr={f >= pizza ? "bravo" : "nervoso"} apito={0.4} />
        <Geladeirinha pos={[1.7, 0, 1.2]} rotY={-0.5} expr="feliz" />
        <Capivara pos={PCj} rotY={0.5} zen fechado={0.9} coroa />
      </Canvas>
      {f >= pizza && f < l1 && <Onomatopeia texto="VOTO: PIZZA!" at={pizza} x={540} y={600} dur={l1 - pizza} cor="#FFD23F" />}
      {f >= feij && f < l2 && <Onomatopeia texto="BRRR!" at={feij} x={540} y={600} dur={l2 - feij} cor="#7fd6ff" />}
      {f >= nada && <Placa texto="AINDA RAINHA" at={nada} y={1430} />}
      <Sfx at={tudo} nome="pop" vol={0.4} />
      <Sfx at={pizza} nome="tada" vol={0.4} />
      <Sfx at={l1} nome="apito" vol={0.35} />
      <Sfx at={feij} nome="whoosh" vol={0.4} />
      <Sfx at={nada} nome="tum" vol={0.4} />
    </>
  );
};

/** 6. FINAL (gancho do ep. 11): a panela fica tão brava que apita mais alto… e mais alto… Vai EXPLODIR? */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const expl = wordAt(scene, "explodir?");
  const proximo = wordAt(scene, "próximo");
  const end = scene.endFrame - scene.startFrame;
  const inch = lerp(f, 0, end, 0.1, 1);
  return (
    <>
      <Canvas fundo={f >= l2 ? "#4a1a1a" : "#7FC8A9"}>
        <Luzes quente />
        <CameraRig
          keys={[
            { f: 0, ...frente(PP, 0, 8.5, ROSTO_P + 0.5, 38) },
            { f: l1, ...frente(PP, 0, 6.5, ROSTO_P + 0.5, 34), corte: true },
            { f: l2, pos: [0, 2.6, 7.6], alvo: [0.2, 1.0, -0.2], fov: 46, corte: true },
            { f: expl, ...frente(PP, 0, 5.1, ROSTO_P + 0.6, 30), corte: true },
            { f: proximo, ...frente(PP, 0, 7.1, ROSTO_P + 0.6, 36), corte: true },
          ]}
          shakes={[l1, l2, expl, proximo]}
          amp={0.04 + inch * 0.12}
        />
        <Cozinha3D />
        <PanelaPressao pos={PP} expr="bravo" apito={0.6 + inch * 0.9} inchada={inch} />
        {f >= l2 && (
          <>
            <TitoRei pos={PT} rotY={-0.5} expr="chocado" pose="chocado" semCoroa />
            <Capivara pos={PC} zen fechado={0.85} coroa />
            <MicroOndas pos={PM} rotY={0.4} escala={ME} expr="chocado" coroa={false} />
          </>
        )}
      </Canvas>
      {f >= l1 - 10 && f < l2 && <Onomatopeia texto="FIIIIIIU!" at={l1 - 10} x={540} y={600} dur={l2 - l1 + 10} cor="#fff" />}
      {f >= expl && f < proximo && <Onomatopeia texto="BOOM?!" at={expl} x={540} y={600} dur={proximo - expl} cor="#FF6B6B" />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={2} nome="apito" vol={0.3} />
      <Sfx at={l1} nome="apito" vol={0.4} />
      <Sfx at={l2} nome="riser" vol={0.4} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
