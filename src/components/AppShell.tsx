'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, NavTab } from './Navigation';
import { DiscoverFeed } from './DiscoverFeed';
import { MatchesView } from './MatchesView';
import { HomePlaceholder } from './HomePlaceholder';
import { MatchItem } from '@/lib/types';

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('discover');
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isMatchesLoading, setIsMatchesLoading] = useState<boolean>(true);

  // Fetch mutual matches from /api/matches
  const fetchMatches = useCallback(async () => {
    try {
      setIsMatchesLoading(true);
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.matches)) {
          setMatches(data.matches);
        }
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setIsMatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center sm:p-4 overflow-x-hidden">
      {/* Background Ambient Lighting for Desktop */}
      <div className="hidden sm:block absolute top-1/4 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Shell Enclosure */}
      <main className="relative w-full max-w-md h-screen sm:h-[844px] bg-[#090d16] sm:rounded-[40px] sm:border-[6px] sm:border-slate-800/90 shadow-2xl flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker notch simulation for mobile realism on desktop */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 z-30 pointer-events-none">
          <div className="w-24 h-4 bg-slate-900 rounded-full border border-slate-800/80" />
        </div>

        {/* Tab View Container */}
        <div className="flex-1 overflow-y-auto relative z-10 flex flex-col">
          {activeTab === 'home' && (
            <HomePlaceholder onGoToDiscover={() => setActiveTab('discover')} />
          )}

          {activeTab === 'discover' && (
            <DiscoverFeed
              onGoToMatches={() => setActiveTab('matches')}
              onMatchCreated={fetchMatches}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesView
              matches={matches}
              isLoading={isMatchesLoading}
              onGoToDiscover={() => setActiveTab('discover')}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          matchesCount={matches.length}
        />
      </main>
    </div>
  );
};
