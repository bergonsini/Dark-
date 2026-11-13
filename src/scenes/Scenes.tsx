import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caveman } from "../characters/Caveman";
import { Mammoth } from "../characters/Mammoth";
import { CaveInterior, DawnLandscape, Forest, NightSky, Plains } from "../components/Backgrounds";
import {
  BerryBush,
  BigText,
  Bolt,
  Brain,
  CartIcon,
  CommentIcon,
  Fire,
  FridgeIcon,
  RedX,
  Root,
  Sparkles,
  StatBar,
  Sunburst,
  WolfEyes,
  shake,
} from "../components/Elements";
import { SceneId, clamp, ease, f, pop, sceneStart, talkAmount, wordAt } from "../lib";

const INK = "#2a1608";
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);
/** Converte um tempo absoluto (s) no quadro local da cena. */
const local = (id: SceneId) => (t: number) => f(t - sceneStart(id));

// =====================================================================================
// 1) GANCHO — pergunta chamativa nos primeiros 2 segundos
// =====================================================================================
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 14], [1.25, 1], { ...clamp });
  const tremble = Math.sin(frame * 1.7) * (frame < 40 ? 6 : 2);
  const look = frame < 45 ? Math.sin(frame * 0.5) * 0.9 : 0;
  return (
    <AbsoluteFill style={{ transform: `${shake(frame, 0, 14, 26)} ${shake(frame, 20, 10, 14)}` }}>
      <Sunburst c1="#ff5400" c2="#ff8500" speed={0.8} cy={1100} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Stage>
          {/* pontos de interrogação flutuando */}
          {[[140, 1000, -20], [940, 950, 18], [180, 1500, 10], [920, 1450, -12]].map(([x, y, r], i) => {
            const s = pop(frame, 14 + i * 4);
            return (
              <text
                key={i}
                x={x}
                y={y + Math.sin(frame * 0.15 + i) * 18}
                fontFamily="Bangers"
                fontSize={170}
                fill="#fff3b0"
                stroke={INK}
                strokeWidth={10}
                paintOrder="stroke"
                textAnchor="middle"
                transform={`rotate(${r + Math.sin(frame * 0.1 + i) * 8},${x},${y}) translate(${x * (1 - s)},${y * (1 - s)}) scale(${s})`}
              >
                ?
              </text>
            );
          })}
          <Caveman
            x={540 + tremble}
            y={1880}
            scale={1.85}
            armL={135 + Math.sin(frame * 0.9) * 10}
            elbowL={35}
            armR={135 + Math.cos(frame * 0.9) * 10}
            elbowR={35}
            eyeScale={1.35}
            brow={1}
            mouth="open"
            mouthOpen={0.85 + Math.sin(frame * 0.6) * 0.15}
            lookX={look}
            lookY={-0.2}
            sweat
          />
        </Stage>
      </AbsoluteFill>
      <BigText text="VOCÊ SOBREVIVERIA" at={0} y={230} size={118} color="#ffffff" />
      <BigText text="1 DIA" at={5} y={410} size={250} color="#ffd60a" rotate={-4} />
      <BigText text={"COMO HOMEM\nDAS CAVERNAS?"} at={10} y={640} size={124} color="#ffffff" rotate={2} />
    </AbsoluteFill>
  );
};

