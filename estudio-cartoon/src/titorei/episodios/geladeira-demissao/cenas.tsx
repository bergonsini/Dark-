import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../CameraRig";
import { Cozinha3D, Praia3D } from "../../cenarios/Cenarios";
import { Bancada, CuboGelo, Geladeira, Leite, Manteiga, Mesa, Queijo, Sorvete } from "../../objetos/Cozinha";
import { Capivara } from "../../personagens/Capivara";
import { TitoRei } from "../../personagens/TitoRei";
import { Luzes } from "../../lowpoly";
import { Onomatopeia, Placa } from "../../Overlay";
import { CenaProps, passo, Sfx, useCena } from "../../common";
import { lineStart, wordAt } from "../../timeline";

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
const useMola = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 10, stiffness: 180 } });

/** 1. GANCHO: "A geladeira do Tito pediu demissão." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const pediu = wordAt(scene, "pediu");
  const dem = wordAt(scene, "demissão.");
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.9, 2.1, 8.2], alvo: [0.55, 1.25, 0.4], fov: 46 },
            { f: pediu - 1, pos: [0.8, 2.0, 7.2], alvo: [0.55, 1.25, 0.4], fov: 46 },
            { f: pediu, pos: [0, 1.65, 3.6], alvo: [0, 1.6, 0.4], fov: 36, corte: true },
            { f: dem + 14, ...frente([1.1, 0, 1.2], -0.6, 2.6, 2.0, 34), corte: true },
          ]}
          shakes={[dem]}
        />
        <Cozinha3D />
        <Bancada pos={[-2.6, 0, -2.2]} />
        <Geladeira pos={[0, 0, 0]} expr={f >= pediu ? "bravo" : "feliz"} />
        <TitoRei pos={[1.1, 0, 1.2]} rotY={-0.6} expr={f >= dem + 14 ? "chocado" : "neutro"} pose={f >= dem + 14 ? "chocado" : "parado"} olhar={[-0.6, 0.2]} />
      </Canvas>
      <Placa texto="PEÇO DEMISSÃO" at={dem} y={1430} ate={dem + 14} />
      <Onomatopeia texto="PLAU!" at={dem} x={760} y={620} />
      <Sfx at={0} nome="whoosh" vol={0.5} />
      <Sfx at={dem} nome="tum" vol={0.8} />
      <Sfx at={dem + 14} nome="apito" vol={0.45} />
    </>
  );
};

/** 2. "Disse que tava cansada de passar frio. Pegou os óculos escuros e foi pra praia." */
export const Motivo: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const frio = wordAt(scene, "frio.");
  const l1 = lineStart(scene, 1);
  const oculos = wordAt(scene, "óculos");
  const praia = wordAt(scene, "praia.");
  const oc = useMola(f, oculos);
  const anda = f >= praia;
  const x = interpolate(f, [praia, praia + 40], [0, 3.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Canvas fundo={f < l1 ? "#9FD3F0" : "#7FC8A9"}>
        <Luzes quente={f >= l1} />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 1.7, 3.8], alvo: [0, 1.6, 0.4], fov: 36 },
            { f: wordAt(scene, "cansada"), ...frente([-0.9, 0, 1.4], 0.6, 2.7, 2.0, 34), corte: true },
            { f: frio, pos: [0, 1.65, 3.0], alvo: [0, 1.65, 0.4], fov: 34, corte: true },
            { f: oculos, pos: [0.4, 1.8, 3.4], alvo: [0, 1.7, 0.4], fov: 36, corte: true },
            { f: praia, pos: [0.6, 2.3, 8.6], alvo: [0.6, 1.2, 0.3], fov: 46, corte: true },
          ]}
          shakes={[frio]}
          amp={0.03}
        />
        <Cozinha3D />
        <Geladeira pos={[x, 0, 0]} rotY={anda ? -1.2 : 0} expr={f < l1 ? "triste" : "feliz"} tremendo={f < l1} oculos={f >= oculos ? oc : 0} andando={anda} />
        <TitoRei pos={[-0.9, 0, 1.4]} rotY={anda ? 0.9 : 0.6} expr={anda ? "chocado" : f >= wordAt(scene, "cansada") ? "triste" : "neutro"} pose={anda ? "chocado" : "parado"} olhar={[0.7, 0]} />
      </Canvas>
      <Onomatopeia texto="BRRR!" at={frio} x={540} y={560} cor="#BFE6FF" dur={30} />
      <Sfx at={frio} nome="ronco" vol={0.4} />
      <Sfx at={oculos} nome="pop" vol={0.6} />
      <Sfx at={oculos + 4} nome="sparkle" vol={0.4} />
      <Sfx at={praia} nome="whoosh" vol={0.5} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={praia + 6 + i * 7} nome="click" vol={0.25} />)}
    </>
  );
};

