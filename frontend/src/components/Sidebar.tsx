import React from 'react';
import {
  LayoutDashboard,
  Wand2,
  Folders,
  Users,
  Network,
  Terminal,
  Activity,
  Sparkles,
  UserCheck,
  Code2,
  BarChart3,
  ShieldCheck,
  BookMarked,
  Radio,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navSections = [
    {
      title: 'Workspace',
      items: [
        { id: 'overview' as ViewType, label: 'Overview', icon: LayoutDashboard, color: 'text-sky-400' },
        { id: 'new-project' as ViewType, label: 'New Project Wizard', icon: Wand2, color: 'text-indigo-400' },
        { id: 'projects' as ViewType, label: 'Repositories', icon: Folders, color: 'text-amber-400' },
      ],
    },
    {
      title: 'Autonomous Agents',
      items: [
        { id: 'agent-network' as ViewType, label: 'Agent Network Graph', icon: Network, color: 'text-sky-400' },
        { id: 'workspace' as ViewType, label: 'Agent Workspace (SOP)', icon: Users, color: 'text-purple-400' },
        { id: 'execution' as ViewType, label: 'Live Monitor & Logs', icon: Terminal, color: 'text-emerald-400' },
        { id: 'command-center' as ViewType, label: 'AI Command Center', icon: Sparkles, color: 'text-amber-400' },
        { id: 'activity' as ViewType, label: 'Agent Activity Stream', icon: Activity, color: 'text-cyan-400' },
        { id: 'approvals' as ViewType, label: 'Human Approvals', icon: UserCheck, color: 'text-emerald-400' },
      ],
    },
    {
      title: 'Engineering & QA',
      items: [
        { id: 'explorer' as ViewType, label: 'Code Explorer & IDE', icon: Code2, color: 'text-sky-400' },
        { id: 'architecture' as ViewType, label: 'Architecture & Design', icon: Network, color: 'text-indigo-400' },
        { id: 'qa' as ViewType, label: 'Testing & QA Center', icon: ShieldCheck, color: 'text-rose-400' },
        { id: 'analytics' as ViewType, label: 'Project Analytics', icon: BarChart3, color: 'text-amber-400' },
        { id: 'documentation' as ViewType, label: 'Documentation Center', icon: BookMarked, color: 'text-emerald-400' },
      ],
    },
    {
      title: 'Platform',
      items: [
        { id: 'api-monitor' as ViewType, label: 'REST API Monitor', icon: Radio, color: 'text-teal-400' },
        { id: 'settings' as ViewType, label: 'Settings & LLM', icon: Settings, color: 'text-slate-400' },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0A0D15] flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-4 overflow-y-auto">
        {navSections.map((sec) => (
          <div key={sec.title}>
            <div className="px-3 text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-1">
              {sec.title}
            </div>
            <nav className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition text-left ${
                      isActive
                        ? 'bg-indigo-500/10 text-sky-400 border-l-2 border-indigo-500'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 bg-black/20 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>AgentDev v2.0.0</span>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>Docs</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
