'use client';

import React from 'react';

interface TrustGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export default function TrustGauge({ score, size = 120, label }: TrustGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;

  let strokeColor = '#18181b'; // Dark mode will invert or use css
  let statusBadge = 'VERIFIED';
  let isHazard = false;

  if (score < 50) {
    statusBadge = 'HAZARD REFUTED';
    isHazard = true;
  } else if (score < 75) {
    statusBadge = 'CALIBRATED';
  } else {
    statusBadge = 'GROUNDED';
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track (Zinc) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="7"
          />
          {/* Progress arc (Monochrome / White in dark mode, or Rose if hazard) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={isHazard ? 'stroke-rose-500' : 'stroke-zinc-900 dark:stroke-white'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${remaining}`}
            style={{
              transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-zinc-950 dark:text-white">
            {score}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
            {label || 'TRUST'}
          </span>
        </div>
      </div>

      <span
        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
          isHazard
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
        }`}
      >
        {statusBadge}
      </span>
    </div>
  );
}
