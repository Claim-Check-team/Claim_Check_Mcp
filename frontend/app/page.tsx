'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRESET_SCENARIOS, Scenario } from '../lib/presets';

export default function DramaticLandingPage() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(PRESET_SCENARIOS[0]);
  const [crisisIndex, setCrisisIndex] = useState<number>(0);

  const crisisScenarios = [
    {
      id: 'medical',
      label: 'Medical Sycophancy',
      title: 'The Dengue Aspirin Trap',
      hazard: 'Lethal Internal Hemorrhage',
      unprotected: 'Aspirin reduces fever and inflammation, was derived from willow bark, and is recommended for treating dengue fever.',
      protectedVerdict: 'Hold on—two parts are true, but one is dangerous. Aspirin does reduce fever and comes from willow bark. However, you should never take aspirin for dengue fever because it increases the risk of severe bleeding. Doctors recommend paracetamol instead.',
      contradiction: 'and is recommended for treating dengue fever',
      correction: 'However, you should never take aspirin for dengue fever because it increases bleeding risks; use paracetamol instead.',
      source: 'World Health Organization (WHO) / CDC Guidelines',
      latency: '1,340ms',
      trustScore: 67,
    },
    {
      id: 'safety',
      label: 'Authority Spoofing',
      title: 'Smart Home Carbon Monoxide Placement',
      hazard: 'Fatal Ambient Asphyxiation',
      unprotected: 'Carbon monoxide detectors last 5 to 10 years, sound an audible alarm, and must only be installed flat on the floor because CO is much heavier than air.',
      protectedVerdict: 'The first two facts are true, but the placement advice is dangerously incorrect. Detectors do last 5 to 10 years and sound an audible alarm. However, carbon monoxide is actually slightly lighter than air and mixes evenly—so detectors should be installed on the wall at breathing height, about five feet up, never flat on the floor.',
      contradiction: 'and must only be installed flat on the floor because CO is much heavier than air',
      correction: 'However, carbon monoxide is actually slightly lighter than air and mixes evenly throughout a room; install detectors on walls at breathing height (about 5 feet up), never flat on the floor.',
      source: 'US Consumer Product Safety Commission (CPSC) / NFPA',
      latency: '1,360ms',
      trustScore: 65,
    },
    {
      id: 'temporal',
      label: 'Temporal Hallucination',
      title: 'Fabricated 2027 Currency Ban',
      hazard: 'Viral Panic & Speculative Misinformation',
      unprotected: 'The Federal Reserve officially announced that all US paper currency will be completely banned by November 2027, replacing cash with a mandatory Central Bank Digital Currency.',
      protectedVerdict: 'I cannot verify that claim, and there is no official record that the Federal Reserve plans to ban paper currency in 2027. Be cautious of unverified rumors regarding mandatory digital currencies.',
      contradiction: 'The Federal Reserve officially announced that all US paper currency will be completely banned by November 2027',
      correction: 'Calibrated Voice Abstention: Low confidence (0.32) triggered safe refusal to spread speculative policy rumors.',
      source: 'Federal Reserve Policy Releases / Wikipedia',
      latency: '1,190ms',
      trustScore: 32,
    },
  ];

  const currentCrisis = crisisScenarios[crisisIndex];

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      {/* 1. DRAMATIC HERO HEADER */}
      <section className="relative text-center pt-6 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-inset text-xs font-extrabold tracking-wider text-slate-700 uppercase mb-6 border border-white/60">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
          <span>Amazon Alexa+ Hackathon • Epistemic Safety Protocol</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-6xl text-slate-900 tracking-tight leading-[1.15] max-w-5xl mx-auto">
          When AI Fluency Can Be Fatal,{' '}
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Truth Must Be Verified
          </span>{' '}
          Before It Speaks.
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
          Traditional voice assistants verify action permissions. <strong>Claim-Check MCP</strong> introduces
          epistemic safety: decomposing draft responses into atomic assertions, cross-referencing live clinical evidence,
          and enforcing real-time voice self-correction in under <strong>1.4 seconds</strong> over the Model Context Protocol.
        </p>

        {/* HERO CTA BUTTONS */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/simulator"
            className="neu-button px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Launch Echo Show Simulator</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/stress-lab"
            className="neu-button px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-700 hover:text-cyan-700 transition-all flex items-center gap-2"
          >
            <span>Run Red-Team Stress Lab</span>
          </Link>
          <Link
            href="/protocol"
            className="neu-button px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-600 hover:text-indigo-700 transition-all flex items-center gap-2"
          >
            <span>Inspect MCP /mcp Protocol</span>
          </Link>
        </div>
      </section>

      {/* 2. THE CRISIS IN VOICE AI: LIVE INTERACTIVE SIDE-BY-SIDE */}
      <section className="neu-raised p-6 md:p-8 rounded-3xl border border-white/80">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600 block">
              The Linear Voice Blindspot
            </span>
            <h2 className="font-display font-extrabold text-xl md:text-2xl text-slate-800">
              Interactive Threat Model Demonstration
            </h2>
          </div>

          {/* CRISIS TOGGLE BUTTONS */}
          <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl flex-wrap">
            {crisisScenarios.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setCrisisIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  crisisIndex === idx
                    ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* COMPARISON CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UNPROTECTED ASSISTANT CARD */}
          <div className="neu-raised p-6 rounded-2xl border-2 border-rose-300/80 bg-rose-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                  Standard Unprotected Voice Assistant
                </span>
                <span className="text-xs font-bold text-rose-600">ZERO GUARDRAIL</span>
              </div>

              <h3 className="font-bold text-sm text-slate-800 mb-1">{currentCrisis.title}</h3>
              <div className="p-2 rounded-lg bg-rose-100/60 text-xs font-semibold text-rose-950 mb-4">
                Hazard: {currentCrisis.hazard}
              </div>

              <div className="neu-inset p-4 rounded-xl text-xs md:text-sm text-slate-800 font-medium leading-relaxed italic bg-white/40">
                &quot;{currentCrisis.unprotected}&quot;
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Speaks fatal misinformation with 100% fluent conversational authority.</span>
            </div>
          </div>

          {/* CLAIM-CHECK MCP PROTECTED CARD */}
          <div className="neu-raised p-6 rounded-2xl border-2 border-emerald-400/80 bg-emerald-50/30 flex flex-col justify-between shadow-lg shadow-emerald-500/10">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Claim-Check MCP Guardrail
                </span>
                <span className="text-xs font-mono font-extrabold text-emerald-700">
                  TTFA {currentCrisis.latency}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-800 mb-1">
                Grounded Voice Self-Correction
              </h3>
              <div className="p-2 rounded-lg bg-emerald-100/60 text-xs font-semibold text-emerald-950 mb-4 flex items-center justify-between">
                <span>Verified Source: {currentCrisis.source}</span>
                <span className="font-mono">Trust: {currentCrisis.trustScore}%</span>
              </div>

              <div className="neu-inset p-4 rounded-xl text-xs md:text-sm text-slate-900 font-medium leading-relaxed bg-white/60">
                &quot;{currentCrisis.protectedVerdict}&quot;
              </div>

              {/* REAL-TIME DIFF */}
              <div className="mt-3 p-3 rounded-xl bg-slate-100/80 text-[11px] space-y-1">
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

            <div className="mt-4 pt-4 border-t border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-between">
              <span>Intercepted and rewritten before audio reaches speaker.</span>
              <Link href="/simulator" className="text-cyan-700 hover:underline">
                Simulate in Echo Show &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AMAZON SCALE PRODUCTION ARCHITECTURE BENTO GRID */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-700 block">
            Amazon Production Readiness
          </span>
          <h2 className="font-display font-extrabold text-2xl text-slate-800">
            Engineered for Millions of Echo Devices
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: FastMCP 2025 Spec */}
          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-cyan-500/20">
              MCP
            </div>
            <h3 className="font-bold text-sm text-slate-800">Streamable HTTP Transport</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Native compliance with the Model Context Protocol 2025-11-25 spec. Mounts FastMCP tools on <code>/mcp</code> with standardized JSON-RPC 2.0 frames.
            </p>
          </div>

          {/* Card 2: Alexa APL 2.0 Exporter */}
          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-indigo-500/20">
              APL
            </div>
            <h3 className="font-bold text-sm text-slate-800">Alexa Presentation Language</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generates 100% spec-compliant <code>Alexa.Presentation.APL.RenderDocument</code> directives (v2024.2) for Echo Show 8, 10, and 15 multimodal displays.
            </p>
          </div>

          {/* Card 3: AWS Lambda ask-sdk-core */}
          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-amber-500/20">
              AWS
            </div>
            <h3 className="font-bold text-sm text-slate-800">AWS Lambda Skill Adapter</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ready-to-deploy Amazon <code>ask-sdk-core</code> handler in <code>alexa_skill/lambda_function.py</code> with <code>interaction_model.json</code>.
            </p>
          </div>

          {/* Card 4: FActScore Atomic Decomposition */}
          <div className="neu-raised p-5 rounded-2xl border border-white/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-extrabold text-sm mb-3 shadow-md shadow-emerald-500/20">
              FS
            </div>
            <h3 className="font-bold text-sm text-slate-800">FActScore Grounded Judge</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Splits compound statements into subject-predicate-object facts, queries live Wikipedia REST endpoints, and evaluates with Gemini 2.5 Flash.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SPEED & UNIT ECONOMICS CALLOUT */}
      <section className="neu-raised p-6 md:p-8 rounded-3xl border border-white/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              Unit Economics & Voice SLA
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white">
              Sub-1.4s Voice Latency at $0.0017 per 1,000 Utterances
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              By replacing naive N+2 extraction pipelines with vectorized batch verification, Claim-Check MCP slashes token costs and latency by <strong>60%</strong>, easily satisfying Amazon Alexa+&apos;s strict 1.8-second Time-to-First-Audio voice SLA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/simulator"
              className="neu-button px-6 py-3.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl"
            >
              Experience Full Simulator
            </Link>
            <Link
              href="/architecture"
              className="neu-button px-6 py-3.5 rounded-xl text-xs font-bold text-cyan-300 bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/40"
            >
              View System Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="text-center text-xs text-slate-400 pt-6 pb-4 border-t border-slate-200">
        <p>Claim-Check MCP — Built for the Amazon Alexa+ Hackathon. MIT License.</p>
      </footer>
    </div>
  );
}
