import React from "react";
import { Composition } from "remotion";
import { CartoonExplainer } from "./cartoon/CartoonExplainer";
import { FPS, HEIGHT, WIDTH } from "./cartoon/config";
import { timeline } from "./cartoon/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Skill cartoon-explainer: 9:16, 1080x1920, 30 fps, duração vinda do timeline (padrão 60 s) */}
      <Composition
        id="CartoonExplainer"
        component={CartoonExplainer}
        durationInFrames={timeline.durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
