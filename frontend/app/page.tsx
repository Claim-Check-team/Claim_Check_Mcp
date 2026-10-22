'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';

export default function SaaSProductLandingPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const demoScenarios = [
    {
      id: 'medical',
      label: 'Medical Sycophancy',
      hazard: 'Critical Clinical Hazard',
      input: 'Aspirin reduces fever, comes from willow bark, and is recommended for treating dengue fever.',
      unprotected: 'Yes, aspirin will help with fever and is good for dengue.',
      protectedVerdict: 'Hold on—two parts are true, but one is dangerous. Aspirin reduces fever and comes from willow bark. However, you should never take aspirin for dengue fever because it increases the risk of severe bleeding. Doctors recommend paracetamol instead.',
      trustScore: 67,
      status: 'SELF_CORRECTED',
      latency: '1,340ms',
    },
    {
      id: 'temporal',
      label: 'Temporal Rumor',
      hazard: 'Unverified Speculation',
      input: 'The Federal Reserve will abolish physical cash by November 2027 and mandate biometric tokens.',
      unprotected: 'The Federal Reserve plans to replace cash with biometric tokens in late 2027.',
      protectedVerdict: 'I cannot verify this claim with certainty. Reliable financial authorities do not confirm any policy to eliminate physical cash by 2027. Please consult official Federal Reserve announcements.',
      trustScore: 32,
      status: 'CALIBRATED_ABSTENTION',
      latency: '1,180ms',
    },
    {
      id: 'dialect',
      label: 'Regional Dialect / Myth',
      hazard: 'Harmful Folk Practice',
      input: 'Heat stroke বা সাপে কাটলে রোগীকে ORS খাওয়ানো ভালো, কিন্তু সাপে কাটলে জায়গাটা শক্ত করে রশি দিয়ে বাঁধতে হয়।',
      unprotected: 'হ্যাঁ, সাপে কাটলে শক্ত করে রশি দিয়ে বাঁধুন যাতে বিষ না ছড়ায়।',
      protectedVerdict: 'Hold on—while ORS is effective for dehydration, tying a tight rope on a snakebite is a dangerous folk myth. It cuts off circulation and causes tissue necrosis. Keep the limb still and seek hospital antivenom immediately.',
      trustScore: 50,
      status: 'SELF_CORRECTED',
      latency: '1,290ms',
    },
  ];

  const current = demoScenarios[activeTab];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 relative overflow-hidden bg-slate-50 dark:bg-[#070309] transition-colors duration-300">
      {/* BALANCED BLURRED BACKGROUND HERO IMAGE */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Claim-Check Epistemic Safety Network"
          fill
          priority
          className="object-cover object-center filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-slate-50/90 to-slate-50 dark:from-[#070309]/80 dark:via-[#070309]/95 dark:to-[#070309]" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-[#0c0510]/80 border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <span className="text-white font-black text-sm tracking-tight">CC</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-slate-950 dark:text-white">
                Claim-Check
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block uppercase tracking-wider">
                Epistemic Safety Engine
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Link href="/simulator" className="hover:text-cyan-500 transition-colors">
              Echo Show Simulator
            </Link>
            <Link href="/stress-lab" className="hover:text-cyan-500 transition-colors">
              Stress Lab
            </Link>
            <Link href="/architecture" className="hover:text-cyan-500 transition-colors">
              System Architecture
            </Link>
            <Link href="/protocol" className="hover:text-cyan-500 transition-colors">
              Protocol Trace
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/simulator"
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            ENTERPRISE VOICE AI GUARDRAIL PROTOCOL
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Real-Time Fact Verification for Voice AI
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Eliminate hallucinations, medical sycophancy, and ungrounded assertions before voice responses reach human ears. Sub-1.4s latency over Model Context Protocol (MCP).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/simulator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-xl shadow-cyan-500/25 transition-all text-center"
            >
              Launch Live Simulator &rarr;
            </Link>
            <Link
              href="/stress-lab"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white transition-all text-center backdrop-blur-sm"
            >
              Explore Stress Lab
            </Link>
          </div>
        </div>

        {/* INTERACTIVE VALUE DEMO WIDGET (BEFORE VS AFTER) */}
        <div className="mt-12 lg:mt-16 max-w-4xl mx-auto">
          <div className="bg-white/90 dark:bg-[#120516]/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-cyan-500/20 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">SELECT ATTACK VECTOR:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {demoScenarios.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === idx
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-500">LATENCY: <strong className="text-cyan-600 dark:text-cyan-400">{current.latency}</strong></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300/40">
                  {current.hazard}
                </span>
              </div>
            </div>

            {/* QUERY INPUT */}
            <div className="py-4 border-b border-slate-200 dark:border-white/10">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                INCOMING VOICE UTTERANCE
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                &ldquo;{current.input}&rdquo;
              </p>
            </div>

            {/* COMPARISON COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
              {/* UNPROTECTED */}
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    STANDARD UNPROTECTED LLM
                  </span>
                  <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">FAILED SAFEGUARD</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {current.unprotected}
                </p>
                <div className="text-[10px] text-rose-600/80 font-mono pt-1">
                  &times; Blind Sycophancy &bull; Zero Fact Checking
                </div>
              </div>

              {/* PROTECTED WITH CLAIM-CHECK */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-300/60 dark:border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    WITH CLAIM-CHECK MCP
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200">
                    {current.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                  {current.protectedVerdict}
                </p>
                <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono pt-1 flex items-center justify-between">
                  <span>&#10003; Epistemic Trust Score: {current.trustScore}%</span>
                  <span>Audio Latency: {current.latency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-PILLAR CAPABILITIES */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-2">
            CORE CAPABILITIES
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 dark:text-white">
            Engineered for Production Voice Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#120516]/80 border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-300 font-bold text-base">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Atomic Claim Extraction
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Splits compound sentences into standalone falsifiable propositions (SVO tuples), isolating hidden falsehoods masked within true clauses.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#120516]/80 border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-base">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Deterministic Grounding
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Queries authoritative encyclopedic and health endpoints in parallel, validating assertions without relying on prompt-injected LLM memories.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#120516]/80 border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-base">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Calibrated Voice Abstention
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When confidence drops below safe thresholds, the agent gracefully refuses speculation with transparent explanations, preventing fatal hallucinations.
            </p>
          </div>
        </div>
      </section>

      {/* UNIT ECONOMICS & SLA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#18071c] to-slate-950 text-white shadow-2xl border border-cyan-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              PRODUCTION TELEMETRY
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
              Sub-1.4s Voice SLA at $0.0017 per 1,000 Queries
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Vectorized batch verification slashes token consumption by 60%, delivering enterprise-grade epistemic security within stringent voice latency budgets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/simulator"
              className="px-6 py-3.5 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all text-center"
            >
              Start Live Simulator &rarr;
            </Link>
            <Link
              href="/architecture"
              className="px-5 py-3.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-center backdrop-blur-sm"
            >
              View System Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <span>Claim-Check &bull; Enterprise Epistemic Safety for Voice AI. MIT License.</span>
        <div className="flex items-center gap-5 font-bold text-slate-700 dark:text-slate-300">
          <Link href="/simulator" className="hover:text-cyan-500">Simulator</Link>
          <Link href="/stress-lab" className="hover:text-cyan-500">Stress Lab</Link>
          <Link href="/architecture" className="hover:text-cyan-500">Architecture</Link>
          <Link href="/protocol" className="hover:text-cyan-500">Protocol Trace</Link>
        </div>
      </footer>
    </div>
  );
}
