import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Geladeira, Leite, Mesa, Queijo } from "../../objetos/Cozinha";
import { CaixaMisterio, Chuva, Nuvem } from "../../objetos/Clima";
import { Pegadas, QuadroBranco, RelogioGerente } from "../../objetos/Relogio";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Episódio 3 — "O relógio gerente" (abre a caixa tic-tac do ep. 2). */

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
/** relógio maior (≈1,45 de altura) e altura do rosto dele */
const RE = 1.3;
const ROSTO = 0.8;
const MESA = 0.86;

/** Linhas de velocidade (modo turbo), em 2D por cima. */
const Velocidade: React.FC<{ forca: number }> = ({ forca }) => {
  const f = useCurrentFrame();
  if (forca <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const y = (i * 137 + f * 40) % 1920;
        const x = (i * 271) % 1080;
        return <rect key={i} x={x} y={y} width={10} height={160} rx={5} fill="#FFFFFF" opacity={0.55 * forca} />;
      })}
    </svg>
  );
};

/** 1. GANCHO: "A caixa abriu… e era um relógio mandão." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const abriu = wordAt(scene, "abriu…");
  const relogio = wordAt(scene, "relógio");
  const mandao = wordAt(scene, "mandão.");
  const sai = mola(f, relogio - 4, 220);
  return (
    <>
      <Canvas fundo="#4A3A6A">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.8, 0.9, 2.4], alvo: [0.8, 0.35, 0.2], fov: 34 },
            { f: abriu, pos: [0.4, 1.9, 7.2], alvo: [0.4, 1.1, 0.4], fov: 40, corte: true },
            { f: mandao, ...frente([0.8, 0, 0.2], 0, 4.4, ROSTO, 32), corte: true },
          ]}
          shakes={[abriu, mandao]}
        />
        <Cozinha3D />
        {f < abriu + 6 && <CaixaMisterio pos={[0.8, 0, 0.2]} escala={f < abriu ? 1 : lerp(f, abriu, abriu + 6, 1, 0.01)} />}
        {f >= relogio - 4 && (
          <group position={[0.8, 0, 0.2]} scale={sai}>
            <RelogioGerente expr="bravo" toca={f >= mandao} escala={RE} />
          </group>
        )}
        <TitoRei pos={[-0.35, 0, 1.0]} rotY={0.6} expr={f >= abriu ? "chocado" : "neutro"} pose={f >= abriu ? "chocado" : "parado"} olhar={[0.8, -0.3]} />
      </Canvas>
      {f < abriu && <Onomatopeia texto="TIC-TAC" at={0} x={540} y={600} dur={abriu} />}
      <Onomatopeia texto="PLOC!" at={abriu} x={540} y={620} dur={20} />
      <Sfx at={0} nome="click" vol={0.5} />
      <Sfx at={15} nome="click" vol={0.5} />
      <Sfx at={30} nome="click" vol={0.5} />
      <Sfx at={abriu} nome="pop" vol={0.7} />
      <Sfx at={relogio - 4} nome="boing" vol={0.5} />
      <Sfx at={mandao} nome="alarme" vol={0.35} />
    </>
  );
};

/** 2. O NOVO GERENTE: pula na mesa e grita; o Tito fica sem palavras… e sem cargo. */
export const Chefe: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const pulou = wordAt(scene, "pulou");
  const gerente = wordAt(scene, "gerente!");
  const l1 = lineStart(scene, 1);
  const cargo = wordAt(scene, "cargo.");
  const t = lerp(f, pulou, pulou + 14);
  const x = 0.8 - t * 0.8;
  const y = Math.sin(t * Math.PI) * 0.9 + t * 0.86;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 7.0], alvo: [0, 1.1, 0.3], fov: 44 },
            { f: gerente, ...frente([0, MESA, 0.3], 0, 4.4, ROSTO, 32), corte: true },
            { f: l1, ...frente([-1.4, 0, 1.3], 0.5, 3.4, 1.8, 36), corte: true },
            { f: cargo, ...frente([-1.4, 0, 1.3], 0.5, 2.5, 2.1, 32), corte: true },
          ]}
          shakes={[gerente]}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 0.3]} />
        <RelogioGerente pos={[x, y, 0.3]} escala={RE} expr="bravo" boca={f >= gerente && f < l1 ? Math.max(0.6, mouth) : 0} toca={f >= gerente && f < gerente + 20} />
        <TitoRei pos={[-1.4, 0, 1.3]} rotY={0.5} expr={f >= cargo ? "triste" : "chocado"} pose={f >= cargo ? "parado" : "chocado"} olhar={[0.3, -0.2]} coroa={f >= cargo ? 0.5 : 0} />
      </Canvas>
      {f >= gerente && f < l1 && <Onomatopeia texto="GERENTE!" at={gerente} x={540} y={600} dur={40} cor="#FF6B6B" rot={-5} />}
      <Placa texto="SEM CARGO" at={cargo} y={1430} />
      <Sfx at={pulou} nome="boing" vol={0.6} />
      <Sfx at={pulou + 14} nome="tum" vol={0.6} />
      <Sfx at={gerente} nome="alarme" vol={0.3} />
      <Sfx at={cargo} nome="apito" vol={0.4} />
    </>
  );
};

