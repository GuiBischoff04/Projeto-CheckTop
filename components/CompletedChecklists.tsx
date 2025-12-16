
import React, { useMemo, useState } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import { ChecklistItemStatus } from '../types';

interface CompletedChecklistsProps {
    onViewDetails: (instanceId: string) => void;
}

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const CompletedChecklists: React.FC<CompletedChecklistsProps> = ({ onViewDetails }) => {
    const { instances, templates } = useChecklistStore();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('all');

    const completedInstances = useMemo(() => {
        return instances
            .filter(instance => instance.completed)
            .filter(instance => selectedTemplateId === 'all' || instance.templateId === selectedTemplateId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [instances, selectedTemplateId]);

    const getTemplateTitle = (templateId: string) => {
        return templates.find(t => t.id === templateId)?.title || 'Template Desconhecido';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Execuções Realizadas</h1>
                <div>
                    <label htmlFor="template-filter" className="sr-only">Filtrar por template</label>
                    <select
                        id="template-filter"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"
                    >
                        <option value="all">Todos os Checklists</option>
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>{template.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {completedInstances.length > 0 ? (
                <div className="space-y-4">
                    {completedInstances.map(instance => {
                        const conformities = instance.items.filter(i => i.status === ChecklistItemStatus.CONFORME).length;
                        const nonConformities = instance.items.filter(i => i.status === ChecklistItemStatus.NAO_CONFORME).length;

                        return (
                            <div key={instance.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold">{getTemplateTitle(instance.templateId)}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        Concluído em: {new Date(instance.createdAt).toLocaleString('pt-BR')}
                                    </p>
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                            {conformities} Sim
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            {nonConformities} Não
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onViewDetails(instance.id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                >
                                    <EyeIcon className="w-5 h-5" />
                                    Ver Detalhes
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Nenhum checklist concluído</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {selectedTemplateId === 'all'
                            ? 'Preencha um checklist para vê-lo aqui.'
                            : 'Nenhum checklist deste tipo foi concluído ainda.'}
                    </p>
                </div>
            )}
        </div>
    );
};
