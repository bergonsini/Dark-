import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { TerraEixo } from "../../components/Lua";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** Efeito lento: a Lua ajuda a segurar a inclinação; sem ela, o eixo fica mais instável (Tito fica tonto). */
export const L6Eixo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const inclinacao = wordAt(scene, "inclinação");
  const l1 = lineStart(scene, 1);
  const instavel = wordAt(scene, "instável,");
  const estacoes = wordAt(scene, "estações");
  const milhares = wordAt(scene, "milhares");
  const wobble = interpolate(f, [instavel - 4, instavel + 20], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tonto = f >= instavel;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1 }, { f: inclinacao, zoom: 1.0 }, { f: instavel, zoom: 1.0 }, { f: instavel + 30, zoom: 1.08 }]} shakes={[instavel]} shakeAmp={10}>
        <Espaco topo="#0E0A24" base="#1E1650" />
        <TerraEixo cx={560} cy={780} r={230} wobble={wobble} />
        <PersonagemEm x={180} pe={1340} altura={400} boca={mouth} expressao={tonto ? "preocupado" : "feliz"} pose={tonto ? "assustado" : "explicando"} olharX={tonto ? Math.sin(f * 0.4) : 0.6} olharY={tonto ? Math.cos(f * 0.4) : -0.3} cabeca={tonto ? Math.sin(f * 0.25) * 12 : 0} rot={tonto ? Math.sin(f * 0.18) * 6 : 0} />
      </Camera>
      <Tag text="EFEITO LENTO" x={540} y={260} at={4} bg={C.white} size={50} />
      {f >= inclinacao && <Tag text="INCLINAÇÃO ≈ 23°" x={820} y={460} at={inclinacao} bg={C.red} color={C.white} size={42} />}
      {f >= l1 && <Tag text="SEM A LUA: MAIS INSTÁVEL" x={540} y={370} at={instavel} bg={C.yellow} size={44} />}
      {f >= estacoes && <Tag text="ESTAÇÕES MUDANDO" x={620} y={1120} at={estacoes} bg={C.green} size={46} />}
      {f >= milhares && <Tag text="EM MILHARES DE ANOS" x={620} y={1220} at={milhares} bg={C.violet} color={C.white} size={42} />}
      <Sfx at={4} name="pop" volume={0.4} />
      <Sfx at={inclinacao} name="click" volume={0.5} />
      <Sfx at={instavel} name="ronco" volume={0.35} />
      <Sfx at={instavel + 4} name="boing" volume={0.35} />
      <Sfx at={estacoes} name="pop" volume={0.45} />
      <Sfx at={milhares} name="pop" volume={0.45} />
    </Full>
  );
};
