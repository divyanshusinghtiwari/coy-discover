'use client';

import React from 'react';
import { Compass } from 'lucide-react';

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export const HomePlaceholder: React.FC<HomePlaceholderProps> = ({ onGoToDiscover }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-600 shadow-inner">
        <span className="text-2xl font-light">🏠</span>
      </div>
      <h2 className="text-xl font-medium text-slate-300 mb-2">Home</h2>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        This is a placeholder tab as specified by the assignment requirements. Explore new connections in Discover.
      </p>
      <button
        onClick={onGoToDiscover}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
      >
        <Compass className="w-4 h-4" />
        Go to Discover
      </button>
    </div>
  );
};
