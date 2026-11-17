'use client';

import React from 'react';
import { X, Heart, Star, Volume2, VolumeX } from 'lucide-react';
import { SwipeAction } from '@/lib/types';
import { sounds } from '@/lib/sound';

interface ActionBarProps {
  onSwipe: (action: SwipeAction) => void;
  disabled?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onSwipe, disabled = false }) => {
  const [isMuted, setIsMuted] = React.useState(sounds.getMuted());

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex items-center justify-center gap-6 py-4 px-2">
      {/* Sound toggle button */}
      <button
        onClick={handleToggleSound}
        className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        aria-label="Toggle sound effects"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Pass Button */}
      <div className="relative group">
        <button
          onClick={() => {
            sounds.playPassSound();
            onSwipe('pass');
          }}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-slate-900 border-2 border-rose-500/50 hover:border-rose-500 text-rose-500 hover:text-rose-400 hover:bg-rose-950/30 flex items-center justify-center shadow-lg shadow-rose-950/40 transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Pass (Swipe Left)"
        >
          <X className="w-8 h-8 stroke-[2.5]" />
        </button>
        <span className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          PASS (←)
        </span>
      </div>

      {/* Superlike / Star Accent */}
      <div className="relative group">
        <button
          onClick={() => {
            sounds.playLikeSound();
            onSwipe('like');
          }}
          disabled={disabled}
          className="w-12 h-12 rounded-full bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-400 hover:bg-amber-950/20 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Superlike"
        >
          <Star className="w-5 h-5 fill-amber-400/20 stroke-[2]" />
        </button>
        <span className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          STAR
        </span>
      </div>

      {/* Like Button */}
      <div className="relative group">
        <button
          onClick={() => {
            sounds.playLikeSound();
            onSwipe('like');
          }}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Like (Swipe Right)"
        >
          <Heart className="w-8 h-8 fill-white stroke-[2]" />
        </button>
        <span className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          LIKE (→)
        </span>
      </div>
    </div>
  );
};
