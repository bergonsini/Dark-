import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D } from "../../cenarios/Cenarios";
import { Geladeira, Mesa } from "../../objetos/Cozinha";
import { Chuva, Nuvem, Porta, Urna, Vaso } from "../../objetos/Clima";
import { MicroOndas } from "../../objetos/MicroOndas";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Caixa, Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 5 — "A grande eleição" (responde "quem é o candidato da coroa maior?" do ep. 4). */

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
const ME = 1.3; // escala do micro-ondas
const ROSTO_M = 0.82 * ME;
/** posições fixas dos candidatos */
const PM: [number, number, number] = [1.5, 0, -0.2];
const PP: [number, number, number] = [-1.6, 0, -0.4];
const PT: [number, number, number] = [0, 0, 0.6];
const PC: [number, number, number] = [0.2, 0, 1.6];

/** Placar da apuração (2D). */
const Placar: React.FC<{ linhas: { nome: string; votos: string; at: number }[] }> = ({ linhas }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 400, background: "#1F1B2E", border: "10px solid #FFD23F", borderRadius: 24, padding: "20px 34px", boxShadow: "0 14px 0 #111" }}>
      {linhas.map((l, i) => {
        const s = spring({ frame: f - l.at, fps: 30, config: { damping: 12, stiffness: 220 } });
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 64, color: "#fff", margin: "6px 0", opacity: f >= l.at ? 1 : 0.25 }}>
            <span>{l.nome}</span>
            <span style={{ color: "#FFD23F", transform: `scale(${f >= l.at ? s : 1})` }}>{f >= l.at ? l.votos : "…"}</span>
          </div>
        );
      })}
    </div>
  );
};

/** 1. GANCHO: o candidato misterioso era… um MICRO-ONDAS! */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const mo = wordAt(scene, "micro-ondas!");
  const luz = f >= mo;
  return (
    <>
      <Canvas fundo={luz ? "#7FC8A9" : "#2A2140"}>
        <Luzes quente={luz} />
        <CameraRig
          keys={[
            { f: 0, pos: [1.6, 1.4, 3.4], alvo: [2.2, 1.2, -2.2], fov: 42 },
            { f: mo, ...frente([2.2, 0, -1.9], -0.3, 4.6, 1.3, 36), corte: true },
            { f: mo + 22, pos: [0, 2.2, 7.6], alvo: [0.6, 1.2, -0.6], fov: 46, corte: true },
          ]}
          shakes={[mo]}
        />
        <Cozinha3D />
        <Porta pos={[2.6, 0, -2.88]} />
        <MicroOndas pos={[2.2, 0, -1.9]} rotY={-0.3} escala={ME} expr={luz ? "feliz" : "bravo"} apito={!luz} />
        <TitoRei pos={[-0.4, 0, 0.9]} rotY={0.5} expr="chocado" pose="chocado" semCoroa boca={0} />
        <Vaso pos={[-1.9, 0, -0.6]} cresce={1} escala={1.1} coroa expr="chocado" />
      </Canvas>
      {luz && <Onomatopeia texto="PLIM!" at={mo} x={540} y={600} dur={22} />}
      <Sfx at={0} nome="riser" vol={0.35} />
      <Sfx at={mo} nome="ding" vol={0.6} />
      <Sfx at={mo + 22} nome="tum" vol={0.4} />
    </>
  );
};

