import React from 'react';
import { AgentActivity } from '../types';

interface ActivityStreamProps {
  activities: AgentActivity[];
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ activities }) => {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Chronological audit trail of all actions and milestones recorded by autonomous agents in SQLite.
      </p>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 font-mono">No activity events recorded yet.</div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="agentdev-card p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400 border border-slate-700 shrink-0">
                {a.agent_name ? a.agent_name[0] : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{a.agent_name}</span>
                    <span className="text-xs text-slate-400 font-mono">({a.agent_role})</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {a.action}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{a.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
