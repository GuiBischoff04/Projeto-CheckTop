
import React, { useMemo, useState } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import { ChecklistItemStatus } from '../types';

const FunnelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
);

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);

type PeriodFilter = '7' | '15' | '30' | 'custom';

export const Reports: React.FC = () => {
    const { instances, templates } = useChecklistStore();

    // States for filters
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('all');
    const [period, setPeriod] = useState<PeriodFilter>('30');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');

    const reportData = useMemo(() => {
        const now = new Date();

        // 1. Filter Instances based on Date Period first
        const filteredInstances = instances.filter(instance => {
            if (!instance.completed) return false;

            const instanceDate = new Date(instance.createdAt);
            
            if (period === 'custom') {
                if (customStartDate) {
                    const start = new Date(customStartDate);
                    start.setHours(0, 0, 0, 0);
                    if (instanceDate < start) return false;
                }
                if (customEndDate) {
                    const end = new Date(customEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (instanceDate > end) return false;
                }
            } else {
                const days = parseInt(period);
                const pastDate = new Date();
                pastDate.setDate(now.getDate() - days);
                pastDate.setHours(0, 0, 0, 0);
                
                if (instanceDate < pastDate) return false;
            }
            return true;
        });

        // 2. Map Templates to rows, calculating stats based on filtered instances
        let data = templates.map(template => {
            const templateInstances = filteredInstances.filter(i => i.templateId === template.id);
            const totalExecutions = templateInstances.length;
            
            let totalItems = 0;
            let totalConformities = 0;
            let totalNonConformities = 0;

            templateInstances.forEach(inst => {
                totalItems += inst.items.length;
                totalConformities += inst.items.filter(i => i.status === ChecklistItemStatus.CONFORME).length;
                totalNonConformities += inst.items.filter(i => i.status === ChecklistItemStatus.NAO_CONFORME).length;
            });

            const conformityRate = totalItems > 0 
                ? ((totalConformities / (totalConformities + totalNonConformities)) * 100).toFixed(1) 
                : '0.0';

            return {
                id: template.id,
                title: template.title,
                totalExecutions,
                totalNonConformities,
                conformityRate
            };
        });

        // 3. Filter the rows if a specific template is selected
        if (selectedTemplateId !== 'all') {
            data = data.filter(row => row.id === selectedTemplateId);
        }

        return data.sort((a, b) => b.totalExecutions - a.totalExecutions);
    }, [instances, templates, period, selectedTemplateId, customStartDate, customEndDate]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios Gerenciais</h1>
                
                {/* Filters Bar */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    
                    {/* Template Filter */}
                    <div className="flex items-center gap-2 px-2">
                        <FunnelIcon className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer min-w-[140px]"
                        >
                            <option value="all">Todos os Checklists</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="h-px sm:h-auto sm:w-px bg-gray-200 dark:bg-gray-600"></div>

                    {/* Period Filter */}
                    <div className="flex items-center gap-2 px-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                            className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
                        >
                            <option value="7">Últimos 7 dias</option>
                            <option value="15">Últimos 15 dias</option>
                            <option value="30">Últimos 30 dias</option>
                            <option value="custom">Personalizado</option>
                        </select>
                    </div>

                    {/* Custom Date Inputs */}
                    {period === 'custom' && (
                        <div className="flex items-center gap-2 animate-fadeIn">
                            <input 
                                type="date" 
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-1"
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                                type="date" 
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-1"
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Desempenho por Checklist</h3>
                        <p className="text-sm text-gray-500 mt-1">Exibindo dados para o período selecionado.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome do Checklist</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Execuções</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Não Conformidades</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Taxa de Adesão</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {reportData.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {row.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                            {row.totalExecutions}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 dark:text-red-400 font-semibold text-center">
                                            {row.totalNonConformities}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                parseFloat(row.conformityRate) >= 80 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : parseFloat(row.conformityRate) >= 50
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {row.conformityRate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {reportData.length === 0 && (
                                     <tr>
                                         <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                             Nenhum dado disponível para este filtro.
                                         </td>
                                     </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
