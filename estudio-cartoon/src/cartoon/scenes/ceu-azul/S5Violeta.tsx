import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Molecula, OlhoGrande, RaioZigue, Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C, RAINBOW } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** DESENVOLVIMENTO 3: e o violeta? O Sol manda pouco violeta e nossos olhos preferem o azul. */
export const S5Violeta: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const olhos = wordAt(scene, "olhos");
  const p = (a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barras = useSpringAt(l1);
  const olho = useSpringAt(olhos, { damping: 9, stiffness: 160 });
  // quantidade de cada cor que o Sol emite (ilustrativo): pouco violeta
  const qtd = [0.8, 0.9, 1, 0.95, 0.85, 0.35];
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: l1, zoom: 1 }, { f: olhos, zoom: 1 }, { f: olhos + 20, zoom: 1.08, y: 60 }]}>
        <Espaco topo="#1A0F3D" base="#3B2580" />
        {[[260, 420], [520, 520], [800, 400], [380, 700], [700, 720]].map(([x, y], i) => (
          <Molecula key={i} x={x} y={y} seed={i * 3} hit={6 + i * 6} />
        ))}
        <RaioZigue pontos={[[-40, 300], [260, 420], [520, 520], [380, 700], [700, 720], [800, 400], [1120, 260]]} cor={C.violet} p={p(4, 45)} />
        {f >= l1 && (
          <div style={{ position: "absolute", left: 90, top: 860, width: 680, height: 330, display: "flex", alignItems: "flex-end", gap: 24 }}>
            {RAINBOW.map((cor, i) => (
              <div key={cor} style={{ flex: 1, height: 300 * qtd[i] * barras, background: cor, border: `7px solid ${C.outline}`, borderRadius: 18, boxShadow: `0 8px 0 ${C.outline}` }} />
            ))}
          </div>
        )}
        {f >= l1 && <Sol x={430} y={790} r={50} cor={C.yellow} />}
        {f >= olhos && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${olho})`, transformOrigin: "540px 500px" }}>
            <OlhoGrande x={540} y={500} s={1.3} corIris={C.blue} />
          </div>
        )}
        <PersonagemEm x={930} pe={1300} altura={420} boca={mouth} expressao={f >= olhos ? "feliz" : f >= l1 ? "pensativo" : "surpreso"} pose={f >= olhos ? "apontando" : f >= l1 ? "pensando" : "assustado"} espelhar olharX={-0.4} />
      </Camera>
      <Tag text="E O VIOLETA?" x={540} y={200} at={2} bg={C.violet} color={C.white} size={60} />
      {f >= l1 && f < olhos && <Tag text="POUCO VIOLETA" x={700} y={820} at={l1 + 20} bg={C.white} size={40} />}
      {f >= olhos && <Tag text="OLHOS ♥ AZUL" x={540} y={760} at={olhos + 10} bg={C.blue} color={C.white} size={56} />}
      <Sfx at={2} name="pop" />
      <Sfx at={4} name="whoosh" volume={0.4} />
      <Sfx at={l1} name="riser" volume={0.3} />
      <Sfx at={olhos} name="boing" volume={0.6} />
      <Sfx at={olhos + 10} name="ding" volume={0.5} />
    </Full>
  );
};
