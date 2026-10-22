'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // If on landing page ('/'), DO NOT SHOW SIDEBAR! Full width immersive landing page!
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#09090b]">{children}</div>;
  }

  // Inside internal app pages (/simulator, /stress-lab, /protocol, /architecture):
  return (
    <div className="flex min-h-screen w-full relative bg-[#f1f5f9] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* COLLAPSIBLE SIDEBAR */}
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 z-40 ${
          isSidebarOpen ? 'w-[260px]' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* MAIN APPLICATION CONTAINER WITH TOP HAMBURGER HEADER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-4 py-3 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 glass-panel sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            {/* HAMBURGER TOGGLE BUTTON */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-9 h-9 rounded-xl neu-raised-sm flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer border border-white/80 dark:border-white/10"
              title={isSidebarOpen ? 'Hide Navigation' : 'Show Navigation'}
              aria-label="Toggle navigation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-zinc-950 dark:text-white tracking-tight">
                  Claim-Check MCP
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Epistemic Safety
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                Live Grounding Engine • FastMCP 2025-11-25
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl text-xs font-bold neu-button flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 border border-white/80 dark:border-white/10 shadow-sm"
            >
              <span className="text-cyan-500">&larr;</span>
              <span>Overview</span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