// =====================================================================================
// 2) APRESENTAÇÃO — Ugo sai da caverna ao amanhecer
// =====================================================================================
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("intro");
  const tUgo = L(wordAt("intro", "Ugo."));
  const walkEnd = 52;
  const x = interpolate(frame, [4, walkEnd], [205, 560], clamp);
  const sc = interpolate(frame, [4, walkEnd], [0.75, 1.3], clamp);
  const stretching = frame > walkEnd && frame < tUgo + 2;
  const waving = frame >= tUgo + 2;
  const stretchP = ease(frame, walkEnd, walkEnd + 12, 0, 1) * (1 - ease(frame, tUgo - 6, tUgo + 4, 0, 1));
  const years = Math.round(interpolate(frame, [2, 30], [0, 100000], clamp));
  return (
    <AbsoluteFill>
      <DawnLandscape sunRise={interpolate(frame, [0, 140], [0, 1], clamp)} />
      <Stage>
        <Caveman
          x={x}
          y={1840}
          scale={sc}
          walk={frame < walkEnd ? 1.1 : 0}
          armL={stretching ? 10 + stretchP * 160 : waving ? 12 : 15 + Math.sin(frame * 0.27) * 15}
          elbowL={stretching ? 10 : 10}
          armR={stretching ? 10 + stretchP * 160 : waving ? 145 : 15 - Math.sin(frame * 0.27) * 15}
          elbowR={waving ? 30 + Math.sin(frame * 0.5) * 30 : 10}
          mouth={stretching && stretchP > 0.5 ? "yawn" : waving ? "grin" : "smile"}
          eyesClosed={stretching ? stretchP : 0}
          brow={stretching ? 0.6 : waving ? 0.4 : 0}
          lookX={waving ? 0 : 0.6}
          headTilt={stretching ? -8 * stretchP : waving ? 6 : 0}
          bounce={waving ? 0.25 : 0}
        />
      </Stage>
      <BigText text={`${years.toLocaleString("pt-BR")} ANOS`} at={2} y={230} size={150} color="#ffd60a" />
      <BigText text="ATRÁS..." at={8} y={380} size={100} color="#ffffff" />
      <BigText text="ESSE É O UGO!" at={tUgo} y={640} size={110} color="#ffffff" bg="#ff6b35" rotate={-3} />
    </AbsoluteFill>
  );
};

// =====================================================================================
// 3) FOME — sem mercado, sem geladeira
// =====================================================================================
export const HungerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("hunger");
  const tMerc = L(wordAt("hunger", "mercado,"));
  const tGel = L(wordAt("hunger", "geladeira..."));
  const tSe = L(wordAt("hunger", "Se"));
  const tVirar = L(wordAt("hunger", "virar."));
  const growl = frame < 30 ? Math.sin(frame * 1.2) * (1 - frame / 30) : 0;
  const thinking = frame >= tSe;
  const icon = (at: number, x: number, children: React.ReactNode, label: string) => {
    const s = pop(frame, at);
    if (frame < at) return null;
    return (
      <g transform={`translate(${x},520) scale(${s}) rotate(${Math.sin(frame * 0.1 + x) * 4})`}>
        <circle r={190} fill="#fff3b0" stroke={INK} strokeWidth={12} />
        {children}
        <RedX at={at + 8} size={250} />
        <text y={300} textAnchor="middle" fontFamily="Bangers" fontSize={78} fill="white" stroke={INK} strokeWidth={10} paintOrder="stroke">
          {label}
        </text>
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ transform: shake(frame, 0, 18, 10) }}>
      <CaveInterior />
      <Stage>
        {icon(tMerc, 270, <CartIcon />, "MERCADO")}
        {icon(tGel, 810, <FridgeIcon />, "GELADEIRA")}
        <Caveman
          x={540}
          y={1880}
          scale={1.4}
          squash={growl}
          armL={thinking ? 15 : 22}
          elbowL={thinking ? 10 : 85}
          armR={thinking ? 160 : 22}
          elbowR={thinking ? 110 + Math.sin(frame * 0.8) * 12 : 85}
          brow={thinking ? -0.3 : -0.6}
          browAngry={thinking ? 0 : -0.8}
          mouth={frame >= tVirar ? "grin" : thinking ? "flat" : "sad"}
          lookX={thinking ? Math.sin(frame * 0.12) : 0}
          lookY={thinking ? -0.8 : 0.5}
          headTilt={thinking ? 10 : -4}
          bounce={frame >= tVirar ? 0.4 : 0}
        />
        {frame < 34 && (
          <text
            x={790}
            y={1260}
            fontFamily="Bangers"
            fontSize={120}
            fill="#ffd60a"
            stroke={INK}
            strokeWidth={12}
            paintOrder="stroke"
            textAnchor="middle"
            transform={`rotate(-12,790,1260) scale(${1 + Math.sin(frame) * 0.04})`}
            style={{ transformOrigin: "790px 1260px" }}
          >
            RONC!
          </text>
        )}
      </Stage>
      <BigText text="SE VIRA!" at={tVirar - 4} y={960} size={190} color="#ff3b30" rotate={-6} />
    </AbsoluteFill>
  );
};

