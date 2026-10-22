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

  let color = '#f59e0b'; // Marigold glowing primary
  let glowColor = 'rgba(245, 158, 11, 0.45)';
  let statusLabel = 'VERIFIED';

  if (score < 50) {
    color = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.4)';
    statusLabel = 'LOW TRUST';
  } else if (score < 75) {
    color = '#d97706';
    glowColor = 'rgba(217, 119, 6, 0.4)';
    statusLabel = 'CAUTION';
  } else if (score >= 90) {
    color = '#10b981';
    glowColor = 'rgba(16, 185, 129, 0.4)';
    statusLabel = 'HIGH TRUST';
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
            opacity="0.6"
          />
          {/* Progress arc (Marigold / Status) */}
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
        {/* Center label (Aubergine) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-black text-aubergine-950 leading-none"
            style={{ fontSize: size * 0.25 }}
          >
            {score}
          </span>
          <span
            className="font-bold text-silver-700 uppercase tracking-wider"
            style={{ fontSize: size * 0.08 }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-bold text-aubergine-900 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
