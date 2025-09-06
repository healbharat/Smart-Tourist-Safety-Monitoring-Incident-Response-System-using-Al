
import React, { useState } from 'react';

interface HeaderProps {
    onGenerateData: () => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({ onGenerateData }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateClick = async () => {
        setIsGenerating(true);
        await onGenerateData();
        setIsGenerating(false);
    };

  return (
    <header className="bg-brand-secondary p-4 flex justify-between items-center shadow-md">
      <div className="relative">
        <input
          type="search"
          placeholder="Search tourist ID, name..."
          className="bg-brand-primary text-brand-text rounded-full py-2 px-4 pl-10 w-96 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button 
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="bg-brand-accent hover:bg-opacity-80 disabled:bg-brand-light disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200"
        >
          {isGenerating ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          ) : (
             <SparklesIcon />
          )}
          {isGenerating ? 'Generating...' : 'Generate AI Data'}
        </button>
        <div className="relative">
          <BellIcon />
          <span className="absolute top-0 right-0 h-2 w-2 bg-brand-red rounded-full"></span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="https://picsum.photos/40" alt="User" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-sm">Admin</p>
            <p className="text-xs text-brand-light">Control Room Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-light hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m8 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM3 13a1 1 0 011 1v1h1a1 1 0 010 2H4v1a1 1 0 01-2 0v-1H1a1 1 0 010-2h1v-1a1 1 0 011-1zm12-2a1 1 0 011-1h1a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 01-1-1zM8 8a1 1 0 011 1v1h1a1 1 0 010 2H9v1a1 1 0 01-2 0v-1H6a1 1 0 010-2h1V9a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
