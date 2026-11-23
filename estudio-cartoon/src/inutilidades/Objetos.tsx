import React from "react";
import { useCurrentFrame } from "remotion";
import { TINTA } from "./common";

/** Cenários e objetos 2D do INUTILIDADES 0800 (SVG em 1080x1920). */

/** Cozinha da casa do Seu Kuka. `destruida`: buraco na parede, fuligem e entulho. */
export const Cozinha: React.FC<{ destruida?: boolean }> = ({ destruida = false }) => {
  const lin: React.ReactNode[] = [];
  for (let y = 0; y < 1380; y += 90) lin.push(<path key={`h${y}`} d={`M0 ${y} L1080 ${y}`} />);
  for (let x = 0; x < 1080; x += 90) lin.push(<path key={`v${x}`} d={`M${x} 0 L${x} 1380`} />);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={1080} height={1920} fill={destruida ? "#D9BF92" : "#F4D9A8"} />
      <g stroke={destruida ? "#C7AB7C" : "#E5C38E"} strokeWidth={5} fill="none">
        {lin}
      </g>
      {/* janela */}
      {!destruida && (
        <g stroke={TINTA} strokeWidth={8}>
          <rect x={120} y={260} width={300} height={260} fill="#8FD3FF" />
          <path d="M270 260 L270 520 M120 390 L420 390" />
        </g>
      )}
      {destruida && (
        <g>
          <path
            d="M560 420 L700 370 L760 460 L880 400 L1000 480 L1080 460 L1080 1200 L960 1160 L900 1230 L780 1150 L700 1220 L620 1100 L640 980 L560 900 L610 780 L540 660 L600 550 Z"
            fill="#8FD3FF"
            stroke="#2a2a2a"
            strokeWidth={22}
          />
          <g fill="#fff">
            <ellipse cx={820} cy={660} rx={110} ry={50} />
            <ellipse cx={900} cy={630} rx={80} ry={55} />
          </g>
          <g fill="#2a2a2a" opacity={0.35}>
            <ellipse cx={420} cy={700} rx={260} ry={200} />
            <ellipse cx={200} cy={420} rx={160} ry={120} />
          </g>
        </g>
      )}
      <rect y={1380} width={1080} height={540} fill={destruida ? "#B8916A" : "#C9A27A"} />
      <path d="M0 1380 L1080 1380" stroke={TINTA} strokeWidth={10} />
      {destruida && (
        <g fill="#B5523C" stroke={TINTA} strokeWidth={6}>
          <rect x={700} y={1440} width={110} height={56} transform="rotate(-14 755 1468)" />
          <rect x={850} y={1520} width={110} height={56} transform="rotate(20 905 1548)" />
          <rect x={120} y={1470} width={100} height={50} transform="rotate(8 170 1495)" />
          <rect x={300} y={1560} width={90} height={46} transform="rotate(-25 345 1583)" />
        </g>
      )}
    </g>
  );
};

/** Estúdio de televendas: raios girando + palco. */
export const Estudio: React.FC<{ cor?: string; raio?: string }> = ({ cor = "#2E6BE6", raio = "#4A85F5" }) => {
  const f = useCurrentFrame();
  const rot = f * 0.4;
  return (
    <g>
      <rect width={1080} height={1920} fill={cor} />
      <g transform={`translate(540 1050) rotate(${rot})`} fill={raio}>
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const b = a + Math.PI / 18;
          return <path key={i} d={`M0 0 L${2200 * Math.cos(a)} ${2200 * Math.sin(a)} L${2200 * Math.cos(b)} ${2200 * Math.sin(b)} Z`} />;
        })}
      </g>
      <ellipse cx={540} cy={1660} rx={640} ry={200} fill="#6A3FC0" stroke={TINTA} strokeWidth={8} />
      <ellipse cx={540} cy={1640} rx={580} ry={160} fill="#8455E0" />
    </g>
  );
};

