'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Radio, FlaskConical, Cpu, Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface DockTab {
  href: string;
  code: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const DOCK_TABS: DockTab[] = [
  { href: '/', code: '01', title: 'OVERVIEW', subtitle: 'Hologram & Live Eval', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { href: '/simulator', code: '02', title: 'SIMULATOR', subtitle: 'Echo Rotary Dial', icon: <Radio className="w-3.5 h-3.5" /> },
  { href: '/stress-lab', code: '03', title: 'STRESS LAB', subtitle: 'Epistemic Trace', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  { href: '/architecture', code: '04', title: 'BLUEPRINT CAD', subtitle: 'Single-Frame Schematic', icon: <Cpu className="w-3.5 h-3.5" /> },
  { href: '/protocol', code: '05', title: 'PROTOCOL', subtitle: 'Wire JSON-RPC 2.0', icon: <Terminal className="w-3.5 h-3.5" /> },
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

      {/* TOP UNIFIED MISSION CONTROL FLIGHT BAR - EXPANDED ROOMY HEADER */}
      <header className="sticky top-0 z-40 tactical-glass border-b border-slate-300 dark:border-emerald-500/20 backdrop-blur-2xl">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 h-18 sm:h-20 flex items-center justify-between">
          
          {/* BRANDING & SPEC STATUS */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm border border-emerald-500/40 shadow-emerald-glow bg-white dark:bg-[#0a0f16] group-hover:scale-105 transition-transform">
                <span className="text-emerald-700 dark:text-[#00f59b]">CC</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-normal text-slate-900 dark:text-white">
                    CLAIM-CHECK MCP
                  </span>
                  <span className="skew-hud px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00f59b] border border-emerald-300 dark:border-emerald-500/40 hidden sm:inline">
                    EPISTEMIC SAFETY KERNEL
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono hidden md:inline">
                  FastMCP Spec 2025-11-25 &bull; Port 8000
                </span>
              </div>
            </Link>
          </div>

          {/* FLIGHT TELEMETRY SENSORS - ROOMY & SPACIOUS */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-100 dark:bg-emerald-950/60 text-xs text-emerald-800 dark:text-[#00f59b] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-[#00f59b] animate-ping" />
              <span>SLA: 1,340ms PASS</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-100 dark:bg-amber-950/50 text-xs text-amber-800 dark:text-[#fbbf24] font-bold">
              <span>VOICE INTERCEPT: READY</span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* FULL-WIDTH VIEWPORT STAGE */}
      <main className="flex-1 relative z-10 pb-24 pt-3">
        {children}
      </main>

      {/* FLOATING MISSION CONTROL DOCK - COMPACT SLEEK CAPSULE */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="px-2 py-1.5 rounded-2xl bg-white/90 dark:bg-[#0b1017]/90 shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-2xl flex items-center gap-1">
          {DOCK_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 select-none text-xs font-mono font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-[#00f59b] border border-emerald-600 dark:border-emerald-500/60 shadow-sm z-10'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                {/* Active Indicator Micro-Beacon */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white dark:bg-[#00f59b] shadow-sm animate-pulse" />
                )}

                <span className="shrink-0 flex items-center justify-center">{tab.icon}</span>
                <span className="tracking-tight">{tab.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
