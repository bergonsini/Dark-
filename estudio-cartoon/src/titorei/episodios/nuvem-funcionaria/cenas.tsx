import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Bancada, Geladeira, Leite, Queijo } from "../../objetos/Cozinha";
import { ArcoIris, CaixaMisterio, Chuva, NotaMusical, Nuvem, Porta, Raio, Vaso } from "../../objetos/Clima";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Episódio 2 — "O funcionário nuvem" (continua "A geladeira pediu demissão"). */

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
const mola = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 10, stiffness: 180 } });
const lerp = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const BRONZE = "#E8B88A";

/** 1. GANCHO: "O novo funcionário do Tito… é uma nuvem." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const nuvem = wordAt(scene, "nuvem.");
  const entra = mola(f, nuvem - 4);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.3, 2.2, 8.0], alvo: [0.2, 1.5, 0.3], fov: 46 },
            { f: nuvem - 1, pos: [0.3, 2.15, 7.0], alvo: [0.2, 1.5, 0.3], fov: 46 },
            { f: nuvem, pos: [-0.6, 2.5, 3.6], alvo: [-0.6, 2.4, 0.3], fov: 36, corte: true },
          ]}
          shakes={[nuvem]}
        />
        <Cozinha3D />
        <Bancada pos={[-2.6, 0, -2.2]} />
        <TitoRei pos={[0.8, 0, 0.6]} rotY={-0.4} expr="animado" pose={f >= nuvem ? "apontando" : "bracosPraCima"} bracoD={f >= nuvem ? [-1.4, 0.6] : undefined} />
        <group position={[-0.6, 2.4, 0.3]} scale={f >= nuvem - 4 ? entra : 0.001}>
          <Nuvem pos={[0, 0, 0]} expr="feliz" danca={0.3} />
        </group>
      </Canvas>
      <Onomatopeia texto="TCHARAM!" at={nuvem} x={540} y={640} />
      <Sfx at={0} nome="whoosh" vol={0.5} />
      <Sfx at={nuvem - 4} nome="sparkle" vol={0.6} />
      <Sfx at={nuvem} nome="tada" vol={0.5} />
    </>
  );
};

/** 2. "Isso mesmo: uma nuvem de verdade. Depois da geladeira e da capivara, faltava alguém pra regar as plantas." */
export const Recap: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const verdade = wordAt(scene, "verdade.");
  const gel = wordAt(scene, "geladeira");
  const capi = wordAt(scene, "capivara,");
  const plantas = wordAt(scene, "plantas.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente([0.8, 0, 0.6], -0.4, 2.8, 2.0, 34) },
            { f: verdade, pos: [-0.6, 2.45, 3.0], alvo: [-0.6, 2.4, 0.3], fov: 34, corte: true },
            { f: gel, ...frente([-2.6, 0, -0.6], 0.5, 4.0, 1.6, 36), corte: true },
            { f: capi, ...frente([2.4, 0, -0.4], -0.5, 3.0, 0.9, 34), corte: true },
            { f: plantas, pos: [0.2, 1.6, 2.4], alvo: [0.2, 1.3, 0], fov: 32, corte: true },
          ]}
        />
        <Cozinha3D />
        <Bancada pos={[0.6, 0, -0.6]} />
        <Vaso pos={[0.2, 1.07, 0]} cresce={0} expr="triste" />
        <Geladeira pos={[-2.6, 0, -0.6]} rotY={0.5} cor={BRONZE} expr="feliz" bracos={f >= gel ? 1 : 0} />
        <Capivara pos={[2.4, 0, -0.4]} rotY={-0.5} />
        <TitoRei pos={[0.8, 0, 0.6]} rotY={-0.4} expr="malandro" pose="maosNaCintura" cabeca={[0, f < verdade ? Math.sin(f * 0.3) * 0.08 : 0]} />
        <Nuvem pos={[-0.6, 2.4, 0.3]} expr="feliz" />
      </Canvas>
      {f >= plantas && <Onomatopeia texto="SECA!" at={plantas} x={540} y={620} cor="#FFD23F" dur={40} />}
      <Sfx at={verdade} nome="pop" vol={0.5} />
      <Sfx at={gel} nome="whoosh" vol={0.4} />
      <Sfx at={capi} nome="whoosh" vol={0.4} />
      <Sfx at={plantas} nome="apito" vol={0.4} />
    </>
  );
};

