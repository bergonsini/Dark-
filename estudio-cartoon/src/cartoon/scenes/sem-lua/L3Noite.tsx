import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { CeuNoturno, Lanterna, QuizCards } from "../../components/Lua";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** Resposta A: noites muito mais escuras. Gag: Tito anda de lanterna e tropeça no escuro. */
export const L3Noite: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const noites = wordAt(scene, "noites!");
  const escuras = wordAt(scene, "escuras.");
  const tropeca = escuras + 4;
  const x = interpolate(f, [noites + 10, tropeca], [140, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const queda = interpolate(f, [tropeca, tropeca + 7, tropeca + 34, tropeca + 46], [0, 78, 78, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const andando = f > noites + 10 && f < tropeca;
  const A = 420;
  const pe = 1330;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: noites + 10, zoom: 1.0 }, { f: tropeca, zoom: 1.15, x: -100, y: -60 }, { f: tropeca + 60, zoom: 1.05 }]} shakes={[tropeca + 6]}>
        <CeuNoturno luar={0} />
        {f > noites + 6 && queda < 30 && <Lanterna x={x + A * 0.16} y={pe - A * 0.55} ang={8} />}
        <PersonagemEm x={x} pe={pe} altura={A} boca={mouth} expressao={queda > 10 ? "surpreso" : "pensativo"} pose={queda > 10 ? "assustado" : andando ? "andando" : "apontando"} andando={andando} olharX={0.6} rot={queda} />
      </Camera>
      {f < noites + 40 && (
        <QuizCards
          y={420}
          opcoes={[
            { letra: "A", texto: "NOITES ESCURAS", cor: C.violet, at: -30 },
            { letra: "B", texto: "MARÉS MENORES", cor: C.blue, at: -30 },
            { letra: "C", texto: "ESTAÇÕES MALUCAS", cor: C.orange, at: -30 },
          ]}
          certa={[0]}
          revela={noites}
        />
      )}
      {f >= noites + 40 && <Tag text="NOITES BEM MAIS ESCURAS" x={540} y={300} at={noites + 40} bg={C.violet} color={C.white} size={48} />}
      {f >= tropeca + 4 && f < tropeca + 50 && <Tag text="OPS!" x={720} y={1060} at={tropeca + 4} bg={C.yellow} size={64} />}
      <Sfx at={noites} name="ding" volume={0.6} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} at={noites + 14 + i * 10} name="click" volume={0.2} />)}
      <Sfx at={tropeca + 4} name="boing" volume={0.7} />
    </Full>
  );
};
