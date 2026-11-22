import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { CameraRig, frente } from "../../../titorei/CameraRig";
import { Alcapao, Bancada, Estudio, MesaJurados } from "../../cenario";
import { CaixaMisteriosa, Chiclete, Garfo, Liquidificador, Miojo, PratoMiojo, PratoMousse, Sardinha } from "../../comidas";
import { CenaProps, lerp, Sfx, useCena } from "../../common";
import { LuzesEstudio, V3 } from "../../massinha";
import { Cronometro, NomePrato, Onomatopeia } from "../../Overlay";
import { Apresentador, Francois, Juninho, Misterioso, Vo, Zica } from "../../personagens";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/** PANELA DEPRESSÃO · Ep. 1 — "A estreia". Juninho (14 derrotas) x Dona Zica (nunca cozinhou). */

const Canvas: React.FC<{ children: React.ReactNode; suspense?: boolean }> = ({ children, suspense = false }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: suspense ? "#12040f" : "#3a1240" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 40, position: [0, 2, 7] }}>
        <LuzesEstudio suspense={suspense} />
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
// posições fixas
const PJ: V3 = [-1.3, 0, -0.7]; // Juninho atrás da bancada esquerda
const PZ: V3 = [1.3, 0, -0.7]; // Dona Zica atrás da bancada direita
const BJ: V3 = [-1.3, 0, 0]; // bancadas
const BZ: V3 = [1.3, 0, 0];
const PA: V3 = [0, 0, 1.3]; // apresentador
const ROSTO = 1.85;
const JF: V3 = [-1.2, 0, -0.55]; // jurados (atrás da mesa em z=0)
const JV: V3 = [0, 0, -0.55];
const JM: V3 = [1.2, 0, -0.55];

const Cozinha: React.FC<{ fogoZ?: number; fogoJ?: number; liquidificador?: boolean; suspense?: boolean }> = ({ fogoZ = 0, fogoJ = 0, liquidificador = false, suspense = false }) => (
  <>
    <Estudio suspense={suspense} />
    <Bancada p={BJ} cor="#2fb36b" fogo={fogoJ} />
    <Bancada p={BZ} cor="#ff8a2a" fogo={fogoZ} />
    {liquidificador && <Liquidificador p={[BJ[0] + 0.4, 1.09, BJ[2] + 0.05]} s={1} liga />}
  </>
);

/** 1. GANCHO: o prato horroroso em close: "Miojo com chiclete e sardinha… e alguém vai COMER!" */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const chic = wordAt(scene, "chiclete");
  const sard = wordAt(scene, "sardinha…");
  const comer = wordAt(scene, "comer!");
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 2.6], alvo: [0, 1.2, 0], fov: 34 },
            { f: sard, pos: [0.5, 1.9, 2.0], alvo: [0, 1.2, 0], fov: 32, corte: true },
            { f: comer, ...frente(PA, 0, 4.0, ROSTO - 0.35, 36), corte: true },
          ]}
          shakes={[comer]}
        />
        <Estudio />
        <Bancada p={[0, 0, 0]} cor="#c2185b" panela={false} />
        {f < comer && (
          <group position={[0, 1.12, 0.1]}>
            <PratoMiojo s={1.1} />
            {f >= chic && <Chiclete p={[0.25, 0.32, 0.05]} s={0.6} />}
            {f >= sard && <Sardinha p={[-0.2, 0.35, 0.1]} s={0.55} rot={0.5} />}
          </group>
        )}
        {f >= comer && <Apresentador pos={PA} expr="chocado" pose="bracosAbertos" boca={boca("apresentador")} />}
      </Canvas>
      {f >= comer && <Onomatopeia texto="ECA!" at={comer} x={540} y={620} dur={40} cor="#7cf25a" />}
      <Sfx at={0} nome="riser" vol={0.35} />
      <Sfx at={chic} nome="pop" vol={0.5} />
      <Sfx at={sard} nome="pop" vol={0.5} />
      <Sfx at={comer} nome="boom" vol={0.45} />
    </>
  );
};

