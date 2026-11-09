import React, { useState, useEffect } from 'react';
import { Network, MessageSquare, Cpu, ArrowRight, ShieldCheck, Wrench, Sparkles } from 'lucide-react';
import { AgentNetworkNode, AgentNetworkEdge, AgentMessage } from '../types';
import { api } from '../services/api';

export const AgentNetworkView: React.FC = () => {
  const [nodes, setNodes] = useState<AgentNetworkNode[]>([]);
  const [edges, setEdges] = useState<AgentNetworkEdge[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentNetworkNode | null>(null);

  useEffect(() => {
    api.getAgentNetwork().then((res) => {
      setNodes(res.nodes || []);
      setEdges(res.edges || []);
      if (res.nodes && res.nodes.length > 0) {
        setSelectedAgent(res.nodes[0]);
      }
    });

    api.getAgentMessages().then((res) => {
      setMessages(res.messages || []);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="agentdev-card p-5 bg-gradient-to-r from-sky-950/30 via-indigo-950/30 to-purple-950/30 border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-sky-400" /> Interactive Multi-Agent Network Topology
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Visualizes peer-to-peer message passing, workload distribution, and Standard Operating Procedure (SOP) state transitions across autonomous roles.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            5 Active Agent Nodes
          </span>
        </div>
      </div>

      {/* Visual Network Graph Canvas */}
      <div className="agentdev-card p-6 overflow-hidden relative">
        <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-4 flex items-center justify-between">
          <span>Agent Communication Pipeline (SOP Message Bus)</span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Message Bus
          </span>
        </h4>

        {/* Nodes Grid / Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {nodes.map((node) => {
            const isSelected = selectedAgent?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedAgent(node)}
                className={`agentdev-card p-4 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-600/20'
                    : 'hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{node.icon}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        node.status === 'running'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{node.name}</h5>
                  <p className="text-[11px] text-indigo-400 font-mono truncate">{node.role}</p>
                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{node.persona}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-[10px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Workload:</span>
                    <span className="text-sky-400">{node.workload}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-sky-400 h-1 rounded-full" style={{ width: `${node.workload * 2}%` }} />
                  </div>
                  <div className="flex justify-between text-slate-500 pt-1">
                    <span>Tokens:</span>
                    <span className="text-slate-300">{node.tokens_consumed.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Communication Channels Bar */}
        <div className="mt-4 p-3 rounded bg-black/40 border border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-slate-500">CHANNELS:</span>
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

      {/* Two Column: Selected Agent Details + Live Dialogue Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selected Agent Profile Drawer (1 Col) */}
        <div className="agentdev-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{selectedAgent?.icon}</span>
              <div>
                <h4 className="font-bold text-white text-base">{selectedAgent?.name}</h4>
                <p className="text-xs text-indigo-400 font-mono">{selectedAgent?.role}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Persona & Specialization</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{selectedAgent?.persona}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Action</span>
              <div className="p-2 rounded bg-black/40 border border-white/5 font-mono text-sky-400 text-xs mt-1">
                {selectedAgent?.primary_action}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Deliverable Output</span>
              <div className="p-2 rounded bg-black/40 border border-white/5 font-mono text-emerald-400 text-xs mt-1">
                {selectedAgent?.output_artifact}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                <Wrench className="w-3 h-3 text-indigo-400" /> Agent Tools & Capabilities
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
          </div>
        </div>

        {/* Live Agent Dialogue Stream (2 Cols) */}
        <div className="md:col-span-2 agentdev-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Agent-to-Agent Communication History
            </h4>
            <span className="text-[10px] font-mono text-slate-500">{messages.length} Recorded Exchanges</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-3 rounded bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sky-400 font-semibold">{msg.from_agent}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-purple-400 font-semibold">{msg.to_agent}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 font-mono">
                  Topic: <span className="text-indigo-300">{msg.topic}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950 p-2 rounded border border-white/5">
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