/** Mesa de jantar com toalha xadrez, frango assado e suco de canudinho (o almoço do rato). */
export const Mesa: React.FC<{ x: number; y: number; escala?: number; comido?: number }> = ({ x, y, escala = 1, comido = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <rect x={-300} y={0} width={30} height={330} fill="#8B5A2B" />
    <rect x={270} y={0} width={30} height={330} fill="#8B5A2B" />
    <path d="M-340 -20 L340 -20 L360 90 L-360 90 Z" fill="#fff" />
    <g fill="#E8282B" stroke="none" opacity={0.85}>
      {[-300, -180, -60, 60, 180, 300].map((cx) => (
        <rect key={cx} x={cx - 20} y={-18} width={40} height={106} />
      ))}
    </g>
    <path d="M-340 -20 L340 -20 L360 90 L-360 90 Z" fill="none" />
    {/* prato + frango */}
    <ellipse cx={-40} cy={-30} rx={170} ry={36} fill="#fff" />
    {comido < 1 && (
      <g transform={`translate(-40 -60) scale(${1 - comido * 0.5})`}>
        <ellipse cx={0} cy={0} rx={110} ry={70} fill="#C8752E" />
        <ellipse cx={-20} cy={-20} rx={50} ry={22} fill="#E0954A" stroke="none" />
        <path d="M80 10 L140 -30" strokeWidth={30} stroke={TINTA} />
        <path d="M80 10 L140 -30" strokeWidth={16} stroke="#C8752E" />
        <circle cx={146} cy={-34} r={14} fill="#fff" />
        <path d="M-80 10 L-140 -30" strokeWidth={30} stroke={TINTA} />
        <path d="M-80 10 L-140 -30" strokeWidth={16} stroke="#C8752E" />
        <circle cx={-146} cy={-34} r={14} fill="#fff" />
      </g>
    )}
    {comido >= 1 && <path d="M-110 -40 L-20 -50 M-60 -60 L20 -36 M-30 -44 L40 -60" stroke="#eee" strokeWidth={12} />}
    {/* suco */}
    <path d="M190 -130 L270 -130 L258 -20 L202 -20 Z" fill="#FF9F1C" />
    <path d="M240 -130 L270 -200 L300 -200" fill="none" strokeWidth={8} stroke="#E8282B" />
  </g>
);

/** Parede de tijolos sendo derrubada: `quebra` 0..1 solta os tijolos voando. */
export const ParedeTijolos: React.FC<{ quebra: number }> = ({ quebra }) => {
  const tij: React.ReactNode[] = [];
  let k = 0;
  for (let row = 0; row < 14; row++)
    for (let col = -1; col < 7; col++) {
      const x = col * 170 + (row % 2) * 85;
      const y = 300 + row * 80;
      k++;
      const solto = x > 380 && x < 900 && y > 650 && y < 1250;
      const s = solto ? quebra : 0;
      const ang = (k * 47) % 360;
      const dx = Math.cos(ang) * 600 * s;
      const dy = (Math.sin(ang) * 400 - 300) * s + 1200 * s * s;
      tij.push(
        <rect
          key={k}
          x={x + dx}
          y={y + dy}
          width={160}
          height={72}
          fill={k % 3 ? "#C0583F" : "#A84B36"}
          stroke={TINTA}
          strokeWidth={6}
          transform={`rotate(${s * ang} ${x + dx + 80} ${y + dy + 36})`}
          opacity={solto ? 1 - Math.max(0, s - 0.85) * 6 : 1}
        />,
      );
    }
  return (
    <g>
      <rect width={1080} height={1920} fill="#2a2a2a" />
      <rect x={380} y={650} width={520} height={600} fill="#8FD3FF" opacity={quebra > 0.05 ? 1 : 0} />
      {tij}
      <rect y={1380} width={1080} height={540} fill="#C9A27A" stroke={TINTA} strokeWidth={10} />
    </g>
  );
};

/** A Ratoeira Explosiva 3000. */
export const Ratoeira: React.FC<{ x: number; y: number; escala?: number; queijo?: boolean; aceso?: boolean; rot?: number }> = ({
  x,
  y,
  escala = 1,
  queijo = true,
  aceso = false,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const fa = aceso ? 1 + Math.sin(f * 1.7) * 0.25 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      <rect x={-140} y={-60} width={280} height={60} rx={8} fill="#B5753C" />
      <path d="M-100 -60 L-100 -110 L100 -110 L100 -60" fill="none" strokeWidth={14} stroke="#9AA4B5" />
      <path d="M-100 -60 L-100 -110 L100 -110 L100 -60" fill="none" strokeWidth={4} />
      {queijo && <path d="M60 -60 L130 -60 L100 -105 Z" fill="#FFD23F" />}
      <rect x={-75} y={-250} width={44} height={190} rx={14} fill="#E8282B" />
      <rect x={-28} y={-260} width={44} height={200} rx={14} fill="#E8282B" />
      <rect x={19} y={-250} width={44} height={190} rx={14} fill="#E8282B" />
      <rect x={-85} y={-160} width={158} height={26} fill={TINTA} />
      <text x={-6} y={-141} fill="#FFD23F" stroke="none" fontSize={22} textAnchor="middle" fontFamily="'Baloo 2'" fontWeight={800}>
        TNT
      </text>
      <path d="M-6 -260 C -10 -310, 50 -310, 40 -360 S 80 -410, 100 -430" fill="none" strokeWidth={7} />
      {aceso && (
        <g transform={`translate(100 -440) scale(${fa})`}>
          <path d="M0 -40 L12 -18 L36 -24 L20 -4 L40 12 L14 10 L6 34 L-2 10 L-28 14 L-10 -4 L-24 -26 L-2 -18 Z" fill="#FFD23F" stroke="#FF7A00" strokeWidth={5} />
        </g>
      )}
    </g>
  );
};

/** Explosão de desenho: `t` 0..1 (cresce, depois vira fumaça). */
export const Explosao: React.FC<{ x: number; y: number; t: number; escala?: number }> = ({ x, y, t, escala = 1 }) => {
  if (t <= 0 || t >= 1) return null;
  const s = Math.min(1, t * 4);
  const fade = t > 0.5 ? 1 - (t - 0.5) * 2 : 1;
  const estrela = (r: number, n = 14) =>
    Array.from({ length: n * 2 })
      .map((_, i) => {
        const a = (i / (n * 2)) * Math.PI * 2;
        const rr = i % 2 ? r * 0.62 : r;
        return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
      })
      .join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (0.3 + s * 0.9)})`} opacity={fade} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
      <polygon points={estrela(620)} fill="#E8282B" />
      <polygon points={estrela(470)} fill="#FF8C1A" transform="rotate(12)" />
      <polygon points={estrela(320)} fill="#FFD23F" transform="rotate(-8)" />
      <text y={40} textAnchor="middle" fontSize={170} fill="#fff" stroke={TINTA} strokeWidth={14} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        BUM!
      </text>
    </g>
  );
};

/** Fumaça subindo (círculos cinza). */
export const Fumaca: React.FC<{ x: number; y: number; n?: number; escala?: number; cor?: string }> = ({ x, y, n = 5, escala = 1, cor = "#8A8A99" }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill={cor} opacity={0.75}>
      {Array.from({ length: n }).map((_, i) => {
        const q = ((f + i * 11) % 50) / 50;
        return <circle key={i} cx={Math.sin(i * 2.1) * 120 + q * 40} cy={-q * 420} r={50 + q * 70} opacity={1 - q} />;
      })}
    </g>
  );
};

/** Banheiro: azulejos azuis, espelho, pia. */
export const Banheiro: React.FC<{ bagunca?: number }> = ({ bagunca = 0 }) => {
  const lin: React.ReactNode[] = [];
  for (let y = 0; y < 1380; y += 80) lin.push(<path key={`h${y}`} d={`M0 ${y} L1080 ${y}`} />);
  for (let x = 0; x < 1080; x += 80) lin.push(<path key={`v${x}`} d={`M${x} 0 L${x} 1380`} />);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={1080} height={1920} fill="#BFE6F5" />
      <g stroke="#A3D4E8" strokeWidth={5} fill="none">
        {lin}
      </g>
      <g stroke={TINTA} strokeWidth={8}>
        <rect x={700} y={420} width={300} height={380} rx={24} fill="#E8F7FF" />
        <path d="M740 470 L800 530 M760 520 L790 550" stroke="#fff" strokeWidth={14} />
        <path d="M680 1060 L1020 1060 L990 1180 L710 1180 Z" fill="#fff" />
        <rect x={830} y={1000} width={20} height={60} fill="#C9D0DC" />
      </g>
      <rect y={1380} width={1080} height={540} fill="#9CC9DA" />
      <path d="M0 1380 L1080 1380" stroke={TINTA} strokeWidth={10} />
      {bagunca > 0 && (
        <g fill="#fff" stroke={TINTA} strokeWidth={5} opacity={bagunca}>
          {[[150, 500, 60], [420, 300, 40], [880, 640, 50], [600, 900, 34], [300, 1100, 46], [960, 300, 30], [80, 900, 36]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      )}
    </g>
  );
};

/** A Escova de Dentes Turbo V8 (produto em destaque). */
export const EscovaTurbo: React.FC<{ x: number; y: number; escala?: number; ligada?: boolean; rot?: number; cordinha?: number }> = ({ x, y, escala = 1, ligada = false, rot = 0, cordinha = 0 }) => {
  const f = useCurrentFrame();
  const v = ligada ? 6 : 0;
  return (
    <g transform={`translate(${x + Math.sin(f * 4.1) * v} ${y + Math.cos(f * 3.3) * v}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      {/* cabo + cerdas */}
      <rect x={-260} y={-30} width={300} height={44} rx={20} fill="#3DA5FF" />
      <rect x={-290} y={-80} width={110} height={52} fill="#fff" strokeWidth={6} />
      <path d="M-280 -80 L-280 -30 M-260 -80 L-260 -30 M-240 -80 L-240 -30 M-220 -80 L-220 -30 M-200 -80 L-200 -30" stroke="#7FD3FF" strokeWidth={5} />
      {/* motor V8 */}
      <rect x={30} y={-110} width={210} height={160} rx={16} fill="#E8282B" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={45 + i * 48} y={-150} width={36} height={46} rx={4} fill="#C9D0DC" />
      ))}
      <text x={135} y={0} textAnchor="middle" fontSize={64} fill="#FFD23F" stroke={TINTA} strokeWidth={6} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        V8
      </text>
      {/* escapamento */}
      <path d="M240 20 L320 20 L320 -60" fill="none" stroke="#777" strokeWidth={26} />
      <path d="M240 20 L320 20 L320 -60" fill="none" strokeWidth={4} />
      {/* cordinha de partida */}
      <path d={`M240 -40 L${280 + cordinha * 160} ${-40 + cordinha * 60}`} fill="none" strokeWidth={5} />
      <rect x={270 + cordinha * 160} y={-55 + cordinha * 60} width={56} height={26} rx={10} fill="#222" />
      {ligada &&
        [0, 1, 2, 3].map((i) => {
          const q = ((f + i * 5) % 20) / 20;
          return <circle key={i} cx={320 + q * 70} cy={-80 - q * 170} r={22 + q * 34} fill="#666" stroke="none" opacity={(1 - q) * 0.8} />;
        })}
    </g>
  );
};

/** Dentes voando para todo lado (t 0..1) e depois no chão, branquinhos. */
export const DentesVoando: React.FC<{ x: number; y: number; t: number; n?: number }> = ({ x, y, t, n = 14 }) => (
  <g stroke={TINTA} strokeWidth={5}>
    {Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + i;
      const v = 500 + (i % 4) * 180;
      const dx = Math.cos(a) * v * t;
      const dy = Math.sin(a) * v * t - 600 * t + 1500 * t * t;
      return <path key={i} transform={`translate(${x + dx} ${y + dy}) rotate(${t * 900 + i * 40})`} d="M-16 -20 Q0 -28 16 -20 L14 10 L6 22 L0 12 L-6 22 L-14 10 Z" fill="#fff" />;
    })}
  </g>
);

/** Dentes enfileirados no chão, brilhando. */
export const DentesNoChao: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={5}>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} transform={`translate(${(i - 5.5) * 52} ${Math.sin(i * 1.7) * 14}) rotate(${(i * 37) % 40 - 20})`} d="M-16 -20 Q0 -28 16 -20 L14 10 L6 22 L0 12 L-6 22 L-14 10 Z" fill="#fff" />
      ))}
      {[0, 1, 2].map((i) => {
        const k = Math.max(0, Math.sin(f * 0.25 + i * 2));
        return <path key={`b${i}`} transform={`translate(${-200 + i * 190} ${-60 - i * 10}) scale(${k})`} d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill="#fff" stroke="#FFD23F" strokeWidth={4} />;
      })}
    </g>
  );
};

