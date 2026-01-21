
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerState, Song } from '../types';
import { Icon } from './Icon';

interface PlayerProps {
  state: PlayerState;
  currentSong: Song | null;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (v: number) => void;
  onSeek: (t: number) => void;
  onRepeatToggle: () => void;
  onShuffleToggle: () => void;
}

export const Player: React.FC<PlayerProps> = ({
  state,
  currentSong,
  onPlayPause,
  onNext,
  onPrev,
  onVolumeChange,
  onSeek,
  onRepeatToggle,
  onShuffleToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = currentSong.duration > 0
    ? (state.progress / currentSong.duration) * 100
    : 0;

  return (
    <div
      className={`glass fixed bottom-16 md:bottom-0 left-0 right-0 z-40 px-4 md:px-8 transition-all duration-300 ${isExpanded ? 'h-[100dvh]' : 'h-24 md:h-24'}`}
    >
      <div className={`flex items-center justify-between h-24 md:h-full relative ${isExpanded ? 'hidden' : 'flex'}`}>
        {/* Mobile Expand Trigger (Overlay) */}
        <div className="md:hidden absolute inset-0 z-0" onClick={() => setIsExpanded(true)}></div>

        {/* Info */}
        <div className="flex items-center gap-2 md:gap-4 w-1/3 min-w-0 z-10">
          <img src={currentSong.coverUrl} className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover shadow-lg flex-shrink-0" alt="" />
          <div className="hidden sm:block overflow-hidden min-w-0 flex-1">
            <h4 className="font-semibold text-xs md:text-sm truncate">{currentSong.title}</h4>
            <p className="text-[10px] md:text-xs text-zinc-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 w-1/3 z-10">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={onShuffleToggle}
              className={`transition-colors hidden sm:block ${state.isShuffle ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'}`}
            >
              <Icon name="Shuffle" size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors">
              <Icon name="SkipBack" fill="currentColor" size={20} className="md:w-6 md:h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
              className="w-9 h-9 md:w-10 md:h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Icon name={state.isPlaying ? "Pause" : "Play"} fill="currentColor" size={18} className="md:w-5 md:h-5" />
            </button>
            <button
              onClick={onNext}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Icon name="SkipForward" fill="currentColor" size={20} className="md:w-6 md:h-6" />
            </button>
            <button
              onClick={onRepeatToggle}
              className={`transition-colors hidden sm:block relative ${state.repeatMode !== 'OFF' ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'}`}
            >
              <Icon name="Repeat" size={16} className="md:w-[18px] md:h-[18px]" />
              {state.repeatMode === 'ONE' && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-[8px] font-bold px-1 rounded-full">1</span>
              )}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 w-full max-w-lg">
            <span className="text-[10px] text-zinc-400 w-8">{formatTime(state.progress)}</span>
            <div
              className="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                onSeek(percent * currentSong.duration);
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full group-hover:bg-emerald-400 transition-colors"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-zinc-400 w-8">{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Extra Tools */}
        <div className="flex items-center justify-end gap-4 w-1/3 z-10">
          <div className="hidden lg:flex items-center gap-2 w-32">
            <Icon name="Volume2" size={18} className="text-zinc-400" />
            <input
              type="range"
              min="0" max="1" step="0.01"
              value={state.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-full accent-emerald-500 cursor-pointer"
            />
          </div>
          <button className="text-zinc-400 hover:text-white">
            <Icon name="ListMusic" size={20} />
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="md:hidden absolute inset-0 flex flex-col p-8 bg-zinc-950 z-50 overflow-hidden"
          >
            <button onClick={() => setIsExpanded(false)} className="mb-8">
              <Icon name="ChevronDown" size={32} />
            </button>

            <motion.div
              layoutId="artwork"
              className="w-full max-h-[45vh] aspect-square rounded-xl overflow-hidden shadow-2xl mb-8 md:mb-12 mx-auto"
            >
              <img src={currentSong.coverUrl} className="w-full h-full object-cover" alt="" />
            </motion.div>

            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 truncate">{currentSong.title}</h2>
              <p className="text-base md:text-lg text-zinc-400 truncate">{currentSong.artist}</p>
            </div>

            <div className="flex flex-col gap-3 mb-6 md:mb-8">
              <div
                className="w-full h-1.5 md:h-2 bg-zinc-800 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  onSeek(percent * currentSong.duration);
                }}
              >
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-zinc-400">
                <span>{formatTime(state.progress)}</span>
                <span>{formatTime(currentSong.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 md:mb-12 px-4">
              <button
                onClick={onShuffleToggle}
                className={`transition-colors ${state.isShuffle ? 'text-emerald-500' : 'text-zinc-400'}`}
              >
                <Icon name="Shuffle" size={20} />
              </button>
              <div className="flex items-center gap-6 md:gap-10">
                <button onClick={onPrev} className="text-zinc-100 hover:text-emerald-400 transition-colors">
                  <Icon name="SkipBack" size={32} fill="currentColor" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <Icon name={state.isPlaying ? "Pause" : "Play"} size={28} fill="currentColor" />
                </button>
                <button onClick={onNext} className="text-zinc-100 hover:text-emerald-400 transition-colors">
                  <Icon name="SkipForward" size={32} fill="currentColor" />
                </button>
              </div>
              <button
                onClick={onRepeatToggle}
                className={`transition-colors relative ${state.repeatMode !== 'OFF' ? 'text-emerald-500' : 'text-zinc-400'}`}
              >
                <Icon name="Repeat" size={20} />
                {state.repeatMode === 'ONE' && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[9px] font-bold px-1 rounded-full">1</span>
                )}
              </button>
            </div>

            {/* Glass Visualizer */}
            <div className="mt-auto flex items-end justify-center gap-1.5 h-24 mb-4">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: state.isPlaying ? [10, Math.random() * 80 + 20, 10] : 10,
                    opacity: state.isPlaying ? [0.3, 0.8, 0.3] : 0.2
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5 + Math.random() * 0.5,
                    ease: "easeInOut"
                  }}
                  className="w-2 rounded-full bg-gradient-to-t from-emerald-500/20 to-emerald-400/60 backdrop-blur-md"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
