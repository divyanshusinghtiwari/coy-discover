'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Profile, SwipeAction, SwipeResponse } from '@/lib/types';
import { ProfileCard } from './ProfileCard';
import { ActionBar } from './ActionBar';
import { EmptyState } from './EmptyState';
import { MatchModal } from './MatchModal';

interface DiscoverFeedProps {
  onGoToMatches: () => void;
  onMatchCreated: () => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({
  onGoToMatches,
  onMatchCreated,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeAction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Fetch candidate discovery profiles from /api/feed
  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/feed');
      if (!res.ok) {
        throw new Error(`Failed to load discovery feed (${res.status})`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
        setCurrentIndex(0);
        setSwipeDirection(null);
      } else {
        throw new Error(data.error || 'Invalid feed response format');
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Handle swipe action (like or pass)
  const handleSwipe = async (action: SwipeAction) => {
    if (isSwiping || currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    setIsSwiping(true);
    setSwipeDirection(action);

    try {
      // Advance to next card in local state
      setCurrentIndex((prev) => prev + 1);

      // Persist swipe to SQLite backend
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: currentProfile.id,
          action,
        }),
      });

      const data: SwipeResponse = await res.json();

      if (data.isMatch && data.match) {
        setMatchedProfile(data.match.matchedUser);
        setIsMatchModalOpen(true);
        onMatchCreated();
      }
    } catch (err) {
      console.error('Failed to submit swipe:', err);
    } finally {
      setIsSwiping(false);
    }
  };

  // Keyboard controls for desktop power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or modal is open
      if (isMatchModalOpen || (e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('like');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('pass');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, profiles, isSwiping, isMatchModalOpen]);

  // Reset demo handler
  const handleReset = async () => {
    try {
      setIsResetting(true);
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await fetchFeed();
        onMatchCreated();
      }
    } catch (err) {
      console.error('Failed to reset:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Current and next candidate profiles in the stack
  const activeProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const hasProfiles = currentIndex < profiles.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[580px] p-6 text-center">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
        </div>
        <h4 className="text-lg font-bold text-white mb-1">Discovering Profiles</h4>
        <p className="text-xs text-slate-400">Finding nearby people with shared interests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[580px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">Unable to Load Feed</h4>
        <p className="text-xs text-slate-400 max-w-xs mb-6">{error}</p>
        <button
          onClick={fetchFeed}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 transition-all shadow-md active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between w-full h-full pb-16">
      {/* Top Header / Brand bar */}
      <header className="w-full flex items-center justify-between px-6 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-500/30">
            <span className="text-white text-xs font-black">C</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Coy
          </h1>
        </div>

        {/* Profiles remaining counter */}
        {hasProfiles && (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800/80">
            {profiles.length - currentIndex} available
          </span>
        )}
      </header>

      {/* Discovery Card Stack Area */}
      <div className="relative w-full max-w-[390px] h-[550px] sm:h-[580px] px-3 my-auto flex items-center justify-center">
        {hasProfiles ? (
          <div className="relative w-full h-full">
            {/* Background card preview for deck depth */}
            {nextProfile && (
              <ProfileCard
                key={nextProfile.id}
                profile={nextProfile}
                onSwipe={handleSwipe}
                isFront={false}
              />
            )}

            {/* Front active swipeable card */}
            <AnimatePresence custom={swipeDirection}>
              {activeProfile && (
                <ProfileCard
                  key={activeProfile.id}
                  profile={activeProfile}
                  onSwipe={handleSwipe}
                  isFront={true}
                  exitDirection={swipeDirection}
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            onGoToMatches={onGoToMatches}
            onReset={handleReset}
            isResetting={isResetting}
          />
        )}
      </div>

      {/* Desktop & Mobile Action Buttons */}
      {hasProfiles && (
        <div className="w-full max-w-[390px]">
          <ActionBar onSwipe={handleSwipe} disabled={isSwiping} />
        </div>
      )}

      {/* "It's a Match!" celebration modal */}
      <MatchModal
        isOpen={isMatchModalOpen}
        matchedProfile={matchedProfile}
        onClose={() => setIsMatchModalOpen(false)}
        onGoToMatches={() => {
          setIsMatchModalOpen(false);
          onGoToMatches();
        }}
      />
    </div>
  );
};