/** Relógio de parede com contador grande (o "2 minutos"). */
export const RelogioParede: React.FC<{ x: number; y: number; texto: string }> = ({ x, y, texto }) => (
  <g transform={`translate(${x} ${y})`} stroke={TINTA} strokeWidth={8}>
    <rect x={-170} y={-70} width={340} height={140} rx={20} fill="#222" />
    <text y={36} textAnchor="middle" fontSize={100} fill="#FF4B3E" stroke="none" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700}>
      {texto}
    </text>
  </g>
);

/** Pedestal de produto (estúdio). */
export const Pedestal: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-170 0 L170 0 L150 260 L-150 260 Z" fill="#fff" />
    <rect x={-180} y={-20} width={360} height={40} rx={10} fill="#FFD23F" />
  </g>
);

/** Linhas de velocidade/vibração (motor ligado). */
export const LinhasVelocidade: React.FC<{ forca?: number }> = ({ forca = 1 }) => {
  const f = useCurrentFrame();
  if (forca <= 0) return null;
  return (
    <g fill="#fff" opacity={0.6 * forca}>
      {Array.from({ length: 16 }).map((_, i) => {
        const y = (i * 131 + f * 55) % 1920;
        const x = (i * 271) % 1080;
        return <rect key={i} x={x} y={y} width={12} height={180} rx={6} />;
      })}
    </g>
  );
};

/** Sala de estar do Seu Kuka: parede listrada, sofá, TV de tubo (com canal trocando) e abajur. */
export const Sala: React.FC<{ canal?: number; tvX?: number; sofa?: boolean }> = ({ canal = 0, tvX = 250, sofa = true }) => {
  const cores = [["#E8282B", "#FFD23F", "#22A447", "#3DA5FF", "#9A62F5"], ["#444", "#888", "#ccc", "#888", "#444"], ["#FF8C1A", "#fff", "#FF8C1A", "#fff", "#FF8C1A"]];
  const c = cores[Math.abs(canal) % cores.length];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={1080} height={1920} fill="#E9D3F2" />
      <g fill="#DDBFE9">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={i * 100} y={0} width={46} height={1380} />
        ))}
      </g>
      <rect y={1380} width={1080} height={540} fill="#B07A50" />
      <path d="M0 1380 L1080 1380" stroke={TINTA} strokeWidth={10} />
      <ellipse cx={560} cy={1640} rx={420} ry={90} fill="#E8282B" opacity={0.6} />
      {/* TV de tubo */}
      <g transform={`translate(${tvX} 1060)`} stroke={TINTA} strokeWidth={8}>
        <rect x={-170} y={-150} width={340} height={280} rx={30} fill="#6B4A2E" />
        <rect x={-140} y={-122} width={230} height={210} rx={20} fill="#222" />
        {c.map((cor, i) => (
          <rect key={i} x={-134 + i * 44} y={-116} width={44} height={198} fill={cor} stroke="none" />
        ))}
        <circle cx={130} cy={-60} r={16} fill="#C9D0DC" />
        <circle cx={130} cy={0} r={16} fill="#C9D0DC" />
        <path d="M-60 -150 L-110 -250 M40 -150 L90 -250" fill="none" strokeWidth={6} />
        <rect x={-120} y={130} width={240} height={250} fill="#8B5A2B" />
      </g>
      {sofa && (
        <g transform="translate(760 1420)" stroke={TINTA} strokeWidth={8}>
          <rect x={-260} y={-260} width={520} height={190} rx={40} fill="#3D8F6B" />
          <rect x={-300} y={-110} width={600} height={130} rx={30} fill="#4FAF80" />
          <rect x={-320} y={-200} width={90} height={230} rx={30} fill="#3D8F6B" />
          <rect x={230} y={-200} width={90} height={230} rx={30} fill="#3D8F6B" />
        </g>
      )}
    </g>
  );
};

/** O Controle Remoto Universal de Verdade (botões: ▶ ‖ ◀◀ ▶▶ ⏏). `aperta`: qual botão brilha. */
export const ControleRemoto: React.FC<{ x: number; y: number; escala?: number; rot?: number; aperta?: "pause" | "ejetar" | "play" | null }> = ({ x, y, escala = 1, rot = 0, aperta = null }) => {
  const f = useCurrentFrame();
  const bot = (id: string, cx: number, cy: number, simb: string, cor: string) => {
    const on = aperta === id && Math.floor(f / 4) % 2 === 0;
    return (
      <g key={id}>
        <circle cx={cx} cy={cy} r={34} fill={on ? "#FFF59A" : cor} />
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize={36} fill={TINTA} stroke="none" fontFamily="'DejaVu Sans', sans-serif" fontWeight={700}>
          {simb}
        </text>
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
      <rect x={-90} y={-260} width={180} height={520} rx={60} fill="#2B2B33" />
      <rect x={-50} y={-300} width={100} height={50} rx={14} fill="#E8282B" />
      <circle cx={0} cy={-200} r={18} fill="#E8282B" />
      {bot("play", 0, -110, "▶", "#22A447")}
      {bot("pause", -45, -20, "‖", "#FFD23F")}
      {bot("rew", 45, -20, "◀◀", "#3DA5FF")}
      {bot("ff", -45, 70, "▶▶", "#3DA5FF")}
      {bot("ejetar", 45, 70, "⏏", "#FF8C1A")}
      <text x={0} y={200} textAnchor="middle" fontSize={34} fill="#FFD23F" stroke="none" fontFamily="'Baloo 2'" fontWeight={800}>
        UNIVERSAL
      </text>
    </g>
  );
};

/** Confete caindo (para mostrar o mundo congelado no PAUSE). */
export const Confete: React.FC<{ n?: number }> = ({ n = 40 }) => {
  const f = useCurrentFrame();
  const cores = ["#FFD23F", "#E8282B", "#22A447", "#3DA5FF", "#fff", "#FF8C1A"];
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = (i * 197) % 1080;
        const y = ((i * 263 + f * (9 + (i % 5) * 2)) % 2000) - 80;
        return <rect key={i} x={x + Math.sin(f * 0.2 + i) * 30} y={y} width={22} height={36} fill={cores[i % cores.length]} transform={`rotate(${f * 6 + i * 40} ${x} ${y})`} />;
      })}
    </g>
  );
};

/** Rua num dia cinzento: prédios, calçada e meio-fio. */
export const Rua: React.FC<{ chuva?: boolean }> = ({ chuva = true }) => (
  <g strokeLinejoin="round">
    <rect width={1080} height={1920} fill={chuva ? "#8FA3B5" : "#9ED8FF"} />
    <g stroke={TINTA} strokeWidth={8}>
      {[
        [-20, 360, 300, "#C9A27A"],
        [260, 520, 260, "#E0B07A"],
        [500, 300, 280, "#B88A6A"],
        [760, 460, 340, "#D9BF92"],
      ].map(([x, y, w, cor], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height={1400 - (y as number)} fill={cor as string} />
          {Array.from({ length: 6 }).map((_, r) =>
            [0, 1].map((c) => <rect key={`${r}-${c}`} x={(x as number) + 40 + c * ((w as number) / 2)} y={(y as number) + 50 + r * 150} width={70} height={90} fill="#FFF3B0" strokeWidth={5} />),
          )}
        </g>
      ))}
    </g>
    <rect y={1400} width={1080} height={120} fill="#B0B8C0" stroke={TINTA} strokeWidth={8} />
    <rect y={1520} width={1080} height={400} fill="#5A6470" stroke={TINTA} strokeWidth={8} />
    <path d="M60 1720 L260 1720 M420 1720 L620 1720 M780 1720 L980 1720" stroke="#E8E8E8" strokeWidth={18} />
  </g>
);

/** Chuva: traços caindo na tela toda (ou numa faixa). */
export const Chuva: React.FC<{ intensidade?: number; x0?: number; x1?: number; y1?: number }> = ({ intensidade = 1, x0 = 0, x1 = 1080, y1 = 1920 }) => {
  const f = useCurrentFrame();
  const n = Math.round(70 * intensidade);
  return (
    <g stroke="#CFEFFF" strokeWidth={7} strokeLinecap="round" opacity={0.85}>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + ((i * 137) % Math.max(1, x1 - x0));
        const y = (i * 251 + f * 42) % y1;
        return <path key={i} d={`M${x} ${y} l-12 50`} />;
      })}
    </g>
  );
};