/** 2. ABERTURA: "Bem-vindos ao PANELA DEPRESSÃO! O programa onde a comida chora… e o jurado TAMBÉM!" */
export const Abertura: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const pd = wordAt(scene, "panela");
  const chora = wordAt(scene, "chora…");
  const tambem = wordAt(scene, "também!");
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.6, 7.6], alvo: [0, 1.3, 0], fov: 44 },
            { f: pd, pos: [0, 2.2, 6.2], alvo: [0, 1.4, 0], fov: 40 },
            { f: chora, pos: [BZ[0], 2.5, 1.5], alvo: [BZ[0], 1.15, 0.25], fov: 32, corte: true },
            { f: tambem, pos: [0, 2.0, 4.6], alvo: [0, 1.5, -0.5], fov: 40, corte: true },
          ]}
          shakes={[pd]}
        />
        {f < tambem ? (
          <>
            <Cozinha />
            <Juninho pos={PJ} expr="feliz" pose="bracosAbertos" />
            <Zica pos={PZ} expr="feliz" pose="bracosAbertos" />
            <Apresentador pos={PA} expr="feliz" pose="bracosPraCima" boca={boca("apresentador")} pulo={f >= pd && f < pd + 10 ? 0.2 : 0} />
            {f >= chora && (
              <group position={[BZ[0], 1.12, 0.25]}>
                <PratoMiojo s={0.8} />
              </group>
            )}
          </>
        ) : (
          <>
            <Estudio />
            <MesaJurados />
            <Francois pos={JF} expr="triste" treme />
            <Vo pos={JV} expr="feliz" />
            <Misterioso pos={JM} expr="neutro" />
          </>
        )}
      </Canvas>
      {f >= pd && f < chora && <Onomatopeia texto="AAAAH!" at={pd + 6} x={540} y={640} dur={30} cor="#ffd23f" />}
      <Sfx at={0} nome="tada" vol={0.45} />
      <Sfx at={pd} nome="boom" vol={0.35} />
      <Sfx at={chora} nome="borbulha" vol={0.4} />
      <Sfx at={tambem} nome="boing" vol={0.45} />
    </>
  );
};

/** 3. OS COZINHEIROS: Juninho (14 derrotas) e Dona Zica (nunca cozinhou). Juninho: "Dessa vez eu GANHO!" */
export const Participantes: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const jun = wordAt(scene, "juninho,");
  const cat = wordAt(scene, "catorze");
  const zica = wordAt(scene, "zica,");
  const l1 = lineStart(scene, 1);
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.4, 6.6], alvo: [0, 1.3, -0.3], fov: 42 },
            { f: jun, ...frente(PJ, 0, 4.2, ROSTO - 0.35, 36), corte: true },
            { f: zica, ...frente(PZ, 0, 4.2, ROSTO - 0.35, 36), corte: true },
            { f: l1, ...frente(PJ, 0, 3.6, ROSTO - 0.3, 34), corte: true },
          ]}
          shakes={[cat, l1]}
        />
        <Cozinha />
        <Juninho pos={PJ} expr={f >= l1 ? "feliz" : f >= cat ? "nervoso" : "feliz"} pose={f >= l1 ? "bracosPraCima" : "parado"} boca={boca("juninho")} pulo={f >= l1 ? Math.abs(Math.sin(f * 0.35)) * 0.25 : 0} />
        <Zica pos={PZ} expr={f >= zica ? "chocado" : "feliz"} pose={f >= zica ? "maosNaCabeca" : "parado"} />
        <Apresentador pos={PA} expr="feliz" pose="apontando" rotY={0.4} boca={boca("apresentador")} />
      </Canvas>
      {f >= cat && f < zica && <Onomatopeia texto="14 DERROTAS" at={cat} x={540} y={620} dur={zica - cat} cor="#ff5c5c" tam={110} />}
      {f >= zica + 20 && f < l1 && <Onomatopeia texto="NUNCA COZINHOU" at={zica + 20} x={540} y={620} dur={l1 - zica - 20} cor="#ffd23f" tam={96} />}
      <Sfx at={jun} nome="whoosh" vol={0.4} />
      <Sfx at={cat} nome="tum" vol={0.45} />
      <Sfx at={zica} nome="whoosh" vol={0.4} />
      <Sfx at={l1} nome="boing" vol={0.45} />
    </>
  );
};

