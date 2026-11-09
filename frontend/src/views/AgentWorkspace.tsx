import React from 'react';
import { Users } from 'lucide-react';
import { AgentRole, TaskStatus } from '../types';

interface AgentWorkspaceProps {
  roles: AgentRole[];
  activeTask: TaskStatus | null;
}

export const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({ roles, activeTask }) => {
  return (
    <div className="space-y-6">
      <div className="agentdev-card p-5 bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border-purple-500/20">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" /> Standard Operating Procedure (SOP) Multi-Agent Workspace
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          MetaGPT decomposes software engineering into role-based Standard Operating Procedures. Each agent consumes outputs from preceding roles and publishes formal structured artifacts to the shared environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => {
          let stateBadge = (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Idle
            </span>
          );

          if (activeTask && activeTask.status === 'running') {
            const stage = activeTask.stage || '';
            const isActive =
              (r.id === 'pm' && stage.includes('Requirements')) ||
              (r.id === 'arch' && stage.includes('Architecture')) ||
              (r.id === 'pmgr' && stage.includes('Planning')) ||
              (r.id === 'eng' && stage.includes('Coding')) ||
              (r.id === 'qa' && stage.includes('QA'));

            if (isActive) {
              stateBadge = (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  Active
                </span>
              );
            }
          }

          return (
            <div key={r.id} className="agentdev-card p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-base">{r.name}</h4>
                      <p className="text-xs text-indigo-400 font-mono">{r.title}</p>
                    </div>
                  </div>
                  {stateBadge}
                </div>
                <div className="my-4">
                  <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
                  <div className="mt-3 p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-slate-400">
                    <div className="text-slate-500 mb-0.5">PRIMARY ACTION</div>
                    <div className="text-sky-300">{r.action}()</div>
                    <div className="text-slate-500 mt-2 mb-0.5">OUTPUT ARTIFACT</div>
                    <div className="text-emerald-400 truncate">{r.output}</div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{r.sop_step || 'SOP Step'}</span>
                <span className="text-indigo-400 font-medium">Standard SOP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
