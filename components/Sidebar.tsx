
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V6zM12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);


const NavItem: React.FC<{
  view: View;
  label: string;
  icon: JSX.Element;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ view, label, icon, currentView, onClick }) => {
  const isActive = currentView === view;
  return (
    <li
      onClick={() => onClick(view)}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-brand-accent text-white shadow-lg'
          : 'text-brand-light hover:bg-brand-secondary hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-brand-secondary text-white flex flex-col p-4 shadow-2xl">
      <div className="flex items-center mb-10 p-2">
        <ShieldIcon className="w-10 h-10 text-brand-light"/>
        <h1 className="text-2xl font-bold ml-2">Aegis</h1>
      </div>
      <nav>
        <ul>
          <NavItem
            view={View.DASHBOARD}
            label="Dashboard"
            icon={<DashboardIcon />}
            currentView={currentView}
            onClick={setCurrentView}
          />
          <NavItem
            view={View.TOURISTS}
            label="Tourists"
            icon={<UsersIcon />}
            currentView={currentView}
            onClick={setCurrentView}
          />
          <NavItem
            view={View.ALERTS}
            label="Alerts"
            icon={<AlertIcon />}
            currentView={currentView}
            onClick={setCurrentView}
          />
        </ul>
      </nav>
      <div className="mt-auto p-2">
        <p className="text-xs text-brand-accent">© 2024 Smart Safety Initiative</p>
      </div>
    </aside>
  );
};

// SVG Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
