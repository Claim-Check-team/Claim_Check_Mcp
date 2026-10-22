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

  let color = '#10b981';
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let statusLabel = 'HIGH TRUST';

  if (score < 50) {
    color = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.4)';
    statusLabel = 'LOW TRUST';
  } else if (score < 75) {
    color = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    statusLabel = 'MODERATE';
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
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            opacity="0.5"
          />
          {/* Progress arc */}
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
              filter: `drop-shadow(0 0 6px ${glowColor})`,
              transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-extrabold text-slate-800 leading-none"
            style={{ fontSize: size * 0.25 }}
          >
            {score}
          </span>
          <span
            className="font-bold text-slate-400 uppercase tracking-wider"
            style={{ fontSize: size * 0.08 }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
