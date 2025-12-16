
export enum ChecklistItemStatus {
  CONFORME = 'Sim',
  NAO_CONFORME = 'Não',
  NA = 'N/A',
  PENDENTE = 'Pendente',
}

export enum ChecklistItemType {
    CONFORMITY_CHECK = 'Verificação de Conformidade',
    TEXT = 'Texto',
    NUMBER = 'Número',
    PHOTO = 'Foto',
    SIGNATURE = 'Assinatura',
    RATING = 'Avaliação',
}

export interface ChecklistItem {
  id: string;
  text: string;
  type: ChecklistItemType;
  min?: number; // Optional validation for numbers
  max?: number; // Optional validation for numbers
}

export interface ChecklistTemplate {
  id:string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

export interface ChecklistInstanceItem extends ChecklistItem {
  status: ChecklistItemStatus;
  value?: string | number | null; // For text, number, photo URL, signature data URL, etc.
}

export interface ChecklistInstance {
  id: string;
  templateId: string;
  createdAt: string;
  items: ChecklistInstanceItem[];
  completed: boolean;
}

export type Permission = 'manage_templates' | 'manage_users' | 'execute_checklists' | 'view_reports';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string; // Ex: 'Admin', 'Inspetor'
    permissions: Permission[];
    avatarUrl?: string;
}

export interface AppNotification {
    id: string;
    userId: string;
    templateId?: string; // Added for filtering
    title: string;
    message: string;
    date: string;
    read: boolean;
    type: 'info' | 'alert' | 'success';
}

export type NotificationConfig = Record<string, string[]>; // Key: TemplateID, Value: Array of UserIDs

export type View = 'dashboard' | 'manager' | 'runner' | 'completed' | 'non_conformities' | 'reports' | 'users' | 'notifications';
export type ActiveChecklist = { instanceId: string; readonly?: boolean } | null;
