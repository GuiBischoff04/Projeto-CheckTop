
import React, { useState } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import { ChecklistItemStatus, ChecklistItemType } from '../types';
import { getCorrectiveActionSuggestion } from '../services/geminiService';
import type { ChecklistInstanceItem } from '../types';
import { ItemInputs } from './checklist-item-types/ItemInputs';

interface ChecklistRunnerProps {
  instanceId: string;
  onBack: () => void;
  readonly?: boolean;
}

const statusConfig = {
    [ChecklistItemStatus.CONFORME]: { color: 'bg-emerald-500', text: 'Sim' },
    [ChecklistItemStatus.NAO_CONFORME]: { color: 'bg-red-500', text: 'Não' },
    [ChecklistItemStatus.NA]: { color: 'bg-gray-500', text: 'N/A' },
    [ChecklistItemStatus.PENDENTE]: { color: 'bg-amber-500', text: 'Pendente' },
}

const ArrowUturnLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


const ChecklistItemCard: React.FC<{
    item: ChecklistInstanceItem;
    onStatusChange: (status: ChecklistItemStatus) => void;
    onValueChange: (value: string | number | null) => void;
    checklistTitle: string;
    readonly?: boolean;
}> = ({ item, onStatusChange, onValueChange, checklistTitle, readonly }) => {
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSuggestion = async () => {
        setIsLoading(true);
        setSuggestion('');
        const result = await getCorrectiveActionSuggestion(checklistTitle, item.text);
        setSuggestion(result);
        setIsLoading(false);
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all">
            <div className="flex justify-between items-start">
                <label className="text-gray-800 dark:text-gray-200 font-medium">{item.text}</label>
                {readonly && (
                     <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[item.status].color} text-white`}>
                        {statusConfig[item.status].text}
                     </span>
                )}
            </div>
            <div className="mt-4">
              <ItemInputs 
                item={item} 
                onStatusChange={onStatusChange} 
                onValueChange={onValueChange} 
                disabled={readonly}
              />
            </div>
             {!readonly && item.status === ChecklistItemStatus.NAO_CONFORME && item.type === ChecklistItemType.CONFORMITY_CHECK && (
                <div className="mt-4 border-t dark:border-gray-700 pt-4">
                    <button
                        onClick={handleSuggestion}
                        disabled={isLoading}
                        className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        {isLoading ? 'Gerando sugestões...' : 'Sugerir Ação Corretiva com IA'}
                    </button>
                    {suggestion && (
                        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <h4 className="font-semibold text-sm mb-1">Ações Sugeridas:</h4>
                            <div className="text-sm prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: suggestion.replace(/\*/g, '•').replace(/\n/g, '<br/>') }}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export const ChecklistRunner: React.FC<ChecklistRunnerProps> = ({ instanceId, onBack, readonly = false }) => {
  const { getInstanceById, getTemplateById, updateItemStatus, updateItemValue, completeChecklist } = useChecklistStore();
  
  const instance = getInstanceById(instanceId);
  const template = instance ? getTemplateById(instance.templateId) : undefined;
  
  if (!instance || !template) {
    return <div className="text-center">Checklist não encontrado.</div>;
  }
  
  const completedCount = instance.items.filter(i => i.status !== ChecklistItemStatus.PENDENTE).length;
  const progress = (completedCount / instance.items.length) * 100;
  
  // Garante que TODOS os itens tenham status diferente de pendente para liberar a finalização
  const isFullyAnswered = instance.items.every(i => i.status !== ChecklistItemStatus.PENDENTE);

  const handleFinish = () => {
      // Finaliza o checklist e volta automaticamente, sem confirmação extra.
      completeChecklist(instanceId);
      onBack();
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
        <ArrowUturnLeftIcon className="w-5 h-5" />
        {readonly ? 'Voltar' : 'Voltar para Checklists'}
      </button>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {template.title}
                    {readonly && <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">Somente Leitura</span>}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
            </div>
            {readonly && (
                <div className="text-right">
                    <p className="text-sm text-gray-500">Realizado em:</p>
                    <p className="font-medium">{new Date(instance.createdAt).toLocaleString('pt-BR')}</p>
                </div>
            )}
        </div>
        {!readonly && (
            <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-right mt-1 text-gray-500">{Math.round(progress)}% Concluído</p>
            </div>
        )}
      </div>

      <div className="space-y-4">
        {instance.items.map(item => (
            <ChecklistItemCard 
                key={item.id} 
                item={item} 
                onStatusChange={(status) => !readonly && updateItemStatus(instance.id, item.id, status)}
                onValueChange={(value) => !readonly && updateItemValue(instance.id, item.id, value)}
                checklistTitle={template.title}
                readonly={readonly}
            />
        ))}
      </div>
       
       {/* Button to Finish Checklist */}
       {!readonly && !instance.completed && isFullyAnswered && (
           <div className="flex justify-center mt-8 pb-8">
               <button 
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-emerald-700 transform transition-transform hover:scale-105"
               >
                   <CheckIcon className="w-6 h-6" />
                   Finalizar Checklist
               </button>
           </div>
       )}

       {instance.completed && !readonly && (
         <div className="text-center p-6 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-lg">
             <h3 className="text-xl font-bold">Checklist Concluído!</h3>
             <p>Todos os itens foram preenchidos.</p>
         </div>
       )}
    </div>
  );
};