/**
 * Guarda-chuva. Origem = ponta de baixo do cabo (onde a mão segura). `peneira`: a cobertura é cheia de furos
 * e, com `jorra`, a água passa direto pelos furinhos em filetes.
 */
export const GuardaChuva: React.FC<{ x: number; y: number; escala?: number; rot?: number; peneira?: boolean; jorra?: number; cor?: string }> = ({
  x,
  y,
  escala = 1,
  rot = 0,
  peneira = false,
  jorra = 0,
  cor = "#E8282B",
}) => {
  const f = useCurrentFrame();
  const furos: [number, number][] = [];
  if (peneira) for (let r = 0; r < 3; r++) for (let c = -4 + r; c <= 4 - r; c++) furos.push([c * 52, -470 + r * 46 - Math.abs(c) * 6]);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      {/* filetes de água passando pelos furos */}
      {peneira && jorra > 0 && (
        <g stroke="#7FD3FF" strokeWidth={10} opacity={jorra}>
          {furos.map(([fx, fy], i) => {
            const q = ((f * 2 + i * 7) % 20) / 20;
            return <path key={`j${i}`} d={`M${fx} ${fy + 20} L${fx - 6} ${fy + 120 + q * 60}`} />;
          })}
        </g>
      )}
      <path d="M0 0 L0 -560" fill="none" strokeWidth={14} />
      <path d="M0 0 q -40 0 -40 -40" fill="none" strokeWidth={16} />
      <path d="M-300 -470 Q 0 -760 300 -470 Q 250 -500 200 -470 Q 150 -500 100 -470 Q 50 -500 0 -470 Q -50 -500 -100 -470 Q -150 -500 -200 -470 Q -250 -500 -300 -470 Z" fill={cor} />
      {peneira && (
        <g fill="#BFE6F5" strokeWidth={4}>
          {furos.map(([fx, fy], i) => (
            <circle key={i} cx={fx} cy={fy - 60} r={13} />
          ))}
        </g>
      )}
      <circle cx={0} cy={-680} r={14} fill={TINTA} />
    </g>
  );
};

/** Poça d'água no chão. */
export const Poca: React.FC<{ x: number; y: number; tam?: number }> = ({ x, y, tam = 1 }) => (
  <ellipse cx={x} cy={y} rx={220 * tam} ry={40 * tam} fill="#7FD3FF" stroke={TINTA} strokeWidth={6} opacity={0.9} />
);

/** Balde (brinde). */
export const Balde: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-90 -170 L90 -170 L70 0 L-70 0 Z" fill="#3DA5FF" />
    <path d="M-90 -170 Q 0 -280 90 -170" fill="none" strokeWidth={8} />
    <ellipse cx={0} cy={-170} rx={90} ry={18} fill="#2B7FCC" />
  </g>
);

/** O Tapete Escorregador Turbo: tapete vermelho com faixas de corrida e um propulsor a jato. `jato` 0..1 = fogo. */
export const TapeteTurbo: React.FC<{ x: number; y: number; escala?: number; jato?: number; rot?: number }> = ({ x, y, escala = 1, jato = 0, rot = 0 }) => {
  const f = useCurrentFrame();
  const fl = jato * (1 + Math.sin(f * 2.1) * 0.2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
      {jato > 0 && (
        <g>
          <path d={`M-300 -40 L${-300 - 260 * fl} -10 L-300 20 Z`} fill="#FF8C1A" />
          <path d={`M-300 -25 L${-300 - 160 * fl} -10 L-300 5 Z`} fill="#FFD23F" strokeWidth={4} />
        </g>
      )}
      <rect x={-300} y={-60} width={40} height={100} rx={8} fill="#777" />
      <path d="M-260 -50 L280 -50 L320 30 L-260 30 Z" fill="#E8282B" />
      <path d="M-200 -50 L-140 30 M-90 -50 L-30 30 M20 -50 L80 30" stroke="#FFD23F" strokeWidth={18} />
      <path d="M-260 -50 L280 -50 L320 30 L-260 30 Z" fill="none" />
      <text x={160} y={8} textAnchor="middle" fontSize={44} fill="#fff" stroke={TINTA} strokeWidth={6} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        TURBO
      </text>
      {[-230, 290].map((fx) => (
        <path key={fx} d={`M${fx} 30 l-10 22 M${fx + 15} 30 l0 22 M${fx + 30} 30 l10 22`} strokeWidth={5} />
      ))}
    </g>
  );
};

/** Parede com um buraco do FORMATO DO KUKA (cabeça black power + corpo redondo), com o céu do outro lado. */
export const ParedeBuraco: React.FC<{ x: number; y: number; escala?: number; cor?: string }> = ({ x, y, escala = 1, cor = "#F4D9A8" }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <mask id={`buraco-${x}-${y}`}>
      <rect x={-600} y={-1300} width={1200} height={1400} fill="#fff" stroke="none" />
      <g fill="#000" stroke="none">
        <circle cx={0} cy={-760} r={200} />
        <ellipse cx={0} cy={-420} rx={200} ry={185} />
        <rect x={-110} y={-280} width={220} height={280} />
        <rect x={-260} y={-560} width={520} height={90} rx={40} />
      </g>
    </mask>
    <rect x={-600} y={-1300} width={1200} height={1400} fill="#8FD3FF" stroke="none" />
    <ellipse cx={150} cy={-900} rx={140} ry={50} fill="#fff" stroke="none" />
    <rect x={-600} y={-1300} width={1200} height={1400} fill={cor} mask={`url(#buraco-${x}-${y})`} />
    <g fill="none" strokeWidth={6}>
      <circle cx={0} cy={-760} r={200} />
      <path d="M-200 -420 a200 185 0 0 0 400 0" />
      <path d="M-120 -870 l-60 -80 M140 -800 l80 -40 M-210 -420 l-80 30 M120 -260 l60 60" />
    </g>
    <g fill="#ddd" strokeWidth={4}>
      {[[-260, -60], [240, -30], [-120, 20], [180, 40]].map(([px, py], i) => (
        <rect key={i} x={px} y={py} width={50} height={30} transform={`rotate(${i * 30} ${px} ${py})`} />
      ))}
    </g>
  </g>
);

/** Capacete de obra (brinde). */
export const Capacete: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-120 0 Q -120 -150 0 -150 Q 120 -150 120 0 Z" fill="#FFC21A" />
    <rect x={-160} y={-10} width={320} height={30} rx={12} fill="#FFC21A" />
    <rect x={-14} y={-150} width={28} height={140} fill="#E5A800" strokeWidth={5} />
  </g>
);

/** Prato com UMA folha de alface (a salada sem graça). */
export const PratoAlface: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
    <ellipse cx={0} cy={0} rx={190} ry={44} fill="#fff" />
    <path d="M-50 -10 Q -60 -60 0 -50 Q 60 -70 50 -10 Q 0 6 -50 -10 Z" fill="#7CCB5C" />
    <path d="M0 -50 L0 -8" stroke="#4E9A3A" strokeWidth={5} />
  </g>
);

/** Halter (peso de academia). Centro em (x,y). */
export const Halter: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
    <rect x={-200} y={-10} width={400} height={20} fill="#9AA4B5" />
    <rect x={-220} y={-60} width={50} height={120} rx={10} fill="#333" />
    <rect x={170} y={-60} width={50} height={120} rx={10} fill="#333" />
  </g>
);

/** Cápsula da Pílula Pena (rosa e branca, com uma peninha). */
export const Capsula: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
    <path d="M0 -40 L-60 -40 A40 40 0 0 0 -60 40 L0 40 Z" fill="#FF7AB6" />
    <path d="M0 -40 L60 -40 A40 40 0 0 1 60 40 L0 40 Z" fill="#fff" />
    <path d="M-20 -30 Q 40 -20 50 10" fill="none" stroke="#fff" strokeWidth={6} opacity={0.6} />
  </g>
);