/** 4. CAIXA MISTERIOSA: miojo, chiclete, sardinha e gelatina de uva sobem um por um. "TRINTA SEGUNDOS!" */
export const Caixa: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const caixa = wordAt(scene, "caixa");
  const ws = [wordAt(scene, "miojo,"), wordAt(scene, "chiclete,"), wordAt(scene, "sardinha"), wordAt(scene, "gelatina")];
  const l1 = lineStart(scene, 1);
  const trinta = wordAt(scene, "trinta");
  const sobe = ws.reduce((a, w, i) => a + Math.min(1, Math.max(0, (f - w + 2) / 8)) * (i >= 0 ? 1 : 0), 0);
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.6, 3.8], alvo: [0, 1.1, 0], fov: 40 },
            { f: ws[0] - 4, pos: [0, 2.4, 3.4], alvo: [0, 1.5, 0], fov: 42, corte: true },
            { f: l1, ...frente([1.7, 0, 0.9], -0.5, 4.0, ROSTO - 0.35, 36), corte: true },
          ]}
          shakes={[trinta]}
        />
        <Estudio />
        <CaixaMisteriosa p={[0, 0, 0]} abre={lerp(f, caixa, caixa + 14)} sobe={sobe} />
        <Apresentador pos={[1.7, 0, 0.9]} rotY={-0.5} expr={f >= trinta ? "chocado" : "feliz"} pose={f >= l1 ? "bracosPraCima" : "apontando"} boca={boca("apresentador")} />
      </Canvas>
      {f >= trinta && <Cronometro seg={30} />}
      {ws.map((w, i) => (
        <Sfx key={i} at={w} nome="pop" vol={0.45} />
      ))}
      <Sfx at={caixa} nome="riser" vol={0.35} />
      <Sfx at={trinta} nome="alarme" vol={0.35} />
    </>
  );
};

/** 5. VALENDO!: o Juninho bate tudo no liquidificador; a Dona Zica… põe fogo na água. Cronômetro corre. */
export const Preparo: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const liq = wordAt(scene, "liquidificador!");
  const zica = wordAt(scene, "zica…");
  const fogo = wordAt(scene, "fogo");
  const len = lineEnd(scene, 0) + 22;
  const seg = 30 - (f / len) * 30;
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.6, 6.4], alvo: [0, 1.3, -0.3], fov: 42 },
            { f: liq - 6, ...frente([BJ[0] + 0.2, 0, BJ[2]], 0, 3.4, 1.5, 36), corte: true },
            { f: zica, ...frente([BZ[0], 0, -0.3], -0.2, 4.2, 1.5, 38), corte: true },
            { f: fogo + 10, pos: [0, 2.6, 6.0], alvo: [0, 1.4, -0.3], fov: 42, corte: true },
          ]}
          shakes={[fogo]}
        />
        <Cozinha liquidificador fogoJ={0.6} fogoZ={f >= fogo ? 3.2 : 0.8} />
        <Juninho pos={PJ} expr="nervoso" pose="segurando" treme />
        <Zica pos={PZ} expr={f >= fogo ? "chocado" : "nervoso"} pose={f >= fogo ? "maosNaCabeca" : "segurando"} />
        <Miojo p={[BJ[0] - 0.4, 1.12, BJ[2] + 0.2]} s={0.7} />
      </Canvas>
      <Cronometro seg={seg} />
      {f >= liq && f < zica && <Onomatopeia texto="VRRRRUM!" at={liq} x={540} y={760} dur={zica - liq} cor="#ffd23f" tam={110} />}
      {f >= fogo && <Onomatopeia texto="FOGO NA ÁGUA?!" at={fogo} x={540} y={760} dur={60} cor="#ff7a1a" tam={100} />}
      <Sfx at={2} nome="apito" vol={0.35} />
      <Sfx at={liq} nome="motor" vol={0.45} />
      <Sfx at={fogo} nome="boom" vol={0.45} />
    </>
  );
};

