
import React, { useMemo, useState } from 'react';
import { useChecklistStore } from '../hooks/useChecklistStore';
import { ChecklistItemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = {
  [ChecklistItemStatus.CONFORME]: '#10B981', // Emerald 500
  [ChecklistItemStatus.NAO_CONFORME]: '#EF4444', // Red 500
  [ChecklistItemStatus.NA]: '#6B7280', // Gray 500
  [ChecklistItemStatus.PENDENTE]: '#F59E0B' // Amber 500
};

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

const MetricCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

type PeriodFilter = '7' | '15' | '30' | 'custom';

export const Dashboard: React.FC = () => {
  const { instances, templates } = useChecklistStore();
  
  // States for filters
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('all');
  const [period, setPeriod] = useState<PeriodFilter>('30');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // 1. Filter Logic
  const filteredInstances = useMemo(() => {
    const now = new Date();
    
    return instances.filter(instance => {
      // Filter by Template
      if (selectedTemplateId !== 'all' && instance.templateId !== selectedTemplateId) {
        return false;
      }

      // Filter by Date
      const instanceDate = new Date(instance.createdAt);
      
      if (period === 'custom') {
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0); // Start of day
          if (instanceDate < start) return false;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999); // End of day
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
  }, [instances, selectedTemplateId, period, customStartDate, customEndDate]);

  // 2. Compute Metrics based on filteredInstances
  const stats = useMemo(() => {
    const completedInstances = filteredInstances.filter(i => i.completed);
    let totalItems = 0;
    let nonConformities = 0;
    let conformities = 0;

    for (const instance of completedInstances) {
      totalItems += instance.items.length;
      nonConformities += instance.items.filter(item => item.status === ChecklistItemStatus.NAO_CONFORME).length;
      conformities += instance.items.filter(item => item.status === ChecklistItemStatus.CONFORME).length;
    }

    const conformityRate = totalItems > 0 ? ((conformities / (conformities + nonConformities)) * 100).toFixed(1) : '0.0';

    return {
      completedChecklists: completedInstances.length,
      totalNonConformities: nonConformities,
      conformityRate,
    };
  }, [filteredInstances]);

  const nonConformitiesByTemplate = useMemo(() => {
    const data = templates.map(template => {
      // If a specific template is selected, we only want to show that one in the chart (or show 0 for others)
      // but typically bar charts look better if we filter out unrelated data if filtering is active.
      if (selectedTemplateId !== 'all' && template.id !== selectedTemplateId) {
          return null;
      }

      const nonConformities = filteredInstances
        .filter(i => i.templateId === template.id && i.completed)
        .reduce((acc, curr) => acc + curr.items.filter(item => item.status === ChecklistItemStatus.NAO_CONFORME).length, 0);
      
      return {
        name: template.title.split(' ').slice(0, 2).join(' '),
        fullName: template.title,
        'Não Conformidades': nonConformities
      };
    }).filter(item => item !== null);

    return data.filter(d => d && d['Não Conformidades'] > 0); // Only show templates with issues for cleaner chart
  }, [filteredInstances, templates, selectedTemplateId]);

  const overallStatusDistribution = useMemo(() => {
    const distribution = {
      [ChecklistItemStatus.CONFORME]: 0,
      [ChecklistItemStatus.NAO_CONFORME]: 0,
      [ChecklistItemStatus.NA]: 0,
      [ChecklistItemStatus.PENDENTE]: 0,
    };
    
    filteredInstances.forEach(instance => {
      instance.items.forEach(item => {
        distribution[item.status]++;
      });
    });

    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [filteredInstances]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Checklists Concluídos" value={stats.completedChecklists} description="No período selecionado." />
        <MetricCard title="Não Conformidades" value={stats.totalNonConformities} description="Itens fora do padrão no período." />
        <MetricCard title="Taxa de Conformidade" value={`${stats.conformityRate}%`} description="Média de conformidade." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Não Conformidades por Checklist</h2>
          {nonConformitiesByTemplate.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nonConformitiesByTemplate} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis allowDecimals={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }} 
                />
                <Legend />
                <Bar dataKey="Não Conformidades" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Nenhuma não conformidade registrada</p>
                <p className="text-xs">neste período ou filtro.</p>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribuição de Status</h2>
          {overallStatusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {overallStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ChecklistItemStatus]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Nenhum dado disponível</p>
                <p className="text-xs">para o filtro selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