/** 3. GELADEIRA DE FÉRIAS: toma sol e derrete os próprios cubinhos de gelo. */
export const Praia: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const sol = wordAt(scene, "sol");
  const derrete = wordAt(scene, "derrete");
  const d = interpolate(f, [derrete, derrete + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Canvas fundo="#7EC8FF">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.5, 2.4, 7.5], alvo: [0, 1.2, 0], fov: 44 },
            { f: sol, pos: [0.3, 1.8, 4.6], alvo: [0, 1.4, 0], fov: 38 },
            { f: wordAt(scene, "inteiro,"), pos: [-0.6, 1.4, 2.9], alvo: [0, 1.6, 0], fov: 30, corte: true },
            { f: derrete, pos: [1.3, 0.9, 2.6], alvo: [1.3, 0.2, 0.6], fov: 32, corte: true },
          ]}
        />
        <Praia3D />
        <group rotation={[-0.35, 0, 0]}>
          <Geladeira pos={[0, 0, 0]} expr="feliz" oculos={1} />
        </group>
        {[
          [1.0, 0.6],
          [1.4, 0.8],
          [1.7, 0.5],
        ].map(([x, z], i) => (
          <CuboGelo key={i} pos={[x, 0, z]} derrete={Math.max(0, d - i * 0.12)} />
        ))}
      </Canvas>
      <Onomatopeia texto="PLOFT!" at={derrete + 18} x={560} y={700} dur={26} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={sol} nome="sparkle" vol={0.4} />
      <Sfx at={derrete} nome="borbulha" vol={0.5} />
      <Sfx at={derrete + 18} nome="pop" vol={0.6} />
    </>
  );
};

/** 4. CAPIVARA REFRIGERADORA: não gela nada, mas o leite nem tem coragem de azedar. */
export const CapivaraCena: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const capi = wordAt(scene, "capivara.");
  const l1 = lineStart(scene, 1);
  const nada = wordAt(scene, "nada…");
  const l2 = lineStart(scene, 2);
  const coragem = wordAt(scene, "coragem");
  const entra = useMola(f, capi - 2);
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0.7, 2.1, 7.6], alvo: [0.5, 1.1, 0.4], fov: 46 },
            { f: wordAt(scene, "contratou"), ...frente([1.15, 0, 1.3], -0.6, 2.7, 2.0, 34), corte: true },
            { f: capi, pos: [0, 1.4, 4.0], alvo: [0, 0.95, 0.6], fov: 38, corte: true },
            { f: l1, pos: [0.6, 1.7, 5.6], alvo: [0.45, 1.05, 0.5], fov: 42, corte: true },
            { f: l2, pos: [0, 1.95, 3.4], alvo: [0, 1.6, 0.8], fov: 34, corte: true },
            { f: coragem, pos: [0, 1.85, 2.7], alvo: [0, 1.7, 0.8], fov: 30, corte: true },
          ]}
          shakes={[nada]}
          amp={0.03}
        />
        <Cozinha3D />
        <Bancada pos={[-2.6, 0, -2.2]} />
        <group scale={f >= capi - 2 ? entra : 0.001}>
          <Capivara pos={[0, 0, 0]} />
        </group>
        {f >= l2 - 10 && <Leite pos={[0, 1.18, 0.75]} expr="nervoso" escala={0.8} />}
        <TitoRei pos={[1.15, 0, 1.3]} rotY={-0.6} expr={f >= l1 ? "malandro" : "feliz"} pose={f < capi ? "apontando" : f < l1 ? "bracosPraCima" : "maosNaCintura"} olhar={[-0.6, 0]} />
      </Canvas>
      {f >= nada && f < l2 && <Placa texto="GELA: NADA" at={nada} y={1430} />}
      <Sfx at={capi} nome="boing" vol={0.6} />
      <Sfx at={capi + 4} nome="tada" vol={0.4} />
      <Sfx at={nada} nome="tum" vol={0.6} />
      <Sfx at={l2} nome="pop" vol={0.5} />
      <Sfx at={coragem} nome="apito" vol={0.4} />
    </>
  );
};