/** Quadro de horários (texto 2D sobre o quadro branco). */
const Quadro: React.FC<{ linhas: { txt: string; at: number }[]; riscadoAt: number }> = ({ linhas, riscadoAt }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 450, padding: "26px 34px", background: "#FFFFFF", border: "12px solid #8A93A6", borderRadius: 16, boxShadow: "0 12px 0 #111" }}>
      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 72, color: "#E23B3B", textAlign: "center", marginBottom: 8 }}>HORÁRIOS</div>
      {linhas.map((l, i) => {
        const s = spring({ frame: f - l.at, fps: 30, config: { damping: 12, stiffness: 220 } });
        if (f < l.at) return null;
        const risca = i === linhas.length - 1 && f >= riscadoAt;
        return (
          <div key={i} style={{ position: "relative", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 60, color: "#1F1B2E", transform: `scale(${s})`, transformOrigin: "left center", margin: "6px 0" }}>
            {l.txt}
            {risca && <div style={{ position: "absolute", left: -8, right: -8, top: "50%", height: 10, background: "#E23B3B", transform: "rotate(-3deg)" }} />}
          </div>
        );
      })}
    </div>
  );
};

/** 3. QUADRO DE HORÁRIOS: geladeira 8h, nuvem 15h, Tito rei só no fim de semana, capivara no horário (nunca). */
export const Horarios: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const [l1, l2, l3, l4, l5] = [1, 2, 3, 4, 5].map((i) => lineStart(scene, i));
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 6.0], alvo: [0, 1.9, -1.5], fov: 44 },
            { f: l1 + 20, ...frente([-2.2, 0, 0], 0.5, 4.0, 1.6, 36), corte: true },
            { f: l2 - 4, pos: [0, 2.2, 6.0], alvo: [0, 1.9, -1.5], fov: 44, corte: true },
            { f: l2, pos: [0, 2.2, 6.0], alvo: [0, 1.9, -1.5], fov: 44, corte: true },
            { f: l2 + 18, pos: [1.6, 3.0, 4.6], alvo: [1.6, 2.8, 0.3], fov: 36, corte: true },
            { f: l3, pos: [0, 2.2, 6.0], alvo: [0, 1.9, -1.5], fov: 44, corte: true },
            { f: l3 + 22, ...frente([0, 0, 1.3], 0, 2.7, 2.0, 34), corte: true },
            { f: l4, pos: [0, 2.2, 6.0], alvo: [0, 1.9, -1.5], fov: 44, corte: true },
            { f: l4 + 20, ...frente([2.2, 0, 0.4], -0.5, 4.2, 0.9, 34), corte: true },
            { f: l5, ...frente([2.2, 0, 0.4], -0.5, 3.4, 0.95, 30), corte: true },
          ]}
        />
        <Cozinha3D />
        <QuadroBranco pos={[0, 2.1, -2.85]} />
        <RelogioGerente pos={[-0.9, 0, -1.6]} rotY={0.3} expr="bravo" escala={RE} />
        <Geladeira pos={[-2.2, 0, 0]} rotY={0.5} cor={BRONZE} expr={f >= l1 + 20 ? "chocado" : "feliz"} />
        <Nuvem pos={[1.6, 2.8, 0.3]} escala={0.8} expr={f >= l2 + 18 ? "triste" : "feliz"} />
        <TitoRei pos={[0, 0, 1.3]} expr={f >= l3 + 22 ? "triste" : "neutro"} pose="parado" coroa={f >= l3 + 22 ? 0.5 : 0} />
        <Capivara pos={[2.2, 0, 0.4]} rotY={-0.5} />
      </Canvas>
      {(f < l1 + 20 || (f >= l2 - 4 && f < l2 + 18) || (f >= l3 && f < l3 + 22) || (f >= l4 && f < l4 + 20)) && (
        <Quadro
          linhas={[
            { txt: "GELADEIRA → GELAR 8H", at: l1 },
            { txt: "NUVEM → CHOVER 15H", at: l2 },
            { txt: "TITO → REI SÁB E DOM", at: l3 },
            { txt: "CAPIVARA → NO HORÁRIO", at: l4 },
          ]}
          riscadoAt={l5}
        />
      )}
      {f >= l5 && <Onomatopeia texto="NUNCA." at={l5} x={540} y={620} dur={60} rot={-4} />}
      <Sfx at={0} nome="pop" vol={0.5} />
      {[l1, l2, l3, l4].map((a, i) => <Sfx key={i} at={a} nome="click" vol={0.5} />)}
      <Sfx at={l3 + 22} nome="apito" vol={0.35} />
      <Sfx at={l5} nome="tum" vol={0.5} />
    </>
  );
};

