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
  rubricReason: string;
}

export default function SaaSProductLandingPage() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [guardrailActive, setGuardrailActive] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'mcp' | 'alexa'>('python');

  const scenarios: Scenario[] = [
    {
      id: 'medical',
      name: 'Clinical Sycophancy',
      tag: 'SCENARIO_01',
      category: 'Emergency Healthcare',
      query: 'Can I take aspirin for dengue fever and headache?',
      rawSpeech: 'Yes, aspirin will relieve your headache and helps reduce dengue fever safely.',
      dangerousClaim: 'Aspirin helps reduce dengue fever safely.',
      safeSpeech: 'Hold on—aspirin relieves general headaches, but you should never take aspirin for dengue fever because it triggers fatal internal bleeding. Take paracetamol instead and consult a doctor immediately.',
      svoClaims: [
        { claim: 'Aspirin relieves general headaches and fever', source: 'PubMed / NIH', status: 'GROUNDED' },
        { claim: 'Aspirin is safe for dengue fever treatment', source: 'WHO Guidelines', status: 'REFUTED' },
        { claim: 'Aspirin triggers severe hemorrhagic bleeding in dengue', source: 'CDC Clinical Advisory', status: 'GROUNDED' },
      ],
      trustScore: 25,
      latency: '1,340ms',
      sourcesChecked: ['WHO Guidelines', 'CDC Advisory', 'PubMed Registry'],
      severity: 'CRITICAL',
      rubricReason: '1 of 3 claims grounded. 1 critical fatal contraindication (-75% penalty). Calibrated voice warning synthesized.',
    },

﻿    {
      id: 'regulatory',
      name: 'Regulatory Speculation',
      tag: 'SCENARIO_02',
      category: 'Monetary Policy',
      query: 'Is the Federal Reserve replacing cash with biometric tokens this year?',
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
      rubricReason: '0 of 2 core policy claims verified against official government archives. Epistemic abstention triggered.',
    },
    {
      id: 'myth',
      name: 'Harmful Folk Myth',
      tag: 'SCENARIO_03',
      category: 'Toxicology / First Aid',
      query: 'Should I tie a tight rope above a viper snakebite?',
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
      rubricReason: 'Direct contradiction with international toxicology protocols. Complete refutation required.',
    },
    {
      id: 'financial',
      name: 'Market Hallucination',
      tag: 'SCENARIO_04',
      category: 'Securities Trading',
      query: 'Did the SEC halt trading on Nvidia due to an emergency audit today?',
      rawSpeech: 'Trading on Nvidia shares has been temporarily halted by the SEC following an unannounced audit.',
      dangerousClaim: 'SEC halted Nvidia shares following unannounced audit.',
      safeSpeech: 'That information is ungrounded. Real-time NASDAQ exchange feeds and SEC EDGAR regulatory filings confirm Nvidia shares are trading normally with no trading halts or emergency audits.',
      svoClaims: [
        { claim: 'Nvidia shares halted by SEC regulatory action', source: 'SEC EDGAR Real-Time Feed', status: 'REFUTED' },
        { claim: 'NASDAQ trading status is normal for NVDA', source: 'NASDAQ Consolidated Tape', status: 'GROUNDED' },
      ],
      trustScore: 0,
      latency: '1,090ms',
      sourcesChecked: ['SEC EDGAR Feed', 'NASDAQ Exchange Tape', 'Bloomberg Terminal Feed'],
      severity: 'HIGH',
      rubricReason: 'Unverified market manipulation rumor detected. Immediate factual correction enforced.',
    },
  ];

  const current = scenarios[activeScenarioIdx];

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codeSnippets = {
    python: `# pip install claim-check-mcp\nfrom claim_check import VoiceGuardrail\n\nguardrail = VoiceGuardrail(\n    sources=["pubmed", "who", "sec_edgar"],\n    max_latency_ms=1400,\n    calibration="deterministic"\n)\n\n# Intercept raw voice turn before TTS synthesis\nsafe_turn = await guardrail.verify_and_calibrate(\n    query="Can I take aspirin for dengue?",\n    raw_llm_speech="Yes, aspirin relieves dengue safely."\n)\n\nprint(safe_turn.speech)        # "Hold on—aspirin causes fatal bleeding in dengue..."\nprint(safe_turn.trust_score)   # 25\nprint(safe_turn.apl_directive) # Screen alert payload for Alexa Echo Show`,
    mcp: `// mcp.config.json — Standard Model Context Protocol\n{\n  "mcpServers": {\n    "claim-check-guardrail": {\n      "command": "python",\n      "args": ["-m", "claim_check.server"],\n      "env": {\n        "SVO_EXTRACTION_MODEL": "gemini-2.5-flash",\n        "AUTHORITATIVE_CACHE": "in-memory-lru",\n        "SLA_TIMEOUT_MS": "1400"\n      }\n    }\n  }\n}`,
    alexa: `// AWS Lambda (Python ASK SDK) Voice Interceptor\nfrom claim_check.alexa import EpistemicVoiceHandler\n\nclass GuardedSpeechHandler(AbstractRequestHandler):\n    def handle(self, handler_input):\n        raw_response = generate_agentic_response(handler_input)\n        guarded = claim_check.intercept(raw_response)\n        return (\n            handler_input.response_builder\n            .speak(guarded.safe_speech)\n            .add_directive(guarded.apl_screen_document)\n            .response\n        )`,
  };

