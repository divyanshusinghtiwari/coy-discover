'use client';

import React from 'react';
import { Compass, Heart, Home } from 'lucide-react';

export type NavTab = 'home' | 'discover' | 'matches';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  matchesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  matchesCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home Tab - Required placeholder */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 ${
            activeTab === 'home'
              ? 'text-rose-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home tab"
        >
          <div className="relative">
            <Home className="w-6 h-6 stroke-[2]" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Home</span>
        </button>

        {/* Discover Tab - Core Discovery & Swipe */}
        <button
          onClick={() => onTabChange('discover')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 ${
            activeTab === 'discover'
              ? 'text-rose-500 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Discover tab"
        >
          <div className="relative">
            <Compass className="w-6 h-6 stroke-[2]" />
            {activeTab === 'discover' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Discover</span>
        </button>

        {/* Matches Tab - Mutual matches */}
        <button
          onClick={() => onTabChange('matches')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 ${
            activeTab === 'matches'
              ? 'text-rose-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Matches tab"
        >
          <div className="relative">
            <Heart className="w-6 h-6 stroke-[2]" />
            {matchesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-lg shadow-rose-500/30">
                {matchesCount}
              </span>
            )}
            {activeTab === 'matches' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Matches</span>
        </button>
      </div>
    </nav>
  );
};