/** 4. MODO TURBO: tempo acelerado — chuva rápida, leite envelhece e vira queijo, a capivara CORRE. */
export const Turbo: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const acelerou = wordAt(scene, "acelerou");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const queijo = wordAt(scene, "queijo,");
  const l3 = lineStart(scene, 3);
  const correu = wordAt(scene, "correu.");
  const cx = lerp(f, correu - 6, correu + 24, -3.5, 3.5);
  return (
    <>
      <Canvas fundo="#9FD3F0">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente([0, MESA, 0.3], 0, 4.4, ROSTO, 32) },
            { f: l1, pos: [0, 2.7, 5.4], alvo: [0, 2.4, 0], fov: 40, corte: true },
            { f: l2, pos: [-1.2, 1.5, 2.2], alvo: [-1.2, 1.25, 0.3], fov: 32, corte: true },
            { f: l3, pos: [0, 1.4, 7.0], alvo: [0, 0.8, 0.5], fov: 46, corte: true },
          ]}
          shakes={[acelerou, queijo, correu]}
          amp={0.05}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 0.3]} />
        <RelogioGerente pos={[0, MESA, 0.3]} escala={RE} expr="bravo" turbo={f >= acelerou} toca={f >= acelerou && f < l1} />
        <Nuvem pos={[0, 2.6, 0]} escala={0.8} expr="chocado" />
        {f >= l1 && f < l3 && <Chuva centro={[0, 0.9, 0]} largura={1.4} prof={0.8} altura={1.6} intensidade={0.9} velocidade={4} />}
        {f < queijo ? <Leite pos={[-1.2, MESA, 0.3]} expr="chocado" escala={0.75} /> : <Queijo pos={[-1.2, MESA, 0.3]} />}
        {f >= l3 && <Capivara pos={[cx, 0, 1.2]} rotY={Math.PI / 2} correndo={f >= correu - 6} />}
      </Canvas>
      <Velocidade forca={f >= acelerou ? 1 : 0} />
      <Onomatopeia texto="ZUUUM!" at={acelerou} x={540} y={600} dur={24} />
      {f >= queijo && f < l3 && <Onomatopeia texto="PUF! VIROU QUEIJO" at={queijo} x={540} y={620} dur={40} cor="#FFD23F" rot={-6} />}
      {f >= correu && <Onomatopeia texto="ELA CORREU!" at={correu} x={540} y={600} dur={50} />}
      <Sfx at={acelerou} nome="riser" vol={0.45} />
      <Sfx at={acelerou + 4} nome="whoosh" vol={0.5} />
      <Sfx at={l1} nome="borbulha" vol={0.4} />
      <Sfx at={queijo} nome="pop" vol={0.6} />
      <Sfx at={correu - 6} nome="whoosh" vol={0.6} />
      {[0, 4, 8, 12, 16].map((d) => <Sfx key={d} at={correu - 4 + d} nome="click" vol={0.3} />)}
    </>
  );
};

