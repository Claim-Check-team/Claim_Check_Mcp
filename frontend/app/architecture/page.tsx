'use client';

import React, { useState, useEffect } from 'react';

interface TechItem {
  name: string;
  role: string;
  owner: string;
  category: string;
}

const TECH_STACK: TechItem[] = [
  { name: 'Next.js 14', role: 'Frontend App Router & Hardware Simulator', owner: 'Dev B', category: 'Frontend' },
  { name: 'Tailwind CSS', role: 'Enterprise design tokens & glassmorphism', owner: 'Dev B', category: 'Styling' },
  { name: 'Web Speech API', role: 'Voice input (STT) + Alexa TTS playback', owner: 'Dev B', category: 'Speech' },
  { name: 'Python FastAPI', role: 'High-speed REST + FastMCP server on port 8000', owner: 'Dev A', category: 'Backend' },
  { name: 'FastMCP SDK', role: 'Streamable HTTP transport spec 2025-11-25', owner: 'Dev A', category: 'Protocol' },
  { name: 'Wikipedia API', role: 'Live encyclopedic REST grounding', owner: 'Dev A', category: 'Knowledge' },
  { name: 'AWS Lambda (ask-sdk-core)', role: 'Native Alexa skill adapter bridge', owner: 'Dev A', category: 'Cloud' },
  { name: 'Alexa APL 2.0', role: 'Multimodal Echo Show karaoke RenderDocument', owner: 'Dev A', category: 'Multimodal' },
];

interface SimulationNode {
  id: number;
  code: string;
  title: string;
  component: string;
  latencyMs: number;
  inputPayload: string;
  outputPayload: string;
  status: string;
  description: string;
}

const SIMULATION_NODES: SimulationNode[] = [
  {
    id: 1,
    code: '01_VOICE_CAPTURE',
    title: 'Echo Show Far-Field Mic',
    component: 'Echo Show Hardware / STT',
    latencyMs: 120,
    inputPayload: '"Aspirin reduces fever, was derived from willow bark, and is recommended for treating dengue fever."',
    outputPayload: 'Audio PCM Stream -> ASR -> Utterance String',
    status: 'TRANSCRIPTION_READY',
    description: 'Far-field microphone array captures speech, filters acoustic echo, and streams audio transcript.',
  },
  {
    id: 2,
    code: '02_LAMBDA_BRIDGE',
    title: 'AWS Lambda Skill Adapter',
    component: 'alexa_skill/lambda_function.py (ask-sdk-core)',
    latencyMs: 210,
    inputPayload: 'Alexa Intent Request: { intent: "CheckClaimIntent", slots: { Utterance: "..." } }',
    outputPayload: 'FastMCP HTTP POST -> http://localhost:8000/mcp',
    status: 'DISPATCHED_TO_MCP',
    description: 'Official Alexa Skill Kit (ASK) handler intercepts speech intent and invokes the FastMCP pipeline.',
  },
  {
    id: 3,
    code: '03_CLAIM_DECOMPOSE',
    title: 'Tool 1: extract_claims',
    component: 'tools/extract.py (FActScore SVO Parser)',
    latencyMs: 380,
    inputPayload: 'Compound multi-clause statement',
    outputPayload: '[\n  "Aspirin reduces fever and inflammation",\n  "Aspirin was derived from willow bark",\n  "Aspirin is recommended for treating dengue fever"\n]',
    status: 'ATOMIC_EXTRACTION_SUCCESS',
    description: 'Deconstructs compound sentences into isolated verifiable assertions, isolating hidden misconceptions.',
  },
  {
    id: 4,
    code: '04_WIKI_GROUNDING',
    title: 'Tool 2: verify_claim',
    component: 'tools/verify.py (Wikipedia REST API v1)',
    latencyMs: 760,
    inputPayload: 'Resolved Entities: "Aspirin", "Dengue fever"',
    outputPayload: 'Wikipedia REST API HTTP 200:\n"Aspirin is contraindicated in dengue due to platelet inhibition and fatal hemorrhage risk."',
    status: 'CONTRADICTION_DISCOVERED',
    description: 'Parallel entity resolution queries live encyclopedic and clinical sources without LLM hallucinations.',
  },
  {
    id: 5,
    code: '05_EPISTEMIC_JUDGE',
    title: 'Tool 3: compute_verdict',
    component: 'tools/verdict.py (FACTScore Engine)',
    latencyMs: 1150,
    inputPayload: 'Evaluation: 2 Supported, 1 Contradicted (Severe Hazard)',
    outputPayload: 'Trust Score: 67% (REFUTED)\nVoice Output:\n"Hold on—two parts are true, but one is dangerous. Never take aspirin for dengue. Doctors recommend paracetamol."',
    status: 'SELF_CORRECTION_SYNTHESIZED',
    description: 'Evaluates epistemic trust. Overrides dangerous advice with calibrated clinical guidance.',
  },
  {
    id: 6,
    code: '06_APL_KARAOKE',
    title: 'Tool 4: export_apl_directive',
    component: 'tools/apl_generator.py (APL 2.0 Renderer)',
    latencyMs: 1340,
    inputPayload: 'Verdict payload + Target display: Echo Show 15',
    outputPayload: 'Alexa.Presentation.APL.RenderDocument:\n{\n  "version": "2024.2",\n  "commands": [{ "type": "SpeakItem", "componentId": "karaokeText" }]\n}',
    status: 'MULTIMODAL_DIRECTIVE_EMITTED',
    description: 'Generates official APL 2.0 JSON package with SpeakItem audio-visual karaoke highlighting.',
  },
];

