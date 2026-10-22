'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  sublabel: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/stress-lab',
    label: 'Stress Lab',
    sublabel: 'Reasoning & Rubrics',
    icon: 'SL',
  },
  {
    href: '/architecture',
    label: 'Architecture',
    sublabel: 'Pipeline & Latency SLA',
    icon: 'AR',
  },
  {
    href: '/simulator',
    label: 'Echo Show Display',
    sublabel: 'Hardware & APL 2.0',
    icon: 'ES',
    badge: 'LIVE',
  },
  {
    href: '/protocol',
    label: 'Protocol Inspector',
    sublabel: 'MCP Trace & JSON-RPC',
    icon: 'PI',
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen flex flex-col py-5 px-4 shrink-0 glass-panel border-r border-slate-200/80 dark:border-white/10 relative overflow-hidden">
      {/* GLOWING AMBIENT ACCENT */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* BRANDING */}
      <div className="flex items-center justify-between px-2 mb-6 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl neu-raised flex items-center justify-center text-zinc-950 dark:text-white font-mono font-black text-sm tracking-tight border border-white/80 dark:border-white/10 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
            <span className="relative z-10 text-cyan-600 dark:text-cyan-400 font-extrabold">CC</span>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-transparent pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm text-zinc-950 dark:text-white tracking-tight leading-tight">
                Claim-Check
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              Epistemic Safety MCP
            </span>
          </div>
        </Link>
      </div>

      {/* QUICK HOME LINK */}
      <div className="mb-4 px-1 relative z-10">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white neu-raised-sm hover:neu-raised transition-all border border-white/80 dark:border-white/10 shadow-sm"
        >
          <span className="text-cyan-500">&larr;</span>
          <span>Main Product Overview</span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2 flex-1 relative z-10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative overflow-hidden ${
                isActive
                  ? 'neu-raised border border-cyan-400/40 text-cyan-700 dark:text-cyan-300 shadow-md font-bold'
                  : 'hover:neu-raised-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-transparent hover:border-white/60 dark:hover:border-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-cyan-500 shadow-sm shadow-cyan-400" />
              )}
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-sm'
                    : 'neu-inset text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold ${
                        isActive
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`block text-[10px] font-normal truncate ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400/80 font-medium' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {item.sublabel}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER STATUS */}
      <div className="mt-auto pt-4 px-2 border-t border-slate-200/70 dark:border-white/10 space-y-2 relative z-10">
        <div className="neu-inset p-2.5 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
              FastMCP Spec 2025-11-25
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
              Streamable HTTP /mcp
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
              Alexa APL 2.0 &amp; Lambda
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
