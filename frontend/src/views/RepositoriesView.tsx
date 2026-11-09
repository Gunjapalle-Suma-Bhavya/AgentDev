import React from 'react';
import { Plus, Code, Download, FolderX } from 'lucide-react';
import { ProjectMetadata, ViewType } from '../types';

interface RepositoriesViewProps {
  projects: ProjectMetadata[];
  onNavigate: (view: ViewType) => void;
  onOpenExplorer: (name: string) => void;
}

export const RepositoriesView: React.FC<RepositoriesViewProps> = ({
  projects,
  onNavigate,
  onOpenExplorer,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          All autonomous repositories stored in workspace/ and indexed in persistence layer.
        </p>
        <button
          onClick={() => onNavigate('new-project')}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Generate New Repo
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-lg">
          <FolderX className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Generated Repositories</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Use the 5-step wizard to assemble the multi-agent team and build your first repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="agentdev-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {p.category || 'Python'}
                  </span>
                  <span className="text-xs text-slate-500">{p.modified || p.created_at}</span>
                </div>
                <h3 className="font-bold text-white text-lg">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(p.tech_stack || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{p.file_count || 0} files</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenExplorer(p.name)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition flex items-center gap-1.5"
                  >
                    <Code className="w-3.5 h-3.5" /> Open IDE
                  </button>
                  <a
                    href={`/api/projects/${encodeURIComponent(p.name)}/download`}
                    className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs rounded transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
