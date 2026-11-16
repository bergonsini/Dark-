import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Geladeira, Mesa } from "../../objetos/Cozinha";
import { Chuva, Lupa, Nuvem, Porta, Silhueta, Urna, Vaso } from "../../objetos/Clima";
import { Pegadas, RelogioGerente } from "../../objetos/Relogio";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 4 — "A planta rainha" (responde "quem levou a coroa?" do ep. 3). */

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
const mola = (f: number, at: number, st = 180) => spring({ frame: f - at, fps: 30, config: { damping: 10, stiffness: st } });
const lerp = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const BRONZE = "#E8B88A";
type V3 = [number, number, number];

/** O Tito detetive (sem coroa) segurando a lupa na mão direita (pose "apontando"). */
const TitoDetetive: React.FC<{ pos: V3; rotY?: number; expr?: React.ComponentProps<typeof TitoRei>["expr"]; boca?: number; lupaBaixa?: boolean }> = ({ pos, rotY = 0, expr = "malandro", boca = 0, lupaBaixa = false }) => {
  // mão direita (pose apontando) no espaço do Tito ≈ (0.45, 1.38, 0.64)
  const lx = 0.45;
  const lz = 0.68;
  const ly = lupaBaixa ? 1.25 : 1.62;
  const x = pos[0] + lx * Math.cos(rotY) + lz * Math.sin(rotY);
  const z = pos[2] - lx * Math.sin(rotY) + lz * Math.cos(rotY);
  return (
    <>
      <TitoRei pos={pos} rotY={rotY} expr={expr} pose="apontando" semCoroa boca={boca} />
      <Lupa p={[x, ly, z]} rot={[lupaBaixa ? -1.2 : 0, rotY, 0]} escala={1.2} />
    </>
  );
};

/** Planta rainha: a planta do vaso, gigante, com a coroa do Tito. */
const PlantaRainha: React.FC<{ pos: V3; escala?: number; boca?: number; expr?: React.ComponentProps<typeof Vaso>["expr"]; coroa?: boolean; vasoMaior?: number }> = ({
  pos,
  escala = 1.4,
  boca = 0,
  expr = "feliz",
  coroa = true,
  vasoMaior = 1,
}) => <Vaso pos={pos} cresce={1} escala={escala} boca={boca} expr={expr} coroa={coroa} vasoMaior={vasoMaior} />;
/** altura do rosto da planta rainha (escala 1.4) */
const ROSTO_P = 3.15;

/** 1. GANCHO: "A coroa sumiu… e o Tito virou DETETIVE!" */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const tito = wordAt(scene, "tito");
  const det = wordAt(scene, "detetive!");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente([0, 0, 0.8], 0, 2.4, 2.25, 32) },
            { f: tito, pos: [0.4, 1.4, 6.2], alvo: [0.2, 1.3, 0.6], fov: 42, corte: true },
            { f: det, pos: [0.9, 0.6, 3.4], alvo: [0.3, 1.6, 0.8], fov: 44, corte: true },
          ]}
          shakes={[det]}
        />
        <Cozinha3D />
        {f < tito ? (
          <TitoRei pos={[0, 0, 0.8]} expr="chocado" pose="chocado" semCoroa boca={mouth} />
        ) : (
          <TitoDetetive pos={[0, 0, 0.8]} rotY={0.2} expr={f >= det ? "malandro" : "feliz"} boca={mouth} />
        )}
      </Canvas>
      <Onomatopeia texto="CADÊ?!" at={4} x={540} y={620} dur={tito - 4} />
      <Placa texto="DETETIVE TITO" at={det} y={1430} />
      <Sfx at={0} nome="apito" vol={0.35} />
      <Sfx at={tito} nome="whoosh" vol={0.5} />
      <Sfx at={det} nome="tada" vol={0.4} />
    </>
  );
};

