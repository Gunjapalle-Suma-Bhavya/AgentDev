import React, { useState, useEffect } from 'react';
import { ProjectMetadata, DocArtifact } from '../types';
import { api } from '../services/api';

interface DocumentationViewProps {
  projects: ProjectMetadata[];
  activeProject: string;
  onSelectProject: (name: string) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
}) => {
  const [artifacts, setArtifacts] = useState<DocArtifact[]>([]);

  useEffect(() => {
    if (activeProject) {
      api.getProjectDocs(activeProject).then((res) => {
        setArtifacts(res.artifacts || []);
      });
    }
  }, [activeProject]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Select Project:</span>
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
      </div>

      {artifacts.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 font-mono">
          No documentation artifacts found in workspace for this project.
        </div>
      ) : (
        <div className="space-y-4">
          {artifacts.map((art, idx) => (
            <div key={idx} className="agentdev-card p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {art.type}
                  </span>
                  <h4 className="font-bold text-white text-base">{art.title}</h4>
                </div>
                <span className="text-xs text-slate-500 font-mono">{art.path}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
                {art.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