// =====================================================================================
// 4) ESCOLHA — caçar ou coletar?
// =====================================================================================
export const ChoiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("choice");
  const tCacar = L(wordAt("choice", "caçar"));
  const tMamute = L(wordAt("choice", "mamute"));
  const tOu = L(wordAt("choice", "ou"));
  const tColetar = L(wordAt("choice", "coletar"));
  const leftIn = ease(frame, tCacar - 4, tCacar + 8, -1, 0);
  const rightIn = ease(frame, tColetar - 4, tColetar + 8, 1, 0);
  const trumpet = interpolate(frame, [tMamute, tMamute + 6, tMamute + 30, tMamute + 40], [0, 1, 1, 0], clamp);
  const look = frame < tCacar ? 0 : frame < tColetar ? -1 : frame < tColetar + 25 ? 1 : Math.sin(frame * 0.15);
  const vs = pop(frame, tOu, 6);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#3d2c5e" />
        <g transform={`translate(${leftIn * 1100},0)`}>
          <path d="M 0 0 L 640 0 L 440 1920 L 0 1920 Z" fill="#e63946" />
          <path d="M 0 0 L 640 0 L 440 1920 L 0 1920 Z" fill="url(#stripes)" opacity={0.15} />
        </g>
        <g transform={`translate(${rightIn * 1100},0)`}>
          <path d="M 640 0 L 1080 0 L 1080 1920 L 440 1920 Z" fill="#2a9d8f" />
        </g>
        <defs>
          <pattern id="stripes" width={40} height={40} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <rect width={20} height={40} fill="white" />
          </pattern>
        </defs>
      </svg>
      <Stage>
        <g transform={`translate(${leftIn * 1100},0)`}>
          <Mammoth x={300} y={930} scale={0.62} trumpet={trumpet} />
          <text x={270} y={1080} textAnchor="middle" fontFamily="Bangers" fontSize={130} fill="white" stroke={INK} strokeWidth={14} paintOrder="stroke" transform={`rotate(-4,270,1080)`}>
            CAÇAR
          </text>
        </g>
        <g transform={`translate(${rightIn * 1100},0)`}>
          <BerryBush x={820} y={880} scale={1.05} />
          <Root x={640} y={830} scale={0.6} />
          <text x={810} y={1080} textAnchor="middle" fontFamily="Bangers" fontSize={120} fill="white" stroke={INK} strokeWidth={14} paintOrder="stroke" transform={`rotate(4,810,1080)`}>
            COLETAR
          </text>
        </g>
        {frame >= tOu && (
          <g transform={`translate(540,${720 + Math.sin(frame * 0.2) * 10}) scale(${vs * (1 + Math.sin(frame * 0.4) * 0.06)}) rotate(${Math.sin(frame * 0.3) * 6})`}>
            <circle r={115} fill="#ffd60a" stroke={INK} strokeWidth={14} />
            <text y={45} textAnchor="middle" fontFamily="Bangers" fontSize={130} fill="#e63946" stroke={INK} strokeWidth={8} paintOrder="stroke">
              VS
            </text>
          </g>
        )}
        <Caveman
          x={540}
          y={1960}
          scale={1.15}
          lookX={look}
          lookY={-0.3}
          headTilt={look * 10}
          armL={frame > tColetar + 25 ? 15 : 20}
          elbowL={frame > tColetar + 25 ? 80 : 20}
          armR={frame > tColetar + 25 ? 160 : 20}
          elbowR={frame > tColetar + 25 ? 105 + Math.sin(frame * 0.9) * 10 : 20}
          brow={frame > tColetar + 25 ? -0.2 : 0.7}
          mouth={frame > tColetar + 25 ? "flat" : "o"}
        />
      </Stage>
      <BigText text="O QUE VOCÊ ESCOLHE?" at={0} y={200} size={112} color="#ffd60a" />
    </AbsoluteFill>
  );
};