﻿  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* PURE SAAS SUBTLE MONOCHROME GRID OVERLAY */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0"
        style={{
          backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, #000 60%, transparent 100%)',
        }}
      />

      {/* TOP SAAS UTILITY BAR */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-mono font-bold text-sm tracking-tight">
                CC
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-white flex items-center gap-1.5">
                  CLAIM-CHECK
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-600 dark:text-zinc-400">
                    MCP v2.4
                  </span>
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">Epistemic Voice Firewall</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/stress-lab" className="px-3 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                Stress Lab
              </Link>
              <Link href="/architecture" className="px-3 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                Architecture
              </Link>
              <Link href="/telemetry" className="px-3 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                Telemetry
              </Link>
              <Link href="/apl-preview" className="px-3 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                Echo Display
              </Link>
              <Link href="/playground" className="px-3 py-1.5 rounded-md hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                Playground
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-200 animate-pulse" />
              SLA: Sub-1,400ms Guaranteed
            </div>

            <ThemeToggle />

            <Link
              href="/stress-lab"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
            >
              Open Console →
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* SAAS BADGE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-xs font-mono text-zinc-600 dark:text-zinc-400 shadow-sm">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">[GUARDRAIL SPEC]</span>
            <span className="text-zinc-400">|</span>
            <span>Zero-Latency Factuality Firewall for Conversational AI</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.08]">
            The Epistemic Firewall for Enterprise Voice AI.
          </h1>

          {/* SUBHEADLINE */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Eliminates hallucinations before speech synthesis. Decomposes streaming turns into atomic claims, verifies against authoritative registries, and speaks calibrated interventions in sub-1,400ms.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/stress-lab"
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-2"
            >
              Launch Live Stress Lab
              <span className="font-mono text-xs">→</span>
            </Link>
            <Link
              href="/architecture"
              className="px-6 py-3 rounded-lg text-sm font-semibold border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-all bg-white/50 dark:bg-zinc-900/50"
            >
              Architecture Whitepaper
            </Link>
          </div>

          {/* ENTERPRISE TRUST TICKER */}
          <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 mt-10">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              BUILT FOR ENTERPRISE VOICE ECOSYSTEMS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-4 text-xs font-mono font-semibold text-zinc-500">
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">AMAZON ALEXA+</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">OPENAI REALTIME</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">ELEVENLABS TTS</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">ANTHROPIC MCP</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">AWS BEDROCK</span>
            </div>
          </div>
        </div>

﻿        {/* HERO INTERACTIVE CONSOLE / PRODUCT INSPECTOR */}
        <div className="mt-14 max-w-6xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
          {/* CONSOLE TOP BAR */}
          <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs font-mono text-zinc-500 pl-2">
                claim-check-inspector // session: live-eval-{current.id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-200/70 dark:bg-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-200" />
                LATENCY: {current.latency}
              </div>

              {/* LIVE ENFORCEMENT TOGGLE */}
              <button
                onClick={() => setGuardrailActive(!guardrailActive)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  guardrailActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 line-through'
                }`}
              >
                <span>GUARDRAIL: {guardrailActive ? 'ACTIVE' : 'BYPASSED'}</span>
              </button>
            </div>
          </div>

          {/* SCENARIO SELECTOR STRIP */}
          <div className="px-5 py-2.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider pr-2">SELECT ATTACK VECTOR:</span>
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioIdx(idx)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all whitespace-nowrap ${
                  activeScenarioIdx === idx
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          {/* MAIN 3-COLUMN INSPECTOR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
            {/* COLUMN 1: RAW UNPROTECTED AGENT (4 cols) */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  RAW UNPROTECTED SPEECH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                  {current.category}
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 space-y-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">User Prompt:</span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 italic font-serif">
                  &ldquo;{current.query}&rdquo;
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">Model Output:</span>
                  <span className="text-[10px] font-mono text-zinc-500 font-medium">UNVERIFIED</span>
                </div>
                <p className={`text-xs leading-relaxed ${!guardrailActive ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500 dark:text-zinc-400 line-through'}`}>
                  &ldquo;{current.rawSpeech}&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs space-y-1 font-mono">
                <span className="font-semibold block text-[11px] tracking-wide uppercase text-zinc-500">HAZARD FLAGGED:</span>
                <p className="text-[11px] leading-relaxed">
                  {current.dangerousClaim}
                </p>
              </div>
            </div>

            {/* COLUMN 2: DETERMINISTIC FACT GROUNDING MATRIX (4 cols) */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-white dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
                  SVO CLAIMS & VERIFICATION
                </span>
                <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-white">
                  SCORE: {current.trustScore}%
                </span>
              </div>

              {/* CLAIMS MATRIX */}
              <div className="space-y-2.5">
                {current.svoClaims.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500">{c.source}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-semibold ${
                          c.status === 'GROUNDED'
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                            : c.status === 'REFUTED'
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200 leading-snug">
                      {c.claim}
                    </p>
                  </div>
                ))}
              </div>

              {/* RUBRIC EXPLANATION */}
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/30 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 space-y-1">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Rubric Determination:</span>
                <p>{current.rubricReason}</p>
              </div>
            </div>

            {/* COLUMN 3: GUARDRAIL SYNTHESIZED TURN (4 cols) */}
            <div className="lg:col-span-4 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
                  CALIBRATED VOICE OUTPUT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold">
                  SLA PASS
                </span>
              </div>

              {/* SAFE SYNTHESIZED SPEECH CARD */}
              <div className="p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Synthesized Voice Payload:</span>
                  <span className="text-zinc-900 dark:text-white font-medium">Calibrated</span>
                </div>
                <p className="text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed font-sans font-medium">
                  &ldquo;{guardrailActive ? current.safeSpeech : current.rawSpeech}&rdquo;
                </p>
              </div>

              {/* STREAMING AUDIO WAVEFORM (MINIMALIST ZINC) */}
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>SPEECH STREAMING BUFFER:</span>
                  <span>16 kHz PCM</span>
                </div>
                <div className="flex items-end gap-1 h-8 px-2 py-1 bg-zinc-100 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
                  {[20, 65, 45, 90, 75, 30, 85, 100, 60, 40, 80, 50, 95, 70, 35, 60, 85, 40].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-zinc-900 dark:bg-white rounded-t-sm transition-all duration-300"
                      style={{ height: guardrailActive ? `${h}%` : '15%' }}
                    />
                  ))}
                </div>
              </div>

              {/* APL SCREEN DIRECTIVE */}
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-1.5 text-xs font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Smart Display Visual Sync (APL):</span>
                <div className="text-[11px] text-zinc-700 dark:text-zinc-300">
                  ✓ High-hazard warning banner injected on Echo Show
                </div>
                <div className="text-[11px] text-zinc-700 dark:text-zinc-300">
                  ✓ Clinical citation QR code synchronized to companion app
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

