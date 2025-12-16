
import React, { useMemo } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import { ChecklistItemStatus } from '../types';

interface NonConformitiesProps {
    onViewChecklist: (instanceId: string) => void;
}

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

export const NonConformities: React.FC<NonConformitiesProps> = ({ onViewChecklist }) => {
    const { instances, templates } = useChecklistStore();

    const nonConformityList = useMemo(() => {
        const list: Array<{
            instanceId: string;
            templateTitle: string;
            date: string;
            itemText: string;
            itemId: string;
        }> = [];

        instances.forEach(instance => {
            if (!instance.completed) return;
            
            const template = templates.find(t => t.id === instance.templateId);
            if (!template) return;

            instance.items.forEach(item => {
                if (item.status === ChecklistItemStatus.NAO_CONFORME) {
                    list.push({
                        instanceId: instance.id,
                        templateTitle: template.title,
                        date: instance.createdAt,
                        itemText: item.text,
                        itemId: item.id
                    });
                }
            });
        });

        return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [instances, templates]);

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Central de Não Conformidades</h1>
             <p className="text-gray-600 dark:text-gray-400">
                Lista consolidada de todos os itens marcados como "Não Conforme" em inspeções concluídas.
             </p>

             {nonConformityList.length > 0 ? (
                 <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-50 dark:bg-gray-700">
                             <tr>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Checklist</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item Afetado</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ação</th>
                             </tr>
                         </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                             {nonConformityList.map((nc, index) => (
                                 <tr key={`${nc.instanceId}-${nc.itemId}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                         {new Date(nc.date).toLocaleDateString('pt-BR')} <span className="text-xs">{new Date(nc.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                         {nc.templateTitle}
                                     </td>
                                     <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                         {nc.itemText}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         <button 
                                            onClick={() => onViewChecklist(nc.instanceId)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center gap-1 text-sm font-medium"
                                         >
                                             Ver Checklist
                                             <ArrowRightIcon className="w-4 h-4" />
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             ) : (
                 <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900">
                        <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                     <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Tudo em ordem!</h3>
                     <p className="mt-1 text-gray-500 dark:text-gray-400">Nenhuma não conformidade encontrada nos registros atuais.</p>
                 </div>
             )}
        </div>
    );
};
