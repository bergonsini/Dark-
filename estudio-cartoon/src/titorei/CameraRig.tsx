import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { PerspectiveCamera } from "three";

type V3 = [number, number, number];
/**
 * Câmera do Titorei. Cada chave: frame LOCAL, posição, alvo e fov.
 * `corte: true` = CORTE SECO (a câmera pula para esta chave no frame dela, sem deslizar).
 * Sem `corte`, a câmera desliza suavemente da chave anterior até esta (dolly/zoom).
 */
export type CamKey = { f: number; pos: V3; alvo: V3; fov?: number; corte?: boolean };

export const CameraRig: React.FC<{ keys: CamKey[]; shakes?: number[]; amp?: number }> = ({ keys, shakes = [], amp = 0.08 }) => {
  const f = useCurrentFrame();
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const ks = [...keys].sort((a, b) => a.f - b.f);
  let a = ks[0];
  let b = ks[0];
  for (let i = 0; i < ks.length; i++) {
    if (ks[i].f <= f) {
      a = ks[i];
      b = ks[i + 1] ?? ks[i];
    }
  }
  let t = 0;
  if (b !== a && !b.corte) t = interpolate(f, [a.f, b.f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const mix = (u: V3, v: V3): V3 => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t, u[2] + (v[2] - u[2]) * t];
  const pos = mix(a.pos, b.pos);
  const alvo = mix(a.alvo, b.alvo);
  const fov = (a.fov ?? 40) + ((b.fov ?? 40) - (a.fov ?? 40)) * t;
  let sx = 0;
  let sy = 0;
  for (const s of shakes) {
    const d = f - s;
    if (d >= 0 && d < 12) {
      const k = 1 - d / 12;
      sx += Math.sin(d * 2.9) * amp * k;
      sy += Math.cos(d * 3.7) * amp * k;
    }
  }
  useLayoutEffect(() => {
    camera.position.set(pos[0] + sx, pos[1] + sy, pos[2]);
    camera.lookAt(alvo[0] + sx, alvo[1] + sy, alvo[2]);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  });
  return null;
};

/**
 * Câmera DE FRENTE para um personagem/objeto: centro (pés ou base), rotação Y dele, distância e altura do alvo.
 * Ex.: close no rosto do Tito.rei → frente(pos, rotY, 2.4, 2.0).
 */
export const frente = (centro: V3, rotY: number, dist: number, altura: number, fov = 32, lado = 0): { pos: V3; alvo: V3; fov: number } => {
  const dx = Math.sin(rotY + lado);
  const dz = Math.cos(rotY + lado);
  const alvo: V3 = [centro[0], centro[1] + altura, centro[2]];
  return { pos: [alvo[0] + dx * dist, alvo[1] + 0.05, alvo[2] + dz * dist], alvo, fov };
};