// =====================================================================================
// 5) CAÇAR — muita comida, muito risco
// =====================================================================================
export const HuntScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("hunt");
  const tBarriga = L(wordAt("hunt", "barriga"));
  const tErro = L(wordAt("hunt", "erro"));
  const danger = frame >= tErro - 4;
  const chase = Math.max(0, frame - (tErro - 4));
  const ugoX = danger ? 330 - chase * 9 : 330;
  const mamX = danger ? 900 - chase * 11 : 900;
  return (
    <AbsoluteFill style={{ transform: danger ? shake(frame, tErro - 4, 30, 16) : "" }}>
      <Plains scroll={danger ? chase * 30 : frame * 2} danger={danger ? 1 : 0} />
      <Stage>
        <Mammoth x={mamX} y={1800} scale={0.82} walk={danger ? 2.2 : 0.4} trumpet={danger && chase < 30 ? 1 : 0} angry={danger ? 1 : 0.3} />
        <Caveman
          x={ugoX}
          y={1840}
          scale={1.2}
          flip={danger}
          walk={danger ? 3 : 0}
          hold="spear"
          armR={danger ? 60 : 150}
          elbowR={danger ? -20 : 10}
          armL={danger ? 100 + Math.sin(frame * 0.8) * 40 : 30}
          elbowL={danger ? 20 : 40}
          mouth={danger ? "open" : "grin"}
          mouthOpen={danger ? 0.9 : 0.5}
          brow={danger ? 1 : -0.2}
          browAngry={danger ? 0 : 0.8}
          eyeScale={danger ? 1.3 : 1}
          lookX={danger ? 1 : 0.8}
          sweat={danger}
          bounce={danger ? 0 : 0.15}
        />
      </Stage>
      <StatBar label="COMIDA" value={95} color="#80ed99" at={tBarriga} y={170} />
      <StatBar label="RISCO DE VIDA" value={92} color="#ff3b30" at={tErro} y={390} />
      {danger && <BigText text="PERIGO!" at={tErro + 3} y={700} size={200} color="#ff3b30" rotate={-8} />}
    </AbsoluteFill>
  );
};

// =====================================================================================
// 6) COLETAR — seguro, mas cansativo
// =====================================================================================
export const GatherScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("gather");
  const tSeguro = L(wordAt("gather", "seguro,"));
  const tAndar = L(wordAt("gather", "andar"));
  const tKm = L(wordAt("gather", "quilômetros,"));
  const scroll = frame * 9;
  const km = Math.round(interpolate(frame, [tAndar, tAndar + 45], [0, 20], clamp));
  const tired = frame > tKm + 10;
  // braço que alcança as frutas a cada ~40 quadros
  const reach = Math.max(0, Math.sin(frame * 0.16)) ** 3;
  return (
    <AbsoluteFill>
      <Forest scroll={scroll} />
      <Stage>
        {[0, 1, 2, 3].map((i) => {
          const x = ((i * 520 + 900 - scroll) % 2080 + 2080) % 2080 - 300;
          return <BerryBush key={i} x={x} y={1700} scale={0.75} picked={x < 420 ? 4 : 0} />;
        })}
        <Caveman
          x={440}
          y={1860}
          scale={1.2}
          walk={tired ? 0.8 : 1.1}
          hold="basket"
          armR={12}
          elbowR={20}
          armL={20 + reach * 70}
          elbowL={10 + reach * 20}
          mouth={tired ? "open" : "smile"}
          mouthOpen={tired ? 0.35 + Math.sin(frame * 0.3) * 0.15 : 0.5}
          brow={tired ? -0.5 : 0.2}
          eyesClosed={tired ? 0.35 : 0}
          lookX={-0.4}
          sweat={tired}
          headTilt={tired ? 8 : 0}
        />
      </Stage>
      <StatBar label="SEGURANÇA" value={85} color="#80ed99" at={tSeguro} y={170} />
      <StatBar label="CANSAÇO" value={88} color="#ff9f1c" at={tKm} y={390} />
      {frame >= tAndar && <BigText text={`${km} KM`} at={tAndar} y={700} size={190} color="#ffd60a" rotate={-3} wobble={false} />}
    </AbsoluteFill>
  );
};

