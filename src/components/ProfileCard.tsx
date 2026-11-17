'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, GraduationCap, Info, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Profile, SwipeAction } from '@/lib/types';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (action: SwipeAction) => void;
  isFront: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSwipe,
  isFront,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.photo];
  const currentPhoto = photos[photoIndex] || profile.photo;

  // Motion values for drag and rotation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-16, 16]);

  // Visual stamps opacity linked to drag distance
  const likeOpacity = useTransform(x, [30, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-30, -120], [0, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
      setImgError(false);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
      setImgError(false);
    }
  };

  // Static fallback avatar if image fails
  const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(
    profile.name
  )}&backgroundColor=0f172a`;

  if (!isFront) {
    // Background card in the deck
    return (
      <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 scale-95 translate-y-3 opacity-60 pointer-events-none select-none transition-all">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-left">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
            <span className="text-xl text-slate-300 font-medium">{profile.age}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800/80 cursor-grab active:cursor-grabbing select-none swipe-card-container z-20 flex flex-col justify-end"
    >
      {/* Photo carousel background */}
      <div className="absolute inset-0 bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgError ? fallbackAvatar : currentPhoto}
          alt={profile.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-all duration-300 pointer-events-none"
        />

        {/* Multi-photo indicator bars */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-4 right-4 z-30 flex gap-1.5 pointer-events-none">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full overflow-hidden bg-black/40 backdrop-blur-sm"
              >
                <div
                  className={`h-full transition-all duration-200 ${
                    idx === photoIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Left / Right touch zones for photo cycling */}
        {photos.length > 1 && (
          <div className="absolute inset-x-0 top-0 h-3/5 z-20 flex justify-between pointer-events-auto">
            <button
              onClick={prevPhoto}
              className={`w-1/3 h-full flex items-center justify-start pl-3 text-white/50 hover:text-white transition-opacity ${
                photoIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-0 hover:opacity-100'
              }`}
              aria-label="Previous photo"
            >
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </button>
            <button
              onClick={nextPhoto}
              className={`w-1/3 h-full flex items-center justify-end pr-3 text-white/50 hover:text-white transition-opacity ${
                photoIndex === photos.length - 1
                  ? 'opacity-0 cursor-default'
                  : 'opacity-0 hover:opacity-100'
              }`}
              aria-label="Next photo"
            >
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}

        {/* Ambient Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* LIKE Stamp badge (Visible on swipe right) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-12 left-8 z-30 pointer-events-none border-4 border-emerald-500 text-emerald-400 font-black tracking-widest text-3xl uppercase px-4 py-1 rounded-xl -rotate-12 bg-emerald-950/40 backdrop-blur-sm shadow-lg shadow-emerald-500/20"
      >
        LIKE
      </motion.div>

      {/* PASS Stamp badge (Visible on swipe left) */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-12 right-8 z-30 pointer-events-none border-4 border-rose-500 text-rose-400 font-black tracking-widest text-3xl uppercase px-4 py-1 rounded-xl rotate-12 bg-rose-950/40 backdrop-blur-sm shadow-lg shadow-rose-500/20"
      >
        PASS
      </motion.div>

      {/* Profile Details Overlay */}
      <div className="relative z-30 p-6 text-left pointer-events-auto">
        {/* Name and Age Header */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {profile.name}
            </h2>
            <span className="text-2xl font-semibold text-slate-300 drop-shadow">
              {profile.age}
            </span>
          </div>

          {/* Toggle info button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBioExpanded(!isBioExpanded);
            }}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"
            aria-label="Toggle profile information"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Location & College info pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {profile.college && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/70 border border-slate-700/60 text-slate-200 backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
              {profile.college}
            </span>
          )}
          {profile.city && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/70 border border-slate-700/60 text-slate-200 backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              {profile.city}
            </span>
          )}
        </div>

        {/* Bio Text */}
        <p
          className={`text-sm text-slate-200 leading-relaxed font-normal mb-3 transition-all duration-200 ${
            isBioExpanded ? 'line-clamp-none' : 'line-clamp-2'
          }`}
        >
          {profile.bio}
        </p>

        {/* Interests Pills */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.interests.slice(0, isBioExpanded ? undefined : 4).map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 backdrop-blur-sm"
              >
                <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                {interest}
              </span>
            ))}
            {!isBioExpanded && profile.interests.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center pl-1">
                +{profile.interests.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
