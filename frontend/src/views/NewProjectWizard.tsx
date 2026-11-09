import React, { useState, useEffect } from 'react';
import { Wand2, ChevronRight, Play, Info, Sparkles, Layers } from 'lucide-react';
import { ProjectTemplate, ProjectProposal } from '../types';
import { api } from '../services/api';

interface WizardProps {
  onLaunch: (payload: any) => Promise<void>;
}

export const NewProjectWizard: React.FC<WizardProps> = ({ onLaunch }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Full-Stack');
  const [tagline, setTagline] = useState('');
  const [users, setUsers] = useState('');
  const [objectives, setObjectives] = useState('');
  const [functionalReqs, setFunctionalReqs] = useState(
    '1. User authentication and RBAC session control\n2. RESTful endpoints for CRUD operations\n3. Input sanitization and error boundaries\n4. Modular service decoupling'
  );
  const [nonFunctionalReqs, setNonFunctionalReqs] = useState(
    'Sub-200ms latency, high modular cohesion, complete unit test coverage.'
  );
  const [framework, setFramework] = useState('FastAPI');
  const [database, setDatabase] = useState('SQLite3');
  const [pattern, setPattern] = useState('Clean Architecture');
  const [codeReview, setCodeReview] = useState(true);
  const [runTests, setRunTests] = useState(true);
  const [nRounds, setNRounds] = useState(5);
  const [investment, setInvestment] = useState(3.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Templates & AI Idea Generator State
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [domainInput, setDomainInput] = useState('');
  const [generatedProposals, setGeneratedProposals] = useState<ProjectProposal[]>([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  useEffect(() => {
    api.getTemplates().then((res) => setTemplates(res.templates || []));
  }, []);

  const applyTemplate = (t: ProjectTemplate) => {
    setName(t.name);
    setCategory(t.category);
    setTagline(t.tagline);
    setUsers(t.targetUsers);
    setObjectives(t.objectives);
    setFramework(t.framework);
    setDatabase(t.database);
    setPattern(t.pattern);
    setFunctionalReqs(t.functionalReqs);
    setNonFunctionalReqs(t.nonFunctionalReqs);
    setNRounds(t.estimatedRounds);
  };

  const handleGenerateIdeas = async () => {
    if (!domainInput.trim()) return;
    setGeneratingIdeas(true);
    try {
      const res = await api.generateIdeas(domainInput);
      setGeneratedProposals(res.proposals || []);
    } catch (err: any) {
      alert(`Error generating ideas: ${err.message}`);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const applyProposal = (p: ProjectProposal) => {
    setName(p.name);
    setCategory(p.category);
    setTagline(p.tagline);
    setFramework(p.framework);
    setDatabase(p.database);
    setFunctionalReqs(p.core_features.map((f, i) => `${i + 1}. ${f}`).join('\n'));
    setObjectives(`Build high-throughput autonomous software for ${p.title}.`);
    setGeneratedProposals([]);
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      alert('Project Name is required.');
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const handleLaunch = async () => {
    setIsSubmitting(true);
    const cleanName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const fullIdea = `Build a complete, production-grade ${category} application named "${cleanName}".
Tagline / Goal: ${tagline}
Target Audience: ${users}
Objectives: ${objectives}
Functional Requirements:
${functionalReqs}
Non-Functional Requirements:
${nonFunctionalReqs}
Technology Stack:
Framework: ${framework}, Database: ${database}, Architecture: ${pattern}.
Ensure modular structure, type hinting, full test cases, and a comprehensive README.md.`;

    const payload = {
      idea: fullIdea,
      project_name: cleanName,
      investment,
      n_round: nRounds,
      code_review: codeReview,
      run_tests: runTests,
      category,
      tech_stack: [framework, database, 'Python'],
    };

    try {
      await onLaunch(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper Header */}
      <div className="agentdev-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-400" /> Autonomous Project Creation Wizard
          </h2>
          <span className="text-xs text-slate-400 font-mono">Step {step} of 5</span>
        </div>

        <div className="flex items-center justify-between relative px-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1 z-10 cursor-pointer" onClick={() => setStep(s)}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  s === step
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                    : s < step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {['Info', 'Requirements', 'Tech Stack', 'Agent Team', 'Launch'][s - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Info & Templates */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Industry Preset Templates */}
          <div className="agentdev-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> 1-Click Industry Templates
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Click to prefill wizard</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className="p-3 rounded bg-black/40 border border-white/10 hover:border-indigo-500/60 hover:bg-indigo-950/20 text-left transition space-y-1"
                >
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 block w-fit">
                    {t.category}
                  </span>
                  <div className="font-semibold text-white text-xs truncate">{t.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{t.framework} + {t.database}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Idea Generator Input */}
          <div className="agentdev-card p-4 space-y-3">
            <span className="text-xs font-mono font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Project Idea Generator
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdeas()}
                placeholder="Enter an industry or domain (e.g. Healthcare, Fintech, Cyber, Robotics)..."
                className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                disabled={generatingIdeas || !domainInput.trim()}
                onClick={handleGenerateIdeas}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> {generatingIdeas ? 'Proposing...' : 'Generate Ideas'}
              </button>
            </div>

            {/* Generated Proposal Cards */}
            {generatedProposals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
                {generatedProposals.map((prop, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyProposal(prop)}
                    className="p-3 rounded bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition space-y-1"
                  >
                    <span className="text-[10px] font-mono text-indigo-400">{prop.category}</span>
                    <h5 className="font-bold text-white text-xs">{prop.title}</h5>
                    <p className="text-[10px] text-slate-300 line-clamp-2">{prop.tagline}</p>
                    <div className="text-[10px] text-emerald-400 font-mono pt-1">Click to adopt idea →</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Info Inputs */}
          <div className="agentdev-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Step 1: Project Identity & Scope</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Name (snake_case)*</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. cyber_threat_detector"
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Full-Stack">Full-Stack Application</option>
                  <option value="Backend API">Backend REST Microservice</option>
                  <option value="Security Tool">Cybersecurity / Forensic Tool</option>
                  <option value="Machine Learning">Machine Learning Pipeline</option>
                  <option value="CLI Tool">Developer CLI / Terminal Utility</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Problem Statement / Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="What core problem does this application solve?"
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Stakeholders</label>
                <input
                  type="text"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  placeholder="e.g. Security Officers, Citizens"
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Primary Objective</label>
                <input
                  type="text"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="e.g. Automated incident triage"
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
              >
                Next: Define Requirements <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Requirements */}
      {step === 2 && (
        <div className="agentdev-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Step 2: Specifications</h3>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Functional Requirements (One per line)</label>
            <textarea
              rows={5}
              value={functionalReqs}
              onChange={(e) => setFunctionalReqs(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Non-Functional Requirements</label>
            <textarea
              rows={3}
              value={nonFunctionalReqs}
              onChange={(e) => setNonFunctionalReqs(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs">
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5"
            >
              Next: Select Tech Stack <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tech Stack */}
      {step === 3 && (
        <div className="agentdev-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Step 3: Tech Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
              >
                <option value="FastAPI">FastAPI (Python Async)</option>
                <option value="Flask">Flask (Lightweight)</option>
                <option value="Django">Django (Full-featured)</option>
                <option value="Typer">Typer CLI Utility</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Database</label>
              <select
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
              >
                <option value="SQLite3">SQLite3 (Zero-config)</option>
                <option value="PostgreSQL">PostgreSQL (Enterprise)</option>
                <option value="MongoDB">MongoDB (Document)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Architecture Pattern</label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
              >
                <option value="Clean Architecture">Clean Architecture</option>
                <option value="Microservices">Microservices</option>
                <option value="MVC">MVC Pattern</option>
              </select>
            </div>
          </div>
          <div className="p-3 bg-black/30 rounded border border-white/5 space-y-2 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={codeReview}
                onChange={(e) => setCodeReview(e.target.checked)}
                className="rounded bg-slate-900 border-white/10 text-indigo-600"
              />
              <span>Enable Static Code Review & Verification (David, QA Engineer)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={runTests}
                onChange={(e) => setRunTests(e.target.checked)}
                className="rounded bg-slate-900 border-white/10 text-indigo-600"
              />
              <span>Execute Automated Unit Tests on Generated Code</span>
            </label>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs">
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5"
            >
              Next: Configure Team <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Agent Team */}
      {step === 4 && (
        <div className="agentdev-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Step 4: Multi-Agent Team</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-black/30 border border-white/5 flex items-center justify-between">
              <span>📋 Alice — Product Manager</span>
              <span className="text-emerald-400 font-mono">Active (WritePRD)</span>
            </div>
            <div className="p-2.5 rounded bg-black/30 border border-white/5 flex items-center justify-between">
              <span>🏗️ Bob — System Architect</span>
              <span className="text-emerald-400 font-mono">Active (WriteDesign)</span>
            </div>
            <div className="p-2.5 rounded bg-black/30 border border-white/5 flex items-center justify-between">
              <span>📊 Eve — Project Manager</span>
              <span className="text-emerald-400 font-mono">Active (WriteTasks)</span>
            </div>
            <div className="p-2.5 rounded bg-black/30 border border-white/5 flex items-center justify-between">
              <span>💻 Alex — Software Engineer</span>
              <span className="text-emerald-400 font-mono">Active (WriteCode)</span>
            </div>
            <div className="p-2.5 rounded bg-black/30 border border-white/5 flex items-center justify-between">
              <span>🧪 David — QA Engineer</span>
              <span className="text-emerald-400 font-mono">Active (WriteCodeReview)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Rounds (n_round)</label>
              <input
                type="number"
                value={nRounds}
                onChange={(e) => setNRounds(parseInt(e.target.value) || 5)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Investment ($)</label>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(parseFloat(e.target.value) || 3.0)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs">
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5"
            >
              Next: Review & Launch <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Launch */}
      {step === 5 && (
        <div className="agentdev-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Step 5: Review & Launch Pipeline</h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="agentdev-card p-3">
              <span className="text-slate-500 block mb-1">PROJECT IDENTITY</span>
              <div className="text-white font-bold text-sm">{name}</div>
              <div className="text-slate-400 mt-1">{category}</div>
            </div>
            <div className="agentdev-card p-3">
              <span className="text-slate-500 block mb-1">ARCHITECTURE</span>
              <div className="text-white font-bold">{framework} + {database}</div>
              <div className="text-slate-400 mt-1">{pattern}</div>
            </div>
          </div>
          <div className="p-4 rounded bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200 leading-relaxed">
              Upon launching, the multi-agent team will sequentially communicate through the environment message pool. You can monitor live streaming logs in the Execution Monitor.
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between">
            <button onClick={() => setStep(4)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs">
              Back
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleLaunch}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white rounded text-xs font-bold inline-flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4" /> {isSubmitting ? 'Starting Pipeline...' : 'Launch Autonomous Agent Pipeline'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
