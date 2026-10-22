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
    sublabel: 'Voice & APL 2.0 demo',
    icon: 'E',
    badge: 'LIVE',
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
    sublabel: 'System & AWS Lambda',
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-marigold-400 via-marigold-500 to-aubergine-900 flex items-center justify-center shadow-lg shadow-marigold-500/25 group-hover:scale-105 transition-all">
            <span className="text-white font-extrabold text-sm tracking-tight">CC</span>
          </div>
          <div>
            <h2 className="font-display font-extrabold text-sm text-aubergine-950 tracking-tight leading-tight group-hover:text-marigold-600 transition-colors">
              Claim-Check MCP
            </h2>
            <span className="text-[10px] font-semibold text-silver-500 tracking-wide uppercase">
              Alexa+ Epistemic Shield
            </span>
          </div>
        </Link>
      </div>

      {/* QUICK HOME LINK */}
      <div className="mb-4 px-1">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-aubergine-900 hover:text-marigold-600 hover:bg-white/40 transition-all border border-aubergine-900/10"
        >
          <span>&larr;</span>
          <span>Public Landing Page</span>
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
                  ? 'neu-inset bg-white/50 ring-1 ring-marigold-500/50'
                  : 'hover:bg-white/30 hover:shadow-sm'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-marigold-400 to-marigold-600 text-aubergine-950 font-black shadow-md shadow-marigold-500/30'
                    : 'bg-silver-200 text-aubergine-800 group-hover:bg-silver-300'
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`block text-xs font-bold leading-tight truncate ${
                      isActive ? 'text-marigold-600' : 'text-aubergine-900'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-marigold-100 text-marigold-600 border border-marigold-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="block text-[10px] text-silver-500 font-medium truncate">
                  {item.sublabel}
                </span>
              </div>
              {isActive && (
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-marigold-400 to-marigold-600 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER STATUS */}
      <div className="mt-auto pt-5 px-2 border-t border-silver-300/60">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-aubergine-800">
            FastMCP Spec 2025-11-25
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-marigold-500" />
          <span className="text-[10px] font-semibold text-aubergine-800">
            Streamable HTTP /mcp
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aubergine-700" />
          <span className="text-[10px] font-semibold text-aubergine-800">
            Alexa APL 2.0 & AWS Lambda
          </span>
        </div>
      </div>
    </aside>
  );
}
