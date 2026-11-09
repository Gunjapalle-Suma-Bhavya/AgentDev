import React from 'react';
import { StopCircle, RotateCcw } from 'lucide-react';
import { TaskStatus } from '../types';
import { TerminalViewer } from '../components/Terminal';

interface ExecutionMonitorProps {
  task: TaskStatus | null;
  onCancel: () => void;
  onRetry: () => void;
  onCopyLogs: () => void;
}

export const ExecutionMonitor: React.FC<ExecutionMonitorProps> = ({
  task,
  onCancel,
  onRetry,
  onCopyLogs,
}) => {
  const getStatusBadge = () => {
    if (!task) return <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-400">IDLE</span>;
    if (task.status === 'completed')
      return <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">COMPLETED</span>;
    if (task.status === 'running')
      return <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 animate-pulse">RUNNING</span>;
    return <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">{task.status.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Execution Status Header */}
      <div className="agentdev-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ACTIVE ORCHESTRATION</span>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-lg font-bold text-white">{task?.project_name || 'No active task'}</h3>
              {getStatusBadge()}
              <span className="text-xs text-slate-500 font-mono">Task ID: {task?.task_id || '--'}</span>
            </div>
            <p className="text-xs text-indigo-400 font-mono mt-1">{task?.stage || 'Ready for assignment'}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48 text-right">
              <div className="text-xs font-mono text-slate-300 mb-1">
                Progress: <span className="font-bold text-sky-400">{task?.progress || 0}%</span> ({task?.elapsed || 0}s)
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-sky-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task?.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs rounded transition flex items-center gap-1"
              >
                <StopCircle className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={onRetry}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Terminal */}
      <TerminalViewer logs={task?.recent_logs || []} onCopy={onCopyLogs} />
    </div>
  );
};
