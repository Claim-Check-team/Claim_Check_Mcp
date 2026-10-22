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
    <div className="flex min-h-screen w-full relative bg-[#fafafa] dark:bg-[#09090b]">
      {/* COLLAPSIBLE SIDEBAR */}
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 z-40 border-r border-zinc-200 dark:border-zinc-800 ${
          isSidebarOpen ? 'w-[260px]' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* MAIN APPLICATION CONTAINER WITH TOP HAMBURGER HEADER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            {/* HAMBURGER TOGGLE BUTTON */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer"
              title={isSidebarOpen ? 'Hide Navigation' : 'Show Navigation'}
              aria-label="Toggle navigation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-zinc-950 dark:text-white tracking-tight">
                  Claim-Check
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-850">
                  Enterprise Guardrail
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                Voice Epistemic Safety • Sub-1,400ms SLA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <span>&larr;</span>
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
