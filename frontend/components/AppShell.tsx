'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // If on landing page ('/'), DO NOT SHOW SIDEBAR! Full width immersive landing page!
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return <div className="min-h-screen w-full bg-transparent">{children}</div>;
  }

  // Inside internal app pages (/simulator, /stress-lab, /protocol, /architecture):
  return (
    <div className="flex min-h-screen w-full relative bg-transparent">
      {/* COLLAPSIBLE SIDEBAR */}
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 z-40 border-r border-aubergine-900/10 ${
          isSidebarOpen ? 'w-[260px]' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* MAIN APPLICATION CONTAINER WITH TOP HAMBURGER HEADER */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-4 py-3 flex items-center justify-between border-b border-aubergine-900/10 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* HAMBURGER TOGGLE BUTTON */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="neu-button w-10 h-10 rounded-xl flex items-center justify-center text-aubergine-900 hover:text-marigold-600 transition-all cursor-pointer"
              title={isSidebarOpen ? 'Hide Navigation' : 'Show Navigation'}
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-sm text-aubergine-950 tracking-tight">
                  Claim-Check MCP
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-marigold-100 text-marigold-600 border border-marigold-300">
                  Alexa+ Guardrail
                </span>
              </div>
              <span className="text-[10px] text-silver-700 font-medium hidden sm:inline">
                Epistemic Safety Engine • Sub-1.4s Voice SLA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="neu-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-aubergine-900 hover:text-marigold-600 transition-colors flex items-center gap-1.5"
            >
              <span>&larr;</span>
              <span>Overview</span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