/** Frasco da Pílula Pena com uma pena no rótulo. */
export const FrascoPilula: React.FC<{ x: number; y: number; escala?: number; rot?: number; cor?: string; rotulo?: string }> = ({ x, y, escala = 1, rot = 0, cor = "#FF7AB6", rotulo = "PENA" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <rect x={-110} y={-330} width={220} height={330} rx={30} fill={cor} />
    <rect x={-90} y={-380} width={180} height={60} rx={14} fill="#fff" />
    <rect x={-90} y={-250} width={180} height={150} rx={14} fill="#fff" />
    <path d="M-50 -120 Q 0 -260 60 -230 Q 20 -200 -50 -120 Z" fill="#BFE6F5" strokeWidth={5} />
    <path d="M-50 -120 L40 -215" fill="none" strokeWidth={4} />
    <text x={0} y={-50} textAnchor="middle" fontSize={44} fill="#fff" stroke={TINTA} strokeWidth={6} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
      {rotulo}
    </text>
  </g>
);

/** Tijolo (brinde: pra voltar pro chão). */
export const Tijolo: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <rect x={-150} y={-70} width={300} height={140} rx={8} fill="#C0583F" />
    <circle cx={-70} cy={0} r={22} fill="#8E3E2C" />
    <circle cx={0} cy={0} r={22} fill="#8E3E2C" />
    <circle cx={70} cy={0} r={22} fill="#8E3E2C" />
  </g>
);

/** Céu aberto: nuvens passando para baixo (dá sensação de subir), pássaros e um aviãozinho. */
export const CeuAberto: React.FC<{ subindo?: number }> = ({ subindo = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g strokeLinejoin="round">
      <rect width={1080} height={1920} fill="#6EC6FF" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = ((i * 430 + f * 14 * subindo) % 2300) - 200;
        const x = (i * 337) % 900;
        return (
          <g key={i} transform={`translate(${x} ${y})`} fill="#fff" stroke={TINTA} strokeWidth={6}>
            <path d="M0 60 Q -20 0 40 10 Q 60 -40 120 -10 Q 170 -40 200 20 Q 250 30 230 60 Z" />
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const x = ((i * 380 - f * 9) % 1300 + 1300) % 1300 - 100;
        const y = 300 + i * 260 + Math.sin(f * 0.2 + i) * 20;
        const a = Math.sin(f * 0.6 + i) * 18;
        return <path key={`p${i}`} d={`M${x - 40} ${y - a} Q ${x - 20} ${y - 20} ${x} ${y} Q ${x + 20} ${y - 20} ${x + 40} ${y - a}`} fill="none" stroke={TINTA} strokeWidth={8} />;
      })}
      <g transform={`translate(${((f * 12) % 1600) - 300} 1500)`} stroke={TINTA} strokeWidth={6} fill="#fff">
        <path d="M0 0 L220 -10 Q 260 0 220 10 L0 10 Z" />
        <path d="M80 0 L40 -70 L110 -70 L140 0 Z" fill="#E8282B" />
        <path d="M10 0 L-20 -40 L20 -40 L40 0 Z" fill="#E8282B" />
      </g>
    </g>
  );
};

/** Contagem regressiva grande (5, 4, 3, 2, 1). */
export const Contagem: React.FC<{ n: number }> = ({ n }) =>
  n <= 0 ? null : (
    <text x={540} y={1100} textAnchor="middle" fontSize={460} fill="#FFD23F" stroke={TINTA} strokeWidth={22} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800} opacity={0.9}>
      {n}
    </text>
  );

/** Calendário da dieta: "SEGUNDA 8h: DIETA ✓" e, quando `desiste`, "SEGUNDA 15h: DESISTIU ✗". */
export const CalendarioDieta: React.FC<{ x: number; y: number; escala?: number; desiste?: boolean }> = ({ x, y, escala = 1, desiste = false }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <rect x={-260} y={-200} width={520} height={400} rx={20} fill="#fff" />
    <rect x={-260} y={-200} width={520} height={100} rx={20} fill="#E8282B" />
    <text x={0} y={-128} textAnchor="middle" fontSize={64} fill="#fff" stroke="none" fontFamily="'Baloo 2'" fontWeight={800}>SEGUNDA</text>
    <text x={-220} y={0} fontSize={52} fill={TINTA} stroke="none" fontFamily="'Baloo 2'" fontWeight={800}>8h  DIETA ✓</text>
    {desiste && (
      <text x={-220} y={120} fontSize={52} fill="#E8282B" stroke="none" fontFamily="'Baloo 2'" fontWeight={800}>15h DESISTIU ✗</text>
    )}
  </g>
);

/** Fatia de bolo de chocolate. */
export const Bolo: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
    <path d="M-90 40 L90 40 L90 -40 L-90 -10 Z" fill="#6D3B1F" />
    <path d="M-90 -10 L90 -40 L90 -60 L-90 -28 Z" fill="#FFF3E0" />
    <circle cx={60} cy={-74} r={18} fill="#E8282B" />
  </g>
);

/** Lustre pendurado no teto (a Dona Cleide se agarra nele). */
export const Lustre: React.FC<{ x: number; y?: number; balanca?: number }> = ({ x, y = 0, balanca = 0 }) => {
  const f = useCurrentFrame();
  const r = Math.sin(f * 0.3) * 8 * balanca;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
      <path d="M0 0 L0 220" strokeWidth={8} />
      <path d="M-160 260 Q 0 200 160 260 L120 300 L-120 300 Z" fill="#FFD23F" />
      {[-110, -40, 40, 110].map((cx) => (
        <g key={cx}>
          <rect x={cx - 8} y={300} width={16} height={40} fill="#fff" />
          <path d={`M${cx} 300 q -10 -26 0 -40 q 10 14 0 40`} fill="#FF8C1A" strokeWidth={4} />
        </g>
      ))}
    </g>
  );
};

/** Rajadas de vento (traços curvos atravessando a tela da esquerda pra direita). */
export const Vento: React.FC<{ forca?: number }> = ({ forca = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.75 * forca}>
      {Array.from({ length: 9 }).map((_, i) => {
        const x = ((i * 233 + f * 48) % 1500) - 300;
        const y = 300 + i * 160;
        return <path key={i} d={`M${x} ${y} q 120 -30 240 0 q 60 15 90 -10`} />;
      })}
    </g>
  );
};

/** Chapéu de aba (o da Dona Cleide). */
export const Chapeu: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
    <ellipse cx={0} cy={0} rx={150} ry={30} fill="#E8282B" />
    <path d="M-80 0 Q -80 -110 0 -110 Q 80 -110 80 0 Z" fill="#E8282B" />
    <path d="M-80 -20 L80 -20" stroke="#FFD23F" strokeWidth={16} />
  </g>
);

/**
 * Prédio em corte: apartamento de CIMA (y 0..900) e de BAIXO (y 980..1920), separados pela laje (900..980).
 * `racha` 0..1 desenha rachaduras; `buraco` abre um rombo na laje (x 380..700).
 */
