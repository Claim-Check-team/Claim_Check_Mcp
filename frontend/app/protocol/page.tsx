'use client';

import React, { useState } from 'react';
import { PRESET_SCENARIOS, Scenario, McpTraceStep } from '../../lib/presets';

interface ExpandedPayload {
  scenarioId: string;
  step: number;
}

export default function ProtocolPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    PRESET_SCENARIOS[0]
  );
  const [expandedPayload, setExpandedPayload] = useState<ExpandedPayload | null>(
    null
  );
  const [showFullPayload, setShowFullPayload] = useState(false);

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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="neu-raised p-5 md:p-6 mb-6 border border-white/80">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-marigold-400 via-marigold-500 to-aubergine-900 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/30">
            P
          </span>
          <h1 className="font-display font-extrabold text-xl text-aubergine-950">
            MCP Protocol Inspector
          </h1>
        </div>
        <p className="text-xs text-silver-700 font-medium ml-10">
          Visualize JSON-RPC 2.0 request/response cycles over MCP Streamable HTTP transport (/mcp endpoint).
        </p>
      </div>

      {/* SCENARIO SELECTOR */}
      <div className="neu-raised p-4 mb-6 border border-white/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-silver-700 block mb-2">
          Select Scenario for Trace Inspection
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_SCENARIOS.map((sc) => {
            const isActive = sc.preset_id === selectedScenario.preset_id;
            return (
              <button
                key={sc.preset_id}
                onClick={() => setSelectedScenario(sc)}
                className={`neu-button p-2 text-left rounded-xl border transition-all text-xs font-bold truncate ${
                  isActive
                    ? 'active ring-2 ring-marigold-500 text-marigold-600 font-extrabold border-marigold-300'
                    : 'text-aubergine-900 border-white/60 hover:scale-[1.02]'
                }`}
              >
                {sc.title.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* PROTOCOL OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="neu-raised p-3 border border-white/80 text-center">
          <span className="font-display font-extrabold text-2xl text-marigold-600">
            {selectedScenario.mcp_trace.length}
          </span>
          <span className="block text-[10px] font-bold text-silver-700 uppercase tracking-wider mt-0.5">
            Tool Calls
          </span>
        </div>
        <div className="neu-raised p-3 border border-white/80 text-center">
          <span className="font-display font-extrabold text-2xl text-aubergine-900">
            {totalLatency}
            <span className="text-sm text-slate-400">ms</span>
          </span>
          <span className="block text-[10px] font-bold text-silver-700 uppercase tracking-wider mt-0.5">
            Total Latency
          </span>
        </div>
        <div className="neu-raised p-3 border border-white/80 text-center">
          <span className="font-display font-extrabold text-2xl text-cyan-600">
            HTTP
          </span>
          <span className="block text-[10px] font-bold text-silver-700 uppercase tracking-wider mt-0.5">
            Transport
          </span>
        </div>
        <div className="neu-raised p-3 border border-white/80 text-center">
          <span className="font-display font-extrabold text-2xl text-emerald-600">
            2.0
          </span>
          <span className="block text-[10px] font-bold text-silver-700 uppercase tracking-wider mt-0.5">
            JSON-RPC Version
          </span>
        </div>
      </div>

      {/* WATERFALL TIMELINE */}
      <div className="neu-raised p-5 mb-6 border border-white/80">
        <h2 className="font-display font-bold text-sm text-aubergine-900 uppercase tracking-wider mb-4">
          Latency Waterfall Timeline
        </h2>

        <div className="space-y-3">
          {selectedScenario.mcp_trace.map((step, idx) => {
            const widthPct = Math.max((step.latency_ms / maxLatency) * 100, 8);
            const offsetPct =
              idx === 0
                ? 0
                : (selectedScenario.mcp_trace
                    .slice(0, idx)
                    .reduce((a, s) => a + s.latency_ms, 0) /
                    totalLatency) *
                  60;

            const colors = [
              'from-marigold-400 to-marigold-600',
              'from-aubergine-600 to-aubergine-900',
              'from-marigold-500 to-marigold-700',
            ];
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
                  <div className="w-32 shrink-0 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {step.step}
                    </span>
                    <span className="text-xs font-bold text-aubergine-900 truncate">
                      {step.tool}
                    </span>
                  </div>

                  {/* Waterfall bar */}
                  <div className="flex-1 relative h-8 neu-inset rounded-lg overflow-hidden">
                    <div
                      className={`absolute top-1 bottom-1 rounded-md bg-gradient-to-r ${colors[idx % colors.length]} shadow-sm transition-all duration-700 group-hover:opacity-90`}
                      style={{
                        left: `${offsetPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white drop-shadow-sm"
                      style={{ left: `${offsetPct + 1}%` }}
                    >
                      {step.latency_ms}ms
                    </span>
                  </div>

                  {/* Status */}
                  <span className="w-16 shrink-0 text-right text-[10px] font-bold text-emerald-600 uppercase">
                    {step.status}
                  </span>
                </div>

                {/* Expanded JSON-RPC payload */}
                {isExpanded && (
                  <div className="ml-[140px] mt-2 mb-1 neu-inset p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-marigold-600">
                        JSON-RPC 2.0 Request Payload
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        POST /mcp HTTP/1.1
                      </span>
                    </div>
                    <pre className="text-[11px] font-mono text-aubergine-900 whitespace-pre-wrap bg-white/50 p-2.5 rounded-lg border border-slate-200/60">
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
      <div className="neu-raised p-5 border border-white/80">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm text-aubergine-900 uppercase tracking-wider">
            Full Scenario Payload
          </h2>
          <button
            onClick={() => setShowFullPayload(!showFullPayload)}
            className="neu-button px-3 py-1 text-[11px] font-bold text-marigold-600"
          >
            {showFullPayload ? 'Collapse' : 'Expand'} JSON
          </button>
        </div>

        {showFullPayload && (
          <pre className="neu-inset p-4 rounded-xl text-[11px] font-mono text-aubergine-900 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
            {JSON.stringify(selectedScenario, null, 2)}
          </pre>
        )}

        {!showFullPayload && (
          <div className="neu-inset p-3 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Preset ID
                </span>
                <span className="font-mono font-bold text-aubergine-900">
                  {selectedScenario.preset_id}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Claims
                </span>
                <span className="font-bold text-aubergine-900">
                  {selectedScenario.total_claims} atomic claims
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Trust Score
                </span>
                <span className="font-bold text-aubergine-900">
                  {selectedScenario.spoken_verdict.overall_trust_score}%
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">
                  Status
                </span>
                <span className="font-bold text-aubergine-900">
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