/** 2. OS SUSPEITOS: geladeira (jura que estava gelando), nuvem (chovendo no banheiro), relógio (roncando). */
export const Suspeitos: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const gel = wordAt(scene, "geladeira");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const banh = wordAt(scene, "banheiro");
  const l3 = lineStart(scene, 3);
  const ronc = wordAt(scene, "roncando");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.3, 8.4], alvo: [0, 1.4, 0], fov: 48 },
            { f: gel, ...frente([-2.0, 0, 0], 0.4, 4.2, 1.5, 36), corte: true },
            { f: l1, ...frente([-2.0, 0, 0], 0.4, 3.0, 1.7, 32), corte: true },
            { f: l2, pos: [0.3, 2.9, 4.4], alvo: [0.3, 2.7, 0.2], fov: 38, corte: true },
            { f: banh, pos: [0.3, 2.4, 5.6], alvo: [0.3, 1.8, 0.2], fov: 44, corte: true },
            { f: l3, ...frente([2.0, 0, 0.2], -0.4, 4.0, 0.8, 34), corte: true },
            { f: ronc, ...frente([2.0, 0, 0.2], -0.4, 3.0, 0.8, 30), corte: true },
          ]}
          shakes={[gel, ronc]}
        />
        <Cozinha3D />
        <Geladeira pos={[-2.0, 0, 0]} rotY={0.4} cor={BRONZE} expr={f >= l1 && f < l2 ? "nervoso" : "chocado"} tremendo={f >= l1 && f < l2} bracos={f >= l1 ? 1 : 0} />
        <Nuvem pos={[0.3, 2.7, 0.2]} escala={0.8} expr={f >= banh ? "zen" : "feliz"} />
        {f >= banh && f < l3 && <Chuva centro={[0.3, 1.1, 0.2]} largura={0.8} prof={0.5} altura={1.6} intensidade={0.7} />}
        <RelogioGerente pos={[2.0, 0, 0.2]} rotY={-0.4} escala={1.3} dorme />
        <TitoDetetive pos={[-0.9, 0, 1.6]} rotY={f >= l3 ? 0.7 : f >= l2 ? 0.3 : -0.5} />
      </Canvas>
      <Placa texto="SUSPEITA Nº 1" at={gel} y={1430} ate={l1} />
      {f >= l1 && f < l2 && <Onomatopeia texto="JURO!" at={l1 + 30} x={540} y={620} dur={30} />}
      {f >= l2 && f < l3 && <Placa texto="ÁLIBI ✓" at={l2 + 20} y={1430} ate={l3} />}
      {f >= l3 && <Onomatopeia texto="ZZZ…" at={l3 + 10} x={600} y={580} dur={80} cor="#BFE6FF" rot={-6} />}
      <Sfx at={gel} nome="tum" vol={0.4} />
      <Sfx at={l1 + 30} nome="boing" vol={0.4} />
      <Sfx at={l2 + 20} nome="ding" vol={0.4} />
      <Sfx at={banh} nome="borbulha" vol={0.35} />
      <Sfx at={ronc} nome="ronco" vol={0.5} />
    </>
  );
};

/** 3. DETETIVE CAPIVARA: ajudou na investigação… a 1 cm por hora. Pista: semana que vem. */
export const DetetiveCapivara: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const um = wordAt(scene, "um");
  const l2 = lineStart(scene, 2);
  const semana = wordAt(scene, "semana");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.4, 1.6, 6.4], alvo: [0.4, 0.8, 0.4], fov: 42 },
            { f: l1, ...frente([0.6, 0, 0.4], 0, 4.4, 0.9, 32), corte: true },
            { f: um, pos: [0.6, 0.5, 4.2], alvo: [0.6, 0.45, 0.4], fov: 40, corte: true },
            { f: l2, ...frente([-0.9, 0, 0.9], 0.4, 2.7, 2.1, 34), corte: true },
            { f: semana, ...frente([0.6, 0, 0.4], 0, 4.6, 0.9, 30), corte: true },
          ]}
        />
        <Cozinha3D />
        <Capivara pos={[0.6 + f * 0.0004, 0, 0.4]} rotY={0} zen />
        <Lupa p={[1.15, 0.75, 0.9]} rot={[0, 0, -0.4]} escala={0.9} />
        <TitoDetetive pos={[-0.9, 0, 0.9]} rotY={0.4} expr={f >= l2 ? "triste" : "neutro"} />
      </Canvas>
      <Placa texto="1 CM POR HORA" at={um} y={1430} ate={l2} />
      {f >= semana && <Placa texto="PISTA EM 7 DIAS" at={semana} y={1430} />}
      <Sfx at={4} nome="click" vol={0.3} />
      <Sfx at={um} nome="apito" vol={0.35} />
      <Sfx at={semana} nome="tum" vol={0.4} />
    </>
  );
};