/** 3. NUVEM JARDINEIRA: chove só no vaso, a planta cresce e pede aumento; e então... vai espirrar. */
export const Jardineira: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const nele = wordAt(scene, "nele.");
  const l1 = lineStart(scene, 1);
  const aumento = wordAt(scene, "aumento.");
  const l2 = lineStart(scene, 2);
  const espirrar = wordAt(scene, "espirrar.");
  const cresce = lerp(f, l1, aumento, 0, 1);
  const prepara = lerp(f, l2 + 20, espirrar + 10, 0, 1);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.2, 2.4, 5.4], alvo: [0.2, 1.9, 0], fov: 42 },
            { f: nele, pos: [0.2, 1.7, 2.6], alvo: [0.2, 1.45, 0], fov: 32, corte: true },
            { f: l1, pos: [0.2, 2.0, 4.2], alvo: [0.2, 1.9, 0], fov: 40, corte: true },
            { f: l2, pos: [0.2, 2.6, 3.4], alvo: [0.2, 3.0, 0], fov: 34, corte: true },
            { f: espirrar, pos: [0.2, 3.05, 2.4], alvo: [0.2, 3.05, 0], fov: 30, corte: true },
          ]}
        />
        <Cozinha3D />
        <Bancada pos={[0.6, 0, -0.6]} />
        <Vaso pos={[0.2, 1.07, 0]} cresce={cresce} expr={cresce > 0.2 ? "feliz" : "triste"} />
        <Nuvem pos={[0.2, 3.1, 0]} escala={0.8} expr={f >= l2 ? "nervoso" : "feliz"} espirro={prepara} />
        {f < l2 && <Chuva centro={[0.2, 1.1, 0]} largura={0.6} prof={0.4} altura={1.7} intensidade={0.5} />}
      </Canvas>
      <Placa texto="QUERO AUMENTO!" at={aumento} y={1430} ate={l2} />
      <Sfx at={4} nome="borbulha" vol={0.4} />
      <Sfx at={l1} nome="riser" vol={0.3} />
      <Sfx at={aumento} nome="boing" vol={0.4} />
      <Sfx at={espirrar} nome="riser" vol={0.4} />
    </>
  );
};

/** 4. TEMPESTADE NA COZINHA: ATCHIM! Capivara nem se mexe, geladeira adora, queijo para de meditar, Tito encharcado. */
export const Tempestade: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const tempest = wordAt(scene, "tempestade.");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const l4 = lineStart(scene, 4);
  const tenis = wordAt(scene, "tênis.");
  return (
    <>
      <Canvas fundo="#5C7A8F">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, pos: [0.2, 3.05, 2.6], alvo: [0.2, 3.05, 0], fov: 32 },
            { f: tempest, pos: [0, 2.6, 8.4], alvo: [0, 1.5, 0], fov: 48, corte: true },
            { f: l1, ...frente([2.2, 0, 0.2], -0.5, 2.9, 0.9, 34), corte: true },
            { f: l2, ...frente([-2.2, 0, 0], 0.5, 4.0, 1.6, 36), corte: true },
            { f: l3, pos: [-1.0, 1.7, 1.3], alvo: [0.2, 1.4, -0.4], fov: 32, corte: true },
            { f: l4, ...frente([0.3, 0, 1.4], 0, 3.0, 1.8, 36), corte: true },
            { f: tenis, pos: [0.3, 0.5, 2.6], alvo: [0.3, 0.2, 1.4], fov: 32, corte: true },
          ]}
          shakes={[0, tempest]}
        />
        <Cozinha3D />
        <Bancada pos={[0.6, 0, -0.6]} />
        <Vaso pos={[1.5, 1.07, -0.6]} cresce={1} />
        <Queijo pos={[0.2, 1.07, -0.4]} medita={f < l3 + 10} />
        <Capivara pos={[2.2, 0, 0.2]} rotY={-0.5} />
        <Geladeira pos={[-2.2, 0, 0]} rotY={0.5} cor={BRONZE} expr="feliz" />
        <TitoRei pos={[0.3, 0, 1.4]} expr={f >= l4 ? "chocado" : "triste"} pose={f >= l4 ? "chocado" : "parado"} molhado />
        <Nuvem pos={[0, 3.4, 0.3]} escala={f < tempest ? 0.8 : 1.6} escura={lerp(f, 0, 12, 0, 1)} expr="bravo" />
        <Chuva centro={[0, 0, 0.3]} largura={6} prof={3} altura={3.3} intensidade={1.6} />
        <Raio pos={[-1.2, 3.0, 0.4]} at={tempest + 2} />
        <Raio pos={[1.5, 3.0, 0.4]} at={l2 + 6} />
      </Canvas>
      <Onomatopeia texto="ATCHIM!" at={0} x={540} y={620} dur={30} />
      {f >= tenis && <Onomatopeia texto="SPLASH!" at={tenis} x={540} y={640} cor="#8FD3FF" dur={30} />}
      <Sfx at={0} nome="boom" vol={0.6} />
      <Sfx at={tempest} nome="ronco" vol={0.5} />
      <Sfx at={tempest + 2} nome="tum" vol={0.5} />
      <Sfx at={l1} nome="borbulha" vol={0.3} />
      <Sfx at={l3} nome="pop" vol={0.5} />
      <Sfx at={tenis} nome="borbulha" vol={0.5} />
    </>
  );
};

