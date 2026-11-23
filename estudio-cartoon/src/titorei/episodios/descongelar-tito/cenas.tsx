import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D, Praia3D } from "../../cenarios/Cenarios";
import { Geladeira, Leite, Sorvete } from "../../objetos/Cozinha";
import { MicroOndas } from "../../objetos/MicroOndas";
import { BlocoGelo, Geladeirinha } from "../../objetos/Familia";
import { MarDePipoca } from "../../objetos/Pipoca";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Caixa, Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

/** Titorei · Ep. 9 — "Descongelando o Tito" (responde "como descongelar o Tito?" do ep. 8). */

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
const PT: V3 = [0.3, 0, 0.6]; // Tito congelado (cozinha)
const PM: V3 = [-1.7, 0, -0.6];
const PB: V3 = [1.5, 0, 1.2];
const NIVEL = 0.2;
const BRONZE = "#E8B88A";

/** Tito dentro do bloco de gelo. `gelo` 1 = bloco inteiro, 0 = derretido. */
const TitoCongelado: React.FC<{ pos: V3; gelo: number; rotY?: number; expr?: "chocado" | "feliz" | "triste" | "neutro"; molhado?: boolean; pose?: "chocado" | "parado" | "bracosPraCima" | "acenando" }> = ({ pos, gelo, rotY = 0, expr = "chocado", molhado = false, pose = "chocado" }) => (
  <group>
    <TitoRei pos={pos} rotY={rotY} expr={expr} pose={pose} semCoroa molhado={molhado} />
    <BlocoGelo pos={pos} k={gelo} />
  </group>
);

/** 1. GANCHO: "O Tito virou PICOLÉ! E ninguém sabia descongelar." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const pic = wordAt(scene, "picolé!");
  const l1 = lineStart(scene, 1);
  return (
    <>
      <Canvas fundo="#bfe6f5">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, ...frente(PT, 0, 5.4, 1.6, 38) },
            { f: pic, ...frente(PT, 0, 6.4, 1.4, 40), corte: true },
            { f: l1, pos: [0, 2.6, 8.2], alvo: [0, 1.3, -0.2], fov: 44, corte: true },
          ]}
          shakes={[pic]}
        />
        <Cozinha3D />
        <TitoCongelado pos={PT} gelo={1} />
        <MicroOndas pos={PM} rotY={0.4} escala={ME} expr="chocado" coroa={false} />
        <Geladeira pos={[-0.9, 0, -1.6]} rotY={0.2} expr="nervoso" />
        <Geladeirinha pos={PB} rotY={-0.4} expr="triste" />
        <Capivara pos={[2.0, 0, -0.4]} rotY={-0.5} zen fechado={0.85} coroa />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= pic && f < l1 && <Onomatopeia texto="PICOLÉ DE TITO" at={pic} x={540} y={600} dur={l1 - pic} cor="#7fd6ff" />}
      <Sfx at={0} nome="whoosh" vol={0.4} />
      <Sfx at={pic} nome="tum" vol={0.5} />
      <Sfx at={l1} nome="riser" vol={0.3} />
    </>
  );
};

/** 2. TENTATIVA 1: o micro-ondas tenta esquentar… o Tito não cabe na porta. Só esquentou a coroa (que ele nem tem). */
export const Tentativa1: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const esq = wordAt(scene, "esquentar.");
  const l1 = lineStart(scene, 1);
  const coube = wordAt(scene, "coube");
  const l2 = lineStart(scene, 2);
  const tem = wordAt(scene, "tem.");
  const PBl: V3 = [-0.2, 0, 0.6];
  const empurra = lerp(f, l1, coube, 0, 0.35);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PM, 0.4, 6.0, ROSTO_M + 0.3, 36) },
            { f: l1, pos: [0.6, 2.4, 6.4], alvo: [-1.0, 1.0, -0.1], fov: 42, corte: true },
            { f: coube, pos: [-0.4, 1.6, 3.8], alvo: [-1.3, 1.0, -0.4], fov: 38, corte: true },
            { f: l2, ...frente(PBl, 0.3, 4.4, 1.9, 36), corte: true },
            { f: tem, ...frente(PBl, 0.3, 4.6, 2.0, 36), corte: true },
          ]}
          shakes={[coube, tem]}
        />
        <Cozinha3D />
        <MicroOndas pos={PM} rotY={0.4} escala={ME} expr={f >= coube ? "triste" : "feliz"} coroa={false} girando={f >= esq} apito={f >= coube && f < l2} />
        <group position={[-empurra, 0, -empurra * 0.6]}>
          <TitoCongelado pos={PBl} gelo={1} rotY={0.3} />
        </group>
        {f >= l2 && (
          <group position={[PBl[0] - empurra, 2.4 + Math.sin(f * 0.3) * 0.05, PBl[2]]}>
            {[0, 1, 2].map((i) => {
              const q = ((f + i * 10) % 30) / 30;
              return <Caixa key={i} p={[-0.2 + i * 0.2, q * 0.6, 0]} s={[0.05, 0.2, 0.05]} c="#FF8A2B" o={1 - q} />;
            })}
          </group>
        )}
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= coube && f < l2 && <Onomatopeia texto="NÃO COUBE!" at={coube} x={540} y={600} dur={l2 - coube} cor="#FF6B6B" />}
      {f >= tem && <Placa texto="COROA: 0" at={tem} y={1430} />}
      <Sfx at={esq} nome="apito" vol={0.3} />
      <Sfx at={coube} nome="tum" vol={0.5} />
      <Sfx at={tem} nome="boing" vol={0.4} />
    </>
  );
};