/** 2. AS PROMESSAS: 30 segundos (até as férias), sombra e água fresca, e o Tito quer a coroa de volta. */
export const Promessas: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const trinta = wordAt(scene, "trinta");
  const ferias = wordAt(scene, "férias.");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const coroa = wordAt(scene, "coroa");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, -0.3, 6.2, ROSTO_M + 0.15, 34) },
            { f: ferias, ...frente(PM, -0.3, 5.2, ROSTO_M + 0.15, 30), corte: true },
            { f: l1, ...frente(PP, 0.3, 4.2, 2.9, 34), corte: true },
            { f: l2, ...frente(PT, 0, 3.2, 1.9, 34), corte: true },
            { f: coroa, ...frente(PT, 0, 3.0, 2.0, 32), corte: true },
          ]}
          shakes={[ferias, coroa]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} boca={f < l1 ? mouth : 0} expr="feliz" />
        <Vaso pos={PP} cresce={1} escala={1.15} coroa boca={f >= l1 && f < l2 ? mouth : 0} expr="feliz" />
        <TitoRei pos={PT} expr={f >= coroa ? "bravo" : "triste"} pose={f >= coroa ? "apontando" : "parado"} semCoroa boca={f >= l2 ? mouth : 0} />
      </Canvas>
      <Placa texto="TUDO EM 30 s" at={trinta} y={1430} ate={l1} />
      {f >= ferias && f < l1 && <Onomatopeia texto="ATÉ AS FÉRIAS?!" at={ferias} x={540} y={600} dur={l1 - ferias} cor="#FF6B6B" />}
      <Placa texto="SOMBRA E ÁGUA FRESCA" at={l1 + 10} y={1430} ate={l2} />
      {f >= coroa && <Onomatopeia texto="MINHA COROA!" at={coroa} x={540} y={600} dur={60} cor="#FFD23F" />}
      <Sfx at={trinta} nome="ding" vol={0.45} />
      <Sfx at={ferias} nome="boing" vol={0.45} />
      <Sfx at={l1 + 10} nome="sparkle" vol={0.4} />
      <Sfx at={coroa} nome="tum" vol={0.45} />
    </>
  );
};

/** 3. O DEBATE: o micro-ondas fica nervoso, gira… e APITA no meio da resposta. */
export const Debate: React.FC<CenaProps> = ({ scene }) => {
  const { f, mouth } = useCena(scene);
  const nervoso = wordAt(scene, "nervoso…");
  const girar = wordAt(scene, "girar.");
  const l1 = lineStart(scene, 1);
  const apitou = wordAt(scene, "apitou");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 8.0], alvo: [0, 1.2, -0.2], fov: 46 },
            { f: nervoso, ...frente(PM, -0.3, 5.8, ROSTO_M + 0.15, 34), corte: true },
            { f: girar, ...frente(PM, -0.3, 3.8, ROSTO_M - 0.15, 32), corte: true },
            { f: l1, pos: [0, 2.2, 8.0], alvo: [0, 1.2, -0.2], fov: 46, corte: true },
            { f: apitou, ...frente(PM, -0.3, 5.2, ROSTO_M + 0.15, 32), corte: true },
          ]}
          shakes={[apitou, apitou + 8, apitou + 16]}
        />
        <Cozinha3D />
        {/* púlpitos */}
        {[PM, PP, PT].map((p, i) => (
          <Caixa key={i} p={[p[0] + (i === 0 ? -0.9 : 0), 0.3, p[2] + 0.9]} s={[0.7, 0.6, 0.3]} c={["#3A86FF", "#3DDC84", "#FFD23F"][i]} />
        ))}
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={f >= nervoso ? "nervoso" : "feliz"} treme={f >= nervoso} girando={f >= girar} apito={f >= apitou} boca={f >= l1 ? mouth : 0} />
        <Vaso pos={PP} cresce={1} escala={1.15} coroa expr={f >= apitou ? "chocado" : "feliz"} />
        <TitoRei pos={PT} expr={f >= apitou ? "chocado" : "neutro"} pose={f >= apitou ? "chocado" : "parado"} semCoroa />
      </Canvas>
      <Placa texto="DEBATE" at={4} y={1430} ate={nervoso} />
      {f >= girar && f < l1 && <Onomatopeia texto="VRRRRR" at={girar} x={540} y={600} dur={l1 - girar} />}
      {f >= apitou && <Onomatopeia texto="PI! PI! PI!" at={apitou} x={540} y={600} dur={60} cor="#FF6B6B" />}
      <Sfx at={4} nome="tada" vol={0.3} />
      <Sfx at={girar} nome="ronco" vol={0.4} />
      <Sfx at={apitou} nome="apito" vol={0.4} />
      <Sfx at={apitou + 8} nome="apito" vol={0.4} />
      <Sfx at={apitou + 16} nome="apito" vol={0.4} />
    </>
  );
};

