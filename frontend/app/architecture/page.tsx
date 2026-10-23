'use client';

import React, { useState, useEffect } from 'react';

interface TechItem {
  name: string;
  role: string;
  owner: string;
  category: string;
}

const TECH_STACK: TechItem[] = [
  { name: 'Next.js 14 App Router', role: 'Hardware Simulator & Telemetry Dashboard', owner: 'Dev B', category: 'Frontend' },
  { name: 'Tailwind CSS Tokens', role: 'Obsidian glassmorphic HUD & CAD styling', owner: 'Dev B', category: 'Styling' },
  { name: 'Web Speech API', role: 'Dual STT voice capture & Echo TTS playback', owner: 'Dev B', category: 'Speech' },
  { name: 'Python FastAPI', role: 'High-speed REST engine + FastMCP on port 8000', owner: 'Dev A', category: 'Backend' },
  { name: 'FastMCP SDK', role: 'Streamable HTTP transport spec 2025-11-25', owner: 'Dev A', category: 'Protocol' },
  { name: 'Wikipedia REST v1', role: 'Encyclopedic consensus entity grounding', owner: 'Dev A', category: 'Knowledge' },
  { name: 'AWS Lambda (ask-sdk-core)', role: 'Native Alexa skill adapter bridge', owner: 'Dev A', category: 'Cloud' },
  { name: 'Alexa APL 2.0', role: 'Echo Show karaoke RenderDocument engine', owner: 'Dev A', category: 'Multimodal' },
];

interface BlueprintNode {
  id: number;
  code: string;
  tag: string;
  title: string;
  component: string;
  latencyMs: number;
  pins: string[];
  inputPayload: string;
  outputPayload: string;
  status: string;
  metric: string;
}

const BLUEPRINT_NODES: BlueprintNode[] = [
  {
    id: 1,
    code: '01_VOICE_CAPTURE',
    tag: 'VOICE // RECORD',
    title: 'Echo Show Far-Field Array',
    component: 'Echo Hardware / Acoustic Beamforming',
    latencyMs: 120,
    pins: ['MIC_IN', 'BEAM_FILTER', 'ASR_OUT'],
    inputPayload: '"Aspirin reduces fever, was derived from willow bark, and is recommended for treating dengue fever."',
    outputPayload: 'Audio PCM Stream -> ASR -> Utterance String',
    status: 'RECORDING_ENGAGED',
    metric: 'SNR: +24dB',
  },
  {
    id: 2,
    code: '02_LAMBDA_BRIDGE',
    tag: 'ECHO // BRIDGE',
    title: 'AWS Lambda Skill Adapter',
    component: 'alexa_skill/lambda_function.py (ask-sdk-core)',
    latencyMs: 210,
    pins: ['INTENT_IN', 'SLOT_PARSER', 'HTTP_MCP'],
    inputPayload: 'Alexa Intent: { CheckClaimIntent, Utterance: "Aspirin reduces..." }',
    outputPayload: 'FastMCP HTTP POST -> http://localhost:8000/mcp',
    status: 'MCP_DISPATCH_OK',
    metric: 'HTTP/2 TLS',
  },
  {
    id: 3,
    code: '03_CLAIM_DECOMPOSE',
    tag: 'STRESS // PARSER',
    title: 'Tool 1: extract_claims',
    component: 'tools/extract.py (FActScore SVO Parser)',
    latencyMs: 380,
    pins: ['RAW_TEXT', 'NLP_SVO', 'ATOMIC_ARR'],
    inputPayload: 'Compound multi-clause statement',
    outputPayload: '[\n  "Aspirin reduces fever and inflammation",\n  "Aspirin was derived from willow bark",\n  "Aspirin is recommended for treating dengue fever"\n]',
    status: 'ATOMIC_SPLIT_3x',
    metric: '3 Claims Iso',
  },
  {
    id: 4,
    code: '04_WIKI_GROUNDING',
    tag: 'LABORATORY // SEARCH',
    title: 'Tool 2: verify_claim',
    component: 'tools/verify.py (Wikipedia REST API v1)',
    latencyMs: 760,
    pins: ['ENTITY_IN', 'REST_QUERY', 'EVIDENCE_OUT'],
    inputPayload: 'Entities: "Aspirin", "Dengue fever"',
    outputPayload: 'Wikipedia REST HTTP 200:\n"Aspirin is contraindicated in dengue due to platelet inhibition and fatal hemorrhage risk."',
    status: 'EVIDENCE_RETRIEVED',
    metric: '200 OK (550ms)',
  },
  {
    id: 5,
    code: '05_EPISTEMIC_JUDGE',
    tag: 'ARCHITECTURE // JUDGE',
    title: 'Tool 3: compute_verdict',
    component: 'tools/verdict.py (FACTScore Engine)',
    latencyMs: 1150,
    pins: ['CLAIM_MATRIX', 'SEVERITY_OVERRIDE', 'TTS_DIRECTIVE'],
    inputPayload: '2 Supported, 1 Contradicted (Severe Hazard)',
    outputPayload: 'Trust: 67% (REFUTED)\nVoice: "Hold on—two parts are true, but one is dangerous. Never take aspirin for dengue. Doctors recommend paracetamol."',
    status: 'HAZARD_INTERCEPTED',
    metric: 'Trust 67%',
  },
  {
    id: 6,
    code: '06_APL_KARAOKE',
    tag: 'ECHO // APL 2.0',
    title: 'Tool 4: export_apl_directive',
    component: 'tools/apl_generator.py (APL 2.0 Renderer)',
    latencyMs: 1340,
    pins: ['VERDICT_IN', 'APL_TREE', 'ECHO_DISPLAY'],
    inputPayload: 'Verdict payload + Echo Show 15 Profile',
    outputPayload: 'Alexa.Presentation.APL.RenderDocument:\n{\n  "version": "2024.2",\n  "commands": [{ "type": "SpeakItem", "componentId": "karaokeText" }]\n}',
    status: 'RENDER_DIRECTIVE_SENT',
    metric: 'APL 2.0 Synced',
  },
];

