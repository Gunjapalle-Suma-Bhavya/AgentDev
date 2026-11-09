export type ViewType =
  | 'overview'
  | 'new-project'
  | 'projects'
  | 'workspace'
  | 'execution'
  | 'explorer'
  | 'activity'
  | 'architecture'
  | 'qa'
  | 'approvals'
  | 'documentation'
  | 'api-monitor'
  | 'settings';

export interface DashboardStats {
  total_projects: number;
  completed_projects: number;
  active_tasks: number;
  failed_tasks: number;
  total_agent_executions: number;
  generated_files: number;
  storage_used_kb: number;
}

export interface ProjectMetadata {
  id: number;
  name: string;
  description: string;
  category: string;
  tech_stack: string[];
  status: string;
  file_count: number;
  created_at: string;
  updated_at?: string;
  modified?: string;
}

export interface TaskStatus {
  task_id: string;
  project_name: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'error';
  stage: string;
  progress: number;
  elapsed?: number;
  recent_logs?: string[];
  log_count?: number;
}

export interface AgentRole {
  id: string;
  name: string;
  title: string;
  icon: string;
  action: string;
  output: string;
  description: string;
  tools?: string[];
  sop_step?: string;
}

export interface AgentActivity {
  id: number;
  task_id: string;
  agent_role: string;
  agent_name: string;
  action: string;
  status: string;
  message: string;
  duration_sec: number;
  timestamp: string;
}

export interface ApprovalItem {
  id: number;
  task_id: string;
  project_name: string;
  stage: string;
  agent_name: string;
  artifact_type: string;
  artifact_title: string;
  artifact_content: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
  decided_at?: string;
}

export interface QADetail {
  file: string;
  status: 'passed' | 'failed';
  message: string;
}

export interface QAReport {
  id: number;
  project_name: string;
  task_id?: string;
  total_tests: number;
  passed: number;
  failed: number;
  skipped: number;
  syntax_errors: number;
  quality_score: number;
  summary: string;
  details: QADetail[];
  created_at: string;
}

export interface DocArtifact {
  type: string;
  title: string;
  path: string;
  content: string;
}

export interface ProjectFile {
  rel_path: string;
  size_bytes: number;
  extension: string;
}

export interface SystemHealth {
  status: string;
  service: string;
  version: string;
  python_version: string;
  database_connected: boolean;
  llm_provider: string;
  llm_model: string;
  llm_configured: boolean;
  active_processes: number;
  timestamp: string;
}

export interface ApiEndpoint {
  path: string;
  methods: string[];
  name: string;
  summary: string;
  tags: string[];
}

export interface ApiRequestLog {
  id: number;
  endpoint: string;
  method: string;
  status_code: number;
  duration_ms: number;
  timestamp: string;
}
