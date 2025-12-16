
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import type { ChecklistTemplate, ChecklistInstance, ChecklistItem, ChecklistInstanceItem, User, NotificationConfig, AppNotification } from '../types';
import { ChecklistItemStatus, ChecklistItemType } from '../types';

// Mock data for initial state (fallback only)
const initialTemplates: ChecklistTemplate[] = [
  {
    id: 'template-1',
    title: 'Auditoria de Segurança Semanal',
    description: 'Verificar todos os pontos de segurança do setor de produção.',
    items: [
      { id: 't1-i1', text: 'Extintores de incêndio estão desobstruídos e com selo de validade.', type: ChecklistItemType.CONFORMITY_CHECK },
      { id: 't1-i2', text: 'Saídas de emergência estão livres e sinalizadas.', type: ChecklistItemType.CONFORMITY_CHECK },
      { id: 't1-i3', text: 'Nome do inspetor', type: ChecklistItemType.TEXT },
      { id: 't1-i4', text: 'Assinatura do inspetor', type: ChecklistItemType.SIGNATURE },
    ],
  },
   {
    id: 'template-2',
    title: 'Inspeção de Qualidade do Produto',
    description: 'Verificar a qualidade do produto final antes do envio.',
    items: [
      { id: 't2-i1', text: 'Embalagem sem avarias.', type: ChecklistItemType.CONFORMITY_CHECK },
      { id: 't2-i2', text: 'Produto conforme especificações de cor e tamanho.', type: ChecklistItemType.CONFORMITY_CHECK },
      { id: 't2-i3', text: 'Número do lote', type: ChecklistItemType.NUMBER, min: 1 },
      { id: 't2-i4', text: 'Foto da etiqueta', type: ChecklistItemType.PHOTO },
    ],
  }
];

const initialUsers: User[] = [
    {
        id: 'user-1',
        name: 'Administrador',
        email: 'admin@checktop.com',
        role: 'Administrador',
        permissions: ['manage_templates', 'manage_users', 'execute_checklists', 'view_reports']
    },
    {
        id: 'user-2',
        name: 'Carlos Inspetor',
        email: 'carlos@checktop.com',
        role: 'Inspetor',
        permissions: ['execute_checklists']
    }
];

