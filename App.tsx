
import React, { useState } from 'react';
import { ChecklistProvider } from './hooks/useChecklistStore';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChecklistManager } from './components/ChecklistManager';
import { ChecklistRunner } from './components/ChecklistRunner';
import { CompletedChecklists } from './components/CompletedChecklists';
import { NonConformities } from './components/NonConformities';
import { Reports } from './components/Reports';
import { UsersManager } from './components/UsersManager';
import { NotificationsManager } from './components/NotificationsManager';
import type { View, ActiveChecklist } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('manager');
  const [activeChecklist, setActiveChecklist] = useState<ActiveChecklist>(null);

  const renderContent = () => {
    switch (view) {
        case 'runner':
            if (activeChecklist) {
                return (
                    <ChecklistRunner 
                        instanceId={activeChecklist.instanceId} 
                        readonly={activeChecklist.readonly}
                        onBack={() => {
                            const nextView = activeChecklist.readonly ? 'completed' : 'manager';
                            setActiveChecklist(null); // Clean up active state
                            setView(nextView);
                        }} 
                    />
                );
            }
            return <ChecklistManager onStartChecklist={(instanceId) => {
                setActiveChecklist({ instanceId });
                setView('runner');
            }} />;
        case 'manager':
            return <ChecklistManager onStartChecklist={(instanceId) => {
                setActiveChecklist({ instanceId });
                setView('runner');
            }} />;
        case 'completed':
            return <CompletedChecklists onViewDetails={(instanceId) => {
                setActiveChecklist({ instanceId, readonly: true });
                setView('runner');
            }}/>;
        case 'non_conformities':
            return <NonConformities onViewChecklist={(instanceId) => {
                setActiveChecklist({ instanceId, readonly: true });
                setView('runner');
            }}/>;
        case 'reports':
            return <Reports />;
        case 'users':
            return <UsersManager />;
        case 'notifications':
            return <NotificationsManager />;
        case 'dashboard':
        default:
            return <Dashboard />;
    }
  };

  return (
    <ChecklistProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar currentView={view} setView={setView} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </ChecklistProvider>
  );
};

export default App;
