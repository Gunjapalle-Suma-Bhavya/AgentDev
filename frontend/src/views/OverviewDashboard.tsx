import React from 'react';
import {
  Folder,
  CheckCircle2,
  Loader,
  AlertCircle,
  Cpu,
  FileCode,
  Plus,
  Folders,
  FolderGit2,
  Code2,
  Download,
} from 'lucide-react';
import { DashboardStats, ProjectMetadata, AgentActivity, ViewType } from '../types';
import { StatsCard } from '../components/StatsCard';

interface OverviewProps {
  stats: DashboardStats | null;
  projects: ProjectMetadata[];
  activities: AgentActivity[];
  onNavigate: (view: ViewType) => void;
  onOpenExplorer: (name: string) => void;
}

export const OverviewDashboard: React.FC<OverviewProps> = ({
  stats,
  projects,
  activities,
  onNavigate,
  onOpenExplorer,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="agentdev-card p-6 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-[#0D111A] to-sky-950/20 border-indigo-500/20">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
            Autonomous AI Engineering
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">From Idea to Production, Powered by Collaborative AI.</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            AgentDev coordinates 5 specialized AI roles (Product Manager, System Architect, Project Manager, Software Engineer, QA Engineer) following Standard Operating Procedures (SOPs) to autonomously design, plan, implement, and verify complete software repositories.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('new-project')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-2 shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Create New Project
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium inline-flex items-center gap-2 transition"
            >
              <Folders className="w-4 h-4" /> Explore Existing Repositories
            </button>
          </div>
        </div>
      </div>

      {/* Real Stats Counters (6 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard label="Total Projects" value={stats?.total_projects || 0} icon={Folder} iconColor="text-sky-400" />
        <StatsCard label="Completed" value={stats?.completed_projects || 0} icon={CheckCircle2} iconColor="text-emerald-400" />
        <StatsCard label="Active Tasks" value={stats?.active_tasks || 0} icon={Loader} iconColor="text-amber-400" />
        <StatsCard label="Failed Tasks" value={stats?.failed_tasks || 0} icon={AlertCircle} iconColor="text-rose-400" />
        <StatsCard label="Agent Actions" value={stats?.total_agent_executions || 0} icon={Cpu} iconColor="text-purple-400" />
        <StatsCard
          label="Generated Files"
          value={stats?.generated_files || 0}
          subValue={`${stats?.storage_used_kb || 0} KB`}
          icon={FileCode}
          iconColor="text-indigo-400"
        />
      </div>

      {/* Two Column Layout: Recent Projects + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Projects (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" /> Recent Software Projects
            </h3>
            <button onClick={() => onNavigate('projects')} className="text-xs text-indigo-400 hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="agentdev-card p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {p.category || 'Full-Stack'}
                    </span>
                    <span className="text-xs text-slate-500">{p.modified || p.created_at}</span>
                  </div>
                  <h4 className="font-semibold text-white text-base truncate">{p.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">{p.file_count || 0} files</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenExplorer(p.name)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition flex items-center gap-1"
                    >
                      <Code2 className="w-3.5 h-3.5" /> Explorer
                    </button>
                    <a
                      href={`/api/projects/${encodeURIComponent(p.name)}/download`}
                      className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs rounded transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> ZIP
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Roles & Live Feed (1 Col) */}
        <div className="space-y-4">
          <div className="agentdev-card p-4">
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3 flex items-center justify-between">
              <span>Multi-Agent Team</span>
              <span className="text-emerald-400 text-[10px]">5 Roles Ready</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                <span className="font-medium text-slate-200">📋 Alice (Product Manager)</span>
                <span className="text-[10px] font-mono text-sky-400">WritePRD</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                <span className="font-medium text-slate-200">🏗️ Bob (System Architect)</span>
                <span className="text-[10px] font-mono text-purple-400">WriteDesign</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                <span className="font-medium text-slate-200">📊 Eve (Project Manager)</span>
                <span className="text-[10px] font-mono text-amber-400">WriteTasks</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                <span className="font-medium text-slate-200">💻 Alex (Software Engineer)</span>
                <span className="text-[10px] font-mono text-emerald-400">WriteCode</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                <span className="font-medium text-slate-200">🧪 David (QA Engineer)</span>
                <span className="text-[10px] font-mono text-rose-400">WriteCodeReview</span>
              </div>
            </div>
          </div>

          <div className="agentdev-card p-4">
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">Live Agent Audit Feed</h4>
            <div className="space-y-2.5">
              {activities.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-2.5 py-1.5 border-b border-slate-800/60 last:border-0">
                  <span className="text-xs px-2 py-0.5 rounded border font-mono font-medium text-indigo-300 bg-indigo-500/10 border-indigo-500/20">
                    {a.agent_name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{a.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{a.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