/** 4. VOTAÇÃO: geladeira vota, nuvem vota e chove na urna; a capivara nem vota (medita). */
export const Votacao: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const nuvem = wordAt(scene, "nuvem");
  const choveu = wordAt(scene, "choveu");
  const l1 = lineStart(scene, 1);
  const medit = wordAt(scene, "meditando.");
  const voto = (at: number, de: [number, number, number]) => {
    const t = lerp(f, at, at + 14);
    if (t <= 0 || t >= 1) return null;
    return <Caixa p={[de[0] + (0 - de[0]) * t, de[1] + Math.sin(t * Math.PI) * 0.8 + (1.6 - de[1]) * t, de[2] + (0.8 - de[2]) * t]} s={[0.22, 0.02, 0.3]} c="#FFFFFF" />;
  };
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [-0.6, 1.8, 5.6], alvo: [-0.6, 1.3, 0.4], fov: 42 },
            { f: nuvem, pos: [0.2, 2.4, 4.4], alvo: [0, 1.8, 0.6], fov: 40, corte: true },
            { f: choveu, pos: [0.2, 1.6, 3.0], alvo: [0, 1.2, 0.8], fov: 36, corte: true },
            { f: l1, ...frente([PC[0], 0, PC[2] + 0.7], 0, 3.6, 1.0, 34), corte: true },
            { f: medit, ...frente([PC[0], 0, PC[2] + 0.7], 0, 3.0, 1.0, 32), corte: true },
          ]}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 0.8]} />
        <Urna pos={[0, 0.86, 0.8]} />
        <Geladeira pos={[-1.6, 0, 0.4]} rotY={0.6} cor={BRONZE} expr="feliz" bracos={1} />
        {voto(12, [-1.2, 1.4, 0.6])}
        <Nuvem pos={[0.1, 2.5, 0.8]} escala={0.6} expr="feliz" />
        {voto(nuvem + 6, [0.1, 2.2, 0.8])}
        {f >= choveu && f < l1 && <Chuva centro={[0, 1.6, 0.8]} largura={0.6} prof={0.4} altura={0.8} intensidade={0.8} />}
        <Capivara pos={PC} zen fechado={0.95} />
      </Canvas>
      <Placa texto="VOTE!" at={4} y={1430} ate={nuvem} />
      {f >= choveu && f < l1 && <Onomatopeia texto="SPLASH" at={choveu} x={540} y={600} dur={l1 - choveu} cor="#BFE6FF" />}
      {f >= medit && <Placa texto="ZEN…" at={medit} y={1430} />}
      <Sfx at={12} nome="pop" vol={0.4} />
      <Sfx at={nuvem + 6} nome="pop" vol={0.4} />
      <Sfx at={choveu} nome="borbulha" vol={0.4} />
      <Sfx at={medit} nome="ronco" vol={0.3} />
    </>
  );
};

/** 5. APURAÇÃO: 2 a 2… Tito 1 (o dele mesmo). EMPATE! Desempate: vence o mais CALMO. */
export const Apuracao: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const dois1 = wordAt(scene, "micro-ondas,");
  const planta = wordAt(scene, "planta,");
  const l1 = lineStart(scene, 1);
  const mesmo = wordAt(scene, "mesmo.");
  const l2 = lineStart(scene, 2);
  const calmo = wordAt(scene, "calmo.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.0, 8.2], alvo: [0, 1.0, -0.2], fov: 46 },
            { f: l1, ...frente(PT, 0, 3.0, 1.9, 34), corte: true },
            { f: mesmo, ...frente(PT, 0, 3.0, 2.0, 32), corte: true },
            { f: l2, pos: [0, 2.0, 8.2], alvo: [0, 1.0, -0.2], fov: 46, corte: true },
            { f: calmo, pos: [0, 2.6, 9.0], alvo: [0, 1.0, -0.2], fov: 50, corte: true },
          ]}
          shakes={[l2]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={f >= l2 ? "chocado" : "feliz"} />
        <Vaso pos={PP} cresce={1} escala={1.15} coroa expr={f >= l2 ? "chocado" : "feliz"} />
        <TitoRei pos={PT} expr={f >= mesmo ? "malandro" : f >= l2 ? "chocado" : "feliz"} pose={f >= l1 && f < l2 ? "acenando" : "parado"} semCoroa boca={0} />
        <Capivara pos={PC} zen fechado={0.95} />
      </Canvas>
      {f < l2 && (
        <Placar
          linhas={[
            { nome: "MICRO-ONDAS", votos: "2", at: dois1 + 10 },
            { nome: "PLANTA", votos: "2", at: planta + 10 },
            { nome: "TITO", votos: "1", at: l1 + 6 },
          ]}
        />
      )}
      {f >= mesmo && f < l2 && <Onomatopeia texto="(O DELE MESMO)" at={mesmo} x={540} y={1000} dur={l2 - mesmo} cor="#fff" />}
      {f >= l2 && f < calmo && <Onomatopeia texto="EMPATE!" at={l2} x={540} y={600} dur={calmo - l2} cor="#FF6B6B" />}
      <Placa texto="DESEMPATE: O MAIS CALMO" at={calmo} y={1430} />
      <Sfx at={dois1 + 10} nome="click" vol={0.45} />
      <Sfx at={planta + 10} nome="click" vol={0.45} />
      <Sfx at={l1 + 6} nome="click" vol={0.45} />
      <Sfx at={l2} nome="boom" vol={0.45} />
      <Sfx at={calmo} nome="riser" vol={0.4} />
    </>
  );
};

