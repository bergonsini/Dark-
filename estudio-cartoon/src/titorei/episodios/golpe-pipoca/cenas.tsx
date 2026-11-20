import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Geladeira, Leite, Queijo } from "../../objetos/Cozinha";
import { MicroOndas } from "../../objetos/MicroOndas";
import { MarDePipoca, OvoGigante, Pipoca, PipocasPulando } from "../../objetos/Pipoca";
import { RelogioGerente } from "../../objetos/Relogio";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 6 — "O golpe da pipoca" (responde "o que acontece no zero?" do ep. 5). */

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
const mola = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 10, stiffness: 180 } });
const ME = 1.3;
const ROSTO_M = 0.82 * ME;
const PM: [number, number, number] = [1.3, 0, -0.6];
const PT: [number, number, number] = [-1.3, 0, 0.3];
const PC: [number, number, number] = [-0.5, 0, 1.6];
const PG: [number, number, number] = [-2.0, 0, -1.6];
const PR: [number, number, number] = [0, 0, -1.8];
/** nível da pipoca depois da enchente (chão coberto) */
const NIVEL = 0.3;

const Contagem: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 700, fontSize: 240, color: "#FF3B30", textShadow: "0 0 30px #FF3B30" }}>
    00:{String(n).padStart(2, "0")}
  </div>
);

/** 1. GANCHO: 00:03… 00:00… PIM! Era só pipoca. */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const pim = wordAt(scene, "pim!");
  const pip = wordAt(scene, "pipoca.");
  const n = Math.max(0, 3 - Math.floor(lerp(f, 0, pim, 0, 3.99)));
  return (
    <>
      <Canvas fundo={f >= pim ? "#7FC8A9" : "#2A1A2E"}>
        <Luzes quente={f >= pim} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, -0.3, 5.0, ROSTO_M + 0.15, 34) },
            { f: pim, ...frente(PM, -0.3, 4.2, ROSTO_M + 0.15, 32), corte: true },
            { f: pip, ...frente(PM, -0.3, 6.4, ROSTO_M + 0.3, 36), corte: true },
          ]}
          shakes={[pim]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={f >= pip ? "feliz" : f >= pim ? "chocado" : "bravo"} apito={f < pim} girando={f < pim} />
        {f >= pim && <PipocasPulando de={[PM[0] - 0.2, 1.2, PM[2] + 0.6]} n={16} />}
      </Canvas>
      {f < pim && <Contagem n={n} />}
      {f >= pim && f < pip && <Onomatopeia texto="PIM!" at={pim} x={540} y={600} dur={pip - pim} cor="#FFD23F" />}
      {f >= pip && <Placa texto="ERA SÓ PIPOCA" at={pip} y={1430} />}
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={i * Math.floor(pim / 3)} nome="apito" vol={0.2} />
      ))}
      <Sfx at={pim} nome="ding" vol={0.55} />
      <Sfx at={pim + 4} nome="pop" vol={0.5} />
      <Sfx at={pip} nome="pop" vol={0.45} />
    </>
  );
};

