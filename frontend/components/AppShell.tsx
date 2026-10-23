'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface DockTab {
  href: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
}

const DOCK_TABS: DockTab[] = [
  { href: '/', code: '01', title: 'OVERVIEW', subtitle: 'Hologram & Live Eval', icon: '⚡' },
  { href: '/simulator', code: '02', title: 'SIMULATOR', subtitle: 'Echo Rotary Dial', icon: '◎' },
  { href: '/stress-lab', code: '03', title: 'STRESS LAB', subtitle: 'Epistemic Trace', icon: '🔬' },
  { href: '/architecture', code: '04', title: 'BLUEPRINT CAD', subtitle: 'Single-Frame Schematic', icon: '📐' },
  { href: '/protocol', code: '05', title: 'PROTOCOL', subtitle: 'Wire JSON-RPC 2.0', icon: '☵' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen w-full relative bg-slate-100 dark:bg-[#070a0e] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-black blueprint-grid transition-colors duration-200">
      
      {/* 3D HOLOGRAPHIC AMBIENT BACKGROUND ACCENT */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 dark:opacity-25 mix-blend-multiply dark:mix-blend-screen scale-105"
          style={{ backgroundImage: "url('/epistemic_3d_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100/70 via-slate-100/90 to-slate-200 dark:from-[#070a0e]/60 dark:via-[#070a0e]/85 dark:to-[#070a0e]" />
      </div>

      {/* TOP UNIFIED MISSION CONTROL FLIGHT BAR */}
      <header className="sticky top-0 z-40 tactical-glass border-b border-emerald-500/20 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          
          {/* BRANDING & SPEC STATUS */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs border border-emerald-500/40 shadow-emerald-glow bg-white dark:bg-[#0a0f16] group-hover:scale-105 transition-transform">
                <span className="text-emerald-700 dark:text-[#00f59b]">CC</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white">
                    CLAIM-CHECK MCP
                  </span>
                  <span className="skew-hud px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00f59b] border border-emerald-300 dark:border-emerald-500/40 hidden sm:inline">
                    EPISTEMIC SAFETY KERNEL
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono hidden md:inline">
                  FastMCP Spec 2025-11-25 &bull; Port 8000
                </span>
              </div>
            </Link>
          </div>

          {/* FLIGHT TELEMETRY SENSORS */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-100 dark:bg-emerald-950/60 text-[11px] text-emerald-800 dark:text-[#00f59b]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#00f59b] animate-ping" />
              <span>SLA: 1,340ms PASS</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-100 dark:bg-amber-950/50 text-[11px] text-amber-800 dark:text-[#fbbf24]">
              <span>VOICE INTERCEPT: READY</span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* FULL-WIDTH VIEWPORT STAGE */}
      <main className="flex-1 relative z-10 pb-28 pt-2">
        {children}
      </main>

      {/* FLOATING CYBERNETIC MISSION CONTROL DOCK (BOTTOM COMMAND STATION) */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[94%] sm:w-auto">
        <div className="p-1.5 sm:p-2 rounded-2xl tactical-glass shadow-2xl border border-emerald-500/40 backdrop-blur-2xl flex items-center justify-around sm:justify-center gap-1 sm:gap-2">
          {DOCK_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-2 select-none group ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-600 shadow-md scale-105 z-10 dark:bg-zinc-950 dark:text-[#00f59b] dark:border-neon-emerald dark:shadow-emerald-glow'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30'
                }`}
              >
                {/* Active Indicator Micro-Beacon */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-[#00f59b] shadow-emerald-glow animate-pulse" />
                )}

                <span className="text-sm font-mono opacity-90">{tab.icon}</span>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-mono font-bold hidden sm:inline ${isActive ? 'text-slate-900 dark:text-zinc-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                      {tab.code}
                    </span>
                    <span className={`text-xs font-mono font-extrabold tracking-wider ${isActive ? 'text-slate-950 dark:text-white' : 'text-slate-700 dark:text-zinc-300'}`}>
                      {tab.title}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono hidden md:block ${isActive ? 'text-slate-900 dark:text-[#00f59b] font-semibold' : 'text-slate-500 dark:text-zinc-500'}`}>
                    {tab.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