/** 3. TENTATIVA 2: a capivara senta em cima pra esquentar… bem devagarinho. 3 horas = 1 centímetro. */
export const Tentativa2: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const devag = wordAt(scene, "devagarinho.");
  const l1 = lineStart(scene, 1);
  const cm = wordAt(scene, "centímetro.");
  const k = 1 - lerp(f, l1, cm, 0, 0.04);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PT, 0, 7.0, 2.0, 40) },
            { f: devag, ...frente([PT[0], 2.7, PT[2]], 0, 3.6, 0.8, 34), corte: true },
            { f: l1, ...frente(PT, 0, 6.2, 1.6, 38), corte: true },
            { f: cm, ...frente(PT, 0, 7.6, 1.8, 40), corte: true },
          ]}
          shakes={[cm]}
        />
        <Cozinha3D />
        <TitoCongelado pos={PT} gelo={k} />
        <Capivara pos={[PT[0], 2.7 * k, PT[2]]} zen fechado={0.9} coroa />
        <MarDePipoca nivel={NIVEL} n={40} />
      </Canvas>
      {f >= l1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 130, color: "#FFD23F", WebkitTextStroke: "12px #1F1B2E", paintOrder: "stroke fill" }}>
          {Math.min(3, Math.floor(lerp(f, l1, cm, 0, 3.99)))}h
        </div>
      )}
      {f >= cm && <Placa texto="DERRETEU 1 CM" at={cm} y={1430} />}
      <Sfx at={devag} nome="ronco" vol={0.35} />
      <Sfx at={cm} nome="tum" vol={0.4} />
    </>
  );
};

/** 4. PLANO DA GELADEIRA: PRAIA! (ela entende de bronzeado). Empurram o bloco até a areia. */
export const Praia: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const praia = wordAt(scene, "praia!");
  const l1 = lineStart(scene, 1);
  const emp = wordAt(scene, "empurraram");
  const x = lerp(f, l1, scene.endFrame - scene.startFrame, -1.8, 0.6);
  return (
    <>
      <Canvas fundo={f >= l1 ? "#7EC8FF" : "#7FC8A9"}>
        <Luzes />
        {f < l1 ? (
          <>
            <CameraRig
              keys={[
                { f: 0, ...frente([-1.2, 0, 0], 0.3, 5.6, 1.6, 38) },
                { f: praia, ...frente([-1.2, 0, 0], 0.3, 4.2, 1.8, 34), corte: true },
              ]}
              shakes={[praia]}
            />
            <Cozinha3D />
            <Geladeira pos={[-1.2, 0, 0]} rotY={0.3} expr="feliz" oculos={1} cor={BRONZE} descascando chinelo bracos={1} />
            <TitoCongelado pos={[1.2, 0, -0.4]} gelo={1} rotY={-0.3} />
            <MarDePipoca nivel={NIVEL} n={40} />
          </>
        ) : (
          <>
            <CameraRig keys={[{ f: 0, pos: [0, 2.4, 8.4], alvo: [-0.6, 1.1, 0], fov: 46 }, { f: emp + 30, pos: [1.2, 2.0, 6.6], alvo: [-0.6, 1.2, 0], fov: 42, corte: true }]} />
            <Praia3D />
            <TitoCongelado pos={[x, 0, 0.3]} gelo={1} />
            <Geladeira pos={[x - 1.3, 0, 0.3]} rotY={Math.PI / 2} expr="feliz" oculos={1} cor={BRONZE} andando chinelo bracos={1} />
            <Leite pos={[x - 2.3, 0, 0.6]} rotY={Math.PI / 2} expr="nervoso" />
          </>
        )}
      </Canvas>
      {f >= praia && f < l1 && <Onomatopeia texto="PRAIA!" at={praia} x={540} y={600} dur={l1 - praia} cor="#FFD23F" />}
      {f >= emp && <Onomatopeia texto="NHÉÉÉC…" at={emp} x={540} y={600} dur={60} cor="#fff" />}
      <Sfx at={praia} nome="tada" vol={0.4} />
      <Sfx at={l1} nome="whoosh" vol={0.4} />
      <Sfx at={emp} nome="ronco" vol={0.35} />
    </>
  );
};

