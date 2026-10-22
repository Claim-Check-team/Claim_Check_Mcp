'use client';

import React, { useState } from 'react';

interface TechItem {
  name: string;
  role: string;
  owner: string;
  color: string;
}

const TECH_STACK: TechItem[] = [
  { name: 'Next.js 15', role: 'Frontend framework (App Router)', owner: 'Dev B', color: 'from-slate-700 to-slate-900' },
  { name: 'Tailwind CSS', role: 'Utility-first styling + custom morphism', owner: 'Dev B', color: 'from-cyan-400 to-blue-500' },
  { name: 'Web Speech API', role: 'Voice input (STT) + TTS synthesis', owner: 'Dev B', color: 'from-violet-400 to-purple-600' },
  { name: 'Python FastAPI', role: 'REST + MCP server on port 8000', owner: 'Dev A', color: 'from-emerald-400 to-teal-600' },
  { name: 'FastMCP SDK', role: 'MCP Streamable HTTP transport', owner: 'Dev A', color: 'from-amber-400 to-orange-500' },
  { name: 'Wikipedia API', role: 'Evidence retrieval for claim verification', owner: 'Dev A', color: 'from-blue-400 to-indigo-600' },
];

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'User Query',
    description: 'Voice or text input captured via Echo Show simulator. Speech Recognition API converts audio to text.',
    icon: 'Q',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    step: 2,
    title: 'Claim Extraction',
    description: 'FActScore-style atomic decomposition splits compound statements into individually verifiable claims.',
    icon: 'E',
    color: 'from-violet-400 to-purple-600',
  },
  {
    step: 3,
    title: 'Epistemic Verification',
    description: 'Each atomic claim is checked against evidence sources (Wikipedia, WHO, PubMed) with confidence scoring.',
    icon: 'V',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    step: 4,
    title: 'Spoken Verdict',
    description: 'Aggregated trust score triggers: verified_safe pass-through, self_corrected rewrite, or calibrated abstention.',
    icon: 'S',
    color: 'from-amber-400 to-orange-500',
  },
];