/** 2. ENCHENTE: pipoca DEMAIS, enche a cozinha até o teto; o leite sai boiando gritando. */
export const Enchente: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const demais = wordAt(scene, "demais.");
  const l1 = lineStart(scene, 1);
  const teto = wordAt(scene, "teto.");
  const l2 = lineStart(scene, 2);
  const nivel = lerp(f, 10, teto + 10, 0.1, 2.2);
  const nivelL = nivel;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, -0.3, 6.0, ROSTO_M + 0.2, 36) },
            { f: demais, pos: [0, 2.6, 8.4], alvo: [0, 1.4, -0.4], fov: 48, corte: true },
            { f: teto, pos: [0, 5.2, 8.0], alvo: [0, 1.8, -0.6], fov: 48, corte: true },
            { f: l2, ...frente([0.9, nivelL, 2.4], 0, 3.0, 0.6, 36), corte: true },
            { f: l2 + 45, pos: [0, 3.6, 5.8], alvo: [0.6, nivelL + 0.3, 1.4], fov: 46, corte: true },
          ]}
          shakes={[demais, teto]}
        />
        <Cozinha3D />
        <MicroOndas pos={[PM[0], Math.max(0, nivel - 1.3), PM[2]]} rotY={-0.3} escala={ME} expr="nervoso" treme />
        <TitoRei pos={[PT[0], Math.max(0, nivel - 1.5), PT[2]]} expr="chocado" pose="bracosPraCima" semCoroa />
        <Capivara pos={[PC[0], Math.max(0, nivel - 0.8), PC[2]]} zen fechado={0.85} coroa />
        {f >= l2 && <Leite pos={[0.9, nivelL - 0.15, 2.4]} expr="chocado" boca={0.9} escala={1.3} />}
        <PipocasPulando de={[PM[0] - 0.2, 1.2, PM[2] + 0.6]} n={20} forca={1.3} />
        <MarDePipoca nivel={nivel} />
      </Canvas>
      {f >= demais && f < l1 + 10 && <Onomatopeia texto="POC POC POC!" at={demais} x={540} y={600} dur={l1 + 10 - demais} cor="#FFD23F" />}
      {f >= teto && f < l2 && <Onomatopeia texto="ATÉ O TETO!" at={teto} x={540} y={600} dur={l2 - teto} cor="#fff" />}
      {f >= l2 && <Onomatopeia texto="SOCORROOO!" at={l2 + 10} x={540} y={600} dur={80} cor="#FF6B6B" />}
      <Sfx at={demais} nome="pop" vol={0.5} />
      <Sfx at={demais + 8} nome="pop" vol={0.4} />
      <Sfx at={l1} nome="riser" vol={0.35} />
      <Sfx at={teto} nome="tum" vol={0.45} />
      <Sfx at={l2 + 10} nome="boing" vol={0.45} />
    </>
  );
};

/** 3. O GOLPE: "quem tem a pipoca, manda!" — e a cozinha inteira vai pro lado dele. */
export const Golpe: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const gritou = wordAt(scene, "gritou:");
  const manda = wordAt(scene, "manda!");
  const l1 = lineStart(scene, 1);
  const inteira = wordAt(scene, "inteira");
  const vira = lerp(f, inteira, inteira + 14, 0, 1);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.4, 8.0], alvo: [0, 1.2, -0.4], fov: 46 },
            { f: gritou, ...frente(PM, -0.3, 5.2, ROSTO_M + 0.2, 34), corte: true },
            { f: manda, ...frente(PM, -0.3, 4.2, ROSTO_M + 0.15, 32), corte: true },
            { f: l1, pos: [0, 2.6, 8.4], alvo: [0, 1.2, -0.4], fov: 48, corte: true },
            { f: inteira + 20, pos: [1.0, 2.0, 6.6], alvo: [0.4, 1.1, -0.6], fov: 44, corte: true },
          ]}
          shakes={[manda]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={f >= gritou && f < l1 ? "bravo" : "feliz"} boca={f >= gritou && f < l1 ? mouth : 0} />
        <Geladeira pos={[PG[0] + vira * 1.2, 0, PG[2]]} rotY={0.3 + vira * 0.6} expr="feliz" oculos={1} />
        <Leite pos={[-0.4 + vira * 0.7, NIVEL, 0.2]} rotY={vira * 0.8} expr="feliz" />
        <Queijo pos={[-1.2 + vira * 1.0, NIVEL + 0.6, 0.9]} rotY={vira * 0.8} medita />
        <TitoRei pos={PT} rotY={0.3} expr={f >= inteira ? "chocado" : "neutro"} pose={f >= inteira ? "chocado" : "parado"} semCoroa />
        <Capivara pos={PC} zen fechado={0.85} coroa />
        <MarDePipoca nivel={NIVEL} n={60} />
      </Canvas>
      {f >= manda && f < l1 && <Onomatopeia texto="QUEM TEM PIPOCA, MANDA!" at={manda} x={540} y={600} dur={l1 - manda} cor="#FFD23F" />}
      <Placa texto="GOLPE DA PIPOCA" at={inteira} y={1430} />
      <Sfx at={gritou} nome="apito" vol={0.35} />
      <Sfx at={manda} nome="boom" vol={0.4} />
      <Sfx at={inteira} nome="whoosh" vol={0.45} />
    </>
  );
};