/** 6. OS PRATOS: "Mousse de Sardinha com Chiclete FLAMBADO!" x "Miojo SENTIMENTAL ao molho de gelatina!" */
export const Pratos: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [BJ[0], 2.3, 2.9], alvo: [BJ[0], 1.4, -0.3], fov: 40 },
            { f: l1, pos: [BZ[0], 2.3, 2.9], alvo: [BZ[0], 1.4, -0.3], fov: 40, corte: true },
          ]}
          shakes={[2, l1]}
        />
        <Cozinha />
        <Juninho pos={PJ} expr="feliz" pose="bracosAbertos" boca={boca("juninho")} />
        <Zica pos={PZ} expr={f >= l1 ? "apaixonado" : "feliz"} pose="bracosAbertos" boca={boca("zica")} />
        <PratoMousse p={[BJ[0], 1.1, BJ[2] + 0.15]} s={0.9} />
        <PratoMiojo p={[BZ[0], 1.1, BZ[2] + 0.15]} s={0.9} />
      </Canvas>
      <NomePrato linha1="MOUSSE DE SARDINHA" linha2="com chiclete flambado" at={4} ate={l1 - 2} y={1430} />
      <NomePrato linha1="MIOJO SENTIMENTAL" linha2="ao molho de gelatina" at={l1 + 2} y={1430} />
      <Sfx at={4} nome="tada" vol={0.4} />
      <Sfx at={l1 + 2} nome="sparkle" vol={0.45} />
    </>
  );
};

/** 7. DEGUSTAÇÃO: luz baixa, suspense… François: "um CRIME!"; Vó: "que DELÍCIA!"; o misterioso DESMAIA. */
export const Degustacao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const crime = wordAt(scene, "crime");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const desm = wordAt(scene, "desmaiou!");
  const cai = lerp(f, desm - 6, desm + 6);
  return (
    <>
      <Canvas suspense={f < l1}>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.0, 4.4], alvo: [0, 1.6, -0.5], fov: 42 },
            { f: 20, pos: [0, 1.9, 3.6], alvo: [0, 1.7, -0.5], fov: 38 },
            { f: l1, ...frente(JF, 0, 3.6, ROSTO - 0.2, 36), corte: true },
            { f: crime, ...frente(JF, 0, 2.9, ROSTO - 0.1, 34), corte: true },
            { f: l2, ...frente(JV, 0, 3.6, ROSTO - 0.2, 36), corte: true },
            { f: l3, ...frente(JM, -0.25, 3.8, ROSTO - 0.45, 38), corte: true },
            { f: desm + 14, pos: [0, 2.6, 5.4], alvo: [0.3, 1.2, -0.5], fov: 44, corte: true },
          ]}
          shakes={[crime, desm]}
        />
        <Estudio suspense={f < l1} />
        <MesaJurados />
        <PratoMousse p={[-0.6, 1.17, 0.15]} s={0.55} fogo={false} />
        <PratoMiojo p={[0.6, 1.17, 0.15]} s={0.55} />
        <Francois pos={JF} expr={f >= l1 ? "bravo" : "nervoso"} pose={f >= l1 ? "bracosAbertos" : "provando"} boca={boca("francois")} treme={f >= crime && f < l2} />
        <Vo pos={JV} expr={f >= l2 ? "apaixonado" : "feliz"} pose={f >= l2 ? "bracosPraCima" : "provando"} boca={boca("vo")} />
        <Misterioso pos={JM} expr={f >= desm ? "chocado" : "neutro"} pose={f >= desm ? "bracosAbertos" : "provando"} desmaio={cai} />
        {f < l1 && <Garfo p={[-0.95, 1.55, 0.05]} r={[0.4, 0, 0.3]} />}
      </Canvas>
      {f < l1 && <Onomatopeia texto="…" at={4} x={540} y={640} dur={l1 - 4} cor="#ffffff" tam={160} rot={0} />}
      {f >= crime && f < l2 && <Onomatopeia texto="CRIME!" at={crime} x={540} y={640} dur={l2 - crime} cor="#ff5c5c" />}
      {f >= l2 + 10 && f < l3 && <Onomatopeia texto="DELÍCIA ♥" at={l2 + 10} x={540} y={640} dur={l3 - l2 - 10} cor="#ff7ac0" tam={120} />}
      {f >= desm && <Onomatopeia texto="TUM!" at={desm} x={540} y={640} dur={40} cor="#ffd23f" />}
      <Sfx at={0} nome="riser" vol={0.35} />
      <Sfx at={crime} nome="boom" vol={0.4} />
      <Sfx at={l2 + 10} nome="sparkle" vol={0.45} />
      <Sfx at={desm} nome="tum" vol={0.55} />
    </>
  );
};

