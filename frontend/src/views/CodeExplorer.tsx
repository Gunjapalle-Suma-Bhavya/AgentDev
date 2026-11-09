import React, { useState, useEffect, useRef } from 'react';
import { Copy, FileCode, Braces, BookOpen, FileText } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import { ProjectMetadata, ProjectFile } from '../types';
import { api } from '../services/api';

interface CodeExplorerProps {
  projects: ProjectMetadata[];
  activeProject: string;
  onSelectProject: (name: string) => void;
  onCopySuccess: () => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCopySuccess,
}) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [codeContent, setCodeContent] = useState<string>('// Select a file to view code');
  const [extension, setExtension] = useState<string>('python');
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeProject) {
      api.getProjectFiles(activeProject).then((res) => {
        setFiles(res.files || []);
        if (res.files && res.files.length > 0) {
          loadFile(activeProject, res.files[0].rel_path);
        }
      });
    }
  }, [activeProject]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [codeContent, extension]);

  const loadFile = async (projectName: string, filePath: string) => {
    setSelectedFile(filePath);
    try {
      const res = await api.getFileContent(projectName, filePath);
      setCodeContent(res.content || '');
      setExtension(res.extension || 'python');
    } catch (err: any) {
      setCodeContent(`Error reading file: ${err.message}`);
    }
  };

  const getFileIcon = (ext: string) => {
    if (ext === 'py') return <FileCode className="w-4 h-4 text-sky-400 shrink-0" />;
    if (ext === 'json') return <Braces className="w-4 h-4 text-amber-400 shrink-0" />;
    if (ext === 'md') return <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />;
    return <FileText className="w-4 h-4 text-slate-400 shrink-0" />;
  };

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
                {p.name} ({p.file_count || 0} files)
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(codeContent);
            onCopySuccess();
          }}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[580px]">
        {/* Left: File Tree */}
        <div className="agentdev-card p-3 overflow-y-auto space-y-1">
          <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-2 mb-2">Workspace File Tree</div>
          <div className="space-y-0.5">
            {files.map((f) => (
              <div
                key={f.rel_path}
                onClick={() => loadFile(activeProject, f.rel_path)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition truncate ${
                  selectedFile === f.rel_path ? 'bg-indigo-600/20 text-white' : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                {getFileIcon(f.extension)}
                <span className="truncate flex-1">{f.rel_path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="md:col-span-3 agentdev-card flex flex-col overflow-hidden">
          <div className="p-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 truncate">
              {activeProject} / {selectedFile || 'No file selected'}
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-[#05070B]">
            <pre className="m-0 p-0 bg-transparent">
              <code ref={codeRef} className={`language-${extension} text-xs font-mono`}>
                {codeContent}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
