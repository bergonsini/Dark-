import React from "react";
import { Composition } from "remotion";
import { DURATION_FRAMES, FPS, H, W } from "./lib";
import { CavemanVideo } from "./Video";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CavemanLife"
    component={CavemanVideo}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
