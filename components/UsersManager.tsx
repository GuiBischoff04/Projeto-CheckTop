
import React, { useState, useMemo } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import type { User, Permission } from '../types';

// Icons
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
);

const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
);

const HardHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25c-4.137 0-7.5 3.33-7.5 7.44v1.86H4.25a.75.75 0 0 0 0 1.5h15.5a.75.75 0 0 0 0-1.5h-.25v-1.86c0-4.11-3.363-7.44-7.5-7.44Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25V3a.75.75 0 0 1 1.5 0v2.25m3 0V3a.75.75 0 0 1 1.5 0v2.25" />
    </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const ALL_PERMISSIONS: { id: Permission; label: string }[] = [
    { id: 'manage_templates', label: 'Gerenciar Checklists' },
    { id: 'execute_checklists', label: 'Executar Checklists' },
    { id: 'view_reports', label: 'Visualizar Relatórios' },
    { id: 'manage_users', label: 'Gerenciar Usuários' },
];

interface RoleConfig {
    id: string;
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    colorClass: string;
    bgClass: string;
    textClass: string;
    displayPermissions: string[];
}

const ROLES_CONFIG: RoleConfig[] = [
    {
        id: 'Administrador',
        title: 'Administrador',
        description: 'Acesso total ao sistema com permissões para gerenciar usuários, configurações e todas as funcionalidades.',
        icon: ShieldCheckIcon,
        colorClass: 'text-red-600',
        bgClass: 'bg-red-100',
        textClass: 'border-red-200',
        displayPermissions: ['Criar e editar checklists', 'Executar checklists', 'Gerenciar usuários', 'Configurar sistema', 'Visualizar relatórios']
    },
    {
        id: 'Gerente',
        title: 'Gerente',
        description: 'Supervisiona operações, aprova checklists e acessa relatórios gerenciais do departamento.',
        icon: UserGroupIcon,
        colorClass: 'text-yellow-600',
        bgClass: 'bg-yellow-100',
        textClass: 'border-yellow-200',
        displayPermissions: ['Criar e editar checklists', 'Executar checklists', 'Visualizar relatórios', 'Exportar dados', 'Gerenciar equipe']
    },
    {
        id: 'Operador',
        title: 'Operador',
        description: 'Executa checklists operacionais e registra observações durante as inspeções de campo.',
        icon: HardHatIcon,
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-100',
        textClass: 'border-emerald-200',
        displayPermissions: ['Executar checklists', 'Adicionar observações', 'Anexar fotos', 'Visualizar histórico próprio']
    }
];

