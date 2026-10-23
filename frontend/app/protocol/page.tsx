'use client';

import React, { useState, useEffect } from 'react';
import { PRESET_SCENARIOS, Scenario, McpTraceStep } from '../../lib/presets';

interface ExpandedPayload {
  scenarioId: string;
  step: number;
}

export default function ProtocolPage() {
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    PRESET_SCENARIOS[0]
  );
  const [expandedPayload, setExpandedPayload] = useState<ExpandedPayload | null>(
    null
  );
  const [showFullPayload, setShowFullPayload] = useState(false);

  useEffect(() => {
    const fetchCustom = async () => {
      try {
        const res = await fetch('/api/custom-scenarios');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCustomScenarios(data);
            return;
          }
        }
      } catch (err) {}
      try {
        const local = localStorage.getItem('claimcheck_custom_scenarios');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCustomScenarios(parsed);
          }
        }
      } catch (err) {}
    };
    fetchCustom();
  }, []);

  const allScenarios = [...customScenarios, ...PRESET_SCENARIOS];

  const togglePayload = (scenarioId: string, step: number) => {
    if (
      expandedPayload &&
      expandedPayload.scenarioId === scenarioId &&
      expandedPayload.step === step
    ) {
      setExpandedPayload(null);
    } else {
      setExpandedPayload({ scenarioId, step });
    }
  };

  const totalLatency = selectedScenario.mcp_trace.reduce(
    (acc, s) => acc + s.latency_ms,
    0
  );
  const maxLatency = Math.max(...selectedScenario.mcp_trace.map((s) => s.latency_ms));

  // Generate JSON-RPC payloads for each step
  const generateJsonRpc = (step: McpTraceStep, scenario: Scenario) => {
    if (step.tool === 'extract_claims') {
      return {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'extract_claims',
          arguments: { response_text: scenario.original_text },
        },
        id: `req-${step.step}`,
      };
    }
    if (step.tool === 'verify_claim') {
      return {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'verify_claim',
          arguments: {
            claims: scenario.claims.map((c) => ({
              claim_id: c.claim_id,
              atomic_text: c.atomic_text,
              category: c.category,
            })),
          },
        },
        id: `req-${step.step}`,
      };
    }
    return {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'spoken_verdict',
        arguments: {
          verified_claims: scenario.claims,
          trust_score: scenario.spoken_verdict.overall_trust_score,
        },
      },
      id: `req-${step.step}`,
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 blueprint-grid min-h-screen">
      {/* HEADER */}
      <div className="p-6 rounded-3xl tactical-glass relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-300 dark:border-emerald-500/30 shadow-md">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="skew-hud px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 dark:bg-neon-emerald/20 dark:text-neon-emerald border border-emerald-300 dark:border-neon-emerald/50">
              PROTOCOL // INSPECTOR
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-800 dark:text-neon-gold border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 font-bold">
              JSON-RPC 2.0 • STREAMABLE HTTP
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-700 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900">
              PORT 8000 /mcp
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            FastMCP Wire Protocol Trace
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-neon-emerald hidden sm:inline font-bold">
              Spec 2025-11-25
            </span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-1">
            Real-time JSON-RPC 2.0 packet payloads over the official Streamable HTTP transport wire.
          </p>
        </div>
      </div>

      {/* SCENARIO SELECTOR */}
      <div className="p-4 rounded-2xl tactical-glass border border-slate-200 dark:border-emerald-500/20 shadow-sm">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-2">
          SELECT SCENARIO FOR WIRE INSPECTION:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {allScenarios.map((sc, i) => {
            const isActive = sc.preset_id === selectedScenario.preset_id;
            const isCustom = sc.is_custom || sc.preset_id?.startsWith('custom');
            return (
              <button
                key={sc.preset_id || `protocol-sc-${i}`}
                onClick={() => setSelectedScenario(sc)}
                className={`p-2 text-left rounded-xl border transition-all text-xs font-mono font-bold truncate cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-emerald-500 text-white font-extrabold border-emerald-600 bg-emerald-600 dark:bg-zinc-950 dark:text-neon-emerald dark:border-emerald-500 shadow-md'
                    : 'text-slate-700 border-slate-300 hover:border-emerald-500/50 bg-white dark:text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60'
                }`}
              >
                0{i + 1} {sc.title.split('(')[0].trim()}{isCustom ? ' [C]' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* PROTOCOL OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl tactical-glass border border-slate-200 dark:border-emerald-500/20 text-center shadow-sm">
          <span className="font-display font-black text-2xl text-emerald-700 dark:text-neon-emerald">
            {selectedScenario.mcp_trace.length}
          </span>
          <span className="block text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
            Tool Invocations
          </span>
        </div>
        <div className="p-4 rounded-2xl tactical-glass border border-slate-200 dark:border-emerald-500/20 text-center shadow-sm">
          <span className="font-display font-black text-2xl text-slate-900 dark:text-white">
            {totalLatency}
            <span className="text-sm text-slate-500 dark:text-zinc-500">ms</span>
          </span>
          <span className="block text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
            Total Wire Latency
          </span>
        </div>
        <div className="p-4 rounded-2xl tactical-glass border border-slate-200 dark:border-emerald-500/20 text-center shadow-sm">
          <span className="font-display font-black text-2xl text-amber-700 dark:text-neon-gold">
            HTTP
          </span>
          <span className="block text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
            Streamable Transport
          </span>
        </div>
        <div className="p-4 rounded-2xl tactical-glass border border-slate-200 dark:border-emerald-500/20 text-center shadow-sm">
          <span className="font-display font-black text-2xl text-emerald-700 dark:text-neon-emerald">
            2.0
          </span>
          <span className="block text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
            JSON-RPC Version
          </span>
        </div>
      </div>

      {/* WATERFALL TIMELINE */}
      <div className="p-6 rounded-3xl tactical-glass border border-slate-200 dark:border-emerald-500/20 space-y-4 shadow-sm">
        <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          Latency Waterfall Timeline
        </h2>

        <div className="space-y-3 font-mono">
          {selectedScenario.mcp_trace.map((step, idx) => {
            const widthPct = Math.max((step.latency_ms / maxLatency) * 100, 10);
            const offsetPct =
              idx === 0
                ? 0
                : (selectedScenario.mcp_trace
                    .slice(0, idx)
                    .reduce((a, s) => a + s.latency_ms, 0) /
                    totalLatency) *
                  60;

            const isExpanded =
              expandedPayload?.scenarioId === selectedScenario.preset_id &&
              expandedPayload?.step === step.step;

            return (
              <div key={step.step}>
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() =>
                    togglePayload(selectedScenario.preset_id, step.step)
                  }
                >
                  {/* Step label */}
                  <div className="w-36 shrink-0 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-emerald-800 dark:text-neon-emerald border border-slate-300 dark:border-emerald-500/30">
                      0{step.step}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-zinc-200 truncate">
                      {step.tool}
                    </span>
                  </div>

                  {/* Waterfall bar */}
                  <div className="flex-1 relative h-8 rounded-lg overflow-hidden bg-slate-200 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800">
                    <div
                      className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-neon-emerald dark:to-emerald-700 shadow-sm transition-all duration-700 group-hover:opacity-90"
                      style={{
                        left: `${offsetPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-900 dark:text-white drop-shadow-sm ml-2"
                      style={{ left: `${offsetPct}%` }}
                    >
                      {step.latency_ms}ms
                    </span>
                  </div>

                  {/* Status */}
                  <span className="w-20 shrink-0 text-right text-[10px] font-extrabold text-amber-800 dark:text-neon-gold uppercase">
                    {step.status}
                  </span>
                </div>

                {/* Expanded JSON-RPC payload */}
                {isExpanded && (
                  <div className="ml-[152px] mt-2 mb-1 p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-emerald-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-neon-emerald">
                        JSON-RPC 2.0 Request Payload
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-500">
                        POST /mcp HTTP/1.1
                      </span>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-800 dark:text-zinc-300 whitespace-pre-wrap bg-white dark:bg-black/60 p-2.5 rounded-lg border border-slate-300 dark:border-zinc-800">
                      {JSON.stringify(
                        generateJsonRpc(step, selectedScenario),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL PAYLOAD VIEWER */}
      <div className="p-6 rounded-3xl tactical-glass border border-slate-200 dark:border-emerald-500/20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            Full Scenario Payload
          </h2>
          <button
            onClick={() => setShowFullPayload(!showFullPayload)}
            className="neu-button px-3 py-1 text-[11px] font-mono font-bold text-emerald-700 dark:text-neon-emerald border border-emerald-500/40 rounded-lg cursor-pointer"
          >
            {showFullPayload ? 'Collapse' : 'Expand'} JSON
          </button>
        </div>

        {showFullPayload && (
          <pre className="p-4 rounded-xl text-[11px] font-mono text-slate-800 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
            {JSON.stringify(selectedScenario, null, 2)}
          </pre>
        )}

        {!showFullPayload && (
          <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
              <div>
                <span className="block text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Preset ID
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedScenario.preset_id}
                </span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Claims
                </span>
                <span className="font-bold text-emerald-700 dark:text-neon-emerald">
                  {selectedScenario.total_claims} atomic claims
                </span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Trust Score
                </span>
                <span className="font-bold text-amber-700 dark:text-neon-gold">
                  {selectedScenario.spoken_verdict.overall_trust_score}%
                </span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Status
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedScenario.spoken_verdict.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
