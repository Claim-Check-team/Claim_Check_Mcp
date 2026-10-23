'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <button
        className={`neu-button w-10 h-10 rounded-xl flex items-center justify-center text-aubergine-900 ${className}`}
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4 rounded-full bg-silver-300 opacity-50" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`neu-button h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer select-none group border border-aubergine-900/10 hover:border-cyan-400/40 ${
        isDark
          ? 'text-cyan-300 hover:text-cyan-200 bg-aubergine-900/40'
          : 'text-aubergine-900 hover:text-cyan-600 bg-white/50'
      } ${className}`}
      title={isDark ? 'Switch to Silver Light Mode' : 'Switch to Midnight Dark Mode'}
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <>
          <svg
            className="w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
          <span className="hidden sm:inline text-[11px] font-semibold text-silver-300">Light</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 text-aubergine-800 transition-transform duration-300 group-hover:-rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
          <span className="hidden sm:inline text-[11px] font-semibold text-aubergine-800">Dark</span>
        </>
      )}
    </button>
  );
}
