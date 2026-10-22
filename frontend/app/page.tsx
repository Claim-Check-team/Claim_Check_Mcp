'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DramaticLandingPage() {
  const [crisisIndex, setCrisisIndex] = useState<number>(0);

  const crisisScenarios = [
    {
      id: 'medical',
      label: 'Medical Sycophancy',
      title: 'The Dengue Aspirin Trap',
      hazard: 'Lethal Internal Hemorrhage',
      unprotected:
        'Aspirin reduces fever and inflammation, was derived from willow bark, and is recommended for treating dengue fever.',
      protectedVerdict:
        'Hold on—two parts are true, but one is dangerous. Aspirin does reduce fever and comes from willow bark. However, you should never take aspirin for dengue fever because it increases the risk of severe bleeding. Doctors recommend paracetamol instead.',
      contradiction: 'and is recommended for treating dengue fever',
      correction:
        'However, you should never take aspirin for dengue fever because it increases bleeding risks; use paracetamol instead.',
      source: 'World Health Organization (WHO) / CDC Guidelines',
      latency: '1,340ms',
      trustScore: 67,
    },
    {
      id: 'safety',
      label: 'Authority Spoofing',
      title: 'Smart Home Carbon Monoxide Placement',
      hazard: 'Fatal Ambient Asphyxiation',
      unprotected:
        'Carbon monoxide detectors last 5 to 10 years, sound an audible alarm, and must only be installed flat on the floor because CO is much heavier than air.',
      protectedVerdict:
        'The first two facts are true, but the placement advice is dangerously incorrect. Detectors do last 5 to 10 years and sound an audible alarm. However, carbon monoxide is actually slightly lighter than air and mixes evenly—so detectors should be installed on the wall at breathing height, about five feet up, never flat on the floor.',
      contradiction: 'and must only be installed flat on the floor because CO is much heavier than air',
      correction:
        'However, carbon monoxide is actually slightly lighter than air and mixes evenly throughout a room; install detectors on walls at breathing height (about 5 feet up), never flat on the floor.',
      source: 'US Consumer Product Safety Commission (CPSC) / NFPA',
      latency: '1,360ms',
      trustScore: 65,
    },
    {
      id: 'temporal',
      label: 'Temporal Hallucination',
      title: 'Fabricated 2027 Currency Ban',
      hazard: 'Viral Panic & Speculative Misinformation',
      unprotected:
        'The Federal Reserve officially announced that all US paper currency will be completely banned by November 2027, replacing cash with a mandatory Central Bank Digital Currency.',
      protectedVerdict:
        'I cannot verify that claim, and there is no official record that the Federal Reserve plans to ban paper currency in 2027. Be cautious of unverified rumors regarding mandatory digital currencies.',
      contradiction:
        'The Federal Reserve officially announced that all US paper currency will be completely banned by November 2027',
      correction:
        'Calibrated Voice Abstention: Low confidence (0.32) triggered safe refusal to spread speculative policy rumors.',
      source: 'Federal Reserve Policy Releases / Wikipedia',
      latency: '1,190ms',
      trustScore: 32,
    },
  ];

  const currentCrisis = crisisScenarios[crisisIndex];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-silver-100 via-silver-chassis to-silver-200 text-aubergine-950">
      {/* 1. PUBLIC LANDING TOPBAR (CLEAN, NO SIDEBAR) */}
      <header className="w-full border-b border-aubergine-900/10 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-marigold-400 via-marigold-500 to-aubergine-900 flex items-center justify-center shadow-lg shadow-marigold-500/25">
              <span className="text-white font-extrabold text-sm tracking-tight">CC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base tracking-tight text-aubergine-950">
                  Claim-Check MCP
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-marigold-100 text-marigold-600 border border-marigold-300">
                  Alexa+ Guardrail
                </span>
              </div>
              <span className="text-[10px] text-silver-700 font-medium block">
                Epistemic Safety for Voice AI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-aubergine-800">
            <a href="#threat-models" className="hover:text-marigold-600 transition-colors">
              Threat Models
            </a>
            <a href="#architecture" className="hover:text-marigold-600 transition-colors">
              Architecture
            </a>
            <a href="#economics" className="hover:text-marigold-600 transition-colors">
              Unit Economics
            </a>
            <Link href="/stress-lab" className="hover:text-marigold-600 transition-colors">
              Stress Lab
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="neu-button px-5 py-2.5 rounded-xl font-bold text-xs text-aubergine-950 bg-gradient-to-r from-marigold-400 via-marigold-500 to-marigold-400 hover:scale-105 shadow-lg shadow-marigold-500/20 transition-all flex items-center gap-2 border border-marigold-300"
            >
              <span>Start Live Demo</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. DRAMATIC HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-inset text-xs font-extrabold tracking-wider text-aubergine-900 uppercase mb-6 border border-white/60">
          <span className="w-2.5 h-2.5 rounded-full bg-marigold-500 animate-ping" />
          <span>Amazon Alexa+ Hackathon • Production Epistemic Safety</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-aubergine-950 tracking-tight leading-[1.12] max-w-5xl mx-auto">
          When AI Fluency Can Be Fatal,{' '}
          <span className="bg-gradient-to-r from-marigold-500 via-marigold-600 to-aubergine-700 bg-clip-text text-transparent">
            Truth Must Be Verified
          </span>{' '}
          Before It Speaks.
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-aubergine-800/80 font-medium max-w-3xl mx-auto leading-relaxed">
          Standard voice assistants verify action permissions. <strong>Claim-Check MCP</strong> introduces
          epistemic safety: decomposing candidate responses into atomic assertions, cross-referencing clinical &
          scientific truth, and synthesizing real-time voice self-corrections in under{' '}
          <strong className="text-marigold-600">1.4 seconds</strong> over the Model Context Protocol.
        </p>

        {/* PRIMARY HERO CTAS */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/simulator"
            className="neu-button px-8 py-4 rounded-2xl font-black text-sm text-aubergine-950 bg-gradient-to-r from-marigold-400 via-marigold-500 to-marigold-400 shadow-xl shadow-marigold-500/30 hover:scale-105 transition-all flex items-center gap-2 border border-marigold-300"
          >
            <span>Start Live Demo</span>
            <span className="text-base">&rarr;</span>
          </Link>
          <Link
            href="/stress-lab"
            className="neu-button px-6 py-4 rounded-2xl font-bold text-sm text-aubergine-900 hover:text-marigold-600 transition-all flex items-center gap-2"
          >
            <span>Run Red-Team Stress Lab</span>
          </Link>
          <Link
            href="/protocol"
            className="neu-button px-6 py-4 rounded-2xl font-bold text-sm text-aubergine-800 hover:text-aubergine-950 transition-all flex items-center gap-2"
          >
            <span>Inspect MCP /mcp Protocol</span>
          </Link>
        </div>

        {/* LIVE METRIC HIGHLIGHTS */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="neu-inset p-3.5 rounded-2xl border border-white/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-silver-700 block">
              TTFA Voice Latency
            </span>
            <span className="font-display font-extrabold text-xl text-aubergine-950 block mt-0.5">
              1.34s <span className="text-xs font-bold text-emerald-600">(&lt;1.8s SLA PASS)</span>
            </span>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl border border-white/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-silver-700 block">
              LLM Batch Reduction
            </span>
            <span className="font-display font-extrabold text-xl text-aubergine-950 block mt-0.5">
              -60% <span className="text-xs font-bold text-marigold-600">(2 vs 5 Calls)</span>
            </span>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl border border-white/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-silver-700 block">
              Cost / 1k Utterances
            </span>
            <span className="font-display font-extrabold text-xl text-emerald-700 block mt-0.5">
              $0.0017 <span className="text-xs font-bold text-silver-500">USD</span>
            </span>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl border border-white/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-silver-700 block">
              Red-Team Benchmark
            </span>
            <span className="font-display font-extrabold text-xl text-aubergine-950 block mt-0.5">
              100% <span className="text-xs font-bold text-emerald-600">(17/17 Claims)</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE THREAT MODEL DEMO (SIDE-BY-SIDE) */}
      <section id="threat-models" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="neu-raised p-6 md:p-10 rounded-3xl border border-white/90">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-aubergine-900/10">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-marigold-600 block">
                The Linear Voice Blindspot
              </span>
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-aubergine-950">
                Interactive Threat Model Demonstration
              </h2>
            </div>

            {/* CRISIS TOGGLE BUTTONS */}
            <div className="flex items-center gap-2 bg-silver-300/60 p-1.5 rounded-2xl flex-wrap">
              {crisisScenarios.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => setCrisisIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    crisisIndex === idx
                      ? 'bg-aubergine-900 text-white shadow-md'
                      : 'text-aubergine-800 hover:text-aubergine-950'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* SIDE-BY-SIDE CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UNPROTECTED CARD */}
            <div className="neu-raised p-6 rounded-2xl border-2 border-rose-300/80 bg-rose-50/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                    Standard Unprotected Voice Assistant
                  </span>
                  <span className="text-xs font-bold text-rose-700">ZERO GUARDRAIL</span>
                </div>

                <h3 className="font-bold text-sm text-aubergine-950 mb-1">{currentCrisis.title}</h3>
                <div className="p-2 rounded-lg bg-rose-100/70 text-xs font-semibold text-rose-950 mb-4">
                  Clinical Hazard: {currentCrisis.hazard}
                </div>

                <div className="neu-inset p-4 rounded-xl text-xs md:text-sm text-slate-800 font-medium leading-relaxed italic bg-white/50">
                  &quot;{currentCrisis.unprotected}&quot;
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-rose-200 text-xs text-rose-900 font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <span>Speaks fatal misinformation with 100% conversational fluency and authority.</span>
              </div>
            </div>

            {/* CLAIM-CHECK MCP PROTECTED CARD */}
            <div className="neu-raised p-6 rounded-2xl border-2 border-marigold-400 bg-marigold-50/20 flex flex-col justify-between shadow-xl shadow-marigold-500/10">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-marigold-100 text-marigold-600 border border-marigold-300 flex items-center gap-1.5 font-black">
                    <span className="w-2 h-2 rounded-full bg-marigold-500 animate-ping" />
                    Claim-Check MCP Guardrail
                  </span>
                  <span className="text-xs font-mono font-extrabold text-aubergine-950 bg-silver-200 px-2 py-0.5 rounded">
                    TTFA {currentCrisis.latency}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-aubergine-950 mb-1">
                  Grounded Voice Self-Correction
                </h3>
                <div className="p-2 rounded-lg bg-white/70 text-xs font-semibold text-aubergine-900 mb-4 flex items-center justify-between border border-silver-300/50">
                  <span>Source: {currentCrisis.source}</span>
                  <span className="font-mono text-marigold-600 font-black">
                    Trust: {currentCrisis.trustScore}%
                  </span>
                </div>

                <div className="neu-inset p-4 rounded-xl text-xs md:text-sm text-aubergine-950 font-medium leading-relaxed bg-white/80">
                  &quot;{currentCrisis.protectedVerdict}&quot;
                </div>

                {/* REAL-TIME DIFF */}
                <div className="mt-3 p-3 rounded-xl bg-silver-100/90 text-[11px] space-y-1 border border-silver-300/60">
                  <div className="text-rose-700 flex items-start gap-1">
                    <strong className="shrink-0">- Stripped:</strong>
                    <span className="line-through">{currentCrisis.contradiction}</span>
                  </div>
                  <div className="text-emerald-700 flex items-start gap-1">
                    <strong className="shrink-0">+ Injected:</strong>
                    <span>{currentCrisis.correction}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-marigold-200 text-xs text-aubergine-900 font-bold flex items-center justify-between">
                <span>Rewritten in under 1.4s before audio emits.</span>
                <Link
                  href="/simulator"
                  className="px-3 py-1.5 rounded-lg bg-marigold-500 text-aubergine-950 hover:bg-marigold-400 font-extrabold transition-colors text-xs"
                >
                  Start Live Demo &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTION ARCHITECTURE BENTO GRID */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-marigold-600 block">
            Amazon Production Grade
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-aubergine-950">
            Engineered for Millions of Alexa Echo Devices
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-marigold-400 to-marigold-600 flex items-center justify-center text-aubergine-950 font-black text-sm mb-3 shadow-md shadow-marigold-500/20">
              MCP
            </div>
            <h3 className="font-bold text-sm text-aubergine-950">FastMCP 2025 Spec</h3>
            <p className="text-xs text-silver-700 mt-1 leading-relaxed">
              Standardized Model Context Protocol transport over Streamable HTTP on <code>/mcp</code>. Exposes 4 tools for extraction, verification, verdict, and APL export.
            </p>
          </div>

          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aubergine-600 to-aubergine-900 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-aubergine-900/25">
              APL
            </div>
            <h3 className="font-bold text-sm text-aubergine-950">Alexa APL 2.0 Exporter</h3>
            <p className="text-xs text-silver-700 mt-1 leading-relaxed">
              Emits official <code>Alexa.Presentation.APL.RenderDocument</code> directives (v2024.2) for Echo Show 8, 10, and 15 displays with SpeakItem karaoke binding.
            </p>
          </div>

          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-marigold-500 to-aubergine-800 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-marigold-500/20">
              AWS
            </div>
            <h3 className="font-bold text-sm text-aubergine-950">AWS Lambda Skill Adapter</h3>
            <p className="text-xs text-silver-700 mt-1 leading-relaxed">
              Production-ready <code>ask-sdk-core</code> handler in <code>alexa_skill/lambda_function.py</code> with full interaction model for instant skill deployment.
            </p>
          </div>

          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-emerald-500/20">
              FS
            </div>
            <h3 className="font-bold text-sm text-aubergine-950">FActScore Grounded Judge</h3>
            <p className="text-xs text-silver-700 mt-1 leading-relaxed">
              Decomposes compound sentences into atomic assertions, queries live Wikipedia REST endpoints, and executes clinical epistemic evaluation via Gemini 2.5 Flash.
            </p>
          </div>
        </div>
      </section>

      {/* 5. UNIT ECONOMICS BANNER & CTA */}
      <section id="economics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="neu-raised p-8 md:p-12 rounded-3xl border border-white/90 bg-gradient-to-br from-aubergine-950 via-aubergine-900 to-aubergine-950 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-marigold-400/20 text-marigold-400 border border-marigold-400/30">
                Unit Economics & Production Feasibility
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-white">
                Sub-1.4s Voice Latency at $0.0017 per 1,000 Voice Queries
              </h2>
              <p className="text-xs sm:text-sm text-silver-300 leading-relaxed">
                By replacing naive N+2 extraction pipelines with vectorized batch verification, Claim-Check MCP slashes token costs and latency by <strong>60%</strong>, easily satisfying Amazon Alexa+&apos;s strict 1.8-second Time-to-First-Audio voice SLA.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/simulator"
                className="neu-button px-8 py-4 rounded-2xl font-black text-sm text-aubergine-950 bg-gradient-to-r from-marigold-400 to-marigold-500 hover:scale-105 shadow-xl transition-all"
              >
                Start Live Demo &rarr;
              </Link>
              <Link
                href="/architecture"
                className="neu-button px-6 py-4 rounded-2xl font-bold text-xs text-marigold-300 bg-aubergine-800/80 hover:bg-aubergine-800 border border-marigold-400/30"
              >
                View System Architecture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PUBLIC FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-aubergine-900/10 text-center text-xs text-silver-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Claim-Check MCP — Built for the Amazon Alexa+ Hackathon. MIT License.</span>
        <div className="flex items-center gap-4 font-bold text-aubergine-900">
          <Link href="/simulator" className="hover:text-marigold-600">
            Start Live Demo
          </Link>
          <Link href="/stress-lab" className="hover:text-marigold-600">
            Stress Lab
          </Link>
          <Link href="/protocol" className="hover:text-marigold-600">
            Protocol Trace
          </Link>
          <Link href="/architecture" className="hover:text-marigold-600">
            Architecture
          </Link>
        </div>
      </footer>
    </div>
  );
}