export const PredioCorte: React.FC<{ racha?: number; buraco?: boolean }> = ({ racha = 0, buraco = false }) => (
  <g strokeLinejoin="round">
    <rect y={0} width={1080} height={900} fill="#E9D3F2" />
    <g fill="#DDBFE9">
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={i * 100} y={0} width={46} height={900} />
      ))}
    </g>
    <rect y={980} width={1080} height={940} fill="#F4D9A8" />
    <g stroke="#E5C38E" strokeWidth={5}>
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M0 ${1000 + i * 90} L1080 ${1000 + i * 90}`} />
      ))}
    </g>
    <rect y={1800} width={1080} height={120} fill="#C9A27A" stroke={TINTA} strokeWidth={8} />
    {/* laje */}
    {buraco ? (
      <g>
        <path d="M-10 900 L380 900 L400 930 L370 960 L390 980 L-10 980 Z" fill="#9E9E9E" stroke={TINTA} strokeWidth={8} />
        <path d="M1090 900 L700 900 L680 935 L710 955 L690 980 L1090 980 Z" fill="#9E9E9E" stroke={TINTA} strokeWidth={8} />
      </g>
    ) : (
      <rect x={-10} y={900} width={1100} height={80} fill="#9E9E9E" stroke={TINTA} strokeWidth={8} />
    )}
    {racha > 0 && !buraco && (
      <path d="M540 900 l -30 30 l 40 20 l -20 30 M540 900 l 50 25 l -30 30" fill="none" stroke={TINTA} strokeWidth={8} opacity={racha} />
    )}
    {buraco && (
      <g fill="#9E9E9E" stroke={TINTA} strokeWidth={6}>
        {[[420, 1760, 20], [600, 1770, -15], [500, 1785, 40], [680, 1740, 10]].map(([cx, cy, r], i) => (
          <rect key={i} x={cx} y={cy} width={70} height={40} transform={`rotate(${r} ${cx + 35} ${cy + 20})`} />
        ))}
      </g>
    )}
  </g>
);

/** Secador de cabelo comum (fraquinho), bico pra direita. Origem no cabo. */
export const SecadorComum: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
      <rect x={-30} y={-10} width={60} height={160} rx={20} fill="#FF7AB6" />
      <rect x={-90} y={-110} width={220} height={110} rx={50} fill="#FF7AB6" />
      <rect x={130} y={-90} width={60} height={70} rx={10} fill="#E05A9A" />
      <g fill="none" stroke="#fff" strokeWidth={6} opacity={0.6}>
        <path d={`M200 ${-70 + Math.sin(f * 0.4) * 4} q 20 6 40 0`} />
        <path d={`M200 ${-40 + Math.sin(f * 0.4 + 1) * 4} q 20 6 40 0`} />
      </g>
    </g>
  );
};

/** O SECADOR A JATO: corpo de secador com uma turbina de avião e fogo saindo. `ligado` 0..1. */
export const SecadorJato: React.FC<{ x: number; y: number; escala?: number; rot?: number; ligado?: number }> = ({ x, y, escala = 1, rot = 0, ligado = 0 }) => {
  const f = useCurrentFrame();
  const fl = ligado * (1 + Math.sin(f * 2.3) * 0.2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
      {ligado > 0 && (
        <g>
          <path d={`M230 -110 L${230 + 380 * fl} -60 L230 -10 Z`} fill="#FF8C1A" />
          <path d={`M230 -90 L${230 + 240 * fl} -60 L230 -30 Z`} fill="#FFD23F" strokeWidth={4} />
        </g>
      )}
      <rect x={-30} y={0} width={70} height={180} rx={20} fill="#9AA4B5" />
      <path d="M-160 -150 L180 -150 L240 -110 L240 -10 L180 30 L-160 30 Z" fill="#C9D0DC" />
      <ellipse cx={-160} cy={-60} rx={40} ry={90} fill="#555" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M-160 -60 L${-160 + Math.cos(f * 0.9 * ligado + i) * 30} ${-60 + Math.sin(f * 0.9 * ligado + i) * 80}`} strokeWidth={6} />
      ))}
      <path d="M-100 -150 L-60 -200 L60 -200 L100 -150" fill="#E8282B" />
      <text x={30} y={-45} textAnchor="middle" fontSize={56} fill="#E8282B" stroke={TINTA} strokeWidth={4} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        JATO
      </text>
    </g>
  );
};

/** Black power do Seu Kuka voando sozinho pelo céu, como algodão-doce. */
export const BlackPowerVoando: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${f * 4}) scale(${escala})`} fill="#3A2414" stroke={TINTA} strokeWidth={8}>
      {[[-100, -40, 70], [-30, -90, 80], [60, -80, 76], [110, -10, 64], [40, 50, 70], [-60, 40, 66], [0, -10, 70]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
};

/** Capacete de piloto (couro + óculos de aviador). */
export const CapacetePiloto: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-150 40 Q -160 -170 0 -170 Q 160 -170 150 40 L110 60 L110 -10 L-110 -10 L-110 60 Z" fill="#8D5524" />
    <rect x={-150} y={-90} width={300} height={36} rx={14} fill="#5D3A1A" />
    <circle cx={-60} cy={-72} r={44} fill="#BFE6FF" />
    <circle cx={60} cy={-72} r={44} fill="#BFE6FF" />
  </g>
);

/* ------------------------------------------------------------------ Ep. 7 — Despertador com Soco */

/** Quarto do Seu Kuka: parede azul de bolinhas, janela (de noite/dia) e piso de madeira. `janelaQuebrada` = buraco em forma de Kuka. */
export const Quarto: React.FC<{ noite?: boolean; janelaQuebrada?: boolean }> = ({ noite = false, janelaQuebrada = false }) => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={1080} height={1920} fill="#BFD8F2" />
    <g fill="#A9C8EA">
      {Array.from({ length: 70 }).map((_, i) => (
        <circle key={i} cx={(i % 10) * 120 + ((Math.floor(i / 10) % 2) * 60)} cy={Math.floor(i / 10) * 190 + 60} r={16} />
      ))}
    </g>
    <rect y={1460} width={1080} height={460} fill="#B07A50" />
    <g stroke="#8A5A36" strokeWidth={6}>
      {[1560, 1680, 1800].map((y) => (
        <path key={y} d={`M0 ${y} L1080 ${y}`} />
      ))}
    </g>
    <path d="M0 1460 L1080 1460" stroke={TINTA} strokeWidth={10} />
    {/* janela */}
    <g transform="translate(800 520)" stroke={TINTA} strokeWidth={10}>
      <rect x={-200} y={-230} width={400} height={460} rx={14} fill={noite ? "#1D2A5C" : "#9ED8FF"} />
      {noite ? (
        <g stroke="none">
          <circle cx={-80} cy={-120} r={46} fill="#FFF3B0" />
          <circle cx={-60} cy={-135} r={40} fill="#1D2A5C" />
          {[[60, -150], [120, -60], [-120, 60], [90, 120]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={6} fill="#fff" />
          ))}
        </g>
      ) : (
        <circle cx={110} cy={-130} r={54} fill="#FFD23F" stroke="none" />
      )}
      {janelaQuebrada ? (
        <g>
          <path d="M-110 -140 Q -40 -230 30 -150 L 90 -170 L 120 -60 Q 160 40 80 90 L 60 200 L -70 200 L -90 90 Q -170 0 -110 -140 Z" fill={noite ? "#0E1640" : "#7FC6F5"} strokeWidth={6} />
          <path d="M-200 -230 L-110 -140 M200 -230 L90 -170 M200 230 L60 200 M-200 230 L-70 200" strokeWidth={6} />
        </g>
      ) : (
        <path d="M0 -230 L0 230 M-200 0 L200 0" />
      )}
      <rect x={-230} y={230} width={460} height={34} rx={10} fill="#fff" />
    </g>
  </g>
);

/** Cabeceira da cama (vai ATRÁS do personagem). */
export const CamaCabeceira: React.FC<{ x?: number; y?: number }> = ({ x = 420, y = 1180 }) => (
  <g transform={`translate(${x} ${y})`} stroke={TINTA} strokeWidth={10} strokeLinejoin="round">
    <path d="M-330 300 L-330 -120 Q -330 -220 -230 -220 L230 -220 Q 330 -220 330 -120 L330 300 Z" fill="#8B5A2B" />
    <path d="M-260 300 L-260 -100 Q -260 -150 -210 -150 L210 -150 Q 260 -150 260 -100 L260 300" fill="#A8703A" strokeWidth={6} />
    <ellipse cx={0} cy={60} rx={220} ry={90} fill="#fff" />
  </g>
);

/** Cobertor + pé da cama (vai NA FRENTE do personagem, cobrindo do peito pra baixo). */
export const CamaFrente: React.FC<{ x?: number; y?: number }> = ({ x = 420, y = 1180 }) => (
  <g transform={`translate(${x} ${y})`} stroke={TINTA} strokeWidth={10} strokeLinejoin="round">
    <path d="M-370 170 Q -300 120 -200 150 Q 0 110 200 150 Q 300 120 370 170 L380 470 L-380 470 Z" fill="#E8282B" />
    <g fill="#FFD23F" stroke="none">
      {[[-250, 260], [-80, 320], [90, 250], [250, 330], [-180, 410], [160, 420]].map(([cx, cy], i) => (
        <path key={i} d={`M${cx} ${cy - 26} l 8 18 20 2 -15 13 5 20 -18 -11 -18 11 5 -20 -15 -13 20 -2 Z`} />
      ))}
    </g>
    <rect x={-390} y={460} width={780} height={70} rx={14} fill="#8B5A2B" />
    <rect x={-380} y={520} width={40} height={60} fill="#6B4320" />
    <rect x={340} y={520} width={40} height={60} fill="#6B4320" />
  </g>
);

/** Criado-mudo (mesinha de cabeceira). */
export const CriadoMudo: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <rect x={-130} y={0} width={260} height={300} rx={12} fill="#A8703A" />
    <rect x={-110} y={30} width={220} height={110} rx={8} fill="#C08A50" />
    <circle cx={0} cy={85} r={12} fill="#FFD23F" />
    <rect x={-145} y={-16} width={290} height={30} rx={8} fill="#8B5A2B" />
  </g>
);

/**
 * O DESPERTADOR COM SOCO: relógio vermelho de dois sinos com uma luva de boxe numa mola sanfonada.
 * `tocando` faz tremer e soltar ondas; `soco` 0..1 estica a mola (para a direita; use `flip` p/ esquerda);
 * `duplo` = duas luvas (modo soneca); `texto` = hora no visor.
 */
export const Despertador: React.FC<{ x: number; y: number; escala?: number; tocando?: boolean; soco?: number; duplo?: boolean; flip?: boolean; texto?: string; rot?: number }> = ({
  x,
  y,
  escala = 1,
  tocando = false,
  soco = 0,
  duplo = false,
  flip = false,
  texto = "6:00",
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const tr = tocando ? Math.sin(f * 2.1) * 7 : 0;
  const alc = 40 + soco * 520;
  const luva = (dy: number, k: number) => {
    const n = 7;
    let d = `M0 ${dy}`;
    for (let i = 1; i <= n; i++) d += ` L${(alc * i) / n} ${dy + (i % 2 ? -26 : 26)}`;
    return (
      <g key={k}>
        <path d={d} fill="none" stroke="#9AA3AE" strokeWidth={12} />
        <g transform={`translate(${alc} ${dy})`}>
          <path d="M-20 -60 Q 90 -95 110 -10 Q 120 70 30 75 Q -30 78 -30 40 Z" fill="#E8282B" />
          <path d="M20 -70 Q 70 -110 95 -50" fill="#E8282B" />
          <path d="M-36 -40 L-36 60 L-10 60 L-10 -50 Z" fill="#fff" />
          <path d="M40 -30 Q 70 -10 60 30" fill="none" stroke="#fff" strokeWidth={8} opacity={0.6} />
        </g>
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * escala} ${escala}) rotate(${rot + tr})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      {/* luva(s) saem da lateral */}
      <g transform="translate(150 -40)">{duplo ? [luva(-80, 0), luva(70, 1)] : luva(0, 0)}</g>
      {/* sinos */}
      <g transform={`rotate(${tocando ? Math.sin(f * 3) * 12 : 0} -110 -170)`}>
        <path d="M-180 -150 Q -180 -250 -90 -250 Q -60 -200 -90 -150 Z" fill="#C9D0DC" />
      </g>
      <g transform={`rotate(${tocando ? -Math.sin(f * 3) * 12 : 0} 110 -170)`}>
        <path d="M180 -150 Q 180 -250 90 -250 Q 60 -200 90 -150 Z" fill="#C9D0DC" />
      </g>
      <path d="M0 -175 L0 -230" strokeWidth={14} />
      <circle cx={0} cy={-238} r={18} fill="#C9D0DC" />
      {/* pés */}
      <path d="M-110 140 L-150 200 M110 140 L150 200" strokeWidth={18} />
      {/* corpo */}
      <circle r={175} fill="#E8282B" />
      <circle r={140} fill="#FFF8E7" />
      <text y={36} textAnchor="middle" fontSize={92} fill={TINTA} stroke="none" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} transform={flip ? "scale(-1 1)" : undefined}>
        {texto}
      </text>
      <path d="M-60 -70 L-30 -50 M60 -70 L30 -50" strokeWidth={10} />
      {tocando && (
        <g fill="none" stroke="#FFD23F" strokeWidth={12} opacity={0.9}>
          {[0, 1].map((i) => {
            const q = ((f * 1.5 + i * 15) % 30) / 30;
            const r = 210 + q * 120;
            return <path key={i} d={`M${-r * 0.7} ${-r * 0.7} A ${r} ${r} 0 0 0 ${-r * 0.7} ${r * 0.7} M${r * 0.7} ${-r * 0.7} A ${r} ${r} 0 0 1 ${r * 0.7} ${r * 0.7}`} opacity={1 - q} />;
          })}
        </g>
      )}
    </g>
  );
};

/** "Z z z" subindo (alguém dormindo). */
export const Zzz: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  return (
    <g fontFamily="'Baloo 2'" fontWeight={800} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke">
      {[0, 1, 2].map((i) => {
        const q = ((f + i * 20) % 60) / 60;
        return (
          <text key={i} x={x + q * 80 + i * 10} y={y - q * 200} fontSize={60 + q * 50} opacity={q < 0.8 ? 1 : (1 - q) * 5}>
            Z
          </text>
        );
      })}
    </g>
  );
};

/** Travesseiro de capacete (brinde): travesseiro branco com casco amarelo de obra por cima. */
export const TravesseiroCapacete: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-190 -60 Q -200 -110 -140 -100 Q 0 -130 140 -100 Q 200 -110 190 -60 Q 210 0 190 60 Q 200 110 140 100 Q 0 130 -140 100 Q -200 110 -190 60 Q -210 0 -190 -60 Z" fill="#fff" />
    <path d="M-120 -40 Q -120 -190 0 -190 Q 120 -190 120 -40 Z" fill="#FFC21A" />
    <rect x={-160} y={-50} width={320} height={30} rx={12} fill="#FFC21A" />
    <rect x={-14} y={-190} width={28} height={140} fill="#E5A800" strokeWidth={5} />
  </g>
);

/* ------------------------------------------------------------------ Ep. 8 — Liquidificador Sem Tampa Pro Max */

/** Morango cartoon. */
export const Morango: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala}) rotate(${rot})`} stroke={TINTA} strokeWidth={6} strokeLinejoin="round">
    <path d="M0 60 Q -60 20 -50 -20 Q -30 -50 0 -40 Q 30 -50 50 -20 Q 60 20 0 60 Z" fill="#E8282B" />
    <path d="M-30 -40 L-10 -60 L0 -45 L10 -60 L30 -40 Z" fill="#22A447" />
    <g fill="#FFD23F" stroke="none">
      {[[-20, -10], [10, -15], [-5, 15], [22, 10], [-25, 20], [5, 38]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={4} ry={6} />
      ))}
    </g>
  </g>
);