/** 4. AS PEGADINHAS: de perto… eram de RAIZ! */
export const Pegadinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const perto = wordAt(scene, "perto…");
  const l1 = lineStart(scene, 1);
  const raiz = wordAt(scene, "raiz!");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [-0.6, 2.6, 4.8], alvo: [0.6, 0.3, -0.8], fov: 44 },
            { f: perto, pos: [0.9, 1.0, 0.6], alvo: [1.1, 0.0, -0.6], fov: 34, corte: true },
            { f: raiz, ...frente([-0.4, 0, 1.4], 0.5, 2.5, 2.1, 32), corte: true },
          ]}
          shakes={[raiz]}
        />
        <Cozinha3D />
        <Pegadas de={[0.2, 0, 0.6]} ate={[1.8, 0, -2.6]} n={9} mostra={1} />
        {f >= l1 &&
          [0, 1, 2, 3].map((i) => (
            <group key={i} position={[0.85 + i * 0.32, 0.03, -0.1 - i * 0.6]} rotation={[0, 0.5, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0.6]}>
                <torusGeometry args={[0.12, 0.025, 4, 8, Math.PI]} />
                <meshStandardMaterial color="#3DDC84" flatShading />
              </mesh>
            </group>
          ))}
        <TitoDetetive pos={[-0.4, 0, 1.4]} rotY={0.5} lupaBaixa={f < raiz} expr={f >= raiz ? "chocado" : "malandro"} boca={f >= raiz ? mouth : 0} />
      </Canvas>
      {f >= raiz && <Onomatopeia texto="RAIZ?!" at={raiz} x={540} y={600} dur={60} cor="#3DDC84" />}
      <Sfx at={perto} nome="whoosh" vol={0.4} />
      <Sfx at={l1} nome="sparkle" vol={0.35} />
      <Sfx at={raiz} nome="tum" vol={0.5} />
    </>
  );
};

/** 5. A RAINHA PLANTA: pediu aumento, ninguém deu… se promoveu sozinha: RAINHA DA COZINHA! */
export const Culpada: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const ninguem = wordAt(scene, "ninguém");
  const l2 = lineStart(scene, 2);
  const rainha = wordAt(scene, "rainha");
  const cresce = mola(f, rainha, 160);
  return (
    <>
      <Canvas fundo={f >= rainha ? "#FFB86B" : "#7FC8A9"}>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.9, 1.6, 6.6], alvo: [1.4, 2.0, -1.8], fov: 46 },
            { f: 12, ...frente([1.4, 0, -1.8], 0, 3.6, ROSTO_P, 34), corte: true },
            { f: l1, ...frente([1.4, 0, -1.8], 0, 3.0, ROSTO_P - 0.6, 34), corte: true },
            { f: ninguem, pos: [-0.6, 2.0, 3.4], alvo: [-0.4, 1.9, 0.8], fov: 36, corte: true },
            { f: l2, pos: [1.4, 1.2, 4.2], alvo: [1.4, 2.4, -1.8], fov: 50, corte: true },
            { f: rainha, ...frente([1.4, 0, -1.8], 0, 3.2, ROSTO_P + 0.3, 36), corte: true },
          ]}
          shakes={[12, rainha]}
        />
        <Cozinha3D />
        {f < l1 || f >= l2 ? (
          <PlantaRainha pos={[1.4, 0, -1.8]} escala={1.4 + (f >= rainha ? cresce * 0.15 : 0)} boca={f >= l2 ? mouth : 0} expr={f >= rainha ? "feliz" : "bravo"} />
        ) : (
          <PlantaRainha pos={[1.4, 0, -1.8]} escala={1.0} expr="triste" coroa={false} />
        )}
        <TitoRei pos={[-0.4, 0, 0.8]} rotY={0.4} expr={f >= ninguem && f < l2 ? "triste" : "chocado"} pose={f >= ninguem && f < l2 ? "pensando" : "chocado"} semCoroa />
      </Canvas>
      <Onomatopeia texto="FOI ELA!" at={12} x={540} y={600} dur={30} />
      {f >= l1 && f < l2 && <Placa texto="AUMENTO: NEGADO" at={l1 + 10} y={1430} ate={l2} />}
      <Placa texto="RAINHA DA COZINHA" at={rainha} y={1430} />
      <Sfx at={12} nome="boom" vol={0.4} />
      <Sfx at={l1 + 10} nome="tum" vol={0.4} />
      <Sfx at={rainha} nome="tada" vol={0.45} />
      <Sfx at={rainha + 6} nome="sparkle" vol={0.4} />
    </>
  );
};