/** 5. RELÓGIO SUPERAQUECIDO: apita sem parar; o Tito aperta a soneca e o gerente dorme na hora. */
export const Soneca: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const soneca = wordAt(scene, "soneca…");
  const dormiu = wordAt(scene, "dormiu");
  const quente = lerp(f, 0, l1, 0.2, 1) * (f >= soneca + 4 ? lerp(f, soneca + 4, soneca + 30, 1, 0) : 1);
  const toca = f >= l1 && f < soneca + 4;
  return (
    <>
      <Canvas fundo={toca ? "#E87A5A" : "#7FC8A9"}>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente([0, MESA, 0.3], 0, 5.0, ROSTO, 34) },
            { f: l1, ...frente([0, MESA, 0.3], 0, 3.6, ROSTO, 30), corte: true },
            { f: l2, pos: [1.2, 2.4, 5.4], alvo: [0.6, 1.5, 0.6], fov: 40, corte: true },
            { f: soneca, pos: [0.3, 3.9, 3.0], alvo: [0, 2.0, 0.3], fov: 34, corte: true },
            { f: dormiu, ...frente([0, MESA, 0.3], 0, 4.4, ROSTO, 32), corte: true },
          ]}
          shakes={toca ? [l1, l1 + 12, l1 + 24, l1 + 36] : []}
          amp={0.04}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 0.3]} />
        <RelogioGerente pos={[0, MESA, 0.3]} escala={RE} expr={toca ? "nervoso" : "bravo"} quente={quente} toca={toca} dorme={f >= dormiu} />
        <TitoRei pos={[1.3, 0, 1.0]} rotY={-0.6} expr={f >= dormiu ? "malandro" : "bravo"} pose={f >= l2 ? "apontando" : "chocado"} bracoD={f >= soneca - 6 && f < dormiu ? [-1.2, 0.35] : undefined} />
      </Canvas>
      {toca && f < soneca && <Onomatopeia texto="TRIIIIIM!" at={l1} x={540} y={600} dur={soneca - l1} rot={-4} />}
      {f >= soneca && f < dormiu && <Onomatopeia texto="CLIC!" at={soneca} x={540} y={640} dur={20} />}
      {f >= dormiu && <Onomatopeia texto="ZZZ…" at={dormiu} x={600} y={560} dur={80} cor="#BFE6FF" rot={-8} />}
      <Sfx at={0} nome="ronco" vol={0.3} />
      <Sfx at={l1} nome="alarme" vol={0.4} />
      <Sfx at={l1 + 40} nome="alarme" vol={0.4} />
      <Sfx at={soneca} nome="click" vol={0.7} />
      <Sfx at={dormiu} nome="apito" vol={0.3} />
    </>
  );
};

/** 6. FINAL (gancho ep. 4): todos comemoram… a coroa do Tito sumiu! Pegadinhas até a janela. "CONTINUA…" */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const perceber = wordAt(scene, "perceber");
  const coroa = wordAt(scene, "coroa");
  const l2 = lineStart(scene, 2);
  const proximo = wordAt(scene, "próximo");
  const peg = lerp(f, l2, l2 + 30);
  return (
    <>
      <Canvas fundo={f >= l2 ? "#4A3A6A" : "#FFB86B"}>
        <Luzes quente={f < l2} />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.3, 8.6], alvo: [0, 1.4, 0.3], fov: 48 },
            { f: perceber, ...frente([0, 0, 1.0], 0, 3.6, 1.7, 36), corte: true },
            { f: coroa, ...frente([0, 0, 1.0], 0, 2.6, 2.1, 34), corte: true },
            { f: l2, pos: [0.2, 1.6, 3.6], alvo: [1.4, 0.2, -1.6], fov: 42, corte: true },
            { f: proximo, pos: [1.6, 2.6, 0.6], alvo: [1.8, 3.2, -2.9], fov: 40, corte: true },
          ]}
          shakes={[coroa]}
        />
        <Cozinha3D />
        <Geladeira pos={[-2.2, 0, 0]} rotY={0.5} cor={BRONZE} expr="feliz" />
        <Capivara pos={[2.2, 0, 0.3]} rotY={-0.5} />
        <Nuvem pos={[-0.9, 3.0, -0.6]} escala={0.7} expr="feliz" danca={f < coroa ? 1 : 0} />
        <RelogioGerente pos={[1.0, 0, -0.8]} rotY={-0.2} escala={RE} dorme />
        <TitoRei pos={[0, 0, 1.0]} expr={f >= coroa ? "chocado" : "animado"} pose={f >= coroa ? "chocado" : "bracosPraCima"} pulo={f < perceber ? Math.abs(Math.sin(f * 0.3)) * 0.25 : 0} semCoroa={f >= coroa} />
        <Pegadas de={[0.4, 0, 0.6]} ate={[1.8, 0, -2.6]} n={9} mostra={peg} />
      </Canvas>
      {f < perceber && <Onomatopeia texto="ÊÊÊÊ!" at={4} x={540} y={600} dur={perceber - 4} />}
      {f >= coroa && f < l2 && <Onomatopeia texto="CADÊ?!" at={coroa} x={540} y={600} dur={60} cor="#FFD23F" rot={-5} />}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={l2 + 30} y={1430} />
      <Sfx at={4} nome="tada" vol={0.45} />
      <Sfx at={coroa} nome="boom" vol={0.5} />
      <Sfx at={l2} nome="riser" vol={0.35} />
      {[0, 4, 8, 12, 16, 20, 24, 28].map((d) => <Sfx key={d} at={l2 + d} nome="click" vol={0.25} />)}
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
