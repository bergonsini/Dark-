import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Uma "tomada" 2D: SVG 1080x1920 com câmera (zoom em torno de um ponto) e tremida.
 * `pb`: preto e branco (o "ANTES" do comercial).
 */
export const Tela: React.FC<{
  children: React.ReactNode;
  zoom?: number;
  foco?: [number, number];
  shake?: readonly [number, number];
  pb?: boolean;
  fundo?: string;
}> = ({ children, zoom = 1, foco = [540, 960], shake = [0, 0], pb = false, fundo = "#000" }) => (
  <AbsoluteFill style={{ background: fundo, filter: pb ? "grayscale(1) contrast(1.25) brightness(1.05) sepia(0.15)" : undefined }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${shake[0]} ${shake[1]}) translate(${foco[0]} ${foco[1]}) scale(${zoom}) translate(${-foco[0]} ${-foco[1]})`}>{children}</g>
    </svg>
  </AbsoluteFill>
);
