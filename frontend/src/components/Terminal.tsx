import React, { useState, useRef, useEffect } from 'react';
import { Copy, ArrowDown } from 'lucide-react';

interface TerminalProps {
  logs: string[];
  onCopy: () => void;
}

export const TerminalViewer: React.FC<TerminalProps> = ({ logs, onCopy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (searchTerm && !log.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (agentFilter !== 'ALL') {
      if (!log.toLowerCase().includes(agentFilter.toLowerCase())) return false;
    }
    return true;
  });

  const getLogStyle = (line: string) => {
    const l = line.toLowerCase();
    if (l.includes('error') || l.includes('fail')) return { color: 'text-rose-400 font-semibold', tag: '[ERROR]' };
    if (l.includes('productmanager') || l.includes('prd')) return { color: 'text-sky-300', tag: '[ALICE:PM]' };
    if (l.includes('architect') || l.includes('design')) return { color: 'text-purple-300', tag: '[BOB:ARCH]' };
    if (l.includes('projectmanager') || l.includes('task')) return { color: 'text-amber-300', tag: '[EVE:PMGR]' };
    if (l.includes('engineer') || l.includes('write')) return { color: 'text-emerald-300', tag: '[ALEX:ENG]' };
    if (l.includes('qa') || l.includes('review')) return { color: 'text-cyan-300', tag: '[DAVID:QA]' };
    return { color: 'text-slate-300', tag: '[INFO]' };
  };

  return (
    <div className="terminal-window p-4 flex flex-col h-[520px]">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-slate-400 ml-2">stdout / metagpt.software_company</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 w-36"
          />
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Agents</option>
            <option value="Alice">Alice (PM)</option>
            <option value="Bob">Bob (Architect)</option>
            <option value="Eve">Eve (Project Mgr)</option>
            <option value="Alex">Alex (Engineer)</option>
            <option value="David">David (QA)</option>
          </select>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 text-xs rounded font-mono inline-flex items-center gap-1 ${
              autoScroll ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <ArrowDown className="w-3 h-3" /> Auto-scroll
          </button>
          <button onClick={onCopy} className="p-1 rounded text-slate-400 hover:text-white" title="Copy Logs">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-0.5 text-slate-300 pr-2">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-4">// Waiting for pipeline execution logs...</div>
        ) : (
          filteredLogs.map((line, i) => {
            const { color, tag } = getLogStyle(line);
            return (
              <div key={i} className="leading-relaxed hover:bg-white/5 px-2 py-0.5 rounded transition flex items-start">
                <span className="text-slate-600 select-none mr-2 w-8 shrink-0 text-right">{i + 1}</span>
                <span className="text-indigo-400 font-bold mr-2 text-[11px] shrink-0">{tag}</span>
                <span className={`${color} break-all`}>{line.trim()}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
