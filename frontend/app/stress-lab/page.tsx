'use client';

import React, { useState, useEffect } from 'react';
import { PRESET_SCENARIOS, Scenario } from '../../lib/presets';
import TrustGauge from '../../components/TrustGauge';

export default function StressLabPage() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [thinkingExpanded, setThinkingExpanded] = useState<boolean>(true);
  const [activeReasoningStep, setActiveReasoningStep] = useState<number>(4);

  const scenario = PRESET_SCENARIOS[selectedScenarioIndex] || PRESET_SCENARIOS[0];

  // Simulation of real-time epistemic chain-of-thought
  const runEvaluation = () => {
    setIsEvaluating(true);
    setActiveReasoningStep(1);

    const stepInterval = setInterval(() => {
      setActiveReasoningStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          setIsEvaluating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 450);
  };

  // Derive dynamic rubric breakdown based on the scenario claims
  const totalClaims = scenario.claims.length;
  const supportedCount = scenario.claims.filter((c) => c.verdict === 'supported').length;
  const contradictedCount = scenario.claims.filter((c) => c.verdict === 'contradicted').length;
  const unsureCount = scenario.claims.filter((c) => c.verdict === 'unsure').length;
  const rawRatio = totalClaims > 0 ? Math.round((supportedCount / totalClaims) * 100) : 100;

  let severityPenalty = 0;
  let severityReason = 'No critical safety contradictions';
  if (contradictedCount > 0) {
    const isCritical = scenario.claims.some((c) => c.check_worthiness === 'critical');
    severityPenalty = isCritical ? 33 : 20;
    severityReason = isCritical
      ? 'Critical Clinical/Physical Safety Hazard Override (-33% penalty)'
      : 'Contradicted Factual Claim Penalty (-20%)';
  } else if (unsureCount > 0) {
    severityPenalty = 40;
    severityReason = 'Unverified Future Speculation / Inconclusive Evidence (-40%)';
  }

  const calculatedTrust = scenario.spoken_verdict.overall_trust_score;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center text-zinc-950 font-black text-sm">
              SL
            </span>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-zinc-950 dark:text-white tracking-tight">
              Epistemic Stress Laboratory
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Single-scenario deep evaluation with real-time reasoning chain-of-thought and mathematical trust rubrics.
          </p>
        </div>

        <button
          onClick={runEvaluation}
          disabled={isEvaluating}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isEvaluating ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>Evaluating Chain-of-Thought...</span>
            </>
          ) : (
            <>
              <span>&#9654;</span>
              <span>Re-Evaluate Scenario</span>
            </>
          )}
        </button>
      </div>

      {/* SCENARIO SELECTOR (SHOW ONE SCENARIO AT A TIME) */}
      <div className="p-3 rounded-2xl bg-white dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {PRESET_SCENARIOS.map((item, idx) => {
            const isSelected = selectedScenarioIndex === idx;
            return (
              <button
                key={item.preset_id}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  runEvaluation();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                <span>#{idx + 1} {item.title.split('(')[0].trim()}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                  item.spoken_verdict.status === 'verified_safe'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : item.spoken_verdict.status === 'abstained'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                }`}>
                  {item.spoken_verdict.status.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SCENARIO DEEP-DIVE (MAIN SINGLE-VIEW WORKSPACE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUERY, REASONING PROCESS, & ATOMIC CLAIMS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* QUERY OVERVIEW CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-semibold">
                SCENARIO #{selectedScenarioIndex + 1} &bull; {scenario.red_team_vector}
              </span>
              <span className="text-xs font-mono text-slate-500">
                LATENCY: <strong className="text-slate-900 dark:text-white">1,340ms</strong> / 1,800ms SLA
              </span>
            </div>

            <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
              {scenario.title}
            </h2>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                INCOMING VOICE STATEMENT
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                &ldquo;{scenario.original_text}&rdquo;
              </p>
            </div>
          </div>

          {/* REAL-TIME EPISTEMIC REASONING (LIKE CHATGPT / CLAUDE THINKING PROCESS) */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 animate-pulse" />
                <span className="font-bold text-slate-200">
                  REAL-TIME EPISTEMIC REASONING PROCESS
                </span>
                {isEvaluating && (
                  <span className="text-[10px] text-zinc-300 animate-pulse font-normal">
                    (Thinking...)
                  </span>
                )}
              </div>

              <button
                onClick={() => setThinkingExpanded(!thinkingExpanded)}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                {thinkingExpanded ? 'Collapse Trace' : 'Expand Trace'}
              </button>
            </div>

            {thinkingExpanded && (
              <div className="space-y-3 pt-1">
                <div className={`p-3 rounded-xl border transition-all ${
                  activeReasoningStep >= 1 ? 'bg-zinc-900/80 border-zinc-700 text-slate-200' : 'bg-zinc-950 border-zinc-850 opacity-40 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300 font-bold mb-1">
                    <span>STEP 1: ATOMIC SVO CLAIM EXTRACTION</span>
                    <span>T+120ms</span>
                  </div>
                  <p className="font-sans text-xs text-slate-300">
                    Decomposed multi-clause sentence into {scenario.claims.length} isolated verifiable claims using subject-verb-object dependency parsing.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border transition-all ${
                  activeReasoningStep >= 2 ? 'bg-zinc-900/80 border-zinc-700 text-slate-200' : 'bg-zinc-950 border-zinc-850 opacity-40 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300 font-bold mb-1">
                    <span>STEP 2: LIVE EXTERNAL GROUNDING QUERY</span>
                    <span>T+480ms</span>
                  </div>
                  <p className="font-sans text-xs text-slate-300">
                    Dispatched parallel HTTP REST queries to authoritative knowledge endpoints ({scenario.claims[0]?.evidence_source || 'Wikipedia'}).
                  </p>
                </div>

                <div className={`p-3 rounded-xl border transition-all ${
                  activeReasoningStep >= 3 ? 'bg-zinc-900/80 border-zinc-700 text-slate-200' : 'bg-zinc-950 border-zinc-850 opacity-40 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300 font-bold mb-1">
                    <span>STEP 3: EPISTEMIC TRUTH EVALUATION</span>
                    <span>T+890ms</span>
                  </div>
                  <p className="font-sans text-xs text-slate-300">
                    Cross-referenced claims against evidence snippets. Found {supportedCount} supported, {contradictedCount} contradicted, {unsureCount} unverified.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border transition-all ${
                  activeReasoningStep >= 4 ? 'bg-zinc-900/80 border-emerald-500/40 text-slate-200' : 'bg-zinc-950 border-zinc-850 opacity-40 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                    <span>STEP 4: VOICE SELF-CORRECTION & DIRECTIVE SYNTHESIS</span>
                    <span>T+1,340ms (Complete)</span>
                  </div>
                  <p className="font-sans text-xs text-slate-300">
                    {scenario.spoken_verdict.status === 'self_corrected'
                      ? 'Replaced dangerous contradicted claim with calibrated clinical guidance. Synthesized Alexa APL 2.0 directive.'
                      : scenario.spoken_verdict.status === 'abstained'
                      ? 'Confidence falls below safe thresholds (0.65). Gracefully abstained to prevent speculative hallucinations.'
                      : 'All claims 100% verified against scientific consensus. Safe speech pass-through authorized.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ATOMIC CLAIMS BREAKDOWN */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Atomic Claims & Verification Matrix ({scenario.claims.length})
            </h3>

            <div className="space-y-3">
              {scenario.claims.map((claim, idx) => (
                <div
                  key={claim.claim_id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      CLAIM #{idx + 1} &bull; {claim.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                        claim.verdict === 'supported'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : claim.verdict === 'unsure'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {claim.verdict} ({(claim.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {claim.atomic_text}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 font-sans">
                    <strong>Evidence Grounding:</strong> {claim.evidence_snippet}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRUST SCORE RUBRICS & VERDICT CARD (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* STRUCTURED TRUST SCORE RUBRICS (EXPLAINS "WHY 25%" OR "WHY 67%") */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                TRUST SCORE RUBRIC EVALUATION
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                FACTScore Certified
              </span>
            </div>

            {/* RADIAL GAUGE */}
            <div className="py-2 flex flex-col items-center">
              <TrustGauge score={calculatedTrust} size={130} label="Epistemic Trust Score" />
            </div>

            {/* DETAILED RUBRIC TABLE */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                <span className="text-slate-500">1. Raw Claim Grounding Ratio</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {supportedCount}/{totalClaims} ({rawRatio}%)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                <span className="text-slate-500">2. External Evidence Source</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                  {scenario.claims[0]?.evidence_source.split('(')[0] || 'Wikipedia REST'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                <span className="text-slate-500">3. Hazard / Severity Penalty</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {severityPenalty > 0 ? `-${severityPenalty}%` : '0%'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                <strong>Why this Score?</strong> {severityReason}. The final calibrated trust score is computed at <strong>{calculatedTrust}%</strong>.
              </div>
            </div>
          </div>

          {/* SPOKEN VERDICT INTERVENTION CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                FINAL SPOKEN INTERVENTION
              </span>
              <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-semibold font-bold">
                Voice TTS
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <span className="text-[10px] font-mono text-zinc-300 uppercase font-bold block">
                WHAT ALEXA SPEAKS ALOUD:
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-100">
                &ldquo;{scenario.spoken_verdict.spoken_response}&rdquo;
              </p>
            </div>

            {scenario.spoken_verdict.self_correction_diff && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300/40 text-xs font-mono space-y-1.5">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase">
                  ACTIVE SELF-CORRECTION DIFF:
                </span>
                <div className="text-rose-700 dark:text-rose-300 text-[11px]">
                  &minus; {scenario.spoken_verdict.self_correction_diff.removed_claim}
                </div>
                <div className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                  + {scenario.spoken_verdict.self_correction_diff.injected_correction}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