/** 5. COZINHA ZEN: queijo medita, manteiga faz ioga, Tito vira o rei da cozinha zen. */
export const Zen: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const manteiga = wordAt(scene, "manteiga");
  const l1 = lineStart(scene, 1);
  const rei = wordAt(scene, "rei");
  const ioga = interpolate(f, [manteiga, manteiga + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coroaPulo = f >= rei ? Math.abs(Math.sin((f - rei) * 0.25)) * 0.2 : 0;
  return (
    <>
      <Canvas fundo="#B9A7E8">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [-1.0, 1.65, 2.9], alvo: [-1.0, 1.4, 0], fov: 34 },
            { f: manteiga, pos: [0.9, 1.6, 2.8], alvo: [0.9, 1.35, 0], fov: 34, corte: true },
            { f: l1, pos: [0, 2.0, 6.6], alvo: [0, 1.3, 0.3], fov: 44, corte: true },
            { f: rei, ...frente([0, 0, 1.2], 0, 2.9, 2.15, 36), corte: true },
          ]}
        />
        <Cozinha3D />
        <Bancada pos={[0, 0, -0.6]} />
        <Queijo pos={[-1.0, 1.07, 0]} medita />
        <Manteiga pos={[0.9, 1.07, 0]} ioga={ioga} />
        <TitoRei pos={[0, 0, 1.2]} expr={f >= rei ? "animado" : "feliz"} pose={f >= rei ? "bracosPraCima" : "parado"} pulo={coroaPulo} brilhoCoroa={f >= rei ? 1 : 0} />
      </Canvas>
      {f >= rei && <Onomatopeia texto="REI!" at={rei} x={540} y={520} cor="#FFD23F" dur={40} rot={-6} />}
      <Sfx at={2} nome="sparkle" vol={0.4} />
      <Sfx at={manteiga} nome="boing" vol={0.5} />
      <Sfx at={l1} nome="whoosh" vol={0.4} />
      <Sfx at={rei} nome="tada" vol={0.6} />
    </>
  );
};