/** 6. NEGOCIAÇÃO: adubo, água e férias × vaso maior, sol de praia e crachá. Ela fica com a coroa. */
export const Negociacao: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const adubo = wordAt(scene, "adubo,");
  const agua = wordAt(scene, "água");
  const ferias = wordAt(scene, "férias.");
  const l1 = lineStart(scene, 1);
  const maior = wordAt(scene, "maior,");
  const cracha = wordAt(scene, "crachá.");
  const l2 = lineStart(scene, 2);
  const ficou = wordAt(scene, "ficou");
  const vaso = f >= maior ? 1 + mola(f, maior, 200) * 0.6 : 1;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 7.4], alvo: [0, 1.5, 0], fov: 46 },
            { f: adubo, ...frente([-1.2, 0, 0.6], 0.5, 2.8, 2.0, 34), corte: true },
            { f: l1, ...frente([0.9, 0, -0.4], -0.4, 3.4, 2.6, 36), corte: true },
            { f: cracha, pos: [0, 2.2, 7.4], alvo: [0, 1.5, 0], fov: 46, corte: true },
            { f: l2, ...frente([0.9, 0, -0.4], -0.4, 3.0, 2.8, 34), corte: true },
            { f: ficou, ...frente([-1.2, 0, 0.6], 0.5, 2.6, 2.1, 32), corte: true },
          ]}
          shakes={[maior]}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 0.1]} />
        <PlantaRainha pos={[0.9, 0, -0.4]} escala={1.2} boca={f >= l1 && f < l2 ? mouth : 0} expr={f >= l2 ? "feliz" : "bravo"} vasoMaior={vaso} />
        <TitoRei pos={[-1.2, 0, 0.6]} rotY={0.5} expr={f >= ficou ? "triste" : "feliz"} pose={f < l1 ? "explicando" : "parado"} semCoroa boca={f < l1 ? mouth : 0} />
      </Canvas>
      <Onomatopeia texto="ADUBO?" at={adubo} x={540} y={600} dur={agua - adubo} rot={-4} />
      <Onomatopeia texto="ÁGUA?" at={agua} x={540} y={600} dur={ferias - agua} rot={4} />
      <Onomatopeia texto="FÉRIAS?" at={ferias} x={540} y={600} dur={24} rot={-4} />
      {f >= maior && f < l2 && <Onomatopeia texto="VASO MAIOR!" at={maior} x={540} y={600} dur={cracha - maior} cor="#FF6B6B" />}
      <Placa texto="CRACHÁ: RAINHA" at={cracha} y={1430} ate={l2} />
      {f >= ficou && <Onomatopeia texto="FICOU COM A COROA" at={ficou} x={540} y={600} dur={80} cor="#FFD23F" rot={-3} />}
      <Sfx at={adubo} nome="pop" vol={0.4} />
      <Sfx at={agua} nome="pop" vol={0.4} />
      <Sfx at={ferias} nome="pop" vol={0.4} />
      <Sfx at={maior} nome="boing" vol={0.5} />
      <Sfx at={cracha} nome="ding" vol={0.4} />
      <Sfx at={ficou} nome="apito" vol={0.35} />
    </>
  );
};