/** 5. CANÇÃO PRA NUVEM: o Tito canta (desafinado, mas com coroa) e a nuvem solta um arco-íris. */
export const Musica: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const coroa = wordAt(scene, "coroa.");
  const l2 = lineStart(scene, 2);
  const arco = wordAt(scene, "arco-íris!");
  const calma = lerp(f, 0, l2, 1, 0);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente([0.4, 0, 1.2], -0.2, 3.2, 1.8, 36) },
            { f: l1, ...frente([0.4, 0, 1.2], -0.2, 2.4, 2.1, 32), corte: true },
            { f: coroa, ...frente([0.4, 0, 1.2], -0.2, 1.8, 2.55, 30), corte: true },
            { f: l2, pos: [-0.3, 2.9, 3.6], alvo: [-0.6, 2.9, 0.3], fov: 36, corte: true },
            { f: arco, pos: [0, 2.4, 8.6], alvo: [0, 1.7, 0], fov: 48, corte: true },
          ]}
        />
        <Cozinha3D />
        <TitoRei pos={[0.4, 0, 1.2]} rotY={-0.2} expr={f >= l1 && f < l2 ? "malandro" : "animado"} pose="explicando" boca={f < l2 ? mouth : 0} brilhoCoroa={f >= coroa ? 1 : 0} />
        {[0, 20, 40].map((d, i) => (
          <NotaMusical key={i} pos={[0.3 + i * 0.25, 2.5, 1.4]} at={d} />
        ))}
        <Nuvem pos={[-0.6, 2.9, 0.3]} escala={1.1} escura={calma * 0.6} expr={f >= l2 ? "feliz" : "zen"} danca={f >= l2 ? 1 : 0.2} />
        {f >= arco && <ArcoIris pos={[-0.6, 0, -1.0]} raio={2.6} mostra={lerp(f, arco, arco + 20)} />}
        <Capivara pos={[2.3, 0, 0]} rotY={-0.5} />
      </Canvas>
      {f >= l1 && f < l2 && <Onomatopeia texto="LÁ-LÁ-LÁÁÁ!" at={l1} x={540} y={600} dur={40} rot={-4} />}
      <Sfx at={4} nome="apito" vol={0.35} />
      <Sfx at={l1 + 10} nome="apito" vol={0.35} />
      <Sfx at={coroa} nome="sparkle" vol={0.5} />
      <Sfx at={arco} nome="tada" vol={0.45} />
    </>
  );
};