/** 6. RAINHA CAPIVARA: quem é o mais calmo? A CAPIVARA! Nem era candidata… e virou rainha. */
export const Resultado: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const rainha = wordAt(scene, "rainha!");
  const coroa = f >= l1 + 8;
  const sc = mola(f, l1 + 8, 200);
  return (
    <>
      <Canvas fundo={f >= l1 ? "#FFB86B" : "#7FC8A9"}>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, -0.3, 5.6, ROSTO_M + 0.15, 34) },
            { f: 22, ...frente(PP, 0.3, 4.0, 2.9, 34), corte: true },
            { f: 44, ...frente(PT, 0, 3.0, 1.9, 34), corte: true },
            { f: l1, ...frente([PC[0], 0, PC[2] + 0.7], 0, 3.4, 1.1, 34), corte: true },
            { f: rainha, pos: [0.2, 1.0, 4.4], alvo: [0.2, 1.1, 1.6], fov: 44, corte: true },
          ]}
          shakes={[l1, rainha]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr={f >= l1 ? "triste" : "nervoso"} treme={f < l1} />
        <Vaso pos={PP} cresce={1} escala={1.15} coroa expr={f >= l1 ? "triste" : "nervoso"} />
        <TitoRei pos={PT} expr={f >= l1 ? "chocado" : "neutro"} pose={f >= l1 ? "chocado" : "parado"} semCoroa />
        <group>
          <Capivara pos={PC} zen fechado={0.85} coroa={coroa} escala={coroa ? 1 + (sc - 1) * 0.1 : 1} />
        </group>
      </Canvas>
      {f >= l1 && <Onomatopeia texto="A CAPIVARA?!" at={l1} x={540} y={600} dur={rainha - l1} cor="#FFD23F" />}
      <Placa texto="RAINHA CAPIVARA" at={rainha} y={1430} />
      <Sfx at={22} nome="click" vol={0.35} />
      <Sfx at={44} nome="click" vol={0.35} />
      <Sfx at={l1} nome="tada" vol={0.5} />
      <Sfx at={rainha} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 7. FINAL (gancho do ep. 6): o micro-ondas não aceita a derrota… CONTAGEM REGRESSIVA. O que acontece no zero? */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const regr = wordAt(scene, "regressiva.");
  const l2 = lineStart(scene, 2);
  const proximo = wordAt(scene, "próximo");
  const n = f >= regr ? Math.max(0, 10 - Math.floor((f - regr) / 12)) : -1;
  return (
    <>
      <Canvas fundo="#2A1A2E">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, -0.3, 6.0, ROSTO_M + 0.15, 34) },
            { f: l1, ...frente(PM, -0.3, 4.2, ROSTO_M + 0.3, 30), corte: true },
            { f: l2, ...frente([-1.1, 0, 1.65], 0.4, 3.4, 1.1, 34), corte: true },
            { f: proximo, ...frente(PM, -0.3, 5.2, ROSTO_M + 0.15, 30), corte: true },
          ]}
          shakes={[l1, proximo]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={-0.3} escala={ME} expr="bravo" apito={f >= l1} girando={f >= l1} boca={0} />
        <Capivara pos={[-1.4, 0, 1.0]} rotY={0.4} zen fechado={0.85} coroa />
      </Canvas>
      {n >= 0 && f < l2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 700, fontSize: 260, color: "#FF3B30", textShadow: "0 0 30px #FF3B30" }}>
          00:{String(n).padStart(2, "0")}
        </div>
      )}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={l1} nome="riser" vol={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} at={regr + i * 12} nome="apito" vol={0.25} />
      ))}
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};
