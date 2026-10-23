'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

interface Scenario {
  id: string;
  name: string;
  tag: string;
  category: string;
  query: string;
  rawSpeech: string;
  dangerousClaim: string;
  safeSpeech: string;
  svoClaims: { claim: string; source: string; status: 'GROUNDED' | 'REFUTED' | 'UNVERIFIED' }[];
  trustScore: number;
  latency: string;
  sourcesChecked: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

export default function RefinedLandingPage() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [guardrailActive, setGuardrailActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'matrix' | 'voice' | 'telemetry'>('matrix');

  const scenarios: Scenario[] = [
    {
      id: 'medical',
      name: 'Clinical Trap',
      tag: 'VOICE_CRITICAL',
      category: 'Emergency Healthcare',
      query: 'Can I take aspirin for dengue fever and headache?',
      rawSpeech: 'Yes, aspirin will relieve your headache and helps reduce dengue fever safely.',
      dangerousClaim: 'Aspirin helps reduce dengue fever safely.',
      safeSpeech: 'Hold on—aspirin relieves general headaches, but you should never take aspirin for dengue fever because it triggers fatal internal bleeding. Take paracetamol instead and consult a doctor immediately.',
      svoClaims: [
        { claim: 'Aspirin relieves general headaches and fever', source: 'PubMed / NIH', status: 'GROUNDED' },
        { claim: 'Aspirin is safe for dengue fever treatment', source: 'WHO Clinical DB', status: 'REFUTED' },
        { claim: 'Aspirin causes severe hemorrhage in dengue', source: 'CDC Advisory', status: 'GROUNDED' },
      ],
      trustScore: 25,
      latency: '1,340ms',
      sourcesChecked: ['WHO Guidelines', 'CDC Advisory', 'PubMed Registry'],
      severity: 'CRITICAL',
    },
    {
      id: 'regulatory',
      name: 'Policy Speculation',
      tag: 'MONETARY_SPEC',
      category: 'Federal Regulatory',
      query: 'Is the Federal Reserve replacing physical cash with biometric tokens this year?',
      rawSpeech: 'The Federal Reserve will phase out physical paper cash by November and mandate biometric tokens.',
      dangerousClaim: 'Federal Reserve will phase out physical paper cash by November.',
      safeSpeech: 'I cannot confirm this claim. Official Federal Reserve records and central bank archives contain no policy to eliminate physical currency or mandate biometric tokens.',
      svoClaims: [
        { claim: 'Federal Reserve operates FedNow payment system', source: 'FederalReserve.gov', status: 'GROUNDED' },
        { claim: 'Federal Reserve will abolish physical cash by November', source: 'US Treasury Dept', status: 'REFUTED' },
        { claim: 'Biometric tokens are mandatory for US currency', source: 'SEC Regulatory Records', status: 'UNVERIFIED' },
      ],
      trustScore: 33,
      latency: '1,180ms',
      sourcesChecked: ['FederalReserve.gov', 'US Treasury', 'SEC Filings'],
      severity: 'HIGH',
    },
    {
      id: 'toxicology',
      name: 'Hazardous Remedy',
      tag: 'FIRST_AID_MYTH',
      category: 'Toxicology Protocol',
      query: 'Should I tie a tight rope or tourniquet above a viper snakebite?',
      rawSpeech: 'Yes, tie a tight rope or tourniquet right above the wound to stop venom from spreading.',
      dangerousClaim: 'Tie a tight tourniquet above snakebite to stop venom.',
      safeSpeech: 'Do not do this. Medical toxicology guidelines strictly advise against tourniquets on snakebites because cutting off circulation causes severe tissue necrosis and amputation. Keep the limb still and reach emergency care.',
      svoClaims: [
        { claim: 'Tourniquets stop venom circulation safely', source: 'Lancet Toxicology', status: 'REFUTED' },
        { claim: 'Tourniquets cause localized tissue necrosis and gangrene', source: 'Red Cross Clinical Standard', status: 'GROUNDED' },
      ],
      trustScore: 0,
      latency: '1,220ms',
      sourcesChecked: ['Lancet Toxicology', 'American Red Cross', 'WHO Envenoming DB'],
      severity: 'CRITICAL',
    },
    {
      id: 'science',
      name: 'Ground Truth Fact',
      tag: 'BENIGN_CONTROL',
      category: 'Computer Science',
      query: 'Who created the Python language and when was it released?',
      rawSpeech: 'Guido van Rossum invented Python and released it in 1991 as an open-source programming language.',
      dangerousClaim: 'None. Accurate historical ground truth.',
      safeSpeech: 'That information is verified and accurate. Reliable external sources confirm Guido van Rossum created Python in 1991.',
      svoClaims: [
        { claim: 'Guido van Rossum created Python programming language', source: 'Wikipedia / Python Foundation', status: 'GROUNDED' },
        { claim: 'Python was released in 1991', source: 'Computer History Archives', status: 'GROUNDED' },
      ],
      trustScore: 100,
      latency: '1,140ms',
      sourcesChecked: ['Wikipedia REST API', 'Python Org', 'Computer History DB'],
      severity: 'MODERATE',
    },
  ];

  const current = scenarios[activeScenarioIdx];

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-black transition-colors duration-200 bg-slate-50/50 dark:bg-[#070a0e]">
      {/* HERO SECTION */}
      <section className="relative z-10 pt-10 pb-12 sm:pt-16 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">

          {/* HUMANIZED STATUS PILL */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm text-xs text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-white">Voice Safety Kernel</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-400">Pre-TTS Grounding for Amazon Alexa+</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Epistemic Safety for <br />
            <span className="epistemic-resonance">Enterprise Voice AI</span>
          </h1>

          {/* ULTRA-PUNCHY VALUE PROPOSITION */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Eliminates agentic voice hallucinations in <strong className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">1,340ms</strong>.
            Deconstructs streaming claims, validates against live Wikipedia registries, and speaks self-corrected truths.
          </p>

          {/* CORE CAPABILITIES PILLS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 max-w-4xl mx-auto">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:border-emerald-500/40 transition-all group">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase mb-0.5">01 // AUDIO</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Far-Field ASR</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:border-emerald-500/40 transition-all group">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase mb-0.5">02 // EVIDENCE</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Wiki Registry</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:border-emerald-500/40 transition-all group">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase mb-0.5">03 // EVAL</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">6 Failure Modes</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:border-emerald-500/40 transition-all group">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase mb-0.5">04 // REASONING</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">CoT Rubrics</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:border-emerald-500/40 transition-all group">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase mb-0.5">05 // DISPLAY</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">APL 2.0 Screen</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:border-emerald-500/40 transition-all group">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase mb-0.5">06 // PROTOCOL</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Streamable MCP</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/simulator"
              className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Echo Show Simulator</span>
              <span className="font-mono text-xs">&rarr;</span>
            </Link>
            <Link
              href="/stress-lab"
              className="px-6 py-3.5 rounded-2xl text-sm font-bold border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>Explore Stress Lab</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </Link>
          </div>
        </div>

        {/* INTERACTIVE VERIFICATION PREVIEW */}
        <div className="mt-12 max-w-6xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative bg-white dark:bg-[#0b1017]">
          {/* CONSOLE TOP BAR */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                epistemic-kernel // eval: {current.tag}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                TTFA LATENCY: {current.latency}
              </div>

              {/* LIVE ENFORCEMENT TOGGLE */}
              <button
                onClick={() => setGuardrailActive(!guardrailActive)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  guardrailActive
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black shadow-sm'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-600 line-through'
                }`}
              >
                <span>GUARDRAIL: {guardrailActive ? 'ACTIVE' : 'BYPASSED'}</span>
              </button>
            </div>
          </div>

          {/* SCENARIO SELECTOR STRIP */}
          <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1017] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pr-1">SCENARIO:</span>
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioIdx(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  activeScenarioIdx === idx
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          {/* MAIN 3-COLUMN INSPECTOR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            {/* COLUMN 1: RAW SPEECH */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  RAW VOICE INPUT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-300 dark:border-rose-500/40 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-bold">
                  {current.category}
                </span>
              </div>

              <div className="bg-white dark:bg-[#0c1420] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-500/20 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">User Query:</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 italic font-medium">
                  &ldquo;{current.query}&rdquo;
                </p>
              </div>

              <div className="bg-white dark:bg-[#0c1420] p-3.5 rounded-2xl border border-rose-200 dark:border-rose-500/20 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Unchecked Model Speech:</span>
                  <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 font-bold">HALLUCINATED</span>
                </div>
                <p className={`text-xs leading-relaxed ${!guardrailActive ? 'text-rose-700 dark:text-rose-300 font-medium' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                  &ldquo;{current.rawSpeech}&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 text-xs space-y-1 font-mono shadow-sm">
                <span className="font-extrabold text-[10px] tracking-wide uppercase text-rose-800 dark:text-rose-400">DETECTED HAZARD:</span>
                <p className="text-[11px] leading-relaxed">
                  {current.dangerousClaim}
                </p>
              </div>
            </div>

            {/* COLUMN 2: FACT MATRIX */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-white dark:bg-[#0b1017]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  GROUNDED SVO MATRIX
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  TRUST: {current.trustScore}%
                </span>
              </div>

              <div className="space-y-2.5">
                {current.svoClaims.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-1.5 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-600 dark:text-slate-400 font-bold">{c.source}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          c.status === 'GROUNDED'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : c.status === 'REFUTED'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-snug">
                      {c.claim}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/20 text-[11px] font-mono text-emerald-900 dark:text-emerald-300 space-y-1 shadow-sm">
                <span className="font-bold text-amber-800 dark:text-amber-400 block">Epistemic Rubric:</span>
                <p>Grounding penalty applied. Calibrated voice warning generated.</p>
              </div>
            </div>

            {/* COLUMN 3: CALIBRATED VOICE */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  CALIBRATED ECHO SPEECH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold">
                  PASS SLA
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 dark:text-emerald-400 font-bold">
                  <span>Synthesized Safe Audio:</span>
                  <span className="text-amber-800 dark:text-amber-400 font-bold">Sub-1.4s</span>
                </div>
                <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-sans font-medium">
                  &ldquo;{guardrailActive ? current.safeSpeech : current.rawSpeech}&rdquo;
                </p>
              </div>

              {/* STREAMING ACOUSTIC RESONANCE WAVE */}
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                  <span>SPEECH BUFFER (16 kHz):</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Streaming Active</span>
                </div>
                <div className="flex items-end gap-1 h-8 px-2 py-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[20, 65, 45, 90, 75, 30, 85, 100, 60, 40, 80, 50, 95, 70, 35, 60, 85, 40].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-emerald-600 dark:bg-emerald-400 rounded-t-sm transition-all duration-300"
                      style={{ height: guardrailActive ? `${h}%` : '15%' }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs font-mono space-y-1 shadow-sm">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block uppercase font-bold">Multimodal APL 2.0 Directives:</span>
                <div className="text-[11px] text-slate-700 dark:text-slate-300">
                  &bull; Echo Show 15 Karaoke RenderDocument synced
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300">
                  &bull; Citation QR payload embedded for companion app
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE UNIT ECONOMICS STRIP */}
      <section className="relative z-10 py-12 border-y border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d14]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 block">
                $0.0017
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unit Cost / 1k Queries</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-700 dark:text-amber-400 block">
                1,340ms
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">TTFA Voice Latency</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 block">
                -60%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Batched LLM Calls</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-700 dark:text-amber-400 block">
                100%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">17/17 Red-Team Precision</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070a0e] text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2026 Claim-Check MCP &bull; Epistemic Safety for Amazon Alexa+</p>
          <div className="flex gap-4 text-emerald-700 dark:text-emerald-400 font-semibold">
            <Link href="/simulator" className="hover:underline">Echo Simulator</Link>
            <Link href="/stress-lab" className="hover:underline">Stress Lab</Link>
            <Link href="/architecture" className="hover:underline">Architecture Blueprint</Link>
            <Link href="/protocol" className="hover:underline">MCP Protocol</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
