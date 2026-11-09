import React, { useState, useEffect, useRef } from 'react';
import { Copy, FileCode, Braces, BookOpen, FileText, X, SplitSquareVertical, Download, Search } from 'lucide-react';
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

interface OpenTab {
  path: string;
  name: string;
  content: string;
  extension: string;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCopySuccess,
}) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabPath, setActiveTabPath] = useState<string>('');
  const [fileFilter, setFileFilter] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeProject) {
      api.getProjectFiles(activeProject).then((res) => {
        const fileList = res.files || [];
        setFiles(fileList);
        if (fileList.length > 0) {
          openFileTab(activeProject, fileList[0].rel_path);
        }
      });
    }
  }, [activeProject]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [activeTabPath, openTabs, showDiff]);

  const openFileTab = async (projectName: string, filePath: string) => {
    const existing = openTabs.find((t) => t.path === filePath);
    if (existing) {
      setActiveTabPath(filePath);
      return;
    }

    try {
      const res = await api.getFileContent(projectName, filePath);
      const newTab: OpenTab = {
        path: filePath,
        name: filePath.split('/').pop() || filePath,
        content: res.content || '',
        extension: res.extension || 'python',
      };
      setOpenTabs((prev) => [...prev, newTab]);
      setActiveTabPath(filePath);
    } catch (err: any) {
      console.error(err);
    }
  };

  const closeTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t.path !== path);
    setOpenTabs(remaining);
    if (activeTabPath === path && remaining.length > 0) {
      setActiveTabPath(remaining[remaining.length - 1].path);
    }
  };

  const activeTab = openTabs.find((t) => t.path === activeTabPath);

  const filteredFiles = files.filter((f) =>
    f.rel_path.toLowerCase().includes(fileFilter.toLowerCase())
  );

  const getFileIcon = (ext: string) => {
    if (ext === 'py') return <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    if (ext === 'json') return <Braces className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    if (ext === 'md') return <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={`px-3 py-1 text-xs rounded transition flex items-center gap-1.5 font-mono ${
              showDiff ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>{showDiff ? 'Hide Diff' : 'Diff Inspector'}</span>
          </button>
          <button
            onClick={() => {
              if (activeTab) {
                navigator.clipboard.writeText(activeTab.content);
                onCopySuccess();
              }
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Code
          </button>
          <a
            href={`/api/projects/${encodeURIComponent(activeProject)}/download`}
            className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs rounded transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Project ZIP
          </a>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[580px]">
        {/* Left Pane: File Tree */}
        <div className="agentdev-card p-3 flex flex-col overflow-hidden">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={fileFilter}
              onChange={(e) => setFileFilter(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-black/40 border border-white/10 rounded pl-8 pr-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-2 mb-1">
            Workspace Files ({filteredFiles.length})
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {filteredFiles.map((f) => (
              <div
                key={f.rel_path}
                onClick={() => openFileTab(activeProject, f.rel_path)}
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono rounded cursor-pointer transition truncate ${
                  activeTabPath === f.rel_path
                    ? 'bg-indigo-600/20 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                {getFileIcon(f.extension)}
                <span className="truncate flex-1">{f.rel_path}</span>
                <span className="text-[10px] text-slate-500 font-sans">
                  {(f.size_bytes / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Multi-Tab Code Viewer / Diff Inspector */}
        <div className="md:col-span-3 agentdev-card flex flex-col overflow-hidden">
          {/* Open Tabs Bar */}
          <div className="bg-[#05070B] border-b border-white/10 flex items-center overflow-x-auto px-2 pt-1 gap-1">
            {openTabs.map((t) => {
              const isActive = t.path === activeTabPath;
              return (
                <div
                  key={t.path}
                  onClick={() => setActiveTabPath(t.path)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer transition border-t-2 select-none ${
                    isActive
                      ? 'bg-[#0D111A] text-white border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
                  }`}
                >
                  {getFileIcon(t.extension)}
                  <span className="truncate max-w-xs">{t.name}</span>
                  <button
                    onClick={(e) => closeTab(t.path, e)}
                    className="text-slate-500 hover:text-white rounded p-0.5 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumb info */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              {activeProject} / {activeTab?.path || 'No open tab'}
            </span>
            {activeTab && (
              <span className="text-[11px] text-indigo-400">
                {activeTab.content ? activeTab.content.split('\n').length : 0} Lines • {activeTab.extension.toUpperCase()}
              </span>
            )}
          </div>

          {/* Content Pane: Standard Code Viewer or Diff Mode */}
          <div className="flex-1 overflow-auto p-4 bg-[#05070B]">
            {showDiff ? (
              <div className="font-mono text-xs space-y-1">
                <div className="text-slate-500 pb-2 border-b border-white/10">
                  --- workspace/{activeTab?.path} (Original)
                  <br />
                  +++ workspace/{activeTab?.path} (Agent Generated)
                </div>
                {(activeTab?.content || '').split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">
                    <span className="select-none text-slate-600 w-10 text-right pr-3">{idx + 1}</span>
                    <span className="select-none text-emerald-500 font-bold mr-2">+</span>
                    <span className="whitespace-pre-wrap break-all">{line}</span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="m-0 p-0 bg-transparent">
                <code ref={codeRef} className={`language-${activeTab?.extension || 'python'} text-xs font-mono`}>
                  {activeTab?.content || '// Select a file from the workspace tree to view source code'}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