// =====================================================================================
// 7) FOGO — calor, proteção e comida
// =====================================================================================
export const FireScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("fire");
  const tFogo = L(wordAt("fire", "fogo"));
  const tAquecia = L(wordAt("fire", "aquecia,"));
  const tEspantava = L(wordAt("fire", "espantava"));
  const tCozinhava = L(wordAt("fire", "cozinhava"));
  const flare = interpolate(frame, [tEspantava, tEspantava + 6, tEspantava + 30], [1, 1.45, 1.1], clamp);
  const wolves = interpolate(frame, [tEspantava + 4, tEspantava + 16], [1, 0], clamp);
  const wolfShift = interpolate(frame, [tEspantava + 4, tEspantava + 16], [0, 120], clamp);
  return (
    <AbsoluteFill>
      <NightSky />
      <Stage>
        <WolfEyes x={90 - wolfShift} y={1300} opacity={wolves} scale={1.4} />
        <WolfEyes x={230 - wolfShift} y={1340} opacity={wolves} scale={1.1} />
        <WolfEyes x={980 + wolfShift} y={1310} opacity={wolves} scale={1.4} />
        <Fire x={540} y={1740} scale={1.1} intensity={flare} />
        <Caveman
          x={190}
          y={1800}
          scale={1.25}
          sit
          hold="meat"
          armR={70}
          elbowR={-10}
          armL={25}
          elbowL={60}
          mouth={frame >= tCozinhava ? "grin" : "smile"}
          lookX={0.9}
          lookY={0.2}
          brow={frame >= tEspantava && frame < tEspantava + 25 ? 1 : 0.2}
        />
        <Caveman
          variant="nara"
          x={890}
          y={1800}
          scale={1.18}
          sit
          armL={60 + Math.sin(frame * 0.1) * 5}
          elbowL={30}
          armR={15}
          elbowR={70}
          lookX={-0.9}
          lookY={0.2}
          mouth="smile"
          headTilt={-6}
        />
      </Stage>
      <BigText text="O FOGO ERA TUDO!" at={tFogo} y={230} size={120} color="#ffba08" out={tAquecia - 6} />
      <BigText text="CALOR" at={tAquecia} y={260} size={110} color="white" bg="#ff6b35" rotate={-4} />
      <BigText text="PROTEÇÃO" at={tEspantava} y={470} size={110} color="white" bg="#3a86ff" rotate={3} />
      <BigText text="COMIDA" at={tCozinhava} y={680} size={110} color="white" bg="#2a9d8f" rotate={-2} />
    </AbsoluteFill>
  );
};