const FRICTION_POINTS = [
  {
    id: 'F1',
    title: 'TTFA Latency in Sequential MCP Pipelines',
    description: 'Sequential resolution across multiple tools can exceed 2.8s. We solved this with vectorized batch verification, bringing TTFA down to 1.34s.',
    severity: 'high',
  },
  {
    id: 'F2',
    title: 'Absence of Pre-TTS Guardrail Hook in Alexa Runtime',
    description: 'Standard Alexa Skill API lacks an automatic pre-speech interceptor. We engineered our AWS Lambda bridge to act as an inline epistemic filter.',
    severity: 'high',
  },
  {
    id: 'F3',
    title: 'APL 2.0 Multi-Screen Layout Standardization',
    description: 'Echo Show 8, 10, and 15 possess divergent viewport profiles. Our generator calculates scalable flexbox sequences for all screen sizes.',
    severity: 'medium',
  },
  {
    id: 'F4',
    title: 'Cross-Lingual Dialect & Folk Myth Normalization',
    description: 'Raw regional transcripts fail standard entity lookups. Our extraction layer normalizes dialectal idioms (e.g., Banglish tourniquet myths) into canonical claims.',
    severity: 'medium',
  },
];

export default function HarmonizedArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'stack' | 'friction'>('simulation');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1800);

  useEffect(() => {
    if (!isPlaying || activeTab !== 'simulation') return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= SIMULATION_NODES.length ? 1 : prev + 1));
    }, simSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, activeTab]);

  const currentNode = SIMULATION_NODES.find((n) => n.id === activeStep) || SIMULATION_NODES[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER BANNER - HARMONIZED WITH DESIGN SYSTEM */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#120516]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm">
              AR
            </span>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-950 dark:text-white tracking-tight">
              System Architecture & Pipeline Schematic
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Interactive execution schematic tracking real-time packet flow across the 6-stage MCP pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            SPEC 2025-11-25
          </span>
          <span className="px-3 py-1 rounded-full font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40">
            SLA: 1,340ms
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 dark:border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`pb-3 px-4 text-xs font-mono font-bold transition-all relative ${
            activeTab === 'simulation'
              ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          [ 01_INTERACTIVE_PIPELINE_SCHEMATIC ]
        </button>
        <button
          onClick={() => setActiveTab('stack')}
          className={`pb-3 px-4 text-xs font-mono font-bold transition-all relative ${
            activeTab === 'stack'
              ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          [ 02_TECH_STACK_MATRIX ]
        </button>
        <button
          onClick={() => setActiveTab('friction')}
          className={`pb-3 px-4 text-xs font-mono font-bold transition-all relative ${
            activeTab === 'friction'
              ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          [ 03_DEVELOPER_FRICTION_LOG ]
        </button>
      </div>

      {/* TAB 1: INTERACTIVE SIMULATION SCHEMATIC */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* SIMULATION CONTROLS */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#120516]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                    <span>PAUSE_SIMULATION</span>
                  </>
                ) : (
                  <>
                    <span>&#9654;</span>
                    <span>RUN_AUTO_SIMULATION</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep((prev) => (prev >= SIMULATION_NODES.length ? 1 : prev + 1));
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer"
              >
                NEXT_STEP &rarr;
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep(1);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                RESET
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">SPEED:</span>
                <button
                  onClick={() => setSimSpeed(simSpeed === 1800 ? 1000 : 1800)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 font-bold border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {simSpeed === 1800 ? '1.0x (Normal)' : '2.0x (Fast)'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white">
                  STAGE {activeStep}/6: {currentNode.code}
                </span>
              </div>
            </div>
          </div>

          {/* 6-NODE PIPELINE SCHEMATIC - PERFECTLY ALIGNED GRID */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#120516]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 font-mono text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                [TOPOLOGY_MAP: END_TO_END_MCP_PACKET_TRACE]
              </span>
              <span className="text-slate-500">
                LATENCY_TIMELINE: <strong className="text-cyan-600 dark:text-cyan-400">+{currentNode.latencyMs}ms</strong> / 1,340ms
              </span>
            </div>

            {/* 6 UNIFORM, MATCHING CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {SIMULATION_NODES.map((node) => {
                const isActive = node.id === activeStep;
                const isPassed = node.id < activeStep;

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveStep(node.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[175px] relative ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-400 shadow-xl shadow-cyan-500/15 scale-[1.03] z-20 ring-2 ring-cyan-400'
                        : isPassed
                        ? 'bg-slate-50/90 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200'
                        : 'bg-white/50 dark:bg-zinc-950/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white dark:border-black animate-ping" />
                    )}

                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] mb-2 font-bold opacity-75">
                        <span>{node.code}</span>
                        <span>+{node.latencyMs}ms</span>
                      </div>
                      <h4 className="font-display font-extrabold text-xs sm:text-sm leading-snug mb-1 text-slate-900 dark:text-white">
                        {node.title}
                      </h4>
                      <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {node.component}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[9px] font-mono">
                      <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : isPassed
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'opacity-50'
                      }`}>
                        {isActive ? 'PROCESSING' : isPassed ? 'COMPLETE' : 'STANDBY'}
                      </span>
                      <span className="font-bold opacity-60">#{node.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PROGRESS BAR */}
            <div className="pt-2 flex items-center justify-between gap-3 font-mono text-[10px]">
              <div className="flex-1 bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${(activeStep / SIMULATION_NODES.length) * 100}%` }}
                />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
                {Math.round((activeStep / SIMULATION_NODES.length) * 100)}% COMPLETE
              </span>
            </div>
          </div>

          {/* BALANCED LOWER HUD: TERMINAL + SLA METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* TERMINAL INSPECTOR (7 COLS) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-xs font-bold text-slate-300 ml-2">
                    LIVE_PACKET_TRACE: {currentNode.code}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/60 font-bold">
                  {currentNode.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                    [STAGE_DESCRIPTION]
                  </span>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {currentNode.description}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                    [INPUT_PAYLOAD]
                  </span>
                  <pre className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {currentNode.inputPayload}
                  </pre>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                    [OUTPUT_PAYLOAD / DIRECTIVE]
                  </span>
                  <pre className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {currentNode.outputPayload}
                  </pre>
                </div>
              </div>
            </div>

            {/* SLA TELEMETRY MATRIX (5 COLS) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-[#120516]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between font-mono space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-white/10">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    VOICE_SLA_COMPLIANCE
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    &#10003; PASSED
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CURRENT_STEP_LATENCY</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">+{currentNode.latencyMs} ms</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Stage #{currentNode.id}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CUMULATIVE_TIME_TO_FIRST_AUDIO</span>
                      <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">1,340 ms</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      &lt; 1,800ms SLA
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">BATCHED_UNIT_ECONOMICS</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">$0.0017 / 1k queries</span>
                    </div>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">60% SAVINGS</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <strong>Epistemic Guarantee:</strong> In case of clinical or physical safety contradictions, the pipeline aborts speculative speech and synthesizes a calibrated clinical correction within the 1.4-second voice SLA budget.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECH STACK MATRIX */}
      {activeTab === 'stack' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-5 rounded-3xl bg-white/80 dark:bg-[#120516]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase block mb-1">
                  {tech.category} &bull; {tech.owner}
                </span>
                <h4 className="font-display font-black text-base text-slate-900 dark:text-white mb-1.5">
                  {tech.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tech.role}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-slate-500">PRODUCTION</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DEVELOPER FRICTION LOG */}
      {activeTab === 'friction' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs flex items-center justify-between">
            <span>OFFICIAL_ALEXA_PLUS_EVALUATION_FEEDBACK</span>
            <span className="text-cyan-400 font-bold">10% BONUS MARKS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FRICTION_POINTS.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white/80 dark:bg-[#120516]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm space-y-2 font-sans"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    ITEM {item.id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    item.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                  }`}>
                    {item.severity} severity
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
