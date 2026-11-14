import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Espaco } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Nebulosa } from "../../components/Cosmos";
import { Brilhos, Sol } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** DESENVOLVIMENTO 3: calor e pressão no centro acendem uma estrela: nasce o Sol. */
export const E5Sol: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const calor = wordAt(scene, "calor");
  const pressao = wordAt(scene, "pressão");
  const acende = wordAt(scene, "acendeu");
  const l1 = lineStart(scene, 1);
  const centro = interpolate(f, [0, acende], [0.4, 1], { extrapolateRight: "clamp" });
  const sol = useSpringAt(acende, { damping: 8, stiffness: 140 });
  const flash = interpolate(f, [acende, acende + 3, acende + 18], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.15 }, { f: acende - 10, zoom: 1.35 }, { f: acende + 10, zoom: 1.05 }]} shakes={[acende]} origin="50% 37%">
        <Espaco topo="#0E0A24" base="#2A1E5C" />
        <Nebulosa cx={540} cy={700} R={420} contrai={0.75} gira={1.3} achata={1} centro={f < acende ? centro : 0.5} gas={0.4} />
        {f >= acende && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${sol})`, transformOrigin: "540px 700px" }}>
            <Sol x={540} y={700} r={115} />
          </div>
        )}
        <Brilhos x={540} y={700} at={acende} cor={C.yellow} n={16} raio={420} />
        <PersonagemEm x={540} pe={1235} altura={460} boca={mouth} expressao={f >= l1 ? "animado" : f >= acende ? "surpreso" : "pensativo"} pose={f >= l1 ? "comemorando" : f >= acende ? "assustado" : "explicando"} olharY={-0.8} acessorio="capaceteEspacial" semSombra corpoY={Math.sin(f * 0.1) * 14 + (f >= l1 ? -Math.abs(Math.sin((f - l1) * 0.25)) * 40 : 0)} />
      </Camera>
      <AbsoluteFill style={{ background: "#FFF6C8", opacity: flash, pointerEvents: "none" }} />
      {f < acende && f >= calor && <Tag text="CALOR" x={300} y={300} at={calor} bg={C.orange} color={C.white} size={52} />}
      {f < acende && f >= pressao && <Tag text="PRESSÃO" x={780} y={300} at={pressao} bg={C.red} color={C.white} size={52} />}
      {f >= l1 && <TitleSlam text="NASCEU O SOL!" top={220} size={124} color={C.yellow} at={l1} />}
      <Sfx at={calor} name="riser" volume={0.4} />
      <Sfx at={pressao} name="ronco" volume={0.35} />
      <Sfx at={acende} name="boom" volume={0.6} />
      <Sfx at={acende + 2} name="sparkle" volume={0.7} />
      <Sfx at={l1} name="tada" volume={0.5} />
    </Full>
  );
};