/** 4. DECRETO: a rainha capivara come UMA pipoca bem devagarinho e nomeia o micro-ondas ministro da pipoca. */
export const Decreto: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const comeu = wordAt(scene, "comeu");
  const devag = wordAt(scene, "devagarinho.");
  const l1 = lineStart(scene, 1);
  const min = wordAt(scene, "ministro");
  const sobe = lerp(f, comeu, devag + 30, 0, 1);
  const pPip: [number, number, number] = [PC[0], 0.7 + sobe * 0.15, PC[2] + 0.9 - sobe * 0.15];
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PC, 0, 4.4, 1.0, 36) },
            { f: comeu, ...frente(PC, 0, 3.4, 0.9, 32), corte: true },
            { f: devag, ...frente(PC, 0, 2.8, 0.9, 30), corte: true },
            { f: l1, ...frente(PC, 0, 4.2, 1.0, 36), corte: true },
            { f: min, ...frente(PM, -0.3, 6.0, ROSTO_M + 0.3, 36), corte: true },
          ]}
          shakes={[min]}
        />
        <Cozinha3D />
        <Capivara pos={PC} zen fechado={0.85} coroa boca={f >= l1 && f < min ? mouth : 0} />
        {f >= comeu && sobe < 1 && <Pipoca p={pPip} escala={1.5} />}
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr="feliz" coroa={false} />
        {f >= min && <group position={[PM[0], 1.35 * ME, PM[2]]}><Pipoca escala={1.8 * mola(f, min)} /></group>}
        <MarDePipoca nivel={NIVEL} n={60} />
      </Canvas>
      {f >= comeu && f < l1 && <Placa texto="1 PIPOCA POR HORA" at={devag} y={1430} ate={l1} />}
      {f >= devag && f < l1 && <Onomatopeia texto="crec…" at={devag} x={540} y={600} dur={l1 - devag} cor="#fff" />}
      <Placa texto="MINISTRO DA PIPOCA" at={min} y={1430} />
      <Sfx at={comeu} nome="pop" vol={0.3} />
      <Sfx at={devag} nome="click" vol={0.35} />
      <Sfx at={min} nome="tada" vol={0.5} />
    </>
  );
};

/** 5. E O TITO? Pediu um cargo… virou ministro do PIRUÁ. */
export const Tito: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const cargo = wordAt(scene, "cargo");
  const l1 = lineStart(scene, 1);
  const pirua = wordAt(scene, "piruá.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PT, 0.3, 4.0, 1.8, 36) },
            { f: cargo, ...frente(PT, 0.3, 2.8, 1.8, 32), corte: true },
            { f: l1, pos: [0, 2.2, 7.4], alvo: [-0.2, 1.1, 0.2], fov: 44, corte: true },
            { f: pirua, ...frente(PT, 0.3, 2.4, 1.75, 30), corte: true },
          ]}
          shakes={[pirua]}
        />
        <Cozinha3D />
        <TitoRei pos={PT} rotY={0.3} expr={f >= pirua ? "triste" : "animado"} pose={f >= pirua ? "parado" : f >= cargo ? "bracosPraCima" : "explicando"} semCoroa boca={f < l1 ? mouth : 0} />
        <Capivara pos={PC} zen fechado={0.85} coroa />
        {f >= pirua && (
          <group position={[PT[0] + 0.45, 1.25, PT[2] + 0.5]}>
            <mesh>
              <icosahedronGeometry args={[0.09, 0]} />
              <meshStandardMaterial color="#C99A2E" flatShading />
            </mesh>
          </group>
        )}
        <MarDePipoca nivel={NIVEL} n={60} />
      </Canvas>
      <Placa texto="MINISTRO DO PIRUÁ" at={pirua} y={1430} />
      {f >= pirua && <Onomatopeia texto="…" at={pirua + 10} x={540} y={600} dur={60} cor="#fff" />}
      <Sfx at={cargo} nome="ding" vol={0.4} />
      <Sfx at={pirua} nome="tum" vol={0.5} />
    </>
  );
};

