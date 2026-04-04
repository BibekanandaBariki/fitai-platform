"use client";

import { useOnboardingStore } from "@/store/onboardingStore";

type Gender = 'male' | 'female' | 'other' | null;

interface HumanSVGProps {
  gender: Gender;
  height: number;
  weight: number;
}

function HumanSVG({ gender, height, weight }: HumanSVGProps) {
  const isFemale = gender === 'female';

  // Normalise
  const h = Math.max(140, Math.min(220, height));
  const w = Math.max(40, Math.min(150, weight));

  // Scale factors
  const heightRatio = h / 175;           // 1.0 at 175 cm
  const bulk       = Math.pow(w / 70, 0.55); // 1.0 at 70 kg

  // --- shape parameters ---
  const cx = 100;
  const headRx  = isFemale ? 21 : 24;
  const headRy  = isFemale ? 25 : 27;
  const neckW   = isFemale ? 14 : 18;
  const shW     = isFemale ? 54 + bulk * 10 : 68 + bulk * 14;  // shoulder width
  const chestW  = isFemale ? 50 + bulk *  9 : 62 + bulk * 13;
  const waistW  = isFemale ? 36 + bulk *  7 : 44 + bulk *  9;
  const hipW    = isFemale ? 62 + bulk * 13 : 50 + bulk *  8;
  const armR    = isFemale ?  6 + bulk *  2 :  8 + bulk *  3;
  const legR    = isFemale ? 10 + bulk *  3 : 13 + bulk *  4;

  // --- Y positions (compressed / stretched by height) ---
  const scale = (base: number) => base * heightRatio;
  const headCY    = 48;
  const neckTop   = headCY + headRy;
  const neckBot   = neckTop + 18;
  const shldrY    = neckBot + 2;
  const chestBotY = shldrY  + scale(55);
  const waistY    = shldrY  + scale(75);
  const hipTopY   = shldrY  + scale(95);
  const crotchY   = shldrY  + scale(115);
  const kneeY     = crotchY + scale(90);
  const footY     = crotchY + scale(170);

  const svgH = footY + 20;

  // Torso outline — cubic bezier for organic curves
  const torso = [
    `M ${cx - shW/2} ${shldrY}`,
    // Left shoulder → left waist
    `C ${cx - chestW/2} ${chestBotY}, ${cx - waistW/2} ${waistY - 5}, ${cx - waistW/2} ${waistY}`,
    // Left waist → left hip
    `C ${cx - waistW/2} ${waistY + 8}, ${cx - hipW/2} ${hipTopY}, ${cx - hipW/2} ${hipTopY + 5}`,
    `L ${cx - hipW/2} ${crotchY}`,
    `L ${cx + hipW/2} ${crotchY}`,
    `L ${cx + hipW/2} ${hipTopY + 5}`,
    `C ${cx + hipW/2} ${hipTopY}, ${cx + waistW/2} ${waistY + 8}, ${cx + waistW/2} ${waistY}`,
    `C ${cx + waistW/2} ${waistY - 5}, ${cx + chestW/2} ${chestBotY}, ${cx + shW/2} ${shldrY}`,
    'Z',
  ].join(' ');

  return (
    <svg
      viewBox={`0 0 200 ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.4))' }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#86efac" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="1"    />
        </linearGradient>
        <linearGradient id="limbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#4ade80" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#15803d" stopOpacity="1"    />
        </linearGradient>
      </defs>

      {/* HEAD */}
      <ellipse cx={cx} cy={headCY} rx={headRx} ry={headRy}
        fill="url(#bodyGrad)" />
      {/* ear hints */}
      <ellipse cx={cx - headRx + 2} cy={headCY + 4} rx="4" ry="6" fill="url(#bodyGrad)" opacity="0.7" />
      <ellipse cx={cx + headRx - 2} cy={headCY + 4} rx="4" ry="6" fill="url(#bodyGrad)" opacity="0.7" />

      {/* NECK */}
      <rect x={cx - neckW/2} y={neckTop} width={neckW} height={neckBot - neckTop + 2}
        rx={neckW / 2} fill="url(#bodyGrad)" opacity="0.9" />

      {/* TORSO */}
      <path d={torso} fill="url(#bodyGrad)" opacity="0.92" />

      {/* Female chest detail */}
      {isFemale && (
        <>
          <ellipse cx={cx - 12} cy={shldrY + scale(30)} rx={10} ry={8}
            fill="url(#bodyGrad)" opacity="0.4" />
          <ellipse cx={cx + 12} cy={shldrY + scale(30)} rx={10} ry={8}
            fill="url(#bodyGrad)" opacity="0.4" />
        </>
      )}

      {/* LEFT ARM */}
      <line
        x1={cx - shW/2 + 2}  y1={shldrY + 4}
        x2={cx - shW/2 - 16} y2={crotchY - 10}
        stroke="url(#limbGrad)" strokeWidth={armR * 2} strokeLinecap="round" opacity="0.88"
      />
      {/* RIGHT ARM */}
      <line
        x1={cx + shW/2 - 2}  y1={shldrY + 4}
        x2={cx + shW/2 + 16} y2={crotchY - 10}
        stroke="url(#limbGrad)" strokeWidth={armR * 2} strokeLinecap="round" opacity="0.88"
      />

      {/* LEFT LEG — upper */}
      <line
        x1={cx - hipW/2 + legR}     y1={crotchY}
        x2={cx - hipW/2 + legR - 3} y2={kneeY}
        stroke="url(#limbGrad)" strokeWidth={legR * 2} strokeLinecap="round" opacity="0.9"
      />
      {/* LEFT LEG — lower */}
      <line
        x1={cx - hipW/2 + legR - 3} y1={kneeY}
        x2={cx - hipW/2 + legR - 6} y2={footY}
        stroke="url(#limbGrad)" strokeWidth={(legR * 2) - 3} strokeLinecap="round" opacity="0.85"
      />

      {/* RIGHT LEG — upper */}
      <line
        x1={cx + hipW/2 - legR}     y1={crotchY}
        x2={cx + hipW/2 - legR + 3} y2={kneeY}
        stroke="url(#limbGrad)" strokeWidth={legR * 2} strokeLinecap="round" opacity="0.9"
      />
      {/* RIGHT LEG — lower */}
      <line
        x1={cx + hipW/2 - legR + 3} y1={kneeY}
        x2={cx + hipW/2 - legR + 6} y2={footY}
        stroke="url(#limbGrad)" strokeWidth={(legR * 2) - 3} strokeLinecap="round" opacity="0.85"
      />

      {/* FEET */}
      <ellipse cx={cx - hipW/2 + legR - 6} cy={footY + 5} rx={legR + 2} ry={5}
        fill="url(#limbGrad)" opacity="0.8" />
      <ellipse cx={cx + hipW/2 - legR + 6} cy={footY + 5} rx={legR + 2} ry={5}
        fill="url(#limbGrad)" opacity="0.8" />
    </svg>
  );
}

export function Avatar3D() {
  const { height, weight, gender } = useOnboardingStore();

  return (
    <div className="w-full h-[50vh] md:h-[600px] rounded-3xl overflow-hidden relative border border-primary/10 bg-gradient-to-b from-background to-primary/5 flex items-center justify-center">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,197,94,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floor glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-primary/15 blur-3xl rounded-full pointer-events-none" />

      {/* Avatar */}
      <div
        className="relative z-10 h-full w-full max-w-[200px] mx-auto py-6"
        style={{ transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <HumanSVG gender={gender} height={height || 175} weight={weight || 70} />
      </div>

      {/* Stat pills */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center flex-wrap">
        {height && (
          <div className="bg-background/80 backdrop-blur-sm text-xs font-mono px-3 py-1 rounded-full border border-primary/20 text-primary">
            {height} cm
          </div>
        )}
        {weight && (
          <div className="bg-background/80 backdrop-blur-sm text-xs font-mono px-3 py-1 rounded-full border border-primary/20 text-primary">
            {weight} kg
          </div>
        )}
        {gender && (
          <div className="bg-background/80 backdrop-blur-sm text-xs font-mono px-3 py-1 rounded-full border border-primary/20 text-primary capitalize">
            {gender === 'male' ? '♂' : gender === 'female' ? '♀' : '⚧'} {gender}
          </div>
        )}
      </div>
    </div>
  );
}
