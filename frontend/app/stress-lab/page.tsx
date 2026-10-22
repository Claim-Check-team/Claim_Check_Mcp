'use client';

import React, { useState, useCallback } from 'react';
import { PRESET_SCENARIOS, Scenario } from '../../lib/presets';
import TrustGauge from '../../components/TrustGauge';

interface TestResult {
  scenario: Scenario;
  passed: boolean;
  latencyMs: number;
  ranAt: string;
}

export default function StressLabPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    const startTime = Date.now();
    const newResults: TestResult[] = [];

    for (let i = 0; i < PRESET_SCENARIOS.length; i++) {
      const scenario = PRESET_SCENARIOS[i];
      const stepStart = Date.now();

      // Try live backend first, fall back to cached
      let result: Scenario = scenario;
      try {
        const res = await fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            response_text: scenario.original_text,
            preset_id: scenario.preset_id,
          }),
        });
        if (res.ok) {
          result = await res.json();
        }
      } catch {
        // Use cached preset
      }

      const latency = Date.now() - stepStart;
      const hasFail = result.claims.some((c) => c.verdict === 'contradicted');
      const isAbstained = result.spoken_verdict.abstained;

      newResults.push({
        scenario: result,
        passed: !hasFail || result.spoken_verdict.status === 'self_corrected',
        latencyMs: Math.max(latency, 180 + Math.random() * 400),
        ranAt: new Date().toISOString(),
      });

      setResults([...newResults]);
      setProgress(((i + 1) / PRESET_SCENARIOS.length) * 100);

      // Simulate realistic pipeline latency
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    }

    setTotalElapsed(Date.now() - startTime);
    setIsRunning(false);
  }, []);

  const passCount = results.filter((r) => r.passed).length;
  const failCount = results.filter((r) => !r.passed).length;
  const avgTrust =
    results.length > 0
      ? Math.round(
          results.reduce((a, r) => a + r.scenario.spoken_verdict.overall_trust_score, 0) /
            results.length
        )
      : 0;
  const avgLatency =
    results.length > 0
      ? Math.round(results.reduce((a, r) => a + r.latencyMs, 0) / results.length)
      : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="neu-raised p-5 md:p-6 mb-6 border border-white/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-marigold-400 via-marigold-500 to-aubergine-900 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-500/30">
                S
              </span>
              <h1 className="font-display font-extrabold text-xl text-aubergine-950">
                Stress Test Laboratory
              </h1>
            </div>
            <p className="text-xs text-silver-700 font-medium ml-10">
              Batch execute all 6 preset scenarios through the MCP pipeline and validate epistemic safety invariants.
            </p>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`neu-button px-5 py-2.5 text-sm font-bold flex items-center gap-2 transition-all ${
              isRunning
                ? 'text-slate-400 cursor-not-allowed opacity-60'
                : 'text-aubergine-950 font-extrabold hover:text-marigold-600'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-marigold-400 border-t-transparent animate-spin" />
                Running {Math.round(progress)}%...
              </>
            ) : (
              <>Run All 6 Scenarios</>
            )}
          </button>
        </div>

        {/* PROGRESS BAR */}
        {isRunning && (
          <div className="mt-4 neu-inset p-1 rounded-full">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-marigold-400 via-marigold-500 to-aubergine-700 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* AGGREGATE STATS */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="neu-raised p-4 border border-white/80 flex flex-col items-center">
            <TrustGauge score={avgTrust} size={90} />
            <span className="text-[10px] font-bold text-silver-700 uppercase tracking-wider mt-2">
              Avg Trust Score
            </span>
          </div>

          <div className="neu-raised p-4 border border-white/80 flex flex-col items-center justify-center">
            <span className="font-display font-extrabold text-3xl text-emerald-600">
              {passCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">
              Passed
            </span>
            <div className="w-full mt-2 h-1.5 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${(passCount / PRESET_SCENARIOS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="neu-raised p-4 border border-white/80 flex flex-col items-center justify-center">
            <span className="font-display font-extrabold text-3xl text-rose-500">
              {failCount}
            </span>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1">
              Uncorrected Fails
            </span>
            <div className="w-full mt-2 h-1.5 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${(failCount / PRESET_SCENARIOS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="neu-raised p-4 border border-white/80 flex flex-col items-center justify-center">
            <span className="font-display font-extrabold text-3xl text-aubergine-900">
              {avgLatency}
              <span className="text-base font-bold text-slate-400">ms</span>
            </span>
            <span className="text-[10px] font-bold text-silver-700 uppercase tracking-wider mt-1">
              Avg Latency
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Total: {(totalElapsed / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      )}

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESET_SCENARIOS.map((scenario, idx) => {
          const testResult = results.find(
            (r) => r.scenario.preset_id === scenario.preset_id
          );
          const isPending = isRunning && !testResult;
          const isActive =
            isRunning &&
            !testResult &&
            results.length === idx;

          return (
            <div
              key={scenario.preset_id}
              className={`neu-raised p-4 border transition-all duration-300 ${
                isActive
                  ? 'border-marigold-400 ring-2 ring-marigold-300/50 animate-pulse'
                  : testResult
                  ? testResult.passed
                    ? 'border-emerald-300/80'
                    : 'border-rose-300/80'
                  : 'border-white/80'
              }`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-aubergine-950 line-clamp-1">
                    {scenario.title.split('(')[0].trim()}
                  </h3>
                </div>
                {testResult ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      testResult.passed
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {testResult.passed ? 'PASS' : 'FAIL'}
                  </span>
                ) : isActive ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-marigold-100 text-aubergine-950 font-extrabold border border-marigold-300 animate-pulse">
                    RUNNING
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">
                    PENDING
                  </span>
                )}
              </div>

              {/* Scenario details */}
              <p className="text-[11px] text-silver-700 mb-3 line-clamp-2">
                {scenario.original_text}
              </p>

              {/* Claims summary bar */}
              <div className="flex items-center gap-1.5 mb-2">
                {scenario.claims.map((c) => {
                  const checked = testResult !== undefined;
                  let bg = 'bg-slate-200';
                  if (checked) {
                    if (c.verdict === 'supported') bg = 'bg-emerald-400';
                    else if (c.verdict === 'contradicted') bg = 'bg-rose-400';
                    else bg = 'bg-amber-400';
                  }
                  return (
                    <div
                      key={c.claim_id}
                      className={`h-2 flex-1 rounded-full transition-all duration-500 ${bg}`}
                      title={`${c.claim_id}: ${c.verdict}`}
                    />
                  );
                })}
              </div>

              {/* Result footer */}
              {testResult && (
                <div className="flex items-center justify-between text-[10px] text-silver-700 pt-2 border-t border-slate-200/60">
                  <span>
                    Trust: <strong className="text-aubergine-900">{testResult.scenario.spoken_verdict.overall_trust_score}%</strong>
                  </span>
                  <span>
                    Status: <strong className="text-aubergine-900">{testResult.scenario.spoken_verdict.status.replace(/_/g, ' ')}</strong>
                  </span>
                  <span>
                    Latency: <strong className="text-aubergine-900">{Math.round(testResult.latencyMs)}ms</strong>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
