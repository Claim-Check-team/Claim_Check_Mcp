'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  sublabel: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Echo Simulator',
    sublabel: 'Voice-first demo',
    icon: 'M',
  },
  {
    href: '/stress-lab',
    label: 'Stress Lab',
    sublabel: 'Batch test runner',
    icon: 'S',
  },
  {
    href: '/protocol',
    label: 'Protocol Inspector',
    sublabel: 'MCP trace timeline',
    icon: 'P',
  },
  {
    href: '/architecture',
    label: 'Architecture',
    sublabel: 'System overview',
    icon: 'A',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-glass w-[260px] min-h-screen flex flex-col py-6 px-4 border-r border-white/60 shrink-0">
      {/* BRANDING */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-900 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <span className="text-white font-extrabold text-sm tracking-tight">CC</span>
        </div>
        <div>
          <h2 className="font-display font-extrabold text-sm text-slate-800 tracking-tight leading-tight">
            Claim-Check MCP
          </h2>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
            Alexa+ Epistemic Safety
          </span>
        </div>
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
                  ? 'neu-inset bg-white/40 ring-1 ring-cyan-400/40'
                  : 'hover:bg-white/30 hover:shadow-sm'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-slate-200/80 text-slate-500 group-hover:bg-slate-300/80'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <span
                  className={`block text-xs font-bold leading-tight truncate ${
                    isActive ? 'text-cyan-700' : 'text-slate-700'
                  }`}
                >
                  {item.label}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium truncate">
                  {item.sublabel}
                </span>
              </div>
              {isActive && (
                <span className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER STATUS */}
      <div className="mt-auto pt-6 px-2 border-t border-slate-200/60">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-500">
            MCP Spec 2025-11-25
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span className="text-[10px] font-semibold text-slate-500">
            Streamable HTTP /mcp
          </span>
        </div>
        <div className="mt-3 neu-inset px-3 py-2 rounded-lg">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Dev B Ownership
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            frontend/* | data/* | docs
          </span>
        </div>
      </div>
    </aside>
  );
}
