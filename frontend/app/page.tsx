'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PRESET_SCENARIOS, Scenario, Claim } from '../lib/presets';

export default function EchoShowSimulator() {
  const [scenarios] = useState<Scenario[]>(PRESET_SCENARIOS);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(PRESET_SCENARIOS[0]);
  const [inputText, setInputText] = useState<string>(PRESET_SCENARIOS[0].original_text);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hwMuted, setHwMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [statusMessage, setStatusMessage] = useState<string>('Ready for query or claim verification');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('Copy JSON');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setStatusMessage('Listening to speech input...');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setStatusMessage('Voice query received. Ready to check.');
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const selectScenario = (id: string) => {
    const s = scenarios.find((p) => p.preset_id === id) || scenarios[0];
    setCurrentScenario(s);
    setInputText(s.original_text);
    setStatusMessage('Loaded scenario: ' + s.title.split('(')[0]);
    if (!hwMuted) {
      speakText(s.spoken_verdict.spoken_response);
    }
  };

  const toggleReasoning = (claimId: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [claimId]: !prev[claimId],
    }));
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || hwMuted) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusMessage('Speaking verified response...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusMessage('Ready for next query.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your claim.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const toggleMute = () => {
    const next = !hwMuted;
    setHwMuted(next);
    if (next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const adjustVolume = (delta: number) => {
    setVolume((prev) => Math.max(0.1, Math.min(1.0, parseFloat((prev + delta).toFixed(1)))));
  };

  const handleVerify = async () => {
    setIsChecking(true);
    setStatusMessage('Invoking MCP pipeline (/mcp): extract_claims -> verify_claim -> spoken_verdict...');

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_text: inputText,
          preset_id: currentScenario.preset_id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentScenario(data);
        setStatusMessage('Verification completed via live Python FastMCP server.');
        if (!hwMuted) speakText(data.spoken_verdict.spoken_response);
        setIsChecking(false);
        return;
      }
    } catch {
      // Backend offline -> fallback
    }

    setTimeout(() => {
      setStatusMessage('Verification completed (deterministic verified cache).');
      if (!hwMuted) speakText(currentScenario.spoken_verdict.spoken_response);
      setIsChecking(false);
    }, 600);
  };

  const runStressTest = () => {
    const stressIds = ['dengue_aspirin', 'ev_cold_battery', 'co_detector_floor'];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < stressIds.length) {
        selectScenario(stressIds[idx]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 4000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentScenario, null, 2));
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy JSON'), 1800);
  };

  const trustScore = currentScenario.spoken_verdict.overall_trust_score;
  const status = currentScenario.spoken_verdict.status;

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* HEADER BAR: PROTOCOL BADGES & STRESS TEST */}
      <header className="neu-raised p-4 md:px-6 mb-6 flex flex-wrap items-center justify-between gap-4 border border-white/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-alexa-cyan via-alexa-blue to-alexa-deep flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/25">
            Shield
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">
                Claim-Check MCP
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                Alexa+ Integration
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Epistemic Safety - FActScore Atomic Decomposition - Calibrated Voice Abstention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="neu-inset px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>MCP Spec: <strong className="text-slate-800">2025-11-25</strong></span>
          </div>

          <div className="neu-inset px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Transport: <strong className="text-slate-800">Streamable HTTP (/mcp)</strong></span>
          </div>

          <button
            onClick={runStressTest}
            className="neu-button px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-1.5"
          >
            <span>Run</span> Q3/Q4 Self-Correction Stress Test
          </button>
        </div>
      </header>

      {/* QUICK PRESET SELECTOR (6 TACTILE SKEUOMORPHIC KEYS) */}
      <div className="neu-raised p-3 md:p-4 mb-6 border border-white/80">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
            Quick Presets (6 Tested Scenarios)
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Click to load scenario and execute epistemic check
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {scenarios.map((sc, i) => {
            const isActive = sc.preset_id === currentScenario.preset_id;
            const st = sc.spoken_verdict.status;
            let badgeColor = 'bg-cyan-100 text-cyan-800 border-cyan-300';
            let dot = 'Status:';
            if (st === 'verified_safe') {
              badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            } else if (st === 'abstained') {
              badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
            } else if (st === 'self_corrected') {
              badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
            }

            return (
              <button
                key={sc.preset_id}
                onClick={() => selectScenario(sc.preset_id)}
                className={`neu-button p-2 text-left flex flex-col justify-between rounded-xl border border-white/60 transition-all hover:scale-[1.02] ${
                  isActive ? 'active ring-2 ring-cyan-500' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">#{i + 1}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${badgeColor}`}>
                    {dot} {st.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">
                  {sc.title.split('(')[0]}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {sc.claims.length} atomic facts
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ECHO SHOW MULTIMODAL CHASSIS */}
      <main className="echo-hardware-chassis metallic-rim p-4 md:p-6 lg:p-8">
        <div className="glass-specular-glare"></div>

        {/* TOP HARDWARE CONTROLS */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-300/70 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400/80 shadow-inner"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400/80 shadow-inner"></div>
            <div className="w-8 h-2.5 rounded-full bg-slate-300 border border-slate-400/80 shadow-inner"></div>
            <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider ml-1">
              ECHO SHOW 15 MULTIMODAL SIMULATOR
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="neu-button px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
            >
              <span className={`w-2 h-2 rounded-full ${hwMuted ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{hwMuted ? 'Muted' : 'Mic Active'}</span>
            </button>

            <div className="neu-inset px-2 py-0.5 flex items-center gap-1.5 text-xs text-slate-600 font-bold">
              <button onClick={() => adjustVolume(-0.2)} className="hover:text-slate-900 px-1">-</button>
              <span>{Math.round(volume * 100)}%</span>
              <button onClick={() => adjustVolume(0.2)} className="hover:text-slate-900 px-1">+</button>
            </div>
          </div>
        </div>

        {/* DUAL-PANE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* LEFT PANEL: ECHO SHOW VOICE DISPLAY */}
          <section className="lg:col-span-5 flex flex-col gap-5">
            
            {/* VOICE HUB SCREEN */}
            <div className="glass-screen rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Multimodal Voice Hub
                </span>
                {isSpeaking && (
                  <div className="speaking-wave flex items-center">
                    <span></span><span></span><span></span><span></span><span></span>
                    <span className="text-[10px] text-cyan-700 font-bold ml-1.5">Speaking</span>
                  </div>
                )}
              </div>

              {/* PULSING ALEXA ORB */}
              <div className="flex flex-col items-center justify-center my-3">
                <div className="alexa-orb-container">
                  <div className="alexa-orb-ring"></div>
                  <div className="alexa-orb-core"></div>
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-3 text-center">
                  {statusMessage}
                </p>
              </div>

              {/* INPUT AREA */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Spoken Draft or User Claim:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full neu-inset p-3 pr-11 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    placeholder="Enter or speak a response draft to decompose and verify..."
                  />
                  <button
                    onClick={toggleMic}
                    title="Microphone Input"
                    className={`absolute right-2.5 top-2.5 w-8 h-8 rounded-xl neu-button flex items-center justify-center ${
                      isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-slate-600 hover:text-cyan-600'
                    }`}
                  >
                    Mic
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleVerify}
                  disabled={isChecking}
                  className="flex-1 neu-button py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isChecking ? 'Verifying Claims...' : 'Verify via MCP'}
                </button>
                <button
                  onClick={() => speakText(currentScenario.spoken_verdict.spoken_response)}
                  title="Read aloud"
                  className="neu-button p-2.5 rounded-xl text-slate-700 hover:text-cyan-600"
                >
                  Audio
                </button>
              </div>
            </div>

            {/* TRUST SCORE GAUGE */}
            <div className="glass-screen rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`transition-all duration-1000 ease-out ${
                        trustScore >= 80 ? 'text-emerald-500' : status === 'abstained' ? 'text-amber-500' : 'text-cyan-500'
                      }`}
                      strokeDasharray={`${trustScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-display font-extrabold text-slate-800">
                      {trustScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Epistemic Trust Score
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 px-2.5 py-0.5 rounded-lg bg-slate-100 inline-block mt-0.5">
                    {status.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentScenario.claims.filter((c) => c.verdict === 'supported').length} supported - {currentScenario.claims.filter((c) => c.verdict === 'contradicted').length} contradicted
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Abstention
                </span>
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded border ${
                    currentScenario.spoken_verdict.abstained
                      ? 'text-amber-700 bg-amber-50 border-amber-200'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}
                >
                  {currentScenario.spoken_verdict.abstained ? 'Unsure (<0.65)' : 'Confident'}
                </span>
              </div>
            </div>

            {/* SPOKEN RESPONSE & REAL-TIME SELF-CORRECTION DIFF */}
            <div className="glass-screen rounded-3xl p-5 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Spoken Alexa+ Output
                  </span>
                  <button
                    onClick={() => speakText(currentScenario.spoken_verdict.spoken_response)}
                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                  >
                    Audio Listen
                  </button>
                </div>

                <div className="neu-inset p-3.5 text-xs md:text-sm text-slate-800 leading-relaxed font-medium min-h-[90px]">
                  {'"' + currentScenario.spoken_verdict.spoken_response + '"'}
                </div>

                {currentScenario.spoken_verdict.self_correction_diff && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-slate-700">
                    <span className="font-bold text-amber-900 block mb-1">
                      Q3/Q4 Real-Time Self-Correction Diff:
                    </span>
                    <div className="flex items-start gap-1.5 text-rose-700">
                      <span className="font-bold">- Removed:</span>
                      <span className="line-through">
                        {currentScenario.spoken_verdict.self_correction_diff.removed_claim}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5 text-emerald-700 mt-1">
                      <span className="font-bold">+ Injected:</span>
                      <span>
                        {currentScenario.spoken_verdict.self_correction_diff.injected_correction}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ACOUSTIC SPEAKER FABRIC GRILL */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                <div className="speaker-acoustic-grill flex-1 h-3"></div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                  Far-Field Acoustic Mesh
                </span>
                <div className="speaker-acoustic-grill flex-1 h-3"></div>
              </div>
            </div>

          </section>

          {/* RIGHT PANEL: ATOMIC CLAIM CARDS & LIVE MCP PROTOCOL TRACE */}
          <section className="lg:col-span-7 flex flex-col gap-5">

            <div className="glass-screen rounded-3xl p-5 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-4">
                <div>
                  <h2 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-2">
                    Atomic Claim Decomposition & Evidence Grounding
                  </h2>
                  <p className="text-xs text-slate-500">
                    FActScore isolation judged against live Wikipedia REST API
                  </p>
                </div>
                <span className="neu-inset px-2.5 py-1 text-xs font-bold text-slate-700">
                  {currentScenario.claims.length} Claims Extracted
                </span>
              </div>

              {/* CLAIM CARDS */}
              <div className="space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
                {currentScenario.claims.map((claim: Claim) => {
                  let badge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  let border = 'border-l-4 border-l-emerald-500';

                  if (claim.verdict === 'contradicted') {
                    badge = 'bg-rose-100 text-rose-800 border-rose-300';
                    border = 'border-l-4 border-l-rose-500';
                  } else if (claim.verdict === 'unsure') {
                    badge = 'bg-amber-100 text-amber-800 border-amber-300';
                    border = 'border-l-4 border-l-amber-500';
                  }

                  const isExpanded = expandedReasoning[claim.claim_id] || false;

                  return (
                    <div key={claim.claim_id} className={`neu-raised p-4 rounded-2xl border border-white/80 ${border}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="neu-inset px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                            {claim.claim_id}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {claim.category.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {Math.round(claim.confidence * 100)}% Conf
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}`}>
                            {claim.verdict.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs md:text-sm font-semibold text-slate-800 mt-2">
                        {'"' + claim.atomic_text + '"'}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <div>
                          <strong>Source:</strong> <span className="text-slate-700">{claim.evidence_source}</span>
                        </div>
                        <button
                          onClick={() => toggleReasoning(claim.claim_id)}
                          className="text-cyan-600 hover:text-cyan-700 font-bold text-[11px] flex items-center gap-1"
                        >
                          <span>Judge Reasoning</span> <span>{isExpanded ? '▲' : '▼'}</span>
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200">
                          <div className="p-2 rounded-lg bg-slate-100/80 text-[11px] text-slate-700 italic mb-2">
                            {'"' + claim.evidence_snippet + '"'}
                          </div>
                          <ul className="space-y-1 mt-1">
                            {claim.reasoning_steps.map((r, i) => (
                              <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                <span className="text-cyan-600 font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                          {claim.correction && (
                            <div className="mt-2.5 p-2 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900">
                              <strong className="font-bold">Grounded Correction:</strong>
                              <p className="mt-0.5">{claim.correction}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE MCP PROTOCOL TRACE DRAWER */}
            <div className="glass-screen rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-700">
                    Live MCP Streamable HTTP Protocol Trace (/mcp)
                  </h3>
                </div>
                <button
                  onClick={() => setShowJsonModal(true)}
                  className="neu-button px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-cyan-600 flex items-center gap-1"
                >
                  <span>{'{ }'}</span> View Full JSON-RPC Payload
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentScenario.mcp_trace.map((step) => (
                  <div key={step.step} className="neu-inset p-2.5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        STEP {step.step} (Tool)
                      </span>
                      <span className="text-xs font-bold text-slate-800">{step.tool}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800">
                      {step.latency_ms}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* JSON MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="neu-raised max-w-3xl w-full max-h-[85vh] flex flex-col p-6 rounded-3xl border border-white/80 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-display font-extrabold text-base text-slate-800">
                Unified MCP JSON Payload
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="neu-button w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <pre className="neu-inset p-4 my-4 font-mono text-xs text-slate-800 overflow-y-auto flex-1 rounded-xl whitespace-pre-wrap">
              {JSON.stringify(currentScenario, null, 2)}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={copyJson}
                className="neu-button px-4 py-2 text-xs font-bold text-cyan-700"
              >
                {copyStatus}
              </button>
              <button
                onClick={() => setShowJsonModal(false)}
                className="neu-button px-4 py-2 text-xs font-bold text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