interface ChecklistContextType {
  templates: ChecklistTemplate[];
  instances: ChecklistInstance[];
  users: User[];
  notificationConfigs: NotificationConfig;
  notifications: AppNotification[];
  addTemplate: (template: Omit<ChecklistTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Omit<ChecklistTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  startChecklist: (templateId: string) => string;
  updateItemStatus: (instanceId: string, itemId: string, status: ChecklistItemStatus) => void;
  updateItemValue: (instanceId: string, itemId: string, value: string | number | null) => void;
  completeChecklist: (instanceId: string) => void;
  getTemplateById: (id: string) => ChecklistTemplate | undefined;
  getInstanceById: (id: string) => ChecklistInstance | undefined;
  // User Management
  addUser: (user: User) => void; 
  updateUser: (id: string, user: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (id: string) => void;
  // Notifications
  toggleNotificationSubscriber: (templateId: string, userId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: (userId: string) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

// Hook personalizado para gerenciar localStorage de forma segura
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
      console.warn(`Erro ao ler ${key} do localStorage:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export const ChecklistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Usando o hook seguro para persistência
  const [templates, setTemplates] = useStickyState<ChecklistTemplate[]>(initialTemplates, 'checkTop_templates');
  const [instances, setInstances] = useStickyState<ChecklistInstance[]>([], 'checkTop_instances');
  const [users, setUsers] = useStickyState<User[]>(initialUsers, 'checkTop_users');
  const [notificationConfigs, setNotificationConfigs] = useStickyState<NotificationConfig>({}, 'checkTop_notifications');
  const [notifications, setNotifications] = useStickyState<AppNotification[]>([], 'checkTop_app_notifications');

  const addTemplate = useCallback((templateData: Omit<ChecklistTemplate, 'id'>) => {
    const newTemplate: ChecklistTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      items: templateData.items.map((item, index) => ({...item, id: `item-${Date.now()}-${index}`}))
    };
    setTemplates(prev => [...prev, newTemplate]);
  }, [setTemplates]);

  const updateTemplate = useCallback((id: string, templateData: Omit<ChecklistTemplate, 'id'>) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === id) {
         return {
             ...t,
             title: templateData.title,
             description: templateData.description,
             items: templateData.items.map((item, index) => ({
                 ...item,
                 id: item.id || `item-${Date.now()}-${index}` 
             }))
         };
      }
      return t;
    }));
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, [setTemplates]);

  const startChecklist = useCallback((templateId: string): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const newInstance: ChecklistInstance = {
      id: `instance-${Date.now()}`,
      templateId,
      createdAt: new Date().toISOString(),
      completed: false,
      items: template.items.map((item): ChecklistInstanceItem => ({
        ...item,
        status: ChecklistItemStatus.PENDENTE,
        value: null,
      })),
    };
    setInstances(prev => [newInstance, ...prev]);
    return newInstance.id;
  }, [templates, setInstances]);

  const updateItemStatus = useCallback((instanceId: string, itemId: string, status: ChecklistItemStatus) => {
    setInstances(prev => prev.map(instance => {
      if (instance.id === instanceId) {
        const updatedItems = instance.items.map(item => item.id === itemId ? { ...item, status } : item);
        return { ...instance, items: updatedItems };
      }
      return instance;
    }));
  }, [setInstances]);
  
  const updateItemValue = useCallback((instanceId: string, itemId: string, value: string | number | null) => {
    setInstances(prev => prev.map(instance => {
      if (instance.id === instanceId) {
        const updatedItems = instance.items.map(item => {
          if (item.id === itemId) {
            let status = ChecklistItemStatus.PENDENTE;
            const valStr = value !== null && value !== undefined ? String(value) : '';
            const hasValue = valStr.trim() !== '';

            if (hasValue) {
                // Inicialmente assumimos conforme se tiver valor
                status = ChecklistItemStatus.CONFORME;

                // Validação Específica para NÚMERO (validando quantidade de dígitos)
                if (item.type === ChecklistItemType.NUMBER) {
                    if (item.min !== undefined && valStr.length < item.min) {
                        status = ChecklistItemStatus.PENDENTE;
                    }
                    if (item.max !== undefined && valStr.length > item.max) {
                         status = ChecklistItemStatus.PENDENTE;
                    }
                }
            }
            
            return { ...item, value, status };
          }
          return item;
        });
        return { ...instance, items: updatedItems };
      }
      return instance;
    }));
  }, [setInstances]);

  const completeChecklist = useCallback((instanceId: string) => {
    setInstances(prev => {
        const instanceIndex = prev.findIndex(i => i.id === instanceId);
        if (instanceIndex === -1) return prev;
        
        const instance = prev[instanceIndex];
        if (instance.completed) return prev; // Already completed

        // Generate Notifications
        const template = templates.find(t => t.id === instance.templateId);
        if (template) {
            const subscribers = notificationConfigs[template.id] || [];
            const nonConformitiesCount = instance.items.filter(i => i.status === ChecklistItemStatus.NAO_CONFORME).length;
            
            const newNotifications: AppNotification[] = subscribers.map(userId => ({
                id: `notif-${Date.now()}-${userId}`,
                userId,
                templateId: template.id,
                title: 'Checklist Finalizado',
                message: `O checklist "${template.title}" foi finalizado. ${nonConformitiesCount > 0 ? `Atenção: ${nonConformitiesCount} não conformidades encontradas.` : 'Tudo conforme.'}`,
                date: new Date().toISOString(),
                read: false,
                type: nonConformitiesCount > 0 ? 'alert' : 'success'
            }));

            if (newNotifications.length > 0) {
                setTimeout(() => {
                    setNotifications(currentNotifs => [...newNotifications, ...currentNotifs]);
                }, 0);
            }
        }

        const newInstances = [...prev];
        newInstances[instanceIndex] = { ...instance, completed: true };
        return newInstances;
    });
  }, [templates, notificationConfigs, setInstances, setNotifications]);

  // User Management Methods
  const addUser = useCallback((user: User) => {
      setUsers(prev => [...prev, user]);
  }, [setUsers]);

  const updateUser = useCallback((id: string, userData: Partial<Omit<User, 'id'>>) => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
  }, [setUsers]);

  const deleteUser = useCallback((id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
  }, [setUsers]);

  // Notifications Logic
  const toggleNotificationSubscriber = useCallback((templateId: string, userId: string) => {
      setNotificationConfigs(prev => {
          const currentSubscribers = prev[templateId] || [];
          let newSubscribers;
          
          if (currentSubscribers.includes(userId)) {
              newSubscribers = currentSubscribers.filter(id => id !== userId);
          } else {
              newSubscribers = [...currentSubscribers, userId];
          }

          return {
              ...prev,
              [templateId]: newSubscribers
          };
      });
  }, [setNotificationConfigs]);

  const markNotificationRead = useCallback((notificationId: string) => {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }, [setNotifications]);

  const clearNotifications = useCallback((userId: string) => {
      setNotifications(prev => prev.filter(n => n.userId !== userId));
  }, [setNotifications]);

  const getTemplateById = useCallback((id: string) => templates.find(t => t.id === id), [templates]);
  const getInstanceById = useCallback((id: string) => instances.find(i => i.id === id), [instances]);
  
  return (
    <ChecklistContext.Provider value={{ 
        templates, 
        instances, 
        users,
        notificationConfigs,
        notifications,
        addTemplate, 
        updateTemplate,
        deleteTemplate,
        startChecklist, 
        updateItemStatus, 
        updateItemValue, 
        completeChecklist,
        getTemplateById, 
        getInstanceById,
        addUser,
        updateUser,
        deleteUser,
        toggleNotificationSubscriber,
        markNotificationRead,
        clearNotifications
    }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklistStore = (): ChecklistContextType => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklistStore must be used within a ChecklistProvider');
  }
  return context;
};