/** Liquidificador velho e fraco: o morango só gira, inteiro. */
export const LiquidificadorVelho: React.FC<{ x: number; y: number; escala?: number; ligado?: boolean }> = ({ x, y, escala = 1, ligado = false }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
      <path d="M-110 -420 L110 -420 L80 -120 L-80 -120 Z" fill="#DDF3FF" opacity={0.9} />
      <Morango x={ligado ? Math.sin(f * 0.3) * 25 : 0} y={-200} escala={0.9} rot={ligado ? f * 4 : 0} />
      <rect x={-125} y={-450} width={250} height={40} rx={12} fill="#BDB49A" />
      <path d="M-120 -120 L120 -120 L140 0 L-140 0 Z" fill="#CFC4A8" />
      <circle cx={0} cy={-60} r={22} fill={ligado ? "#FFD23F" : "#8A8270"} />
    </g>
  );
};

/** O PRO MAX: cromado e vermelho, com raio e "PRO MAX", SEM TAMPA. `jato` 0..1 solta a coluna de vitamina pra cima. */
export const LiquidificadorProMax: React.FC<{ x: number; y: number; escala?: number; ligado?: boolean; jato?: number; rot?: number }> = ({
  x,
  y,
  escala = 1,
  ligado = false,
  jato = 0,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const tr = ligado ? Math.sin(f * 2.7) * 6 : 0;
  const nivel = 1 - jato;
  return (
    <g transform={`translate(${x + tr} ${y}) scale(${escala}) rotate(${rot})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      {jato > 0 && (
        <g>
          <path d={`M-70 -430 Q ${-90 + Math.sin(f) * 20} ${-430 - 1200 * jato} 0 ${-430 - 1500 * jato} Q ${90 + Math.cos(f) * 20} ${-430 - 1200 * jato} 70 -430 Z`} fill="#FF8C1A" />
          {Array.from({ length: 8 }).map((_, i) => {
            const q = ((f * 2 + i * 9) % 30) / 30;
            const a = -Math.PI / 2 + (i - 3.5) * 0.35;
            return <circle key={i} cx={Math.cos(a) * (100 + q * 500)} cy={-440 + Math.sin(a) * (100 + q * 500)} r={22 + (i % 3) * 8} fill="#FF8C1A" />;
          })}
        </g>
      )}
      <path d="M-120 -440 L120 -440 L90 -120 L-90 -120 Z" fill="#DDF3FF" opacity={0.9} />
      {nivel > 0.05 && <path d={`M${-90 - 20 * nivel} ${-120 - 300 * nivel} L${90 + 20 * nivel} ${-120 - 300 * nivel} L90 -120 L-90 -120 Z`} fill="#FF8C1A" stroke="none" opacity={0.95} />}
      {ligado && (
        <g fill="none" stroke="#fff" strokeWidth={6} opacity={0.8}>
          <path d={`M-50 ${-200} q 50 ${-40 + Math.sin(f) * 20} 100 0`} />
          <path d={`M-40 ${-260} q 40 ${30 + Math.cos(f) * 20} 80 0`} />
        </g>
      )}
      <path d="M-130 -120 L130 -120 L160 20 L-160 20 Z" fill="#E8282B" />
      <path d="M-100 -95 L100 -95" stroke="#C9D0DC" strokeWidth={14} />
      <text y={-20} textAnchor="middle" fontSize={44} fill="#FFD23F" stroke={TINTA} strokeWidth={4} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        PRO MAX
      </text>
      <path d="M150 -80 l 30 -40 l -10 30 l 30 -10 l -40 50" fill="#FFD23F" strokeWidth={5} />
      <circle cx={-110} cy={-20} r={16} fill={ligado ? "#3DFF8A" : "#555"} />
    </g>
  );
};

/** Manchas de vitamina laranja espalhadas pela tela (`k` 0..1 = quantas). Use por cima do cenário e dos personagens. */
export const Manchas: React.FC<{ k: number; seed?: number; area?: [number, number, number, number] }> = ({ k, seed = 0, area = [0, 0, 1080, 1700] }) => {
  if (k <= 0) return null;
  const n = Math.round(28 * k);
  const rnd = (i: number, j: number) => {
    const v = Math.sin((i + seed * 13) * 91.7 + j * 47.3) * 43758.5;
    return v - Math.floor(v);
  };
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const cx = area[0] + rnd(i, 1) * area[2];
        const cy = area[1] + rnd(i, 2) * area[3];
        const r = 20 + rnd(i, 3) * 55;
        return (
          <g key={i} fill="#FF8C1A" stroke="none">
            <ellipse cx={cx} cy={cy} rx={r} ry={r * (0.7 + rnd(i, 4) * 0.4)} />
            <circle cx={cx + r * 0.9} cy={cy - r * 0.6} r={r * 0.25} />
            <path d={`M${cx - r * 0.3} ${cy + r * 0.5} q ${r * 0.15} ${r * 1.2} ${r * 0.3} 0 Z`} />
          </g>
        );
      })}
    </g>
  );
};

/** Capa de chuva amarela (brinde). */
export const CapaChuva: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-60 -200 Q 0 -260 60 -200 L120 160 L-120 160 Z" fill="#FFD23F" />
    <path d="M-60 -200 Q 0 -150 60 -200" fill="#E5B800" />
    <path d="M0 -170 L0 140" strokeWidth={5} />
    {[-120, -60, 0, 60].map((cy) => (
      <circle key={cy} cx={14} cy={cy} r={8} fill="#fff" strokeWidth={4} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ Ep. 9 — Fone Antirruído Extremo */

/** Broca de furadeira atravessando a parede (o vizinho!), com pó voando. `liga` faz girar e tremer. */
export const BrocaNaParede: React.FC<{ x: number; y: number; escala?: number; liga?: boolean }> = ({ x, y, escala = 1, liga = true }) => {
  const f = useCurrentFrame();
  const t = liga ? Math.sin(f * 2.5) * 4 : 0;
  return (
    <g transform={`translate(${x + t} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <circle r={70} fill="#5a3a2a" />
      <path d={`M0 0 L${-180} 0`} stroke="#9aa3ae" strokeWidth={26} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${-40 - i * 35} -13 L${-55 - i * 35} 13`} stroke={TINTA} strokeWidth={5} opacity={0.7} transform={`translate(${liga ? (f * 6) % 35 : 0} 0)`} />
      ))}
      <path d="M-180 -13 L-215 0 L-180 13 Z" fill="#9aa3ae" />
      {liga &&
        [0, 1, 2, 3, 4].map((i) => {
          const q = ((f * 2 + i * 7) % 24) / 24;
          return <circle key={i} cx={-20 - q * 160} cy={-30 + Math.sin(i * 2 + f) * 60 * q} r={10 - q * 6} fill="#c9a27a" stroke="none" opacity={1 - q} />;
        })}
    </g>
  );
};

/** O FONE ANTIRRUÍDO EXTREMO: conchas gigantes, antena parabólica e luz "MUTE". `ligado` acende. */
export const FoneExtremo: React.FC<{ x: number; y: number; escala?: number; ligado?: boolean; rot?: number }> = ({ x, y, escala = 1, ligado = false, rot = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala}) rotate(${rot})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-200 0 Q -200 -260 0 -260 Q 200 -260 200 0" fill="none" stroke={TINTA} strokeWidth={40} />
      <path d="M-200 0 Q -200 -260 0 -260 Q 200 -260 200 0" fill="none" stroke="#e8282b" strokeWidth={26} />
      {[-1, 1].map((l) => (
        <g key={l} transform={`translate(${l * 215} 30)`}>
          <ellipse rx={95} ry={130} fill="#1f1b2e" />
          <ellipse rx={70} ry={100} fill="#e8282b" />
          <circle r={30} fill={ligado && f % 20 < 12 ? "#3dff8a" : "#2a5a3a"} />
        </g>
      ))}
      <path d="M0 -260 L0 -340" strokeWidth={10} />
      <path d="M-70 -350 Q 0 -420 70 -350 Z" fill="#c9d0dc" />
      {ligado &&
        [0, 1].map((i) => {
          const q = ((f * 1.5 + i * 15) % 30) / 30;
          return <path key={i} d={`M${-60 - q * 60} ${-400 - q * 40} Q 0 ${-470 - q * 60} ${60 + q * 60} ${-400 - q * 40}`} fill="none" stroke="#3dff8a" strokeWidth={8} opacity={1 - q} />;
        })}
    </g>
  );
};

/** Chamas de desenho (incêndio de mentirinha). */
export const Chamas: React.FC<{ x: number; y: number; escala?: number; n?: number }> = ({ x, y, escala = 1, n = 5 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={7} strokeLinejoin="round">
      {Array.from({ length: n }).map((_, i) => {
        const h = 160 + Math.sin(f * 0.7 + i * 1.9) * 50;
        const cx = (i - (n - 1) / 2) * 90;
        return (
          <g key={i}>
            <path d={`M${cx - 55} 0 Q ${cx - 60} ${-h * 0.6} ${cx} ${-h} Q ${cx + 60} ${-h * 0.6} ${cx + 55} 0 Z`} fill="#ff6b1a" />
            <path d={`M${cx - 28} 0 Q ${cx - 30} ${-h * 0.35} ${cx} ${-h * 0.6} Q ${cx + 30} ${-h * 0.35} ${cx + 28} 0 Z`} fill="#ffd23f" stroke="none" />
          </g>
        );
      })}
    </g>
  );
};

/** Jato de mangueira dos bombeiros (vem da esquerda) com gotas. */
export const JatoBombeiro: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <path d={`M-700 -80 Q -300 ${-160 + Math.sin(f) * 10} 0 0`} fill="none" stroke="#3da5ff" strokeWidth={70} strokeLinecap="round" opacity={0.85} />
      <path d={`M-700 -80 Q -300 ${-160 + Math.sin(f) * 10} 0 0`} fill="none" stroke="#bfe6ff" strokeWidth={22} strokeLinecap="round" />
      {Array.from({ length: 10 }).map((_, i) => {
        const q = ((f * 2 + i * 7) % 30) / 30;
        const a = -1.2 + (i / 10) * 2.4;
        return <circle key={i} cx={Math.cos(a) * q * 260} cy={Math.sin(a) * q * 260} r={18} fill="#3da5ff" stroke={TINTA} strokeWidth={4} opacity={1 - q} />;
      })}
    </g>
  );
};

/** Extintor vermelho (brinde). */
export const Extintor: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
    <rect x={-70} y={-280} width={140} height={300} rx={60} fill="#e8282b" />
    <rect x={-50} y={-180} width={100} height={70} rx={10} fill="#fff" strokeWidth={5} />
    <path d="M-30 -280 L-30 -330 L40 -330 L70 -310" fill="none" strokeWidth={14} />
    <path d="M70 -310 Q 130 -300 120 -200" fill="none" strokeWidth={14} />
  </g>
);
