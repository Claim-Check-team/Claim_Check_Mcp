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
  tag?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/stress-lab',
    label: 'Stress Lab',
    sublabel: 'STRESS // LABORATORY',
    icon: 'SL',
  },
  {
    href: '/architecture',
    label: 'Architecture CAD',
    sublabel: 'VOICE // ARCHITECTURE',
    icon: 'AR',
  },
  {
    href: '/simulator',
    label: 'Echo Show Display',
    sublabel: 'ECHO // RECORD',
    icon: 'ES',
    badge: 'LIVE',
  },
  {
    href: '/protocol',
    label: 'Protocol Inspector',
    sublabel: 'MCP Spec 2025-11-25',
    icon: 'PI',
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen flex flex-col py-5 px-4 shrink-0 glass-panel border-r border-slate-200 dark:border-emerald-500/20 bg-white/95 dark:bg-obsidian-titanium/90 relative overflow-hidden transition-colors">
      {/* GLOWING AMBIENT ACCENTS */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* BRANDING */}
      <div className="flex items-center justify-between px-2 mb-6 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl neu-raised flex items-center justify-center font-mono font-black text-sm tracking-tight border border-slate-300 dark:border-emerald-500/40 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform bg-slate-100 dark:bg-zinc-950">
            <span className="relative z-10 text-emerald-700 dark:text-neon-emerald font-extrabold">CC</span>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
                Claim-Check
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-neon-emerald animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-neon-gold uppercase tracking-wider block font-semibold">
              Epistemic Safety MCP
            </span>
          </div>
        </Link>
      </div>

      {/* QUICK HOME LINK */}
      <div className="mb-4 px-1 relative z-10">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white neu-raised-sm hover:neu-raised transition-all border border-slate-300 dark:border-emerald-500/20 shadow-sm bg-slate-100/70 dark:bg-zinc-900/40"
        >
          <span className="text-emerald-700 dark:text-neon-emerald font-bold">&larr;</span>
          <span>Overview HUD</span>
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
                  ? 'neu-raised border border-emerald-500/50 text-emerald-800 dark:text-neon-emerald shadow-emerald-glow bg-emerald-50 dark:bg-zinc-950 font-bold'
                  : 'hover:neu-raised-sm text-slate-700 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white border border-transparent hover:border-slate-300 dark:hover:border-emerald-500/20 hover:bg-slate-100/80 dark:hover:bg-zinc-900/40'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-emerald-600 dark:bg-neon-emerald shadow-sm shadow-emerald-400" />
              )}
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-neon-emerald dark:to-emerald-700 text-white dark:text-black shadow-sm'
                    : 'neu-inset text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800'
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
                          ? 'bg-emerald-600 dark:bg-neon-emerald text-white dark:text-black shadow-sm'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-neon-emerald border border-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`block text-[10px] font-mono truncate ${
                    isActive ? 'text-emerald-700 dark:text-emerald-400/90 font-medium' : 'text-slate-500 dark:text-zinc-500'
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
      <div className="mt-auto pt-4 px-2 border-t border-slate-200 dark:border-emerald-500/20 space-y-2 relative z-10 font-mono">
        <div className="neu-inset p-2.5 rounded-xl space-y-1.5 bg-slate-100 dark:bg-zinc-950/80 border border-slate-300 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-neon-emerald animate-pulse" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-300">
              FastMCP Spec 2025-11-25
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-neon-gold" />
            <span className="text-[10px] text-slate-600 dark:text-zinc-400">
              Streamable HTTP /mcp:8000
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="text-[10px] text-slate-600 dark:text-zinc-400">
              Alexa APL 2.0 &amp; Lambda
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
