import React, { useEffect } from 'react';
import { Network } from 'lucide-react';
import mermaid from 'mermaid';

export const ArchitectureCenter: React.FC = () => {
  useEffect(() => {
    try {
      mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
      mermaid.run();
    } catch (err) {
      console.error('Mermaid render error:', err);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="agentdev-card p-5">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" /> System Architecture & Multi-Agent Design
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          AgentDev orchestrates a genuine client-server architecture powered by a FastAPI backend, an SQLite transactional persistence layer, and MetaGPT's event-driven multi-agent framework.
        </p>
      </div>

      {/* Diagram 1 */}
      <div className="agentdev-card p-5">
        <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">1. High-Level System Architecture</h4>
        <div className="flex justify-center p-4 bg-black/40 rounded border border-white/5 overflow-x-auto">
          <pre className="mermaid">
{`graph LR
    Client["AgentDev Frontend (Client IDE)"]
    API["FastAPI REST Server (server.py)"]
    DB[("SQLite Database (agentdev.db)")]
    Engine["Multi-Agent SOP Engine (MetaGPT)"]
    Workspace[("Workspace Repositories (/workspace)")]

    Client -->|REST API / HTTP| API
    API -->|Read / Write State| DB
    API -->|Spawn Agent Subprocess| Engine
    Engine -->|Write Source & Docs| Workspace
    Workspace -->|Code Explorer & ZIP| API`}
          </pre>
        </div>
      </div>

      {/* Diagram 2 */}
      <div className="agentdev-card p-5">
        <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">2. Standard Operating Procedure (SOP) Sequence Diagram</h4>
        <div className="flex justify-center p-4 bg-black/40 rounded border border-white/5 overflow-x-auto">
          <pre className="mermaid">
{`sequenceDiagram
    autonumber
    actor User as User / Product Owner
    participant PM as Alice (Product Manager)
    participant Arch as Bob (System Architect)
    participant PMgr as Eve (Project Manager)
    participant Eng as Alex (Software Engineer)
    participant QA as David (QA Engineer)

    User->>PM: Project Requirement & Idea
    PM->>PM: WritePRD (User Stories, Scope)
    PM->>Arch: Product Requirements Document (PRD)
    Arch->>Arch: WriteDesign (Class Diagram, Data Models)
    Arch->>PMgr: System Design Specification
    PMgr->>PMgr: WriteTasks (Breakdown, Dependencies)
    PMgr->>Eng: File Implementation Tasks
    Eng->>Eng: WriteCode (Generate Python Modules)
    Eng->>QA: Modular Source Code
    QA->>QA: WriteCodeReview & Static AST Validation
    QA->>User: Verified Deliverable & Complete Repository`}
          </pre>
        </div>
      </div>

      {/* Agent Responsibility Matrix */}
      <div className="agentdev-card p-5">
        <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">3. Agent Role Responsibility Matrix</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Primary Action</th>
                <th className="py-2.5 px-3">Input Data</th>
                <th className="py-2.5 px-3">Output Artifact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Product Manager</td>
                <td className="py-2.5 px-3 text-sky-400">Alice</td>
                <td className="py-2.5 px-3">WritePRD</td>
                <td className="py-2.5 px-3">Raw User Idea & Goals</td>
                <td className="py-2.5 px-3">docs/prds/*.json</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">System Architect</td>
                <td className="py-2.5 px-3 text-purple-400">Bob</td>
                <td className="py-2.5 px-3">WriteDesign</td>
                <td className="py-2.5 px-3">Approved PRD</td>
                <td className="py-2.5 px-3">docs/system_design/*.json</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Project Manager</td>
                <td className="py-2.5 px-3 text-amber-400">Eve</td>
                <td className="py-2.5 px-3">WriteTasks</td>
                <td className="py-2.5 px-3">System Architecture</td>
                <td className="py-2.5 px-3">docs/tasks/*.json</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Software Engineer</td>
                <td className="py-2.5 px-3 text-emerald-400">Alex</td>
                <td className="py-2.5 px-3">WriteCode</td>
                <td className="py-2.5 px-3">Task Specification</td>
                <td className="py-2.5 px-3">Modular Source Code (*.py)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">QA Engineer</td>
                <td className="py-2.5 px-3 text-rose-400">David</td>
                <td className="py-2.5 px-3">WriteCodeReview</td>
                <td className="py-2.5 px-3">Generated Codebase</td>
                <td className="py-2.5 px-3">QA Report & AST Validation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
