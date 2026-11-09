import React, { useState, useEffect } from 'react';
import { FileCode2, ExternalLink } from 'lucide-react';
import { ApiEndpoint, ApiRequestLog } from '../types';
import { api } from '../services/api';

export const APIMonitor: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [requests, setRequests] = useState<ApiRequestLog[]>([]);

  useEffect(() => {
    api.getApiEndpoints().then((res) => setEndpoints(res.endpoints || []));
    api.getApiRequests().then((res) => setRequests(res.requests || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Live introspection of all active FastAPI endpoints and request performance metrics.
        </p>
        <div className="flex gap-2">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
          >
            <FileCode2 className="w-3.5 h-3.5" /> Swagger Docs (/docs)
          </a>
          <a
            href="http://localhost:8000/redoc"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium inline-flex items-center gap-1.5 transition"
          >
            ReDoc (/redoc) <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="agentdev-card p-4">
        <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">
          Registered REST Endpoints ({endpoints.length})
        </h4>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {endpoints.map((ep, i) => (
                <tr key={i} className="hover:bg-slate-900/50 text-xs font-mono">
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        ep.methods.includes('POST')
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {ep.methods.join(', ')}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200">{ep.path}</td>
                  <td className="py-2 px-3 text-slate-400 font-sans">{ep.summary || ep.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Request Logs */}
      <div className="agentdev-card p-4">
        <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3">
          Live Request Logs ({requests.length})
        </h4>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {requests.slice(0, 15).map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/50 text-xs font-mono">
                  <td className="py-2 px-3 text-slate-500">{req.timestamp}</td>
                  <td className="py-2 px-3 font-semibold text-slate-300">{req.method}</td>
                  <td className="py-2 px-3 text-slate-300 truncate max-w-xs">{req.endpoint}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        req.status_code === 200
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {req.status_code}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400">{req.duration_ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