/** 6. GELADEIRA COM CIÚMES: vê tudo pelo celular, volta correndo da praia, bronzeada, de chinelo e descascando. */
export const Ciumes: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const celular = wordAt(scene, "celular.");
  const tudo = wordAt(scene, "tudo");
  const ciume = wordAt(scene, "ciúme");
  const correndo = wordAt(scene, "correndo");
  const l2 = lineStart(scene, 2);
  const chinelo = wordAt(scene, "chinelo");
  const descas = wordAt(scene, "descascando.");
  const x = interpolate(f, [correndo, l2], [-3.5, 3.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bronze = "#E8B88A";
  if (f < l2)
    return (
      <>
        <Canvas fundo="#7EC8FF">
          <Luzes />
          <CameraRig
            keys={[
              { f: 0, pos: [0.4, 1.5, 3.8], alvo: [0, 1.35, 0.6], fov: 38 },
              { f: tudo, pos: [0, 1.5, 2.3], alvo: [0, 1.4, 0.9], fov: 30, corte: true },
              { f: celular, pos: [0, 1.75, 4.0], alvo: [0, 1.6, 0.3], fov: 34, corte: true },
              { f: ciume, pos: [0, 1.7, 3.5], alvo: [0, 1.62, 0.3], fov: 32, corte: true },
              { f: correndo, pos: [0, 1.8, 9.0], alvo: [0, 1.1, 0], fov: 48, corte: true },
            ]}
            shakes={[ciume]}
            amp={0.04}
          />
          <Praia3D />
          {f < correndo ? (
            <group rotation={[-0.25, 0, 0]}>
              <Geladeira pos={[0, 0, 0]} cor={bronze} expr={f >= ciume ? "bravo" : f >= celular ? "chocado" : "feliz"} oculos={f < celular ? 1 : 0} bracos={1} celular={f < celular} tremendo={f >= ciume} />
            </group>
          ) : (
            <Geladeira pos={[x, 0, 0]} rotY={Math.PI / 2} cor={bronze} expr="bravo" correndo chinelo />
          )}
        </Canvas>
        {f >= ciume && f < correndo && <Onomatopeia texto="GRRR!" at={ciume} x={540} y={600} cor="#FF6B6B" dur={40} />}
        <Sfx at={tudo} nome="click" vol={0.5} />
        <Sfx at={celular} nome="apito" vol={0.45} />
        <Sfx at={ciume} nome="ronco" vol={0.4} />
        <Sfx at={correndo} nome="whoosh" vol={0.6} />
        {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} at={correndo + 4 + i * 5} nome="click" vol={0.25} />)}
      </>
    );
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: l2, pos: [0, 2.1, 8.4], alvo: [0, 1.25, 0.3], fov: 46 },
            { f: chinelo, pos: [-0.85, 0.5, 2.4], alvo: [-0.85, 0.15, 0.2], fov: 34, corte: true },
            { f: descas, pos: [-0.85, 2.0, 4.0], alvo: [-0.85, 1.65, 0.4], fov: 36, corte: true },
          ]}
          shakes={[l2]}
          amp={0.05}
        />
        <Cozinha3D />
        <Geladeira pos={[-0.85, 0, 0]} cor={bronze} expr="bravo" oculos={1} chinelo descascando andando={f < chinelo} />
        <Capivara pos={[0.95, 0, 0.2]} rotY={-0.4} fechado={0.2} />
        <TitoRei pos={[0.35, 0, 1.9]} rotY={-0.4} expr="chocado" pose="chocado" olhar={[-0.8, 0]} />
      </Canvas>
      <Onomatopeia texto="TCHARAM!" at={l2} x={540} y={600} dur={22} />
      <Sfx at={l2} nome="tum" vol={0.7} />
      <Sfx at={chinelo} nome="boing" vol={0.5} />
      <Sfx at={descas} nome="apito" vol={0.4} />
    </>
  );
};

