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

  let color = '#00d2ff'; // Alexa Electric Cyan
  let glowColor = 'rgba(0, 210, 255, 0.5)';
  let statusLabel = 'VERIFIED';

  if (score < 50) {
    color = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.45)';
    statusLabel = 'REFUTED';
  } else if (score < 75) {
    color = '#38bdf8';
    glowColor = 'rgba(56, 189, 248, 0.45)';
    statusLabel = 'CALIBRATED';
  } else if (score >= 90) {
    color = '#10b981';
    glowColor = 'rgba(16, 185, 129, 0.45)';
    statusLabel = 'GROUNDED';
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track (Silver) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="8"
            opacity="0.5"
          />
          {/* Progress arc (Alexa Cyan / Status) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${remaining}`}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        {/* Center label (Aubergine) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-black text-aubergine-950 dark:text-white leading-none"
            style={{ fontSize: size * 0.25 }}
          >
            {score}
          </span>
          <span
            className="font-bold text-silver-700 dark:text-silver-300 uppercase tracking-wider"
            style={{ fontSize: size * 0.08 }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-bold text-aubergine-900 dark:text-silver-200 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
