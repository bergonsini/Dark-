import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Video} from './Video';
import {T} from './lib';

loadFont({family: 'Luckiest Guy', url: staticFile('fonts/LuckiestGuy.woff2')});
loadFont({family: 'Nunito', url: staticFile('fonts/Nunito-Black.woff2'), weight: '900'});

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HomemDasCavernas"
    component={Video}
    durationInFrames={T.durationInFrames}
    fps={T.fps}
    width={1080}
    height={1920}
  />
);
