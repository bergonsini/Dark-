import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Calendario, Cozinha, Ingrediente, Moedas, Panetone } from "../../components/Natal";
import { Brilhos } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

const ITENS = [
  { tipo: "manteiga" as const, palavra: "manteiga,", x: 330, y: 680 },
  { tipo: "ovos" as const, palavra: "ovos,", x: 790, y: 680 },
  { tipo: "acucar" as const, palavra: "açúcar", x: 420, y: 1010 },
  { tipo: "frutas" as const, palavra: "frutas", x: 820, y: 1010 },
];

/** DESENVOLVIMENTO 1: ingredientes caríssimos → pão de luxo guardado para a maior festa do ano. */
export const P3Luxo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const caros = wordAt(scene, "caríssimos.");
  const l1 = lineStart(scene, 1);
  const festa = wordAt(scene, "festa");
  const junta = interpolate(f, [l1, l1 + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pao = useSpringAt(l1 + 18, { damping: 8, stiffness: 150 });
  const cal = useSpringAt(festa, { damping: 9, stiffness: 170 });
  const spr = ITENS.map((it) => useSpringAt(wordAt(scene, it.palavra), { damping: 9, stiffness: 180 }));
  const preco = useSpringAt(caros, { damping: 8, stiffness: 200 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.08 }, { f: caros, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 30, zoom: 1.1, y: 40 }]} shakes={[caros]}>
        <Cozinha bancada={1320} />
        {ITENS.map((it, i) => {
          const x = it.x + (540 - it.x) * junta;
          const y = it.y + (900 - it.y) * junta;
          const s = spr[i] * (1 - junta);
          return s > 0.01 ? <Ingrediente key={it.tipo} tipo={it.tipo} x={x} y={y} preco={f >= caros ? preco : 0} s={s * 1.6} /> : null;
        })}
        {f >= l1 + 18 && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${pao})`, transformOrigin: "540px 1020px" }}>
            <Panetone x={540} y={1020} s={1.05} />
          </div>
        )}
        <Brilhos x={540} y={850} at={l1 + 18} cor={C.yellow} n={14} raio={320} />
        <PersonagemEm x={160} pe={1330} altura={400} boca={mouth} expressao={f >= l1 ? "encantado" : f >= caros ? "surpreso" : "feliz"} pose={f >= caros && f < l1 ? "assustado" : "explicando"} olharX={0.7} olharY={-0.4} acessorio="gorroNatal" />
      </Camera>
      <Moedas at={caros} n={18} />
      {f >= caros && f < l1 && <Tag text="CARÍSSIMOS!" x={540} y={300} at={caros} bg={C.yellow} size={66} />}
      {f >= l1 && <Tag text="PÃO DE LUXO" x={540} y={300} at={l1 + 18} bg={C.orange} color={C.white} size={60} />}
      {f >= festa && <Calendario x={860} y={1080} mes="DEZ" dia="25" s={cal * 0.75} destaque={interpolate(f, [festa + 4, festa + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      {ITENS.map((it) => <Sfx key={it.tipo} at={wordAt(scene, it.palavra)} name="pop" volume={0.5} />)}
      <Sfx at={caros} name="ding" volume={0.6} />
      <Sfx at={l1} name="whoosh" volume={0.5} />
      <Sfx at={l1 + 18} name="sparkle" volume={0.6} />
      <Sfx at={festa} name="pop" volume={0.5} />
    </Full>
  );
};