// =====================================================================================
// 8) CURIOSIDADE — cozinhar ajudou o cérebro a crescer
// =====================================================================================
export const FactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = local("fact");
  const tCient = L(wordAt("fact", "cientistas"));
  const tCoz = L(wordAt("fact", "cozinhar"));
  const tAjudou = L(wordAt("fact", "ajudou"));
  const tCerebro = L(wordAt("fact", "cérebro"));
  const tCrescer = L(wordAt("fact", "crescer,"));
  const tLibera = L(wordAt("fact", "libera"));
  const brainS = pop(frame, tCerebro) * interpolate(frame, [tCrescer, tCrescer + 20], [0.6, 1.0], clamp);
  const arrowP = interpolate(frame, [tAjudou, tAjudou + 12], [0, 1], clamp);
  const meatS = pop(frame, tCoz);
  return (
    <AbsoluteFill>
      <Sunburst c1="#3a0ca3" c2="#4361ee" speed={0.25} cy={850} />
      <Sparkles count={18} seed="fact" area={[40, 80, 1000, 1200]} />
      <Stage>
        {frame >= tCoz && (
          <g transform={`translate(250,950) scale(${meatS})`}>
            <Fire x={0} y={80} scale={0.45} />
            <g transform="translate(0,-60) rotate(-20)">
              <rect x={-8} y={-30} width={16} height={200} rx={8} fill="#7a4a1d" stroke={INK} strokeWidth={5} />
              <ellipse cx={0} cy={-60} rx={70} ry={58} fill="#9c3a1d" stroke={INK} strokeWidth={8} />
              <ellipse cx={-14} cy={-74} rx={30} ry={18} fill="#c86b3c" />
              <circle cx={-52} cy={-104} r={18} fill="#f3ead2" stroke={INK} strokeWidth={5} />
            </g>
          </g>
        )}
        {arrowP > 0 && (
          <g opacity={arrowP}>
            <path d={`M 410 860 L ${410 + 200 * arrowP} 860`} stroke={INK} strokeWidth={46} strokeLinecap="round" />
            <path d={`M 410 860 L ${410 + 200 * arrowP} 860`} stroke="#ffd60a" strokeWidth={30} strokeLinecap="round" />
            {arrowP > 0.9 && <path d="M 600 800 L 680 860 L 600 920 Z" fill="#ffd60a" stroke={INK} strokeWidth={10} strokeLinejoin="round" />}
          </g>
        )}
        {frame >= tCerebro && (
          <g>
            <Brain x={850} y={850} scale={brainS} />
            {frame >= tCrescer &&
              [[-200, -150, -20], [190, -170, 25], [210, 150, 160], [-210, 140, -160]].map(([dx, dy, r], i) => (
                <Bolt key={i} x={850 + dx * brainS} y={850 + dy * brainS} scale={0.6 * pop(frame, tCrescer + i * 3)} rot={r + Math.sin(frame * 0.4 + i) * 10} />
              ))}
          </g>
        )}
        <Caveman
          x={540}
          y={1880}
          scale={1.15}
          glasses
          armL={frame >= tCerebro ? 140 : 25}
          elbowL={frame >= tCerebro ? -20 : 60}
          armR={frame < tCerebro ? 140 : 20}
          elbowR={frame < tCerebro ? -10 : 40}
          lookX={frame >= tCerebro ? -0.2 : 0.2}
          lookY={-0.6}
          brow={0.8}
          mouth={frame > tLibera ? "grin" : "smile"}
          headTilt={Math.sin(frame * 0.2) * 5}
        />
      </Stage>
      <BigText text="VOCÊ SABIA?" at={0} y={210} size={170} color="#ffd60a" rotate={-3} />
      <BigText text="SEGUNDO CIENTISTAS..." at={tCient} y={420} size={80} color="#ffffff" font="Baloo" />
      {frame >= tCrescer && <BigText text="CÉREBRO MAIOR!" at={tCrescer + 4} y={1140} size={100} color="#ff8fab" x={760} width={620} />}
      {frame >= tLibera && <BigText text="+ ENERGIA" at={tLibera} y={600} size={140} color="#80ed99" rotate={-4} />}
    </AbsoluteFill>
  );
};

