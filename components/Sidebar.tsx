
import React from 'react';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const ClipboardDocumentListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 6.5 4.225a2.25 2.25 0 0 1-1.857 1.108a48.338 48.338 0 0 0-1.123.08A2.25 2.25 0 0 0 3 6.108v11.785c0 1.243 1.007 2.25 2.25 2.25h9.75a2.25 2.25 0 0 0 2.25-2.25V9.334c0-.537-.213-1.036-.593-1.414a2.25 2.25 0 0 0-1.414-.593m-3.566 0a1.5 1.5 0 0 1-1.5-1.5V6.334a1.5 1.5 0 0 1 1.5-1.5h.001" />
  </svg>
);

const ClipboardDocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const Squares2X2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);

const BrandLogoFull: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 220 60" className={className} xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="42" fontFamily="sans-serif" fontWeight="800" fontSize="36" fill="#1F2937">CheckTop</text>
        <path d="M 10 52 L 195 52" stroke="#FF5722" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const BrandLogoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 60 60" className={className} xmlns="http://www.w3.org/2000/svg">
         <text x="30" y="42" fontFamily="sans-serif" fontWeight="800" fontSize="24" fill="#1F2937" textAnchor="middle">CT</text>
         <path d="M 10 52 L 50 52" stroke="#FF5722" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'manager', label: 'Checklists', icon: ClipboardDocumentListIcon },
    { id: 'completed', label: 'Execuções', icon: ClipboardDocumentCheckIcon },
    { id: 'non_conformities', label: 'Não Conformidades', icon: ExclamationTriangleIcon },
    { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { id: 'reports', label: 'Relatórios', icon: ChartBarIcon },
    { id: 'users', label: 'Usuários', icon: UsersIcon },
    { id: 'notifications', label: 'Notificações', icon: BellIcon },
  ];

  return (
    <aside className="w-16 sm:w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transition-all duration-300">
      <div className="flex items-center justify-center sm:justify-start sm:pl-6 h-16 border-b dark:border-gray-700 overflow-hidden">
         {/* Mobile/Collapsed: Show Icon Only */}
         <div className="sm:hidden">
            <BrandLogoIcon className="w-10 h-10" />
         </div>
         {/* Desktop: Show Full Logo */}
         <div className="hidden sm:block">
            <BrandLogoFull className="h-10 w-auto" />
         </div>
      </div>
      <nav className="flex-1 px-2 sm:px-4 py-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
              currentView === item.id
                ? 'bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="h-6 w-6 min-w-[24px]" />
            <span className="hidden sm:block ml-4 font-medium truncate">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
