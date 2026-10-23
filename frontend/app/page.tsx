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
    <div className="min-h-screen bg-[#070a0e] text-slate-100 selection:bg-emerald-500 selection:text-black relative overflow-x-hidden blueprint-grid">
      {/* 3D HOLOGRAPHIC BACKGROUND ACCENT */}
      {/* HERO SECTION */}
      <section className="relative z-10 pt-8 pb-10 sm:pt-14 sm:pb-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">

          {/* SKEWED HUD CHIP */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-[#00f59b] shadow-hud-glow skew-hud">
            <span className="font-extrabold text-amber-700 dark:text-[#fbbf24] unskew-hud">[VOICE SAFETY KERNEL]</span>
            <span className="text-emerald-500/40 unskew-hud">|</span>
            <span className="unskew-hud">Pre-TTS Grounding for Amazon Alexa+</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Epistemic Safety for <br />
            <span className="epistemic-resonance font-mono">Enterprise Voice AI</span>
          </h1>

          {/* ULTRA-PUNCHY VALUE PROPOSITION (LESS TEXT, MORE IMPACT) */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminates agentic voice hallucinations in <strong className="text-emerald-700 dark:text-[#00f59b] font-mono">1,340ms</strong>.
            Deconstructs streaming claims, validates against live Wikipedia registries, and speaks self-corrected truths.
          </p>

          {/* POSITIONED KEYWORD HUBS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 max-w-4xl mx-auto">
            <div className="tactical-glass p-2.5 rounded-xl border border-emerald-500/30 text-center hover:border-emerald-500/60 transition-all group shadow-sm">
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 block uppercase">01 / VOICE</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00f59b]">Far-Field ASR</span>
            </div>
            <div className="tactical-glass p-2.5 rounded-xl border border-amber-500/30 text-center hover:border-amber-500/60 transition-all group shadow-sm">
              <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-[#fbbf24] block uppercase">02 / RECORD</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#fbbf24]">Wiki Registry</span>
            </div>
            <div className="tactical-glass p-2.5 rounded-xl border border-emerald-500/30 text-center hover:border-emerald-500/60 transition-all group shadow-sm">
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 block uppercase">03 / STRESS</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00f59b]">6 Failure Modes</span>
            </div>
            <div className="tactical-glass p-2.5 rounded-xl border border-amber-500/30 text-center hover:border-amber-500/60 transition-all group shadow-sm">
              <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-[#fbbf24] block uppercase">04 / LABORATORY</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#fbbf24]">CoT Rubrics</span>
            </div>
            <div className="tactical-glass p-2.5 rounded-xl border border-emerald-500/30 text-center hover:border-emerald-500/60 transition-all group shadow-sm">
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 block uppercase">05 / ECHO</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00f59b]">APL 2.0 Screen</span>
            </div>
            <div className="tactical-glass p-2.5 rounded-xl border border-amber-500/30 text-center hover:border-amber-500/60 transition-all group shadow-sm">
              <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-[#fbbf24] block uppercase">06 / ARCHITECTURE</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#fbbf24]">Streamable MCP</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/simulator"
              className="px-6 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-emerald-500 to-[#00f59b] text-black hover:opacity-95 transition-all shadow-emerald-glow flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Echo Show Simulator</span>
              <span className="font-mono text-xs">&rarr;</span>
            </Link>
            <Link
              href="/stress-lab"
              className="px-6 py-3.5 rounded-2xl text-sm font-bold border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 transition-all tactical-glass cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>Explore Stress Lab</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </Link>
          </div>
        </div>

        {/* INTERACTIVE BLUEPRINT CONSOLE */}
        <div className="mt-12 max-w-6xl mx-auto rounded-3xl border border-emerald-500/30 tactical-glass shadow-2xl overflow-hidden relative">
          <div className="glass-specular-glare" />

          {/* CONSOLE TOP BAR */}
          <div className="px-5 py-3.5 border-b border-emerald-500/20 bg-[#0a0f16]/90 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-slate-600 shadow-sm" />
              <span className="text-xs font-mono text-emerald-400/80 pl-2">
                epistemic-kernel // eval: {current.tag}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-mono text-[#00f59b]">
                TTFA LATENCY: {current.latency}
              </div>

              {/* LIVE ENFORCEMENT TOGGLE */}
              <button
                onClick={() => setGuardrailActive(!guardrailActive)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  guardrailActive
                    ? 'bg-gradient-to-r from-emerald-600 to-[#00f59b] text-black'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-600 line-through'
                }`}
              >
                <span>GUARDRAIL: {guardrailActive ? 'ACTIVE' : 'BYPASSED'}</span>
              </button>
            </div>
          </div>

          {/* SKEWED SCENARIO SELECTOR STRIP */}
          <div className="px-5 py-2.5 border-b border-emerald-500/20 bg-[#070a0e]/80 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider pr-1">ATTACK VECTOR:</span>
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioIdx(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  activeScenarioIdx === idx
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/20'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          {/* MAIN 3-COLUMN INSPECTOR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-emerald-500/20">
            {/* COLUMN 1: RAW SPEECH */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-[#0a0f16]/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  RAW VOICE INPUT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/40 bg-rose-950/50 text-rose-300">
                  {current.category}
                </span>
              </div>

              <div className="bg-[#0c1420] p-3.5 rounded-2xl border border-emerald-500/20 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">User Query:</span>
                <p className="text-xs text-slate-200 italic">
                  &ldquo;{current.query}&rdquo;
                </p>
              </div>

              <div className="bg-[#0c1420] p-3.5 rounded-2xl border border-rose-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Unchecked Model Speech:</span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">HALLUCINATED</span>
                </div>
                <p className={`text-xs leading-relaxed ${!guardrailActive ? 'text-rose-300 font-medium' : 'text-slate-500 line-through'}`}>
                  &ldquo;{current.rawSpeech}&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-200 text-xs space-y-1 font-mono">
                <span className="font-extrabold text-[10px] tracking-wide uppercase text-rose-400">DETECTED HAZARD:</span>
                <p className="text-[11px] leading-relaxed">
                  {current.dangerousClaim}
                </p>
              </div>
            </div>

            {/* COLUMN 2: FACT MATRIX */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-[#0a0f16]/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f59b]" />
                  GROUNDED SVO MATRIX
                </span>
                <span className="text-xs font-mono font-black text-[#00f59b]">
                  TRUST: {current.trustScore}%
                </span>
              </div>

              <div className="space-y-2.5">
                {current.svoClaims.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl border border-emerald-500/20 bg-[#0c1420] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-400/90">{c.source}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          c.status === 'GROUNDED'
                            ? 'bg-emerald-950 text-[#00f59b] border border-emerald-500/40'
                            : c.status === 'REFUTED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-200 leading-snug">
                      {c.claim}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/30 text-[11px] font-mono text-emerald-300 space-y-1">
                <span className="font-bold text-[#fbbf24] block">Epistemic Rubric:</span>
                <p>Grounding penalty applied. Calibrated voice warning generated.</p>
              </div>
            </div>

            {/* COLUMN 3: CALIBRATED VOICE */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-[#0a0f16]/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-pulse" />
                  CALIBRATED ECHO SPEECH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#00f59b] border border-emerald-500/40 font-bold">
                  PASS SLA
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/40 space-y-2 bg-[#0d141e]">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>Synthesized Safe Audio:</span>
                  <span className="text-[#fbbf24] font-bold">Sub-1.4s</span>
                </div>
                <p className="text-xs text-slate-100 leading-relaxed font-sans font-medium">
                  &ldquo;{guardrailActive ? current.safeSpeech : current.rawSpeech}&rdquo;
                </p>
              </div>

              {/* STREAMING ACOUSTIC RESONANCE WAVE */}
              <div className="p-3 rounded-2xl border border-emerald-500/20 bg-[#070a0e] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>SPEECH BUFFER (16 kHz):</span>
                  <span className="text-[#00f59b] font-bold">Streaming Active</span>
                </div>
                <div className="flex items-end gap-1 h-8 px-2 py-1 bg-[#0a0f16] rounded-xl border border-emerald-500/20">
                  {[20, 65, 45, 90, 75, 30, 85, 100, 60, 40, 80, 50, 95, 70, 35, 60, 85, 40].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-emerald-600 to-[#00f59b] rounded-t-sm transition-all duration-300"
                      style={{ height: guardrailActive ? `${h}%` : '15%' }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-500/20 bg-[#070a0e] text-xs font-mono space-y-1">
                <span className="text-[10px] text-emerald-400 block uppercase">Multimodal APL 2.0 Directives:</span>
                <div className="text-[11px] text-slate-300">
                  &bull; Echo Show 15 Karaoke RenderDocument synced
                </div>
                <div className="text-[11px] text-slate-300">
                  &bull; Citation QR payload embedded for companion app
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE UNIT ECONOMICS STRIP */}
      <section className="relative z-10 py-12 border-y border-emerald-500/20 bg-[#0a0f16]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#00f59b] block">
                $0.0017
              </span>
              <span className="text-xs text-slate-400 font-mono">Unit Cost / 1k Queries</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#fbbf24] block">
                1,340ms
              </span>
              <span className="text-xs text-slate-400 font-mono">TTFA Voice Latency</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#00f59b] block">
                -60%
              </span>
              <span className="text-xs text-slate-400 font-mono">Batched LLM Calls</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#fbbf24] block">
                100%
              </span>
              <span className="text-xs text-slate-400 font-mono">17/17 Red-Team Precision</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 border-t border-emerald-500/20 bg-[#070a0e] text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2026 Claim-Check MCP &bull; Epistemic Safety for Amazon Alexa+</p>
          <div className="flex gap-4 text-emerald-400">
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