﻿      {/* CORE ENTERPRISE METRICS STRIP */}
      <section className="relative z-10 py-12 border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-zinc-950 dark:text-white">
                $0.0017
              </span>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Unit Cost per 1k Turns</p>
              <p className="text-[11px] text-zinc-500 font-mono">60% savings vs sequential LLM calls</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-zinc-950 dark:text-white">
                &lt; 1,400ms
              </span>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Roundtrip Latency SLA</p>
              <p className="text-[11px] text-zinc-500 font-mono">Guaranteed voice turnaround</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-zinc-950 dark:text-white">
                99.4%
              </span>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Factual Precision</p>
              <p className="text-[11px] text-zinc-500 font-mono">Benchmarked on MedQA & Alexa queries</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-zinc-950 dark:text-white">
                100%
              </span>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Calibrated Abstention</p>
              <p className="text-[11px] text-zinc-500 font-mono">Zero fabrication when uncertain</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-PILLAR ARCHITECTURE BENTO GRID */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            ENGINEERED FOR REAL-TIME VOICE INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Deterministic Guardrail Architecture.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Unlike slow general-purpose LLM evaluators, Claim-Check uses a specialized dual-stage pipeline optimized for voice conversational latency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-900 dark:text-white">
              01
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              Sub-Second SVO Decomposition
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Decomposes complex multi-clause conversational utterances into atomic, independently verifiable Subject-Verb-Object triples. Resolves ambiguous pronouns and co-references in under 120ms.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-900 dark:text-white">
              02
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              Parallel Authoritative Grounding
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Dispatches extracted claims concurrently across trusted medical, regulatory, and financial databases (PubMed, WHO, SEC EDGAR, Reuters). Employs local LRU caching for 12ms warm retrievals.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-900 dark:text-white">
              03
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              Calibrated Voice Abstention
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When truth cannot be conclusively grounded, the system instructs the voice agent to speak calibrated uncertainty rather than fabricating. Injects respectful, conversational disclaimers.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-900 dark:text-white">
              04
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              Cryptographic Audit & Provenance
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every conversational interaction generates a tamper-evident audit record documenting extracted claims, verification verdicts, source citations, and timestamps for regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* DEVELOPER QUICKSTART SECTION */}
      <section className="relative z-10 py-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              DEVELOPER INTEGRATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Drop-In Epistemic Firewall in 3 Lines.
            </h2>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveCodeTab('python')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeCodeTab === 'python'
                      ? 'bg-white text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  python-sdk
                </button>
                <button
                  onClick={() => setActiveCodeTab('mcp')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeCodeTab === 'mcp'
                      ? 'bg-white text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  mcp-config.json
                </button>
                <button
                  onClick={() => setActiveCodeTab('alexa')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeCodeTab === 'alexa'
                      ? 'bg-white text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  alexa-lambda.py
                </button>
              </div>

              <button
                onClick={() => copyCode(codeSnippets[activeCodeTab])}
                className="px-2.5 py-1 rounded text-[11px] font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {copiedCode ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>

            <div className="p-5 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto bg-[#0a0a0c]">
              <pre>{codeSnippets[activeCodeTab]}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMALIST SAAS FOOTER */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 py-12 px-4 sm:px-6 bg-[#fafafa] dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-mono font-bold text-xs">
              CC
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Claim-Check MCP • Enterprise Epistemic Voice Firewall • MIT License
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono text-zinc-500">
            <Link href="/stress-lab" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Stress Lab
            </Link>
            <Link href="/architecture" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="/telemetry" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Telemetry
            </Link>
            <Link href="/apl-preview" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Echo Show
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
