
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
}

export const Player: React.FC<PlayerProps> = ({
  state,
  currentSong,
  onPlayPause,
  onNext,
  onPrev,
  onVolumeChange,
  onSeek
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = (state.progress / currentSong.duration) * 100;

  return (
    <div 
      className={`glass fixed bottom-16 md:bottom-0 left-0 right-0 z-40 px-4 md:px-8 transition-all duration-300 ${isExpanded ? 'h-[100dvh]' : 'h-24 md:h-24'}`}
    >
      <div className={`flex items-center justify-between h-24 md:h-full relative ${isExpanded ? 'hidden' : 'flex'}`}>
        {/* Mobile Expand Trigger (Overlay) */}
        <div className="md:hidden absolute inset-0 z-0" onClick={() => setIsExpanded(true)}></div>

        {/* Info */}
        <div className="flex items-center gap-4 w-1/3 z-10">
          <img src={currentSong.coverUrl} className="w-14 h-14 rounded-md object-cover shadow-lg" alt="" />
          <div className="hidden sm:block overflow-hidden">
            <h4 className="font-semibold text-sm truncate">{currentSong.title}</h4>
            <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 w-1/3 z-10">
          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
              <Icon name="Shuffle" size={18} />
            </button>
            <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors">
              <Icon name="SkipBack" fill="currentColor" size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onPlayPause(); }} 
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Icon name={state.isPlaying ? "Pause" : "Play"} fill="currentColor" size={20} />
            </button>
            <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors">
              <Icon name="SkipForward" fill="currentColor" size={24} />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
              <Icon name="Repeat" size={18} />
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
              className="w-full aspect-square rounded-xl overflow-hidden shadow-2xl mb-12"
            >
              <img src={currentSong.coverUrl} className="w-full h-full object-cover" alt="" />
            </motion.div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
              <p className="text-lg text-zinc-400">{currentSong.artist}</p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div 
                className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"
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
              <div className="flex justify-between text-sm text-zinc-400">
                <span>{formatTime(state.progress)}</span>
                <span>{formatTime(currentSong.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-12">
              <button className="text-zinc-400"><Icon name="Shuffle" size={24} /></button>
              <button onClick={onPrev}><Icon name="SkipBack" size={40} fill="currentColor" /></button>
              <button 
                onClick={onPlayPause} 
                className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center"
              >
                <Icon name={state.isPlaying ? "Pause" : "Play"} size={32} fill="currentColor" />
              </button>
              <button onClick={onNext}><Icon name="SkipForward" size={40} fill="currentColor" /></button>
              <button className="text-zinc-400"><Icon name="Repeat" size={24} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