/** 7. ENTREVISTA DE EMPREGO: geladeira gela sorvete em 3 s; capivara só pisca e o sorvete pede pra ficar. */
export const Entrevista: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const sorvete = wordAt(scene, "sorvete", 1);
  const tres = wordAt(scene, "três");
  const l2 = lineStart(scene, 2);
  const piscou = wordAt(scene, "piscou…");
  const ficar = wordAt(scene, "ficar.");
  const nasce = spring({ frame: f - sorvete, fps: 30, config: { damping: 8, stiffness: 200 } });
  const pisca = interpolate(f, [piscou, piscou + 8, piscou + 16], [0.75, 1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vai = interpolate(f, [ficar, ficar + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sx = -0.55 + vai * 1.25;
  return (
    <>
      <Canvas>
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.4, 9.0], alvo: [0, 1.2, 0.3], fov: 48 },
            { f: l1, ...frente([-1.3, 0, 1.0], 0.45, 4.0, 1.55, 36), corte: true },
            { f: tres, pos: [-0.5, 1.4, 2.3], alvo: [-0.55, 1.25, 0.3], fov: 30, corte: true },
            { f: l2, ...frente([1.3, 0, 1.0], -0.45, 2.9, 0.9, 34), corte: true },
            { f: ficar, pos: [0.2, 1.45, 2.5], alvo: [0.2, 1.25, 0.3], fov: 32, corte: true },
          ]}
          shakes={[tres]}
          amp={0.04}
        />
        <Cozinha3D />
        <Mesa pos={[0, 0, 0.3]} />
        <TitoRei pos={[0, 0, -0.5]} expr={f >= ficar ? "chocado" : "malandro"} pose={f >= ficar ? "chocado" : "pensando"} />
        <Geladeira pos={[-1.3, 0, 1.0]} rotY={0.45} expr={f >= ficar ? "chocado" : "feliz"} bracos={f >= sorvete - 6 ? 1 : 0} />
        <Capivara pos={[1.3, 0, 1.0]} rotY={-0.45} fechado={pisca} />
        {f >= sorvete && <Sorvete pos={[sx, 0.86, 0.45]} escala={nasce * 0.9} expr={f >= ficar ? "feliz" : "chocado"} />}
      </Canvas>
      <Onomatopeia texto="3 SEGUNDOS!" at={tres} x={540} y={560} cor="#BFE6FF" dur={34} />
      <Placa texto="QUERO FICAR!" at={ficar + 4} y={1430} />
      <Sfx at={2} nome="pop" vol={0.4} />
      <Sfx at={sorvete} nome="sparkle" vol={0.6} />
      <Sfx at={tres} nome="ding" vol={0.6} />
      <Sfx at={piscou} nome="click" vol={0.35} />
      <Sfx at={ficar} nome="boing" vol={0.6} />
      <Sfx at={ficar + 4} nome="tada" vol={0.4} />
    </>
  );
};

/** 8. FINAL: as duas dividem a cozinha (uma gela, a outra acalma) + "Segue pra ver quem o Tito contrata amanhã!" */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const gela = wordAt(scene, "gela,");
  const acalma = wordAt(scene, "acalma.");
  const l1 = lineStart(scene, 1);
  const amanha = wordAt(scene, "amanhã!");
  return (
    <>
      <Canvas fundo="#FFB86B">
        <Luzes />
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.1, 8.4], alvo: [0, 1.2, 0.3], fov: 46 },
            { f: gela, pos: [-1.3, 1.7, 3.4], alvo: [-1.3, 1.55, 0.4], fov: 36, corte: true },
            { f: acalma, pos: [1.3, 1.3, 3.4], alvo: [1.3, 1.0, 0.5], fov: 34, corte: true },
            { f: l1, pos: [0, 2.0, 7.6], alvo: [0, 1.25, 0.4], fov: 44, corte: true },
            { f: amanha, ...frente([0, 0, 1.0], 0, 2.8, 2.0, 34), corte: true },
          ]}
        />
        <Cozinha3D />
        <Geladeira pos={[-1.3, 0, 0]} rotY={0.25} cor="#E8B88A" expr="feliz" />
        <Capivara pos={[1.3, 0, 0.2]} rotY={-0.3} />
        <TitoRei pos={[0, 0, 1.0]} expr={passo(f, [[0, "feliz"], [amanha, "malandro"]])} pose={f >= l1 ? "acenando" : "bracosPraCima"} />
        <CuboGelo pos={[-0.7, 0, 1.0]} derrete={0} />
      </Canvas>
      {f >= gela && f < acalma && <Onomatopeia texto="GELA!" at={gela} x={540} y={560} cor="#BFE6FF" dur={30} />}
      {f >= acalma && f < l1 && <Onomatopeia texto="ACALMA!" at={acalma} x={540} y={560} cor="#C9F2C7" dur={30} />}
      <Placa texto="SEGUE O TITO.REI!" at={l1} y={1430} />
      <Sfx at={gela} nome="sparkle" vol={0.5} />
      <Sfx at={acalma} nome="pop" vol={0.5} />
      <Sfx at={l1} nome="whoosh" vol={0.4} />
      <Sfx at={amanha} nome="boing" vol={0.5} />
    </>
  );
};