/** 6. HORA DA FAXINA: o relógio acorda, apita… e todo mundo finge que está dormindo. */
export const Relogio: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const acordou = wordAt(scene, "acordou");
  const l1 = lineStart(scene, 1);
  const faxina = wordAt(scene, "faxina!");
  const fingiu = wordAt(scene, "fingiu");
  const finge = f >= fingiu;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PR, 0, 5.6, 1.1, 36) },
            { f: acordou, ...frente(PR, 0, 4.6, 1.1, 32), corte: true },
            { f: faxina, ...frente(PR, 0, 3.8, 1.1, 30), corte: true },
            { f: fingiu, pos: [0, 2.4, 8.0], alvo: [0, 1.1, -0.4], fov: 46, corte: true },
            { f: fingiu + 40, ...frente(PT, 0.3, 3.0, 1.8, 34), corte: true },
          ]}
          shakes={[acordou, faxina]}
        />
        <Cozinha3D />
        <RelogioGerente pos={[PR[0], NIVEL, PR[2]]} rotY={0} escala={0.8} dorme={f < acordou} toca={f >= acordou && f < fingiu} expr="bravo" boca={f >= l1 && f < fingiu ? mouth : 0} pulo={f >= acordou && f < acordou + 10 ? 0.3 : 0} />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={finge ? "zen" : "chocado"} coroa={false} />
        <TitoRei pos={PT} rotY={0.3} expr={finge ? "neutro" : "chocado"} pose={finge ? "parado" : "chocado"} semCoroa />
        <Capivara pos={PC} zen fechado={0.95} coroa />
        <Leite pos={[1.1, NIVEL, 0.9]} expr={finge ? "zen" : "chocado"} />
        <MarDePipoca nivel={NIVEL} n={60} />
      </Canvas>
      {f >= acordou && f < faxina && <Onomatopeia texto="TRIIIM!" at={acordou} x={540} y={600} dur={faxina - acordou} cor="#FF6B6B" />}
      <Placa texto="HORA DA FAXINA!" at={faxina} y={1430} ate={fingiu} />
      {finge && <Onomatopeia texto="ZZZ…" at={fingiu} x={540} y={600} dur={120} cor="#fff" />}
      <Sfx at={acordou} nome="alarme" vol={0.3} />
      <Sfx at={faxina} nome="apito" vol={0.4} />
      <Sfx at={fingiu} nome="ronco" vol={0.45} />
    </>
  );
};

/** 7. FINAL (gancho do ep. 7): no fundo da pipoca, um OVO GIGANTE… que começa a rachar. */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const ovo = wordAt(scene, "ovo");
  const l1 = lineStart(scene, 1);
  const rachar = wordAt(scene, "rachar.");
  const l2 = lineStart(scene, 2);
  const proximo = wordAt(scene, "próximo");
  const PO: [number, number, number] = [0, 0, -0.2];
  const surge = lerp(f, ovo - 6, ovo + 10, -1.8, 0);
  return (
    <>
      <Canvas fundo="#2A1A2E">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 1.6, 6.0], alvo: [0, 0.6, -0.2], fov: 44 },
            { f: ovo, ...frente(PO, 0, 7.0, 1.6, 40), corte: true },
            { f: rachar, ...frente(PO, 0, 4.6, 1.9, 34), corte: true },
            { f: l2, pos: [0, 2.6, 9.0], alvo: [0, 1.4, -0.2], fov: 46, corte: true },
            { f: proximo, ...frente(PO, 0, 6.2, 1.7, 36), corte: true },
          ]}
          shakes={[ovo, rachar, proximo]}
        />
        <Cozinha3D />
        <OvoGigante pos={[PO[0], surge, PO[2]]} escala={1.3} racha={lerp(f, rachar - 6, rachar + 30, 0, 1)} treme={f >= l1} />
        <Capivara pos={[-1.6, 0, 1.0]} rotY={0.4} zen fechado={0.85} coroa />
        <TitoRei pos={[1.6, 0, 0.8]} rotY={-0.5} expr="chocado" pose="chocado" semCoroa />
        <MarDePipoca nivel={NIVEL + 0.2} n={70} />
      </Canvas>
      {f >= rachar && f < l2 && <Onomatopeia texto="CREC!" at={rachar} x={540} y={600} dur={l2 - rachar} cor="#fff" />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={ovo} nome="tum" vol={0.5} />
      <Sfx at={rachar} nome="click" vol={0.6} />
      <Sfx at={rachar + 12} nome="click" vol={0.5} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
