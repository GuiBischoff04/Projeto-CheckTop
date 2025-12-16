
import React, { useState } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import type { ChecklistItem, ChecklistTemplate } from '../types';
import { ChecklistItemType } from '../types';

interface ChecklistManagerProps {
  onStartChecklist: (instanceId: string) => void;
}

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


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
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

const initialNewItem: Partial<ChecklistItem> = { text: '', type: ChecklistItemType.CONFORMITY_CHECK };

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({ onStartChecklist }) => {
  const { templates, startChecklist, addTemplate, deleteTemplate, updateTemplate } = useChecklistStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formItems, setFormItems] = useState<Partial<ChecklistItem>[]>([initialNewItem]);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormItems([initialNewItem]);
    setEditingTemplateId(null);
  }

  const handleOpenCreate = () => {
      resetForm();
      setIsModalOpen(true);
  }

  const handleOpenEdit = (template: ChecklistTemplate) => {
      setEditingTemplateId(template.id);
      setFormTitle(template.title);
      setFormDescription(template.description);
      setFormItems(template.items.map(item => ({...item}))); // Deep copy to avoid mutating store directly
      setIsModalOpen(true);
  }

  const handleAddItem = () => {
    setFormItems([...formItems, { ...initialNewItem }]);
  };

  const handleRemoveItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ChecklistItem, value: any) => {
    const updatedItems = [...formItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormItems(updatedItems);
  };
  
  const handleSaveTemplate = () => {
    if (formTitle.trim() && formItems.every(item => item.text?.trim())) {
      const templateData = { 
          title: formTitle, 
          description: formDescription,
          items: formItems as ChecklistItem[]
      };

      if (editingTemplateId) {
          updateTemplate(editingTemplateId, templateData);
      } else {
          addTemplate(templateData);
      }

      resetForm();
      setIsModalOpen(false);
    } else {
        alert("Por favor, preencha o título e todos os itens do checklist.")
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Checklists</h1>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Checklist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                     <h2 className="text-xl font-bold">{template.title}</h2>
                     <div className="flex gap-2">
                         <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(template);
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            title="Editar"
                         >
                             <PencilIcon className="w-5 h-5 pointer-events-none"/>
                         </button>
                         <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate(template.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            title="Excluir"
                         >
                             <TrashIcon className="w-5 h-5 pointer-events-none"/>
                         </button>
                     </div>
                </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
              <span className="text-sm text-gray-500">{template.items.length} itens</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const instanceId = startChecklist(template.id);
                onStartChecklist(instanceId);
              }}
              className="mt-auto w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Iniciar Preenchimento
            </button>
          </div>
        ))}
      </div>
      
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTemplateId ? "Editar Checklist" : "Criar Novo Checklist"}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Título</label>
            <input type="text" id="title" value={formTitle} onChange={e => setFormTitle(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" />
          </div>
           <div>
            <label htmlFor="description" className="block text-sm font-medium">Descrição</label>
            <textarea id="description" value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={2} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Itens do Checklist</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {formItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 border dark:border-gray-700 rounded-md bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                    type="text"
                    placeholder={`Pergunta ${index + 1}`}
                    value={item.text}
                    onChange={e => handleItemChange(index, 'text', e.target.value)}
                    className="w-full sm:flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"
                    />
                    <select
                        value={item.type}
                        onChange={(e) => handleItemChange(index, 'type', e.target.value as ChecklistItemType)}
                        className="w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"
                    >
                        {Object.values(ChecklistItemType).map(type => (
                        <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full disabled:opacity-50"
                    disabled={formItems.length <= 1}
                    >
                    <XMarkIcon className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>
                {item.type === ChecklistItemType.NUMBER && (
                    <div className="flex gap-4 items-center pl-1">
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">Mín Caracteres:</label>
                            <input 
                                type="number" 
                                value={item.min ?? ''} 
                                onChange={(e) => handleItemChange(index, 'min', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="w-24 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">Máx Caracteres:</label>
                            <input 
                                type="number" 
                                value={item.max ?? ''} 
                                onChange={(e) => handleItemChange(index, 'max', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="w-24 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}
              </div>
            ))}
            </div>
            <button type="button" onClick={handleAddItem} className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-sm font-semibold">
                <PlusIcon className="w-4 h-4" /> Adicionar item
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700 mt-4">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
             <button type="button" onClick={handleSaveTemplate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar Template</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