const FRICTION_LOG = [
  { id: 'F1', title: 'Sequential Latency Overhead', fix: 'Vectorized parallel claim verification reduced total TTFA from 2.8s to 1.34s.' },
  { id: 'F2', title: 'Missing Alexa Pre-TTS Interceptor', fix: 'AWS Lambda middleware acts as inline epistemic filter before speech synthesizer fires.' },
  { id: 'F3', title: 'APL 2.0 Multi-Viewport Sizing', fix: 'Dynamic flexbox packages rendered specifically for Echo Show 8, 10, and 15.' },
  { id: 'F4', title: 'Regional Dialect False Positives', fix: 'Normalization preprocessing maps dialectal medical myths into standard canonical entities.' },
];

export default function HarmonizedArchitecturePage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(2000);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'stack' | 'friction'>('blueprint');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= BLUEPRINT_NODES.length ? 1 : prev + 1));
    }, simSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const currentNode = BLUEPRINT_NODES.find((n) => n.id === activeStep) || BLUEPRINT_NODES[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 blueprint-grid min-h-screen">
      
      {/* CAD BLUEPRINT HEADER */}
      <div className="p-6 rounded-3xl tactical-glass relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-300 dark:border-emerald-500/30 shadow-md">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="skew-hud px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 dark:bg-neon-emerald/20 dark:text-neon-emerald border border-emerald-300 dark:border-neon-emerald/50">
              BLUEPRINT // CAD SCHEMATIC
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-800 dark:text-neon-gold border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 font-bold">
              VOICE • RECORD • STRESS • LABORATORY • ECHO • ARCHITECTURE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900">
              FAST-MCP SPEC 2025-11-25
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Unified Epistemic Architecture CAD
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-neon-emerald hidden sm:inline font-bold">
              Single-Frame Bus Auto-Simulation
            </span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-1">
            Complete end-to-end hardware-to-knowledge pipeline visualized in a single technical schematic frame.
          </p>
        </div>

        {/* CAD SIMULATION CONTROLS */}
        <div className="flex items-center gap-2 font-mono text-xs shrink-0 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all border ${
              isPlaying
                ? 'bg-emerald-100 text-emerald-900 dark:bg-zinc-950 dark:text-neon-emerald border-emerald-400 dark:border-neon-emerald shadow-emerald-glow'
                : 'bg-slate-100 text-slate-800 dark:bg-zinc-900 dark:text-zinc-300 border-slate-300 dark:border-zinc-700 hover:border-emerald-500'
            }`}
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-neon-emerald animate-ping" />
                <span>PAUSE AUTO-RUN</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>RESUME AUTO-RUN</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((prev) => (prev >= BLUEPRINT_NODES.length ? 1 : prev + 1));
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:border-emerald-500 text-slate-800 dark:text-zinc-200 cursor-pointer"
          >
            STEP ⟶
          </button>

          <select
            value={simSpeed}
            onChange={(e) => setSimSpeed(Number(e.target.value))}
            className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-300 text-xs cursor-pointer font-bold"
          >
            <option value={3000}>0.5x Pace</option>
            <option value={2000}>1.0x Normal</option>
            <option value={1000}>2.0x High-Speed</option>
          </select>
        </div>
      </div>

      {/* VIEW TABS */}
      <div className="flex items-center gap-2 border-b border-slate-300 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'blueprint'
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-neon-emerald border border-emerald-400 dark:border-emerald-500/40'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          [ 01_SCHEMATIC_CANVAS ]
        </button>
        <button
          onClick={() => setActiveTab('stack')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'stack'
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-neon-emerald border border-emerald-400 dark:border-emerald-500/40'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          [ 02_TECH_STACK_MATRIX ]
        </button>
        <button
          onClick={() => setActiveTab('friction')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'friction'
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-neon-emerald border border-emerald-400 dark:border-emerald-500/40'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          [ 03_DEVELOPER_FRICTION_LOG ]
        </button>
      </div>

      {activeTab === 'blueprint' && (
        <div className="space-y-6">
          
          {/* THE CAD BLUEPRINT SCHEMATIC (SINGLE WHOLE-DESIGN FRAME) */}
          <div className="blueprint-frame p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-slate-900 dark:bg-obsidian-titanium/95 shadow-2xl border border-emerald-500/30 text-white">
            {/* Top CAD Header Ribbon */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-emerald-500/30 font-mono text-[11px] text-zinc-300">
              <div className="flex items-center gap-4">
                <span className="text-neon-emerald font-bold">CAD-DWG // CLAIM-CHECK-MCP</span>
                <span>SCALE: 1:1 BUS</span>
                <span>GRID: 10MM ORTHO</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neon-gold font-bold">TOTAL TTFA SLA: 1,340ms</span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                  NODE 0{activeStep} OF 06 ACTIVE
                </span>
              </div>
            </div>

            {/* FLOWING BUS LINE (ANIMATED LASER PULSE) */}
            <div className="relative mb-6">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-neon-emerald via-neon-mint to-neon-gold transition-all duration-500"
                  style={{ width: `${(activeStep / BLUEPRINT_NODES.length) * 100}%` }}
                />
              </div>
              <div
                className="absolute -top-1.5 w-4 h-4 rounded-full bg-neon-emerald shadow-emerald-glow border-2 border-white transition-all duration-500"
                style={{ left: `calc(${(activeStep / BLUEPRINT_NODES.length) * 100}% - 8px)` }}
              />
            </div>

            {/* SINGLE FRAME: 6 INTEGRATED BLUEPRINT IC NODES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BLUEPRINT_NODES.map((node) => {
                const isActive = node.id === activeStep;
                const isPassed = node.id < activeStep;

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveStep(node.id);
                    }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? 'bg-zinc-950 border-neon-emerald shadow-emerald-glow ring-2 ring-neon-emerald/50 scale-[1.02] z-10'
                        : isPassed
                        ? 'bg-zinc-900/60 border-emerald-500/30 opacity-90 hover:opacity-100'
                        : 'bg-zinc-950/40 border-zinc-800 opacity-60 hover:opacity-90'
                    }`}
                  >
                    {/* Corner CAD Ticks */}
                    <div className="absolute top-1.5 left-1.5 font-mono text-[9px] text-zinc-600 pointer-events-none">+</div>
                    <div className="absolute top-1.5 right-1.5 font-mono text-[9px] text-zinc-600 pointer-events-none">+</div>
                    <div className="absolute bottom-1.5 left-1.5 font-mono text-[9px] text-zinc-600 pointer-events-none">+</div>
                    <div className="absolute bottom-1.5 right-1.5 font-mono text-[9px] text-zinc-600 pointer-events-none">+</div>

                    {/* Chip Pin Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`skew-hud px-2 py-0.5 rounded text-[9px] font-mono font-black ${
                        isActive
                          ? 'bg-neon-emerald text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {node.tag}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        T+{node.latencyMs}ms
                      </span>
                    </div>

                    <div className="font-mono text-xs font-bold text-white tracking-wide mb-1">
                      {node.code}
                    </div>

                    <h3 className="font-display font-black text-sm text-zinc-100 mb-2">
                      {node.title}
                    </h3>

                    <div className="text-[11px] font-mono text-zinc-400 truncate mb-3">
                      {node.component}
                    </div>

                    {/* Pinout Bus Connectors */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-800/80">
                      {node.pins.map((pin, i) => (
                        <span
                          key={i}
                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                            isActive
                              ? 'bg-emerald-500/10 text-neon-emerald border-emerald-500/40'
                              : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                          }`}
                        >
                          PIN:{pin}
                        </span>
                      ))}
                      <span className="ml-auto text-[9px] font-mono font-bold text-neon-gold">
                        {node.metric}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CAD Metadata Stamp */}
            <div className="mt-8 pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] text-zinc-400">
              <div className="flex items-center gap-3">
                <span>PROJECT: CLAIM-CHECK-MCP</span>
                <span>STAGE: HARDWARE VERIFICATION</span>
                <span>SECURITY: ZERO AIR-GAP HALLUCINATIONS</span>
              </div>
              <div className="text-neon-emerald font-bold">
                STATUS: PIPELINE ONLINE & STREAMING (PORT 8000)
              </div>
            </div>
          </div>

          {/* REAL-TIME NODE TELEMETRY INSPECTOR */}
          <div className="p-6 rounded-3xl neu-raised border border-slate-300 dark:border-emerald-500/20 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="skew-hud px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-neon-emerald border border-emerald-300 dark:border-emerald-500/40">
                  LIVE OSCILLOSCOPE TELEMETRY
                </span>
                <span className="text-xs font-mono text-amber-700 dark:text-neon-gold font-bold">
                  STAGE 0{currentNode.id}/06
                </span>
              </div>

              <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                {currentNode.title}
              </h2>
              <p className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                Component: {currentNode.component}
              </p>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>LATENCY BUDGET:</span>
                  <span className="text-emerald-700 dark:text-neon-emerald font-bold">{currentNode.latencyMs}ms</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>STAGE STATUS:</span>
                  <span className="text-amber-700 dark:text-neon-gold font-bold">{currentNode.status}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>BUS THROUGHPUT:</span>
                  <span className="text-slate-900 dark:text-zinc-200 font-bold">{currentNode.metric}</span>
                </div>
              </div>
            </div>

            {/* Wire Payload Inspector */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 dark:bg-zinc-950 border border-slate-700 dark:border-zinc-800 font-mono text-xs space-y-2 text-white">
                <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold border-b border-zinc-800 pb-1.5">
                  <span className="text-neon-gold">RX WIRE INFLOW (INPUT)</span>
                  <span>BUS_PIN_IN</span>
                </div>
                <pre className="text-zinc-300 text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-40">
                  {currentNode.inputPayload}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 dark:bg-zinc-950 border border-slate-700 dark:border-zinc-800 font-mono text-xs space-y-2 text-white">
                <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold border-b border-zinc-800 pb-1.5">
                  <span className="text-neon-emerald">TX WIRE OUTFLOW (OUTPUT)</span>
                  <span>BUS_PIN_OUT</span>
                </div>
                <pre className="text-zinc-300 text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-40">
                  {currentNode.outputPayload}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECH STACK MATRIX */}
      {activeTab === 'stack' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_STACK.map((tech, i) => (
            <div key={i} className="p-5 rounded-2xl neu-raised border border-slate-300 dark:border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-emerald px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30">
                  {tech.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">{tech.owner}</span>
              </div>
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">{tech.name}</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans leading-relaxed">{tech.role}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DEVELOPER FRICTION LOG */}
      {activeTab === 'friction' && (
        <div className="space-y-4">
          {FRICTION_LOG.map((f) => (
            <div key={f.id} className="p-5 rounded-2xl neu-raised border border-amber-300 dark:border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-neon-gold border border-amber-300 dark:border-amber-500/40">
                  {f.id}
                </span>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{f.title}</h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
                <strong className="text-emerald-700 dark:text-neon-emerald">Architectural Solution:</strong> {f.fix}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
