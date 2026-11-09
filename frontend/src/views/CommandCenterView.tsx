import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Terminal, ShieldAlert, Zap, Database, BookOpen, MessageSquare } from 'lucide-react';
import { CommandChatMessage } from '../types';
import { api } from '../services/api';

interface CommandCenterProps {
  activeProject: string;
}

export const CommandCenterView: React.FC<CommandCenterProps> = ({ activeProject }) => {
  const [messages, setMessages] = useState<CommandChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'explain' | 'bugs' | 'optimize' | 'schema' | 'docs'>('chat');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getChatHistory(activeProject).then((res) => {
      setMessages(res.chats || []);
    });
  }, [activeProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string, customMode?: typeof mode) => {
    const text = (customPrompt || input).trim();
    if (!text || loading) return;

    const currentMode = customMode || mode;
    const userMsg: CommandChatMessage = { role: 'user', mode: currentMode, message: text, timestamp: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendCommandChat(text, activeProject, currentMode);
      const aiMsg: CommandChatMessage = {
        role: 'assistant',
        mode: currentMode,
        message: res.reply,
        timestamp: res.timestamp,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', mode: currentMode, message: `Error: ${err.message}`, timestamp: 'Just now' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { label: 'Explain Architecture', mode: 'explain' as const, prompt: 'Explain the architecture and module relationships in main.py.' },
    { label: 'Audit Bugs & Security', mode: 'bugs' as const, prompt: 'Identify potential edge-case bugs, unhandled exceptions, and security vulnerabilities.' },
    { label: 'Suggest Optimizations', mode: 'optimize' as const, prompt: 'Suggest asynchronous optimizations, caching strategies, and performance improvements.' },
    { label: 'Generate SQL Schema DDL', mode: 'schema' as const, prompt: 'Generate the relational PostgreSQL database schema DDL with indexes for this project.' },
    { label: 'Synthesize API Docs', mode: 'docs' as const, prompt: 'Generate comprehensive OpenAPI/Markdown documentation for all endpoints.' },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[640px]">
      {/* Topbar Info */}
      <div className="agentdev-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 p-[1px]">
            <div className="w-full h-full bg-[#0D111A] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">AI Command Center & Co-Pilot</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Active Context: <span className="text-indigo-400 font-semibold">{activeProject || 'Workspace'}</span>
            </p>
          </div>
        </div>

        {/* Mode Selector Chips */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          <button
            onClick={() => setMode('chat')}
            className={`px-2.5 py-1 rounded transition ${mode === 'chat' ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('explain')}
            className={`px-2.5 py-1 rounded transition ${mode === 'explain' ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            Explain
          </button>
          <button
            onClick={() => setMode('bugs')}
            className={`px-2.5 py-1 rounded transition ${mode === 'bugs' ? 'bg-rose-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            Bugs
          </button>
          <button
            onClick={() => setMode('optimize')}
            className={`px-2.5 py-1 rounded transition ${mode === 'optimize' ? 'bg-amber-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            Optimize
          </button>
          <button
            onClick={() => setMode('schema')}
            className={`px-2.5 py-1 rounded transition ${mode === 'schema' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
          >
            Schema
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono text-slate-300">
        <span className="text-[10px] text-slate-500 shrink-0 uppercase">Quick Actions:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMode(s.mode);
              handleSend(s.prompt, s.mode);
            }}
            className="px-2.5 py-1 rounded bg-black/40 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-950/30 text-slate-300 shrink-0 transition"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="agentdev-card flex-1 p-4 overflow-y-auto space-y-3 bg-[#05070B]">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-indigo-400" />
            <h4 className="text-sm font-bold text-white">AgentDev AI Command Center Ready</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
              Ask questions about the active repository, audit code for defects, request async optimizations, or generate database schemas.
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-slate-500">
                <span>{m.role === 'user' ? 'You' : 'AgentDev Co-Pilot'}</span>
                {m.mode && <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400">{m.mode}</span>}
              </div>
              <div
                className={`p-3.5 rounded-lg text-xs font-mono leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0E1424] text-slate-200 border border-white/10'
                }`}
              >
                {m.message}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 py-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /> Analyzing project workspace...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask AgentDev Co-Pilot (${mode} mode)...`}
          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          disabled={loading || !input.trim()}
          onClick={() => handleSend()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition"
        >
          <Send className="w-3.5 h-3.5" /> Send
        </button>
      </div>
    </div>
  );
};
