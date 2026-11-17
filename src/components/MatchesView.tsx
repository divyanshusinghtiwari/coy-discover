'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, MapPin, GraduationCap, Sparkles, X, Send } from 'lucide-react';
import { MatchItem } from '@/lib/types';

interface MatchesViewProps {
  matches: MatchItem[];
  isLoading: boolean;
  onGoToDiscover: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  isLoading,
  onGoToDiscover,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({});

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !chatMessage.trim()) return;

    setSentMessages((prev) => ({
      ...prev,
      [selectedMatch.id]: [...(prev[selectedMatch.id] || []), chatMessage.trim()],
    }));
    setChatMessage('');
  };

  const getFallbackAvatar = (name: string) =>
    `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}&backgroundColor=0f172a`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-10 h-10 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading your connections...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Matches Yet</h3>
        <p className="text-sm text-slate-400 max-w-xs mb-6">
          When you and another member both like each other, they will appear here. Swipe on Discover to find your mutual spark!
        </p>
        <button
          onClick={onGoToDiscover}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
        >
          Start Swiping
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Matches
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
              {matches.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">People who liked you back</p>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-2 gap-3">
        {matches.map((item) => {
          const profile = item.matchedUser;
          const matchDate = new Date(item.matchedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={item.id}
              onClick={() => setSelectedMatch(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 hover:-translate-y-0.5 flex flex-col aspect-[3/4]"
            >
              {/* Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={profile.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = getFallbackAvatar(profile.name);
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Match Date Pill */}
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white/80 backdrop-blur-md border border-white/10">
                  {matchDate}
                </span>
              </div>

              {/* Profile Details */}
              <div className="absolute bottom-0 inset-x-0 p-3 z-10 text-left">
                <div className="flex items-baseline gap-1.5">
                  <h4 className="font-bold text-white text-base tracking-tight truncate">
                    {profile.name}
                  </h4>
                  <span className="text-xs font-semibold text-slate-300">
                    {profile.age}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 truncate mt-0.5">
                  {profile.city || profile.college || 'Nearby'}
                </p>

                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-rose-400 group-hover:text-rose-300 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat now</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat / Profile Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMatch.matchedUser.photo}
                  alt={selectedMatch.matchedUser.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = getFallbackAvatar(selectedMatch.matchedUser.name);
                  }}
                  className="w-12 h-12 rounded-full object-cover border-2 border-rose-500"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {selectedMatch.matchedUser.name}, {selectedMatch.matchedUser.age}
                  </h3>
                  <p className="text-xs text-rose-400 font-medium">Matched connection</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content: Profile Summary & Chat messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Profile Details Snippet */}
              <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
                <p className="text-xs text-slate-300 leading-relaxed italic mb-2">
                  &ldquo;{selectedMatch.matchedUser.bio}&rdquo;
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                  {selectedMatch.matchedUser.college && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-rose-400" />
                      {selectedMatch.matchedUser.college}
                    </span>
                  )}
                  {selectedMatch.matchedUser.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      {selectedMatch.matchedUser.city}
                    </span>
                  )}
                </div>
                {selectedMatch.matchedUser.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {selectedMatch.matchedUser.interests.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversation Area */}
              <div className="space-y-2">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
                    You matched on{' '}
                    {new Date(selectedMatch.matchedAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Simulated Icebreaker from partner */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-slate-800 px-3.5 py-2 text-xs text-slate-200">
                    Hey! Great to connect with you on Coy 😊
                  </div>
                </div>

                {/* Sent messages */}
                {(sentMessages[selectedMatch.id] || []).map((msg, idx) => (
                  <div key={idx} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-2 text-xs text-white">
                      {msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Message ${selectedMatch.matchedUser.name}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
