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
    href: '/simulator',
    label: 'Echo Show Simulator',
    sublabel: 'Hardware & APL 2.0',
    icon: 'E',
    badge: 'LIVE',
  },
  {
    href: '/stress-lab',
    label: 'Stress Lab',
    sublabel: 'Reasoning & Rubrics',
    icon: 'S',
  },
  {
    href: '/protocol',
    label: 'Protocol Inspector',
    sublabel: 'MCP Trace & JSON-RPC',
    icon: 'P',
  },
  {
    href: '/architecture',
    label: 'Architecture',
    sublabel: 'Pipeline & AWS Lambda',
    icon: 'A',
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar-glass w-[260px] min-h-screen flex flex-col py-5 px-4 shrink-0">
      {/* BRANDING */}
      <div className="flex items-center justify-between px-2 mb-6">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all">
            <span className="text-slate-950 font-black text-sm tracking-tight">CC</span>
          </div>
          <div>
            <h2 className="font-display font-extrabold text-sm text-slate-950 dark:text-white tracking-tight leading-tight group-hover:text-cyan-500 transition-colors">
              Claim-Check
            </h2>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
              Voice Epistemic Safety
            </span>
          </div>
        </Link>
      </div>

      {/* QUICK HOME LINK */}
      <div className="mb-4 px-1">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-cyan-500 hover:bg-white/40 dark:hover:bg-white/5 transition-all border border-slate-200 dark:border-white/10"
        >
          <span>&larr;</span>
          <span>Main Product Site</span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'neu-inset bg-white/50 dark:bg-white/5 ring-1 ring-cyan-500/50'
                  : 'hover:bg-white/30 dark:hover:bg-white/5 hover:shadow-sm'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 group-hover:bg-slate-300'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`block text-xs font-bold leading-tight truncate ${
                      isActive ? 'text-cyan-600 dark:text-cyan-400 font-extrabold' : 'text-slate-900 dark:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-300/60">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="block text-[10px] text-slate-500 font-medium truncate">
                  {item.sublabel}
                </span>
              </div>
              {isActive && (
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER STATUS */}
      <div className="mt-auto pt-5 px-2 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            FastMCP Spec 2025-11-25
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            Streamable HTTP /mcp
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            Alexa APL 2.0 & AWS Lambda
          </span>
        </div>
      </div>
    </aside>
  );
}
