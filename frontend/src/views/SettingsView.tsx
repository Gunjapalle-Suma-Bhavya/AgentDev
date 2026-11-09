import React, { useState, useEffect } from 'react';
import { Cpu, Save, HardDrive } from 'lucide-react';
import { api } from '../services/api';

interface SettingsViewProps {
  onSaveSuccess: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSaveSuccess }) => {
  const [apiType, setApiType] = useState('openai');
  const [model, setModel] = useState('gpt-4o');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('Checking...');

  useEffect(() => {
    api.getConfig().then((conf) => {
      setApiType(conf.api_type || 'openai');
      setModel(conf.model || 'gpt-4o');
      setBaseUrl(conf.base_url || 'https://api.openai.com/v1');
      setMaskedKey(conf.is_configured ? `Configured (${conf.masked_key})` : 'Not Set');
    });
  }, []);

  const handleSave = async () => {
    try {
      await api.saveConfig({ api_type: apiType, model, api_key: apiKey, base_url: baseUrl });
      setApiKey('');
      setMaskedKey('Configured');
      onSaveSuccess();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="agentdev-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" /> LLM Provider & Model Configuration
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">API Provider</label>
            <select
              value={apiType}
              onChange={(e) => setApiType(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="openai">OpenAI (Official)</option>
              <option value="ollama">Ollama (Local Offline)</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="azure">Azure OpenAI</option>
              <option value="deepseek">DeepSeek API</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Model Name</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o, llama3:8b, etc."
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">API Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono text-slate-400">API Key (Masked & Encrypted)</label>
            <span className="text-[11px] font-mono text-indigo-400">{maskedKey}</span>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter new key to update..."
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="agentdev-card p-6 space-y-3">
        <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-400" /> Workspace & Persistence Storage
        </h3>
        <div className="text-xs font-mono text-slate-400 space-y-1">
          <div><span className="text-slate-500">Workspace Root:</span> C:\MetaGPT</div>
          <div><span className="text-slate-500">Repositories Directory:</span> C:\MetaGPT\workspace</div>
          <div><span className="text-slate-500">Database File:</span> C:\MetaGPT\agentdev.db (SQLite3)</div>
          <div><span className="text-slate-500">Python Virtualenv:</span> C:\MetaGPT\.venv\Scripts\python.exe</div>
        </div>
      </div>
    </div>
  );
};
