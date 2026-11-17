'use client';

import React from 'react';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onGoToMatches: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onGoToMatches,
  onReset,
  isResetting,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[580px] p-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400 shadow-md">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">You&apos;re All Caught Up!</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">
        You&apos;ve reviewed all available profiles in your discovery area. Check back soon for new people or connect with your mutual matches.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onGoToMatches}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white" />
          View Your Matches
        </button>

        <button
          onClick={onReset}
          disabled={isResetting}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          {isResetting ? 'Resetting Deck...' : 'Reset Discovery Deck'}
        </button>
      </div>
    </div>
  );
};