/** 6. ESCORREGADOR DE ARCO-ÍRIS: o leite desce gritando de alegria; a capivara vai atrás... bem devagarinho. */
export const Arcoiris: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const desceu = wordAt(scene, "desceu");
  const l1 = lineStart(scene, 1);
  const deva = wordAt(scene, "devagarinho.");
  const R = 2.6;
  const th = lerp(f, desceu, desceu + 45, Math.PI * 0.5, Math.PI * 0.97);
  const lx = -0.6 + Math.cos(th) * R;
  const ly = Math.sin(th) * R;
  const tc = lerp(f, l1 + 10, l1 + 200, Math.PI * 0.12, Math.PI * 0.2);
  const cx = -0.6 + Math.cos(tc) * R;
  const cy = Math.sin(tc) * R;
  return (
    <>
      <Canvas fundo="#9FD3F0">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [-0.6, 2.4, 9.0], alvo: [-0.6, 1.5, -1.0], fov: 48 },
            { f: desceu + 15, pos: [-1.6, 1.6, 3.6], alvo: [-2.2, 1.2, -1.0], fov: 38, corte: true },
            { f: l1, pos: [1.5, 2.2, 3.8], alvo: [1.6, 2.0, -1.0], fov: 36, corte: true },
            { f: deva, pos: [1.5, 2.1, 2.8], alvo: [1.6, 2.0, -1.0], fov: 30 },
          ]}
        />
        <Cozinha3D />
        <ArcoIris pos={[-0.6, 0, -1.0]} raio={R} />
        <group position={[lx, ly - 0.05, -1.0]} rotation={[0, 0, th - Math.PI / 2]}>
          <Leite pos={[0, 0, 0]} expr="feliz" escala={0.8} boca={f >= desceu ? 0.8 : 0} />
        </group>
        <group position={[cx, cy, -1.0]} rotation={[0, 0, tc - Math.PI / 2]}>
          <Capivara pos={[0, 0, 0]} rotY={Math.PI / 2} escala={0.55} />
        </group>
        <TitoRei pos={[0.6, 0, 1.4]} rotY={-0.3} expr="feliz" pose="bracosPraCima" />
      </Canvas>
      {f >= desceu && f < l1 && <Onomatopeia texto="UHUUUU!" at={desceu} x={540} y={620} dur={45} />}
      {f >= deva && <Placa texto="1 CM POR HORA" at={deva} y={1430} />}
      <Sfx at={desceu} nome="apito" vol={0.3} />
      <Sfx at={desceu + 15} nome="whoosh" vol={0.3} />
      <Sfx at={deva} nome="tum" vol={0.4} />
    </>
  );
};

/** 7. FINAL (gancho para o ep. 3): batem na porta e deixam uma caixa que faz TIC-TAC. "CONTINUA…" */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const bateu = wordAt(scene, "bateu");
  const l1 = lineStart(scene, 1);
  const tictac = wordAt(scene, "tic-tac.");
  const l2 = lineStart(scene, 2);
  const proximo = wordAt(scene, "próximo");
  const caixa = mola(f, l1 + 6);
  return (
    <>
      <Canvas fundo="#4A3A6A">
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#B8A8FF", "#3A2A4A", 0.5]} />
        <directionalLight position={[3, 6, 5]} intensity={0.9} />
        <CameraRig
          keys={[
            { f: 0, pos: [0.8, 2.0, 6.6], alvo: [1.6, 1.3, -1.5], fov: 44 },
            { f: bateu + 4, pos: [2.0, 1.6, 1.6], alvo: [2.5, 1.2, -2.8], fov: 36, corte: true },
            { f: l1, pos: [1.2, 1.2, 1.4], alvo: [2.3, 0.4, -1.8], fov: 36, corte: true },
            { f: tictac, pos: [2.3, 0.8, 0.2], alvo: [2.3, 0.35, -1.8], fov: 30, corte: true },
            { f: l2, ...frente([0, 0, 0.8], 0.5, 2.8, 2.0, 34), corte: true },
            { f: proximo, pos: [2.3, 1.0, 0.0], alvo: [2.3, 0.35, -1.8], fov: 34, corte: true },
          ]}
          shakes={[bateu, bateu + 12]}
          amp={0.03}
        />
        <Cozinha3D />
        <Porta pos={[2.5, 0, -2.88]} batida={bateu} />
        {f >= l1 && (
          <group scale={caixa}>
            <CaixaMisterio pos={[2.3, 0, -1.8]} />
          </group>
        )}
        <TitoRei pos={[0, 0, 0.8]} rotY={0.5} expr={f >= l2 ? "chocado" : "neutro"} pose={f >= l2 ? "chocado" : "parado"} olhar={[0.8, 0]} />
        <Capivara pos={[-1.6, 0, -0.4]} rotY={0.6} />
      </Canvas>
      <Onomatopeia texto="TOC TOC" at={bateu} x={700} y={620} dur={28} cor="#FFD23F" />
      {f >= tictac && <Onomatopeia texto="TIC-TAC" at={tictac} x={540} y={600} dur={60} />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={520} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={l2 + 10} y={1430} />
      <Sfx at={bateu} nome="tum" vol={0.6} />
      <Sfx at={bateu + 12} nome="tum" vol={0.6} />
      {[0, 15, 30, 45, 60, 75].map((d) => <Sfx key={d} at={tictac + d} nome="click" vol={0.45} />)}
      <Sfx at={l2} nome="riser" vol={0.4} />
      <Sfx at={proximo} nome="boom" vol={0.45} />
    </>
  );
};