/** 7. FINAL (gancho do ep. 5): ELEIÇÃO pra rei da cozinha… chega o candidato surpresa, com uma coroa MAIOR. CONTINUA… */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const eleicao = wordAt(scene, "eleição");
  const l1 = lineStart(scene, 1);
  const chegar = wordAt(scene, "chegar.");
  const l2 = lineStart(scene, 2);
  const maior = wordAt(scene, "maior.");
  const l3 = lineStart(scene, 3);
  const proximo = wordAt(scene, "próximo");
  const escuro = f >= chegar;
  const abre = lerp(f, chegar, chegar + 10, 0, 1.4);
  return (
    <>
      <Canvas fundo={escuro ? "#2A2140" : "#7FC8A9"}>
        <Luzes quente={!escuro} />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.3, 8.6], alvo: [0, 1.4, 0], fov: 48 },
            { f: eleicao, pos: [0, 1.4, 3.6], alvo: [0, 0.8, 0.8], fov: 40, corte: true },
            { f: l1, pos: [0.4, 2.2, 7.6], alvo: [1.4, 1.4, -2.4], fov: 44, corte: true },
            { f: chegar, pos: [2.2, 1.6, 2.4], alvo: [2.6, 1.3, -2.6], fov: 40, corte: true },
            { f: l2, pos: [2.5, 1.8, 0.8], alvo: [2.6, 2.4, -2.8], fov: 40, corte: true },
            { f: maior, pos: [2.5, 2.4, -0.4], alvo: [2.6, 3.6, -2.8], fov: 40, corte: true },
            { f: l3, ...frente([-1.3, 0, 1.4], 0.5, 2.6, 2.1, 34), corte: true },
            { f: proximo, pos: [2.2, 1.6, 2.4], alvo: [2.6, 1.6, -2.6], fov: 42, corte: true },
          ]}
          shakes={[chegar, maior]}
        />
        <Cozinha3D />
        <Urna pos={[0, 0.86, 0.8]} />
        <Mesa pos={[0, 0, 0.8]} />
        <Porta pos={[2.6, 0, -2.88]} rotY={0} batida={l1 + 20} />
        {f >= chegar && (
          <group position={[2.6, 0, -2.6]}>
            <group rotation={[0, abre, 0]} position={[-0.5, 0, 0]}>
              <group position={[0.5, 0, 0]}>
                <mesh position={[0, 1.05, 0]}>
                  <boxGeometry args={[1, 2.1, 0.12]} />
                  <meshStandardMaterial color="#1A1420" flatShading />
                </mesh>
              </group>
            </group>
            <Silhueta pos={[0, 0, -0.1]} escala={1.0} />
          </group>
        )}
        <PlantaRainha pos={[-2.2, 0, -0.8]} escala={1.1} expr={f >= chegar ? "chocado" : "feliz"} />
        <Geladeira pos={[-3.4, 0, 0.6]} rotY={0.6} cor={BRONZE} expr={f >= chegar ? "chocado" : "feliz"} />
        <Capivara pos={[1.4, 0, 0.9]} rotY={-0.4} zen />
        <TitoRei pos={[-1.3, 0, 1.4]} rotY={f >= l1 ? 0.5 : 0.2} expr={f >= chegar ? "chocado" : "animado"} pose={f >= chegar ? "chocado" : "bracosPraCima"} semCoroa />
      </Canvas>
      <Placa texto="ELEIÇÃO!" at={eleicao} y={1430} ate={l1} />
      {f >= l1 + 20 && f < chegar && <Onomatopeia texto="TOC TOC" at={l1 + 20} x={540} y={600} dur={chegar - l1 - 20} />}
      {f >= maior && f < l3 && <Onomatopeia texto="COROA MAIOR?!" at={maior} x={540} y={600} dur={l3 - maior} cor="#FFD23F" />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={eleicao} nome="tada" vol={0.4} />
      <Sfx at={l1 + 20} nome="tum" vol={0.5} />
      <Sfx at={l1 + 32} nome="tum" vol={0.5} />
      <Sfx at={chegar} nome="riser" vol={0.4} />
      <Sfx at={maior} nome="boom" vol={0.45} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