/** 5. DESCONGELOU: em 2 minutos de sol derrete… ATCHIM! O leite traz toalha; o sorvete derrete junto. */
export const Derrete: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const der = wordAt(scene, "derreteu…");

  const atch = wordAt(scene, "atchim!");
  const l2 = lineStart(scene, 2);
  const toalha = wordAt(scene, "toalha.");
  const der2 = wordAt(scene, "derreteu", 1);
  const PT2: V3 = [0.3, 0, 0.3];
  const gelo = 1 - lerp(f, 10, der + 10);
  const sorv = lerp(f, der2 > toalha ? der2 : toalha + 25, (der2 > toalha ? der2 : toalha + 25) + 25);
  return (
    <>
      <Canvas fundo="#7EC8FF">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, ...frente(PT2, 0, 6.0, 1.6, 40) },
            { f: der, ...frente(PT2, 0, 4.4, 1.7, 36), corte: true },
            { f: atch, ...frente(PT2, 0, 3.0, 1.95, 32), corte: true },
            { f: l2, pos: [0.6, 2.2, 6.2], alvo: [0.6, 1.0, 0.3], fov: 42, corte: true },
            { f: toalha + 20, ...frente([1.8, 0, 0.8], -0.3, 3.0, 0.8, 34), corte: true },
          ]}
          shakes={[atch]}
        />
        <Praia3D />
        <TitoCongelado pos={PT2} gelo={gelo} expr={f >= atch ? "chocado" : gelo < 0.5 ? "feliz" : "chocado"} molhado={gelo < 0.3} pose={f >= l2 ? "acenando" : gelo < 0.5 ? "bracosPraCima" : "chocado"} />
        {f >= l2 && (
          <>
            <Leite pos={[-1.2, 0, 0.8]} rotY={0.4} expr="feliz" />
            <Caixa p={[-0.9, 0.7, 1.0]} r={[0, 0.4, 0.2]} s={[0.6, 0.8, 0.04]} c="#FF7AB6" />
            <group position={[1.8, 0, 0.8]} scale={[1 + sorv * 0.6, 1 - sorv * 0.75, 1 + sorv * 0.6]}>
              <Sorvete expr={sorv > 0.2 ? "nervoso" : "feliz"} escala={1.3} />
            </group>
          </>
        )}
      </Canvas>
      {f >= atch && f < l2 && <Onomatopeia texto="ATCHIM!" at={atch} x={540} y={600} dur={l2 - atch} cor="#FFD23F" />}
      {f >= toalha + 20 && <Placa texto="SORVETE: DERRETIDO" at={toalha + 20} y={1430} />}
      <Sfx at={der} nome="borbulha" vol={0.45} />
      <Sfx at={atch} nome="boom" vol={0.4} />
      <Sfx at={toalha} nome="pop" vol={0.4} />
    </>
  );
};

