import React from "react";
import { Composition } from "remotion";
import { CavemanReel } from "./CavemanReel";
import { timeline } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CavemanReel"
      component={CavemanReel}
      durationInFrames={timeline.durationInFrames}
      fps={timeline.fps}
      width={1080}
      height={1920}
    />
  );
};
