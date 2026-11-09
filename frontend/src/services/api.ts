import {
  DashboardStats,
  ProjectMetadata,
  TaskStatus,
  AgentRole,
  AgentActivity,
  ApprovalItem,
  QAReport,
  DocArtifact,
  ProjectFile,
  SystemHealth,
  ApiEndpoint,
  ApiRequestLog,
  AgentNetworkNode,
  AgentNetworkEdge,
  AgentMessage,
  CommandChatMessage,
  ProjectAnalytics,
  ProjectTemplate,
  ProjectProposal,
} from '../types';

const BASE_URL = '';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Health & Stats
  getHealth: () => request<SystemHealth>('/api/health'),
  getStats: () => request<DashboardStats>('/api/dashboard/stats'),
  getConfig: () => request<any>('/api/config'),
  saveConfig: (data: any) => request<any>('/api/config', { method: 'POST', body: JSON.stringify(data) }),

  // Multi-Agent Roles & Pipelines
  getRoles: () => request<{ roles: AgentRole[] }>('/api/roles'),
  generateProject: (payload: any) =>
    request<{ status: string; task_id: string; message: string }>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTaskStatus: (taskId: string) => request<TaskStatus>(`/api/task/${taskId}/status`),
  cancelTask: (taskId: string) => request<any>(`/api/task/${taskId}/cancel`, { method: 'POST' }),
  retryTask: (taskId: string) => request<{ status: string; task_id: string }>(`/api/task/${taskId}/retry`, { method: 'POST' }),

  // Multi-Agent Network & Visual Topology
  getAgentNetwork: () => request<{ nodes: AgentNetworkNode[]; edges: AgentNetworkEdge[] }>('/api/agents/network'),
  getAgentMessages: (taskId?: string) =>
    request<{ messages: AgentMessage[] }>(taskId ? `/api/agents/messages?task_id=${taskId}` : '/api/agents/messages'),

  // AI Command Center
  sendCommandChat: (message: string, projectName: string = '', mode: string = 'chat') =>
    request<{ reply: string; mode: string; project_name: string; timestamp: string }>('/api/command/chat', {
      method: 'POST',
      body: JSON.stringify({ message, project_name: projectName, mode }),
    }),
  getChatHistory: (projectName?: string) =>
    request<{ chats: CommandChatMessage[] }>(projectName ? `/api/command/history?project_name=${projectName}` : '/api/command/history'),

  // Project Analytics Dashboard
  getProjectAnalytics: (projectName: string) => request<ProjectAnalytics>(`/api/analytics/${projectName}`),

  // Templates & Idea Generation
  getTemplates: () => request<{ templates: ProjectTemplate[] }>('/api/templates'),
  generateIdeas: (domain: string) => request<{ domain: string; proposals: ProjectProposal[] }>('/api/ideas/generate', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  }),

  // Projects & Files Management
  getProjects: () => request<{ projects: ProjectMetadata[] }>('/api/projects'),
  deleteProject: (projectName: string) => request<any>(`/api/projects/${projectName}`, { method: 'DELETE' }),
  duplicateProject: (projectName: string, newName: string) =>
    request<any>(`/api/projects/${projectName}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ new_name: newName }),
    }),
  getProjectFiles: (projectName: string) => request<{ project_name: string; files: ProjectFile[] }>(`/api/projects/${projectName}/files`),
  getFileContent: (projectName: string, filePath: string) =>
    request<{ project_name: string; file_path: string; extension: string; content: string }>(
      `/api/projects/${projectName}/file-content?file_path=${encodeURIComponent(filePath)}`
    ),

  // Activity Stream & Approvals
  getActivities: () => request<{ activities: AgentActivity[] }>('/api/agent/activity'),
  getApprovals: () => request<{ approvals: ApprovalItem[] }>('/api/approvals'),
  takeApprovalAction: (approvalId: number, status: 'approved' | 'rejected', feedback: string = '') =>
    request<any>(`/api/approvals/${approvalId}/action`, {
      method: 'POST',
      body: JSON.stringify({ status, feedback }),
    }),

  // Testing & Quality Assurance
  runQAAudit: (projectName: string) =>
    request<QAReport>('/api/qa/run', {
      method: 'POST',
      body: JSON.stringify({ project_name: projectName }),
    }),
  getQAReports: (projectName?: string) =>
    request<{ reports: QAReport[] }>(projectName ? `/api/qa/reports?project_name=${encodeURIComponent(projectName)}` : '/api/qa/reports'),

  // Documentation & API Monitoring
  getProjectDocs: (projectName: string) =>
    request<{ project_name: string; artifacts: DocArtifact[] }>(`/api/docs/artifacts/${projectName}`),
  getApiEndpoints: () => request<{ endpoints: ApiEndpoint[] }>('/api/monitor/endpoints'),
  getApiRequests: () => request<{ requests: ApiRequestLog[] }>('/api/monitor/requests'),
};