export const UsersManager: React.FC = () => {
    const { users, addUser, updateUser, deleteUser, templates, notificationConfigs, toggleNotificationSubscriber } = useChecklistStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formRole, setFormRole] = useState('Operador');
    const [formPermissions, setFormPermissions] = useState<Permission[]>([]);
    
    // For managing notifications inside modal for NEW users or editing
    const [tempNotificationSubscriptions, setTempNotificationSubscriptions] = useState<string[]>([]);

    // Count active users per role
    const roleCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        users.forEach(user => {
            let roleKey = user.role;
            if (roleKey === 'Inspetor') roleKey = 'Operador';
            counts[roleKey] = (counts[roleKey] || 0) + 1;
        });
        return counts;
    }, [users]);

    const resetForm = () => {
        setFormName('');
        setFormEmail('');
        setFormRole('Operador');
        setFormPermissions([]);
        setEditingUserId(null);
        setTempNotificationSubscriptions([]);
    };

    const handleOpenCreate = () => {
        resetForm();
        setFormPermissions(['execute_checklists']);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUserId(user.id);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormRole(user.role);
        setFormPermissions(user.permissions);
        
        // Populate subscribed templates
        const subscribed = templates
            .filter(t => (notificationConfigs[t.id] || []).includes(user.id))
            .map(t => t.id);
        setTempNotificationSubscriptions(subscribed);
        
        setIsModalOpen(true);
    };

    const handlePermissionToggle = (permission: Permission) => {
        setFormPermissions(prev => 
            prev.includes(permission) 
                ? prev.filter(p => p !== permission) 
                : [...prev, permission]
        );
    };

    const handleNotificationToggle = (templateId: string) => {
        setTempNotificationSubscriptions(prev => 
            prev.includes(templateId) 
                ? prev.filter(id => id !== templateId)
                : [...prev, templateId]
        );
    }

    const handleRoleChange = (newRole: string) => {
        setFormRole(newRole);
        if (newRole === 'Administrador') {
            setFormPermissions(['manage_templates', 'manage_users', 'execute_checklists', 'view_reports']);
        } else if (newRole === 'Gerente') {
            setFormPermissions(['manage_templates', 'execute_checklists', 'view_reports']);
        } else {
            setFormPermissions(['execute_checklists']);
        }
    };

    const handleSaveUser = () => {
        if (!formName || !formEmail || !formRole) {
            alert('Por favor, preencha nome, email e cargo.');
            return;
        }

        const userId = editingUserId || `user-${Date.now()}`;

        const userData = {
            id: userId,
            name: formName,
            email: formEmail,
            role: formRole,
            permissions: formPermissions
        };

        if (editingUserId) {
            updateUser(editingUserId, userData);
        } else {
            addUser(userData);
        }

        // Update notification configs
        templates.forEach(template => {
            const shouldSubscribe = tempNotificationSubscriptions.includes(template.id);
            const currentlySubscribed = (notificationConfigs[template.id] || []).includes(userId);
            
            if (shouldSubscribe !== currentlySubscribed) {
                toggleNotificationSubscriber(template.id, userId);
            }
        });

        setIsModalOpen(false);
        resetForm();
    };

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Usuários e Permissões</h1>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <PlusIcon className="w-5 h-5" />
                    Novo Usuário
                </button>
            </div>

            {/* Role Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ROLES_CONFIG.map((role) => (
                    <div key={role.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${role.bgClass} ${role.colorClass}`}>
                                <role.icon className="w-8 h-8" />
                            </div>
                            <div className="text-right">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{role.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {roleCounts[role.id] || 0} usuário(s) ativo(s)
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                            {role.description}
                        </p>

                        <div className="mt-auto">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Permissões</h4>
                            <ul className="space-y-2">
                                {role.displayPermissions.map((perm, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <CheckCircleIcon className={`w-4 h-4 mr-2 ${role.colorClass}`} />
                                        {perm}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lista de Usuários</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cargo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permissões</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                                <UserIcon className="w-6 h-6" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.role === 'Administrador' ? 'bg-red-100 text-red-800' : 
                                              user.role === 'Gerente' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-emerald-100 text-emerald-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        <div className="flex flex-wrap gap-1">
                                            {user.permissions.length > 0 ? user.permissions.map(p => (
                                                <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                                    {ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                                </span>
                                            )) : <span className="text-xs italic">Padrão</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(user);
                                            }}
                                            className="relative z-10 text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 mr-3"
                                        >
                                            <PencilIcon className="w-5 h-5 pointer-events-none inline" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteUser(user.id);
                                            }}
                                            className="relative z-10 text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                        >
                                            <TrashIcon className="w-5 h-5 pointer-events-none inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUserId ? "Editar Usuário" : "Novo Usuário"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 p-2 border"
                            placeholder="Ex: João da Silva"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 p-2 border"
                            placeholder="Ex: joao@empresa.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo / Função</label>
                        <select
                            value={formRole}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 p-2 border"
                        >
                            <option value="Administrador">Administrador</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Operador">Operador</option>
                        </select>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4 mt-2">
                         <h3 className="block text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                            <BellIcon className="w-4 h-4" />
                            Assinaturas de Notificação
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Selecione quais checklists este usuário deve acompanhar.</p>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600 max-h-40 overflow-y-auto space-y-2">
                             {templates.length > 0 ? templates.map(template => (
                                <div key={template.id} className="flex items-center">
                                    <input
                                        id={`notif-sub-${template.id}`}
                                        type="checkbox"
                                        checked={tempNotificationSubscriptions.includes(template.id)}
                                        onChange={() => handleNotificationToggle(template.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`notif-sub-${template.id}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
                                        {template.title}
                                    </label>
                                </div>
                             )) : <p className="text-xs text-gray-500 italic">Nenhum checklist disponível.</p>}
                        </div>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissões de Acesso</label>
                        <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                            {ALL_PERMISSIONS.map(permission => (
                                <div key={permission.id} className="flex items-center">
                                    <input
                                        id={`perm-${permission.id}`}
                                        type="checkbox"
                                        checked={formPermissions.includes(permission.id)}
                                        onChange={() => handlePermissionToggle(permission.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`perm-${permission.id}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
                                        {permission.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-2 border-t dark:border-gray-700 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveUser}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md"
                        >
                            Salvar Usuário
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
