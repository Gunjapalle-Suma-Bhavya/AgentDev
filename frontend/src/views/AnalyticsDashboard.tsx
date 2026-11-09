import React, { useState, useEffect } from 'react';
import { BarChart3, FileCode, Cpu, DollarSign, Database, ShieldCheck } from 'lucide-react';
import { ProjectMetadata, ProjectAnalytics } from '../types';
import { api } from '../services/api';
import { StatsCard } from '../components/StatsCard';

interface AnalyticsProps {
  projects: ProjectMetadata[];
  activeProject: string;
  onSelectProject: (name: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({
  projects,
  activeProject,
  onSelectProject,
}) => {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);

  useEffect(() => {
    if (activeProject) {
      api.getProjectAnalytics(activeProject).then((res) => {
        setAnalytics(res);
      });
    }
  }, [activeProject]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Target Project:</span>
          <select
            value={activeProject}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-black/40 border border-white/10 rounded px-3 py-1 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-400 font-mono">Empirical Codebase Metrics</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Lines of Code" value={analytics?.total_loc || 0} icon={FileCode} iconColor="text-sky-400" />
        <StatsCard label="Source & Spec Files" value={analytics?.file_count || 0} icon={Database} iconColor="text-emerald-400" />
        <StatsCard label="Estimated Tokens" value={analytics?.estimated_tokens.toLocaleString() || 0} icon={Cpu} iconColor="text-purple-400" />
        <StatsCard label="Estimated Cost" value={`$${analytics?.estimated_cost_usd || 0}`} icon={DollarSign} iconColor="text-amber-400" />
      </div>

      {/* Language Breakdown & Agent Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Breakdown Card */}
        <div className="agentdev-card p-5 space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" /> Language Distribution (LOC)
          </h4>
          <div className="space-y-3">
            {Object.entries(analytics?.languages || {}).map(([lang, loc]) => {
              const total = analytics?.total_loc || 1;
              const pct = Math.round((loc / total) * 100);
              let color = 'bg-sky-400';
              if (lang === 'md') color = 'bg-emerald-400';
              if (lang === 'json') color = 'bg-amber-400';
              if (lang === 'txt') color = 'bg-slate-400';

              return (
                <div key={lang} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 uppercase">{lang}</span>
                    <span className="text-slate-400">
                      {loc} LOC ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Workload Distribution */}
        <div className="agentdev-card p-5 space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> Agent Workload Breakdown
          </h4>
          <div className="space-y-3">
            {Object.entries(analytics?.agent_distribution || {}).map(([agent, pct]) => (
              <div key={agent} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{agent}</span>
                  <span className="text-indigo-400 font-semibold">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* File by File Metrics Table */}
      <div className="agentdev-card p-5">
        <h4 className="font-bold text-white text-sm mb-3">File Metrics Breakdown</h4>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-2 px-3">File Path</th>
                <th className="py-2 px-3">Extension</th>
                <th className="py-2 px-3 text-right">Lines of Code</th>
                <th className="py-2 px-3 text-right">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(analytics?.file_metrics || []).map((f, i) => (
                <tr key={i} className="hover:bg-slate-900/50">
                  <td className="py-2 px-3 text-slate-200">{f.file}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {f.extension}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-sky-400">{f.loc}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{(f.size_bytes / 1024).toFixed(1)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
