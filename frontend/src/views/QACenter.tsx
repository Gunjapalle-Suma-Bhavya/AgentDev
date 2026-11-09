import React, { useState, useEffect } from 'react';
import { ShieldCheck, Play } from 'lucide-react';
import { ProjectMetadata, QAReport } from '../types';
import { api } from '../services/api';

interface QACenterProps {
  projects: ProjectMetadata[];
  activeProject: string;
  onSelectProject: (name: string) => void;
  onAuditFinished: (score: number) => void;
}

export const QACenter: React.FC<QACenterProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onAuditFinished,
}) => {
  const [report, setReport] = useState<QAReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeProject) {
      loadReport(activeProject);
    }
  }, [activeProject]);

  const loadReport = async (name: string) => {
    try {
      const res = await api.getQAReports(name);
      setReport(res.reports && res.reports.length > 0 ? res.reports[0] : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAudit = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const newReport = await api.runQAAudit(activeProject);
      setReport(newReport);
      onAuditFinished(newReport.quality_score);
    } catch (err: any) {
      alert(`Audit failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Project for QA Audit:</span>
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
        <button
          disabled={loading}
          onClick={handleRunAudit}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 shadow-sm transition"
        >
          <ShieldCheck className="w-4 h-4" /> {loading ? 'Running AST Parser...' : 'Run Automated QA Audit'}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="agentdev-card p-4">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Quality Score</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{report ? `${report.quality_score}%` : '--'}</div>
        </div>
        <div className="agentdev-card p-4">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Test Suite Files</span>
          <div className="text-2xl font-bold text-white mt-1">{report ? report.total_tests : '--'}</div>
        </div>
        <div className="agentdev-card p-4">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Passed AST Files</span>
          <div className="text-2xl font-bold text-sky-400 mt-1">{report ? report.passed : '--'}</div>
        </div>
        <div className="agentdev-card p-4">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Detected Syntax Errors</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{report ? report.syntax_errors : '--'}</div>
        </div>
      </div>

      {/* Report Summary */}
      {report ? (
        <div className="space-y-4">
          <div className="agentdev-card p-4">
            <h4 className="font-bold text-white text-sm mb-1">QA Audit Summary</h4>
            <p className="text-xs text-slate-300 font-mono">{report.summary}</p>
            <div className="text-[11px] text-slate-500 mt-2 font-mono">Audited at: {report.created_at}</div>
          </div>
          <div className="space-y-2">
            {(report.details || []).map((d, i) => (
              <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200">{d.file}</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    d.status === 'passed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {d.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
          <ShieldCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-xs text-slate-400 font-mono">No QA report generated for this project yet.</p>
          <button
            onClick={handleRunAudit}
            className="mt-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5" /> Run Automated QA Audit
          </button>
        </div>
      )}
    </div>
  );
};
