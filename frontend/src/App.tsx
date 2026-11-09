import React, { useState, useEffect } from 'react';
import {
  ViewType,
  DashboardStats,
  ProjectMetadata,
  TaskStatus,
  AgentRole,
  AgentActivity,
  ApprovalItem,
  SystemHealth,
} from './types';
import { api } from './services/api';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer, ToastMessage } from './components/Toast';

// Views
import { OverviewDashboard } from './views/OverviewDashboard';
import { NewProjectWizard } from './views/NewProjectWizard';
import { RepositoriesView } from './views/RepositoriesView';
import { AgentWorkspace } from './views/AgentWorkspace';
import { ExecutionMonitor } from './views/ExecutionMonitor';
import { CodeExplorer } from './views/CodeExplorer';
import { ActivityStream } from './views/ActivityStream';
import { ArchitectureCenter } from './views/ArchitectureCenter';
import { QACenter } from './views/QACenter';
import { ApprovalsView } from './views/ApprovalsView';
import { DocumentationView } from './views/DocumentationView';
import { APIMonitor } from './views/APIMonitor';
import { SettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [activeProject, setActiveProject] = useState<string>('');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [roles, setRoles] = useState<AgentRole[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTaskData, setActiveTaskData] = useState<TaskStatus | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const addToast = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    const newToast: ToastMessage = { id: Math.random().toString(), text, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    try {
      const [h, s, p, r, act, appr] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getStats().catch(() => null),
        api.getProjects().catch(() => ({ projects: [] })),
        api.getRoles().catch(() => ({ roles: [] })),
        api.getActivities().catch(() => ({ activities: [] })),
        api.getApprovals().catch(() => ({ approvals: [] })),
      ]);

      if (h) setHealth(h);
      if (s) setStats(s);
      if (p.projects) {
        setProjects(p.projects);
        if (!activeProject && p.projects.length > 0) {
          setActiveProject(p.projects[0].name);
        }
      }
      if (r.roles) setRoles(r.roles);
      if (act.activities) setActivities(act.activities);
      if (appr.approvals) setApprovals(appr.approvals);
    } catch (err) {
      console.error('Error refreshing platform data:', err);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Polling loop for active tasks
  useEffect(() => {
    if (!activeTaskId) return;

    const pollTask = async () => {
      try {
        const data = await api.getTaskStatus(activeTaskId);
        setActiveTaskData(data);
        if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
          if (data.status === 'completed') {
            addToast(`Project ${data.project_name} successfully built!`, 'success');
            refreshData();
          } else {
            addToast(`Task ended with status: ${data.status}`, 'error');
          }
          setActiveTaskId(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    pollTask();
    const pollInterval = setInterval(pollTask, 1500);
    return () => clearInterval(pollInterval);
  }, [activeTaskId]);

  const handleLaunchProject = async (payload: any) => {
    try {
      const res = await api.generateProject(payload);
      addToast(`Pipeline dispatched! Task ID: ${res.task_id}`, 'success');
      setActiveTaskId(res.task_id);
      setActiveProject(payload.project_name);
      setCurrentView('execution');
    } catch (err: any) {
      addToast(`Launch failed: ${err.message}`, 'error');
    }
  };

  const handleCancelTask = async () => {
    if (activeTaskData) {
      await api.cancelTask(activeTaskData.task_id);
      addToast(`Task cancelled.`, 'info');
      setActiveTaskId(null);
    }
  };

  const handleRetryTask = async () => {
    if (activeTaskData) {
      const res = await api.retryTask(activeTaskData.task_id);
      addToast(`Task retry initiated!`, 'success');
      setActiveTaskId(res.task_id);
    }
  };

  const handleApprovalAction = async (id: number, status: 'approved' | 'rejected') => {
    const feedback = prompt(status === 'approved' ? 'Optional approval comments:' : 'Enter revision feedback:');
    if (feedback === null) return;
    try {
      await api.takeApprovalAction(id, status, feedback || '');
      addToast(`Checkpoint updated to ${status}.`, 'success');
      refreshData();
    } catch (err: any) {
      addToast(`Action failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#07090E] text-slate-100 ${theme}`}>
      <Topbar
        health={health}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onNavigate={setCurrentView}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 overflow-y-auto bg-[#07090E] p-6">
          <div className="pb-6 mb-6 border-b border-white/5">
            <h1 className="text-xl font-bold tracking-tight text-white capitalize">
              {currentView.replace('-', ' ')}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous AI Software Engineering Framework powered by MetaGPT & FastAPI
            </p>
          </div>

          {currentView === 'overview' && (
            <OverviewDashboard
              stats={stats}
              projects={projects}
              activities={activities}
              onNavigate={setCurrentView}
              onOpenExplorer={(name) => {
                setActiveProject(name);
                setCurrentView('explorer');
              }}
            />
          )}

          {currentView === 'new-project' && <NewProjectWizard onLaunch={handleLaunchProject} />}

          {currentView === 'projects' && (
            <RepositoriesView
              projects={projects}
              onNavigate={setCurrentView}
              onOpenExplorer={(name) => {
                setActiveProject(name);
                setCurrentView('explorer');
              }}
            />
          )}

          {currentView === 'workspace' && <AgentWorkspace roles={roles} activeTask={activeTaskData} />}

          {currentView === 'execution' && (
            <ExecutionMonitor
              task={activeTaskData}
              onCancel={handleCancelTask}
              onRetry={handleRetryTask}
              onCopyLogs={() => addToast('Logs copied to clipboard.', 'success')}
            />
          )}

          {currentView === 'explorer' && (
            <CodeExplorer
              projects={projects}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              onCopySuccess={() => addToast('Code copied to clipboard.', 'success')}
            />
          )}

          {currentView === 'activity' && <ActivityStream activities={activities} />}

          {currentView === 'architecture' && <ArchitectureCenter />}

          {currentView === 'qa' && (
            <QACenter
              projects={projects}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              onAuditFinished={(score) => addToast(`QA Audit completed! Score: ${score}%`, 'success')}
            />
          )}

          {currentView === 'approvals' && (
            <ApprovalsView approvals={approvals} onAction={handleApprovalAction} />
          )}

          {currentView === 'documentation' && (
            <DocumentationView
              projects={projects}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
            />
          )}

          {currentView === 'api-monitor' && <APIMonitor />}

          {currentView === 'settings' && (
            <SettingsView onSaveSuccess={() => addToast('Settings saved successfully.', 'success')} />
          )}
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
