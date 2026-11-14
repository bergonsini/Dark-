import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Calendario, Engrenagem, Esteira, Panetone } from "../../components/Natal";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** DESENVOLVIMENTO 3: Angelo Motta deixa o panetone alto; hoje as fábricas começam lá por julho. */
export const P5Fabrica: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const motta = wordAt(scene, "motta");
  const alto = wordAt(scene, "alto,");
  const l1 = lineStart(scene, 1);
  const julho = wordAt(scene, "julho.");
  const altura = interpolate(f, [alto, alto + 20], [0.55, 1.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const sai = interpolate(f, [l1, l1 + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const esteira = useSpringAt(l1 + 4, { damping: 14, stiffness: 120 });
  const cal = useSpringAt(julho, { damping: 9, stiffness: 180 });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: alto, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: l1 + 30, zoom: 1.05 }]} shakes={[alto + 6]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #5D6B8A 0%, #8A97B3 70%, #4A5160 70%)" }} />
        {[150, 420, 690].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 380, width: 220, height: 260, background: "#C9E6FF", border: `8px solid ${C.outline}`, borderRadius: 14 }} />
        ))}
        <Engrenagem x={110} y={260} r={70} vel={1} />
        <Engrenagem x={980} y={300} r={90} vel={-0.8} cor="#A8B0C2" />
        {sai > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: sai }}>
            <Panetone x={540} y={1180} s={1.3} alto={altura} />
          </div>
        )}
        {f >= l1 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - esteira) * 700}px)` }}>
            <Esteira y={1120} vel={5} />
          </div>
        )}
        <PersonagemEm x={900} pe={1340} altura={380} boca={mouth} expressao={f >= alto ? "encantado" : "feliz"} pose={f >= l1 ? "apontando" : "explicando"} espelhar olharX={-0.6} acessorio="gorroNatal" />
      </Camera>
      <Tag text="HÁ UNS 100 ANOS" x={540} y={250} at={2} bg={C.white} size={52} />
      {f >= motta && f < l1 && <Tag text="ANGELO MOTTA" x={540} y={360} at={motta} bg={C.yellow} size={52} />}
      {f >= alto && f < l1 && <Tag text="ALTO!" x={830} y={760} at={alto + 4} bg={C.orange} color={C.white} size={60} />}
      {f >= julho && <Calendario x={300} y={720} mes="COMEÇA EM" dia="JULHO" diaTam={64} s={cal * 0.85} destaque={interpolate(f, [julho + 4, julho + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      {f >= l1 && <Tag text="MESES ANTES DO NATAL" x={540} y={360} at={l1 + 6} bg={C.red} color={C.white} size={46} />}
      <Sfx at={2} name="whoosh" volume={0.4} />
      <Sfx at={motta} name="pop" volume={0.5} />
      <Sfx at={alto} name="riser" volume={0.35} />
      <Sfx at={alto + 6} name="boing" volume={0.6} />
      <Sfx at={l1 + 4} name="ronco" volume={0.25} />
      <Sfx at={julho} name="ding" volume={0.5} />
    </Full>
  );
};
