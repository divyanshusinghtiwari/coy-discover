'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Profile } from '@/lib/types';
import { sounds } from '@/lib/sound';

interface MatchModalProps {
  isOpen: boolean;
  matchedProfile: Profile | null;
  onClose: () => void;
  onGoToMatches: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  matchedProfile,
  onClose,
  onGoToMatches,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Play celebratory sound
      sounds.playMatchSound();

      // Fire celebratory confetti explosion
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#10b981', '#fbbf24', '#ffffff'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> Mutual Connection
            </span>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 tracking-tight">
              It&apos;s a Match!
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              You and <span className="text-white font-medium">{matchedProfile.name}</span> liked each other.
            </p>
          </motion.div>

          {/* Overlapping Profile Pictures */}
          <div className="relative flex items-center justify-center py-4 mb-6">
            {/* Current user avatar */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-xl z-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="You"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Glowing heart connector badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: 'spring' }}
              className="absolute z-30 w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/50 border-2 border-slate-900"
            >
              <Heart className="w-5 h-5 fill-white text-white" />
            </motion.div>

            {/* Matched user avatar */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-xl z-20 -ml-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={matchedProfile.photo}
                alt={matchedProfile.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Profile Quick Summary */}
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/80 mb-6 text-left">
            <p className="text-xs text-slate-300 line-clamp-2 italic">
              &ldquo;{matchedProfile.bio}&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              {matchedProfile.college && <span>🎓 {matchedProfile.college}</span>}
              {matchedProfile.city && <span>📍 {matchedProfile.city}</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={onGoToMatches}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Say Hello
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 active:scale-[0.98] transition-all"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
