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
