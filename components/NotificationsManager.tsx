
import React, { useMemo, useState } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';

const BellAlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const EnvelopeOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const FunnelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
);

export const NotificationsManager: React.FC = () => {
    const { notifications, users, templates, markNotificationRead, clearNotifications } = useChecklistStore();
    const [filterTemplateId, setFilterTemplateId] = useState<string>('all');
    
    // EM UM APP REAL: O ID viria do contexto de autenticação (Ex: useAuth())
    const currentUserId = users[0]?.id || 'user-1'; 

    const myNotifications = useMemo(() => {
        return notifications
            .filter(n => n.userId === currentUserId)
            .filter(n => {
                if (filterTemplateId === 'all') return true;
                // Old notifications might not have templateId, hide them if filtering by specific template
                return n.templateId === filterTemplateId;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [notifications, currentUserId, filterTemplateId]);

    const unreadCount = myNotifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg relative">
                        <BellAlertIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Suas Notificações</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Alertas recentes dos checklists que você assina.
                        </p>
                    </div>
                </div>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterTemplateId}
                        onChange={(e) => setFilterTemplateId(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer min-w-[150px]"
                    >
                        <option value="all">Todas as notificações</option>
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>{template.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-750">
                    <span className="text-sm font-medium text-gray-500">
                        Mostrando {myNotifications.length} notificação(ões)
                    </span>
                    {myNotifications.length > 0 && (
                        <button 
                            onClick={() => clearNotifications(currentUserId)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Limpar Histórico
                        </button>
                    )}
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {myNotifications.length > 0 ? (
                        myNotifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 flex gap-4 ${!notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                                onClick={() => markNotificationRead(notification.id)}
                            >
                                <div className={`flex-shrink-0 mt-1`}>
                                    {notification.type === 'alert' ? (
                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                                            <BellAlertIcon className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <CheckIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {notification.title}
                                            {!notification.read && <span className="ml-2 inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(notification.date).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <EnvelopeOpenIcon className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-lg font-medium">Você não tem notificações.</p>
                            <p className="text-sm">
                                {filterTemplateId === 'all' 
                                    ? 'Preencha um checklist para gerar alertas.' 
                                    : 'Nenhuma notificação encontrada para este filtro.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