/** 8. ELIMINAÇÃO: "Quem sai hoje é… o JUNINHO! De novo!" — alçapão. Juninho: "Quinze…" */
export const Veredito: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const jun = wordAt(scene, "juninho!");
  const l1 = lineStart(scene, 1);
  const abre = lerp(f, jun + 4, jun + 12);
  const queda = lerp(f, l1 + 22, l1 + 40);
  const PJ2: V3 = [-1.0, 0, 1.0];
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, ...frente([0.9, 0, 1.0], -0.5, 4.2, ROSTO - 0.35, 36) },
            { f: jun, pos: [-0.4, 2.3, 4.6], alvo: [-1.0, 1.0, 0.8], fov: 40, corte: true },
            { f: l1, ...frente(PJ2, 0, 4.0, ROSTO - 0.4, 38), corte: true },
            { f: l1 + 26, pos: [PJ2[0], 3.6, PJ2[2] + 2.4], alvo: [PJ2[0], 0, PJ2[2]], fov: 40, corte: true },
          ]}
          shakes={[jun]}
        />
        <Estudio />
        <Apresentador pos={[0.9, 0, 1.0]} rotY={-0.5} expr="feliz" pose="apontando" boca={boca("apresentador")} />
        <Alcapao p={PJ2} abre={abre} />
        <Juninho pos={[PJ2[0], -queda * 3, PJ2[2]]} expr={f >= jun ? "triste" : "nervoso"} pose={f >= l1 + 20 ? "bracosPraCima" : "parado"} boca={boca("juninho")} treme={f < jun} />
      </Canvas>
      {f >= jun && f < l1 && <Onomatopeia texto="ELIMINADO!" at={jun} x={540} y={640} dur={l1 - jun} cor="#ff5c5c" tam={120} />}
      {f >= l1 + 24 && <Onomatopeia texto="AAAaaa…" at={l1 + 24} x={540} y={640} dur={40} cor="#ffffff" tam={110} />}
      <Sfx at={0} nome="riser" vol={0.35} />
      <Sfx at={jun} nome="alarme" vol={0.3} />
      <Sfx at={jun + 4} nome="click" vol={0.5} />
      <Sfx at={l1 + 22} nome="whoosh" vol={0.5} />
    </>
  );
};

/** 9. PRÓXIMO EPISÓDIO: "o ingrediente quem escolhe é VOCÊ! Comenta o mais NOJENTO!" */
export const Final: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const voce = wordAt(scene, "você!");
  const com = wordAt(scene, "comenta");
  return (
    <>
      <Canvas>
        <CameraRig
          keys={[
            { f: 0, pos: [0, 2.2, 5.4], alvo: [0, 1.4, 0], fov: 40 },
            { f: voce, ...frente([0, 0, 0.6], 0, 4.0, ROSTO - 0.35, 36), corte: true },
            { f: com + 10, pos: [0, 2.4, 6.2], alvo: [0, 1.4, 0], fov: 42, corte: true },
          ]}
          shakes={[voce]}
        />
        <Estudio />
        <Apresentador pos={[0, 0, 0.6]} expr="feliz" pose={f >= voce && f < com ? "apontando" : "bracosAbertos"} boca={boca("apresentador")} />
        <Zica pos={[-1.6, 0, -0.4]} rotY={0.3} expr="feliz" pose="bracosPraCima" />
        <Vo pos={[1.6, 0, -0.4]} rotY={-0.3} expr="feliz" pose="bracosPraCima" />
        <Sardinha p={[-0.9, 2.6 + Math.sin(f * 0.15) * 0.1, 0]} s={0.6} rot={0.3} />
        <Chiclete p={[0.9, 2.8 + Math.cos(f * 0.15) * 0.1, 0]} s={0.6} />
      </Canvas>
      {f >= com && <Onomatopeia texto="COMENTA AÍ! 👇" at={com} x={540} y={640} dur={200} cor="#ffd23f" tam={100} rot={-4} />}
      <Sfx at={voce} nome="boing" vol={0.45} />
      <Sfx at={com} nome="tada" vol={0.4} />
    </>
  );
};
