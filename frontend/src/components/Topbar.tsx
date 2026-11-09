import React from 'react';
import { Cpu, FolderGit2, Sparkles, Plus, SunMoon } from 'lucide-react';
import { ProjectMetadata, SystemHealth, ViewType } from '../types';

interface TopbarProps {
  health: SystemHealth | null;
  projects: ProjectMetadata[];
  activeProject: string;
  onSelectProject: (name: string) => void;
  onNavigate: (view: ViewType) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  health,
  projects,
  activeProject,
  onSelectProject,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="h-14 border-b border-white/10 bg-[#0D111A]/90 backdrop-blur sticky top-0 z-40 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Brand Logo */}
        <button onClick={() => onNavigate('overview')} className="flex items-center gap-2.5 text-left group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#0D111A] rounded-[7px] flex items-center justify-center group-hover:bg-transparent transition duration-300">
              <Cpu className="w-4 h-4 text-sky-400 group-hover:text-white transition" />
            </div>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AgentDev
            </span>
            <span className="text-[10px] text-slate-500 font-mono block -mt-1">Autonomous Multi-Agent IDE</span>
          </div>
        </button>

        {/* Academic Project Badge */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 6-Credit Major Project
        </span>

        {/* Project Selector */}
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/10">
          <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={activeProject}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Switch Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.file_count || 0} files)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* LLM Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 border border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className={`text-xs font-mono ${health?.llm_configured ? 'text-emerald-400' : 'text-amber-400'}`}>
            {health?.llm_configured ? `LLM: ${health.llm_model}` : 'LLM: Not Configured'}
          </span>
        </div>

        {/* Backend Status Ping */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-white/5 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-slate-400 text-[11px]">
            {health?.status === 'healthy' ? 'Backend Online (Port 8000)' : 'Backend Offline'}
          </span>
        </div>

        {/* Quick Action: New Project */}
        <button
          onClick={() => onNavigate('new-project')}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition"
          title="Toggle Dark / Light Theme"
        >
          <SunMoon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