/** 6. PEDIDO DE DESCULPAS: a Gelinha dá um abraço quentinho… morno, na verdade. */
export const Abraco: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const q = wordAt(scene, "quentinho.");
  const l1 = lineStart(scene, 1);
  const PT2: V3 = [0.4, 0, 0.3];
  const PB2: V3 = [-0.5, 0, 0.6];
  return (
    <>
      <Canvas fundo="#7EC8FF">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 1.8, 5.4], alvo: [0, 1.0, 0.4], fov: 40 },
            { f: q, pos: [0, 1.5, 3.8], alvo: [0, 0.9, 0.4], fov: 36, corte: true },
            { f: l1, ...frente(PB2, 0.2, 2.6, 0.55, 32), corte: true },
          ]}
          shakes={[l1]}
        />
        <Praia3D />
        <TitoRei pos={PT2} rotY={-0.5} expr="feliz" pose="bracosPraCima" semCoroa molhado />
        <Geladeirinha pos={PB2} rotY={0.6} expr={f >= l1 ? "nervoso" : "feliz"} pulo={f < l1 ? Math.abs(Math.sin(f * 0.3)) * 0.1 : 0} />
        {f >= q - 10 &&
          [0, 1, 2].map((i) => {
            const k = ((f + i * 12) % 36) / 36;
            return <Caixa key={i} p={[0 + (i - 1) * 0.25, 1.4 + k * 0.6, 0.6]} r={[0, 0, 0.785]} s={[0.14, 0.14, 0.04]} c="#FF7AB6" o={1 - k} />;
          })}
      </Canvas>
      {f >= q && f < l1 && <Onomatopeia texto="♥ ABRAÇO ♥" at={q} x={540} y={600} dur={l1 - q} cor="#FF7AB6" />}
      {f >= l1 && <Placa texto="TEMPERATURA: MORNA" at={l1} y={1430} />}
      <Sfx at={q} nome="sparkle" vol={0.45} />
      <Sfx at={l1} nome="tum" vol={0.35} />
    </>
  );
};

/** 7. FINAL (gancho do ep. 10): um bilhete boiando na água do gelo… assinado: "o verdadeiro rei". */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const bil = wordAt(scene, "bilhete…");
  const l1 = lineStart(scene, 1);
  const verd = wordAt(scene, "verdadeiro");
  const l2 = lineStart(scene, 2);
  const proximo = wordAt(scene, "próximo");
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - l1, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <>
      <Canvas fundo="#2A1A2E">
        <Luzes quente={false} />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 6.0], alvo: [0, 0.4, 0.6], fov: 42 },
            { f: bil, pos: [0.2, 1.4, 2.6], alvo: [0, 0.05, 0.6], fov: 36, corte: true },
            { f: l2, ...frente([0.4, 0, 0.0], 0, 6.0, 1.5, 38), corte: true },
            { f: proximo, ...frente([0.4, 0, 0.0], 0, 4.8, 1.6, 36), corte: true },
          ]}
          shakes={[verd, proximo]}
        />
        <Praia3D />
        <mesh position={[0, 0.03, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.1, 24]} />
          <meshStandardMaterial color="#9fd8ff" flatShading transparent opacity={0.8} />
        </mesh>
        <Caixa p={[0, 0.06 + Math.sin(f * 0.15) * 0.02, 0.6]} r={[0, Math.sin(f * 0.05) * 0.4, 0]} s={[0.5, 0.02, 0.35]} c="#FFF6DE" />
        <TitoRei pos={[0.4, 0, 0.0]} expr={f >= verd ? "chocado" : "neutro"} pose={f >= verd ? "chocado" : "parado"} semCoroa molhado />
      </Canvas>
      {f >= l1 && f < l2 + 30 && (
        <div style={{ position: "absolute", left: 120, right: 120, top: 470, transform: `scale(${s}) rotate(-4deg)`, background: "#FFF6DE", border: "10px solid #1F1B2E", borderRadius: 12, padding: "30px 30px", textAlign: "center", boxShadow: "0 14px 0 #1F1B2E" }}>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 40, color: "#6b5a4a" }}>"Essa cozinha é minha."</div>
          <div style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 64, color: "#E23B3B", marginTop: 10 }}>— O VERDADEIRO REI 👑</div>
        </div>
      )}
      {f >= proximo && <Onomatopeia texto="?" at={proximo} x={540} y={560} dur={200} cor="#FFD23F" rot={8} />}
      <Placa texto="CONTINUA…" at={proximo + 6} y={1430} />
      <Sfx at={bil} nome="borbulha" vol={0.4} />
      <Sfx at={verd} nome="tum" vol={0.5} />
      <Sfx at={proximo} nome="tum" vol={0.5} />
    </>
  );
};