// =====================================================================================
// 9) CHAMADA FINAL — comente!
// =====================================================================================
export const CtaScene: React.FC<{ absStart: number }> = ({ absStart }) => {
  const frame = useCurrentFrame();
  const L = local("cta");
  const tCacador = L(wordAt("cta", "caçador"));
  const tColetor = L(wordAt("cta", "coletor?"));
  const tComenta = L(wordAt("cta", "Comenta"));
  const talk = talkAmount(frame + absStart, ["cta"]);
  const btn = (at: number, x: number, color: string, label: string, icon: React.ReactNode, phase: number) => {
    const s = pop(frame, at, 8);
    if (frame < at) return null;
    const pulse = 1 + Math.max(0, Math.sin(frame * 0.25 + phase)) * 0.07;
    return (
      <g transform={`translate(${x},640) scale(${s * pulse}) rotate(${Math.sin(frame * 0.1 + phase) * 3})`}>
        <rect x={-230} y={-200} width={460} height={400} rx={50} fill={INK} transform="translate(0,16)" />
        <rect x={-230} y={-200} width={460} height={400} rx={50} fill={color} stroke={INK} strokeWidth={12} />
        <g transform="translate(0,-50)">{icon}</g>
        <text y={145} textAnchor="middle" fontFamily="Bangers" fontSize={100} fill="white" stroke={INK} strokeWidth={12} paintOrder="stroke">
          {label}
        </text>
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <Sunburst c1="#ff006e" c2="#fb5607" speed={0.6} cy={1000} />
      <Stage>
        {btn(
          tCacador,
          290,
          "#e63946",
          "CAÇADOR",
          <g transform="rotate(35) scale(0.55)">
            <rect x={-10} y={-200} width={20} height={380} rx={10} fill="#8b5a2b" stroke={INK} strokeWidth={8} />
            <path d="M 0 -290 L 36 -190 L 0 -208 L -36 -190 Z" fill="#9aa3ad" stroke={INK} strokeWidth={8} />
          </g>,
          0,
        )}
        {btn(tColetor, 790, "#2a9d8f", "COLETOR", <BerryBush x={0} y={70} scale={0.55} />, Math.PI)}
        <Caveman
          x={540}
          y={1900}
          scale={1.3}
          mouth={talk > 0 ? "talk" : "grin"}
          mouthOpen={talk}
          armL={frame >= tComenta ? 30 : 100}
          elbowL={frame >= tComenta ? 20 : -40 + Math.sin(frame * 0.4) * 10}
          armR={frame >= tComenta ? 120 : 20}
          elbowR={frame >= tComenta ? 40 + Math.sin(frame * 0.6) * 15 : 30}
          lookX={frame < tCacador ? 0 : frame < tColetor ? -0.9 : frame < tComenta ? 0.9 : 0}
          brow={0.7}
          bounce={0.18}
          headTilt={frame >= tComenta ? 8 : 0}
        />
        {frame >= tComenta && (
          <g>
            <CommentIcon x={880} y={1130 + Math.sin(frame * 0.35) * 18} scale={pop(frame, tComenta) * 0.9} />
            {[0, 1].map((i) => (
              <path
                key={i}
                d="M -40 0 L 0 40 L 40 0"
                transform={`translate(880,${1260 + i * 50 + ((frame * 3) % 50)})`}
                stroke="#ffd60a"
                strokeWidth={22}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={1 - ((frame * 3) % 50) / 80}
              />
            ))}
          </g>
        )}
      </Stage>
      <BigText text="E VOCÊ?" at={0} y={220} size={190} color="#ffd60a" rotate={-3} />
      {frame >= tComenta && <BigText text="COMENTA AÍ!" at={tComenta} y={1000} x={400} width={720} size={120} color="#ffffff" rotate={-5} />}
    </AbsoluteFill>
  );
};