const FRICTION_POINTS = [
  {
    id: 'F1',
    title: 'TTFA Latency',
    description: 'Time-to-first-answer with 3-tool MCP chain adds 2-4s. Needs streaming partial results.',
    severity: 'high',
  },
  {
    id: 'F2',
    title: 'Pre-TTS Guardrail Hook',
    description: 'No Alexa Skill API hook to intercept and rewrite response text before TTS synthesis.',
    severity: 'high',
  },
  {
    id: 'F3',
    title: 'APL Citation Schema',
    description: 'Echo Show APL lacks a native citation/source card layout for multimodal evidence display.',
    severity: 'medium',
  },
  {
    id: 'F4',
    title: 'Rate Limiting',
    description: 'Free-tier Wikipedia API rate limits require batching claim verifications.',
    severity: 'medium',
  },
];

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'stack' | 'friction'>('pipeline');

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="neu-raised p-5 md:p-6 mb-6 border border-white/80">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/30">
            A
          </span>
          <h1 className="font-display font-extrabold text-xl text-slate-800">
            System Architecture
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-10">
          End-to-end epistemic safety pipeline for Alexa+ voice responses over MCP Streamable HTTP.
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="neu-raised p-1.5 mb-6 border border-white/80 flex gap-1.5">
        {(['pipeline', 'stack', 'friction'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'neu-inset text-indigo-700 bg-white/40'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/20'
            }`}
          >
            {tab === 'pipeline' ? 'Pipeline Flow' : tab === 'stack' ? 'Tech Stack' : 'Friction Log'}
          </button>
        ))}
      </div>

      {/* PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Architecture Diagram */}
          <div className="neu-raised p-6 border border-white/80">
            <h2 className="font-display font-bold text-sm text-slate-700 uppercase tracking-wider mb-4">
              MCP Tool Chain Architecture
            </h2>

            {/* Visual pipeline flow */}
            <div className="flex flex-col gap-0">
              {PIPELINE_STEPS.map((step, idx) => (
                <div key={step.step} className="flex items-stretch gap-4">
                  {/* Vertical timeline */}
                  <div className="flex flex-col items-center w-12 shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg z-10`}
                    >
                      {step.icon}
                    </div>
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-300 to-slate-200 my-1" />
                    )}
                  </div>

                  {/* Content card */}
                  <div className="neu-raised-sm p-4 flex-1 mb-3 border border-white/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        STEP {step.step}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800">{step.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                    {step.step <= 1 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-100 text-cyan-700 border border-cyan-200">
                          Frontend (Port 3000)
                        </span>
                      </div>
                    )}
                    {step.step > 1 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Backend MCP (Port 8000)
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          POST /mcp
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Q3/Q4 Self-Correction Flow */}
          <div className="neu-raised p-6 border border-white/80">
            <h2 className="font-display font-bold text-sm text-slate-700 uppercase tracking-wider mb-4">
              Q3/Q4 Self-Correction Decision Tree
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-emerald-200/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                  <span className="text-emerald-700 font-bold text-sm">P</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Pass-Through</h3>
                <p className="text-[11px] text-slate-500">
                  Trust score &ge; 85%. All claims supported. Original response spoken unchanged.
                </p>
                <div className="mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold inline-block">
                  verified_safe
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-rose-200/60">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center mb-2">
                  <span className="text-rose-700 font-bold text-sm">C</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Self-Correct</h3>
                <p className="text-[11px] text-slate-500">
                  Contradicted claim detected. Harmful claim removed and correction injected into spoken output.
                </p>
                <div className="mt-2 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold inline-block">
                  self_corrected
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-amber-200/60">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
                  <span className="text-amber-700 font-bold text-sm">A</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Abstain</h3>
                <p className="text-[11px] text-slate-500">
                  Trust score below threshold or insufficient evidence. System declines to answer with explanation.
                </p>
                <div className="mt-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold inline-block">
                  abstained
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TECH STACK TAB */}
      {activeTab === 'stack' && (
        <div className="neu-raised p-6 border border-white/80">
          <h2 className="font-display font-bold text-sm text-slate-700 uppercase tracking-wider mb-4">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="neu-raised-sm p-4 border border-white/60 flex items-start gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}
                >
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{tech.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{tech.role}</p>
                  <span
                    className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      tech.owner === 'Dev B'
                        ? 'bg-cyan-100 text-cyan-700 border-cyan-200'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {tech.owner}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ownership Boundary */}
          <div className="mt-6 glass-card p-4 rounded-2xl border border-indigo-200/60">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              File Ownership Boundary (Zero Conflict Rule)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="neu-inset p-3 rounded-xl">
                <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-600 block mb-1">
                  Developer B (Frontend)
                </span>
                <div className="space-y-0.5 text-[11px] font-mono text-slate-600">
                  <div>frontend/**</div>
                  <div>data/preset_cache.json</div>
                  <div>FRICTION_LOG.md</div>
                  <div>README.md</div>
                </div>
              </div>
              <div className="neu-inset p-3 rounded-xl">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  Developer A (Backend)
                </span>
                <div className="space-y-0.5 text-[11px] font-mono text-slate-600">
                  <div>server.py</div>
                  <div>tools/**</div>
                  <div>requirements.txt</div>
                  <div>.env</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FRICTION LOG TAB */}
      {activeTab === 'friction' && (
        <div className="space-y-4">
          {FRICTION_POINTS.map((fp) => (
            <div
              key={fp.id}
              className={`neu-raised p-5 border ${
                fp.severity === 'high'
                  ? 'border-rose-200/80'
                  : 'border-amber-200/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    fp.severity === 'high'
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}
                >
                  {fp.severity.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {fp.id}
                </span>
                <h3 className="text-sm font-bold text-slate-800">{fp.title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {fp.description}
              </p>
            </div>
          ))}

          <div className="glass-card p-4 rounded-2xl border border-indigo-200/60 text-center">
            <p className="text-xs text-slate-500">
              Full friction log with recommendations available in{' '}
              <span className="font-mono font-bold text-indigo-600">FRICTION_LOG.md</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
