import React, { useState, useEffect } from 'react';
import {
  Network,
  MessageSquare,
  Play,
  Send,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Sparkles,
  RefreshCw,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { AgentNetworkNode, AgentNetworkEdge, AgentMessage } from '../types';
import { api } from '../services/api';

export const AgentNetworkView: React.FC = () => {
  const [nodes, setNodes] = useState<AgentNetworkNode[]>([]);
  const [edges, setEdges] = useState<AgentNetworkEdge[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentNetworkNode | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(-1);
  const [directMsg, setDirectMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  const fetchNetworkData = async () => {
    try {
      const [netRes, msgRes] = await Promise.all([
        api.getAgentNetwork(),
        api.getAgentMessages(),
      ]);
      setNodes(netRes.nodes || []);
      setEdges(netRes.edges || []);
      setMessages(msgRes.messages || []);
      if (!selectedAgent && netRes.nodes && netRes.nodes.length > 0) {
        setSelectedAgent(netRes.nodes[0]);
      }
    } catch (err) {
      console.error('Error fetching agent network:', err);
    }
  };

  useEffect(() => {
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRunLiveSimulation = async () => {
    setIsSimulating(true);
    setSimStep(0);
    try {
      await api.simulateAgentRun('cyber_nethra_core', 'Simulated Live SOP Pipeline Verification');
      // Step through the 5 roles visually with glowing animation
      for (let i = 0; i < 5; i++) {
        setSimStep(i);
        await new Promise((r) => setTimeout(r, 1800));
        await fetchNetworkData();
      }
    } catch (err: any) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
      setSimStep(-1);
      fetchNetworkData();
    }
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !directMsg.trim()) return;
    setIsSending(true);
    setAgentResponse(null);
    try {
      const res = await api.interactWithAgent(selectedAgent.id, directMsg.trim());
      setAgentResponse(res.reply);
      setDirectMsg('');
      fetchNetworkData();
    } catch (err: any) {
      setAgentResponse(`Error communicating with ${selectedAgent.name}: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner with Simulation Launcher */}
      <div className="agentdev-card p-5 bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-purple-950/40 border-indigo-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-sky-400" /> Interactive Multi-Agent Network & Live Dataflow Bus
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time peer-to-peer message passing, token gauges, and Standard Operating Procedure (SOP) state machine connecting Alice, Bob, Eve, Alex, and David.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunLiveSimulation}
              disabled={isSimulating}
              className={`px-4 py-2 rounded text-xs font-semibold inline-flex items-center gap-2 shadow-lg transition ${
                isSimulating
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              {isSimulating ? `Executing SOP Step ${simStep + 1} of 5...` : '▶️ Run Live Agent Simulation'}
            </button>
            <button
              onClick={fetchNetworkData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
              title="Refresh Network"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Animated Topology Visualizer */}
      <div className="agentdev-card p-6 overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Active SOP Message Flow Topology
            </h4>
          </div>
          <span className="text-[11px] font-mono text-indigo-400">
            {isSimulating ? '⚡ Live Token Stream & Message Bus Active' : '● All 5 Autonomous Agents Connected'}
          </span>
        </div>

        {/* Visual Graph with SVG Connections */}
        <div className="relative py-4">
          {/* SVG Animated Packet Paths (Hidden on very small screens) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4 4" />
              {isSimulating && (
                <line
                  x1="10%"
                  y1="50%"
                  x2="90%"
                  y2="50%"
                  stroke="url(#flowGrad)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>

          {/* 5 Nodes in SOP Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
            {nodes.map((node, idx) => {
              const isSelected = selectedAgent?.id === node.id;
              const isCurrentlyActiveInSim = simStep === idx;

              return (
                <div
                  key={node.id}
                  onClick={() => { setSelectedAgent(node); setAgentResponse(null); }}
                  className={`agentdev-card p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isCurrentlyActiveInSim
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-xl shadow-emerald-500/30 scale-105'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-600/20'
                      : 'hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{node.icon}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isCurrentlyActiveInSim
                            ? 'bg-emerald-500 text-black font-bold animate-pulse'
                            : node.status === 'running'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isCurrentlyActiveInSim ? 'ACTIVE NOW' : node.status.toUpperCase()}
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-sm flex items-center justify-between">
                      <span>{node.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Step {idx + 1}</span>
                    </h5>
                    <p className="text-[11px] text-indigo-400 font-mono truncate">{node.role}</p>
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{node.persona}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-[10px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Workload:</span>
                      <span className="text-sky-400 font-semibold">{node.workload}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(node.workload * 1.5, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-slate-500 pt-1">
                      <span>Tokens Consumed:</span>
                      <span className="text-slate-200 font-semibold">{node.tokens_consumed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channels Communication Bar */}
        <div className="mt-4 p-3 rounded bg-black/40 border border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-slate-500 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-indigo-400" /> ACTIVE CHANNELS:
          </span>
          {edges.map((e, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-slate-300 font-semibold">{e.from.toUpperCase()}</span>
              <ArrowRight className="w-3 h-3 text-indigo-400" />
              <span className="text-slate-300 font-semibold">{e.to.toUpperCase()}</span>
              <span className="text-[10px] text-sky-400 px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/20">
                {e.message_count} msgs
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Selected Agent Interaction & Live Dialogue Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Agent Interactive Controller (1 Col) */}
        <div className="agentdev-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{selectedAgent?.icon}</span>
              <div>
                <h4 className="font-bold text-white text-base">{selectedAgent?.name}</h4>
                <p className="text-xs text-indigo-400 font-mono">{selectedAgent?.role}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Interactive
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Action</span>
              <div className="p-2 rounded bg-black/40 border border-white/5 font-mono text-sky-400 text-xs mt-1">
                {selectedAgent?.primary_action}()
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Deliverable Artifact</span>
              <div className="p-2 rounded bg-black/40 border border-white/5 font-mono text-emerald-400 text-xs mt-1">
                {selectedAgent?.output_artifact}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                <Wrench className="w-3 h-3 text-indigo-400" /> Available Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedAgent?.tools || []).map((tool, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Message Input */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                Send Direct Inquiry to {selectedAgent?.name}:
              </span>
              <form onSubmit={handleSendDirectMessage} className="space-y-2">
                <input
                  type="text"
                  value={directMsg}
                  onChange={(e) => setDirectMsg(e.target.value)}
                  placeholder={`Ask ${selectedAgent?.name} a question...`}
                  className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSending || !directMsg.trim()}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-3 h-3" /> {isSending ? 'Querying Agent...' : 'Send Inquiry'}
                </button>
              </form>

              {agentResponse && (
                <div className="mt-3 p-3 rounded bg-indigo-950/40 border border-indigo-500/30 text-xs font-mono text-indigo-200 animate-fadeIn">
                  <div className="text-[10px] text-indigo-400 font-bold mb-1">Response:</div>
                  {agentResponse}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Agent Dialogue Stream (2 Cols) */}
        <div className="lg:col-span-2 agentdev-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Live Agent-to-Agent Communication Bus
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {messages.length} Exchanges Recorded
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 rounded bg-black/40 border border-white/5 space-y-1.5 hover:border-white/10 transition">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sky-400 font-semibold">{msg.from_agent}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-purple-400 font-semibold">{msg.to_agent}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 font-mono">
                  Artifact: <span className="text-indigo-300">{msg.topic}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#05070B] p-2.5 rounded border border-white/5">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};