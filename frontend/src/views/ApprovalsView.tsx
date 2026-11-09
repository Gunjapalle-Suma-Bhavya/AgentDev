import React from 'react';
import { CheckCheck } from 'lucide-react';
import { ApprovalItem } from '../types';

interface ApprovalsViewProps {
  approvals: ApprovalItem[];
  onAction: (id: number, status: 'approved' | 'rejected') => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ approvals, onAction }) => {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Review deliverable checkpoints submitted by agents before production sign-off.
      </p>

      {approvals.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
          <CheckCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-xs text-slate-400 font-mono">All agent deliverables approved. No pending checkpoints.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((appr) => {
            const isPending = appr.status === 'pending';
            return (
              <div key={appr.id} className="agentdev-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-indigo-400 font-mono font-semibold">{appr.stage}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded font-mono ${
                        appr.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : appr.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {appr.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">{appr.artifact_title}</h4>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Project: {appr.project_name} • Submitted by: {appr.agent_name}
                  </div>
                  <div className="mt-3 p-3 bg-black/40 rounded border border-white/5 text-xs text-slate-300 font-mono line-clamp-3">
                    {appr.artifact_content}
                  </div>
                  {appr.feedback && (
                    <div className="mt-2 text-xs text-slate-400 font-mono italic">Feedback: "{appr.feedback}"</div>
                  )}
                </div>

                {isPending && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAction(appr.id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs rounded transition"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => onAction(appr.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-medium transition"
                    >
                      Approve Deliverable
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
