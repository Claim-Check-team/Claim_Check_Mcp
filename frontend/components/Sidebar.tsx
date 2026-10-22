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
    <aside className="w-[260px] min-h-screen flex flex-col py-5 px-4 shrink-0 bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800">
      {/* BRANDING */}
      <div className="flex items-center justify-between px-2 mb-6">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-mono font-bold text-sm tracking-tight">
            CC
          </div>
          <div>
            <h2 className="font-bold text-sm text-zinc-950 dark:text-white tracking-tight leading-tight">
              Claim-Check
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Epistemic Guardrail
            </span>
          </div>
        </Link>
      </div>

      {/* QUICK HOME LINK */}
      <div className="mb-4 px-1">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all border border-zinc-200 dark:border-zinc-800"
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        isActive
                          ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`block text-[10px] font-normal truncate ${
                    isActive ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
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
      <div className="mt-auto pt-4 px-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-200 animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            FastMCP Spec 2025-11-25
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-200" />
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            Streamable HTTP /mcp
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-200" />
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            Alexa APL 2.0 &amp; Lambda
          </span>
        </div>
      </div>
    </aside>
  );
}
