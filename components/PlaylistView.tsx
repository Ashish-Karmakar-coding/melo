
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Playlist, Song } from '../types';
import { Icon } from './Icon';

interface PlaylistViewProps {
  playlist: Playlist;
  isPlaying: boolean;
  currentSongId?: string;
  onPlaySong: (idx: number) => void;
  onAddSong: (song: Omit<Song, 'id' | 'dateAdded'>) => void;
  onDeletePlaylist: () => void;
  onExport: () => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ 
  playlist, 
  isPlaying, 
  currentSongId, 
  onPlaySong, 
  onAddSong,
  onDeletePlaylist,
  onExport
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [songForm, setSongForm] = useState({ title: '', artist: '', url: '', album: '' });
  const [urlError, setUrlError] = useState('');

  // Generate gradient placeholder based on seed string
  const generateGradientUrl = (seed: string): string => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const color1 = `hsl(${hue}, 70%, 50%)`;
    const color2 = `hsl(${(hue + 60) % 360}, 70%, 40%)`;
    const gradId = `grad-${Math.abs(hash)}`;
    
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#${gradId})"/>
      </svg>
    `.trim();
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Normalize and validate URL
  const normalizeUrl = (url: string): string | null => {
    if (!url || !url.trim()) return null;
    
    let normalized = url.trim();
    
    // Handle YouTube short URLs
    if (normalized.includes('youtu.be/')) {
      const videoId = normalized.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      if (videoId) {
        normalized = `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
    
    // Handle YouTube mobile URLs
    if (normalized.includes('youtube.com/watch') || normalized.includes('youtube.com/embed')) {
      // Already valid YouTube URL
    }
    
    // Validate URL format
    try {
      const urlObj = new URL(normalized);
      // Check if it's a valid protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }
      return normalized;
    } catch (e) {
      // If URL parsing fails, try adding https://
      try {
        const testUrl = normalized.startsWith('http') ? normalized : `https://${normalized}`;
        new URL(testUrl);
        return testUrl;
      } catch (e2) {
        return null;
      }
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    
    if (!songForm.url || !songForm.title) {
      setUrlError('Please provide both URL and title');
      return;
    }
    
    const normalizedUrl = normalizeUrl(songForm.url);
    if (!normalizedUrl) {
      setUrlError('Invalid URL format. Please enter a valid YouTube, SoundCloud, or direct audio URL.');
      return;
    }
    
    onAddSong({
      ...songForm,
      url: normalizedUrl,
      coverUrl: generateGradientUrl(songForm.title + songForm.artist),
      duration: 0, // Will be updated when song is played and duration is detected
    });
    setIsAdding(false);
    setSongForm({ title: '', artist: '', url: '', album: '' });
    setUrlError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      <header className="p-8 pb-12 pt-16 flex flex-col md:flex-row items-end gap-8 bg-gradient-to-b from-emerald-900/40 to-transparent">
        <motion.img 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={playlist.coverUrl} 
          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
          alt="" 
        />
        <div className="flex-1">
          <span className="uppercase text-xs font-bold tracking-widest text-zinc-300">Playlist</span>
          <h1 className="text-4xl md:text-7xl font-black mt-2 mb-6 tracking-tight">{playlist.name}</h1>
          <p className="text-zinc-400 mb-8 max-w-2xl">{playlist.description}</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => playlist.songs.length > 0 && onPlaySong(0)}
              className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:grayscale"
              disabled={playlist.songs.length === 0}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} fill="currentColor" size={28} className="text-black" />
            </button>
            <button onClick={onExport} title="Export JSON" className="text-zinc-400 hover:text-white transition-colors">
              <Icon name="Download" size={24} />
            </button>
            <button onClick={() => setIsAdding(true)} title="Add Song" className="text-zinc-400 hover:text-white transition-colors">
              <Icon name="PlusCircle" size={24} />
            </button>
            <button onClick={onDeletePlaylist} title="Delete Playlist" className="text-zinc-400 hover:text-rose-500 transition-colors">
              <Icon name="Trash2" size={24} />
            </button>
          </div>
        </div>
      </header>

      <section className="px-4 md:px-8">
        <div className="grid grid-cols-[40px_1fr_1fr_100px] gap-4 py-2 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider mb-4">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block">Album</div>
          <div className="text-right pr-4"><Icon name="Clock" size={16} /></div>
        </div>

        <div className="flex flex-col gap-1">
          {playlist.songs.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4 text-zinc-500">
                <Icon name="Music" size={48} className="opacity-20" />
                <p>No songs yet. Click "+" to add some music!</p>
            </div>
          ) : (
            playlist.songs.map((song, idx) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ 
                  scale: 1.008, 
                  x: 4, 
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  transition: { duration: 0.1 }
                }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onPlaySong(idx)}
                className={`grid grid-cols-[40px_1fr_1fr_100px] gap-4 py-3 px-2 rounded-md items-center cursor-pointer group relative overflow-hidden transition-all duration-200 ${currentSongId === song.id ? 'bg-white/10' : ''}`}
              >
                {/* Active Indicator Bar */}
                {currentSongId === song.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                )}

                <div className="relative flex items-center justify-center">
                    <div className={`${(currentSongId === song.id && isPlaying) ? 'opacity-100' : 'opacity-100 group-hover:opacity-0'} transition-opacity`}>
                        {currentSongId === song.id && isPlaying ? (
                            <div className="flex items-end justify-center gap-0.5 h-3 mb-1">
                                <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-emerald-500" />
                                <motion.div animate={{ height: [8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-emerald-500" />
                                <motion.div animate={{ height: [12, 6, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-emerald-500" />
                            </div>
                        ) : <span className="text-zinc-500 text-sm font-medium">{idx + 1}</span>}
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon 
                          name={currentSongId === song.id && isPlaying ? "Pause" : "Play"} 
                          fill="currentColor" 
                          size={16} 
                          className="text-white" 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 overflow-hidden">
                  <img src={song.coverUrl} className="w-10 h-10 rounded shadow-sm object-cover" alt="" />
                  <div className="overflow-hidden">
                    <p className={`font-medium truncate ${currentSongId === song.id ? 'text-emerald-500' : 'group-hover:text-white'}`}>{song.title}</p>
                    <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">{song.artist}</p>
                  </div>
                </div>

                <div className="hidden md:block text-zinc-400 truncate text-sm group-hover:text-zinc-300 transition-colors">{song.album}</div>

                <div className="text-right pr-4 text-sm text-zinc-400 group-hover:text-zinc-300">
                  {song.duration > 0 
                    ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
                    : '--:--'}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <motion.form 
            onSubmit={handleAdd}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-zinc-900 w-full max-w-lg p-8 rounded-2xl border border-zinc-700 shadow-2xl flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">Add Music</h3>
            </div>
            
            <div className="space-y-1 mb-2">
                <input 
                required
                type="text"
                placeholder="YouTube, SoundCloud, or Direct Audio URL" 
                className={`bg-zinc-800 p-4 rounded-lg outline-none w-full focus:ring-1 ring-emerald-500 border transition-all ${
                  urlError ? 'border-rose-500' : 'border-zinc-700'
                }`}
                value={songForm.url}
                onChange={e => {
                  setSongForm({ ...songForm, url: e.target.value });
                  setUrlError('');
                }}
                />
                {urlError ? (
                  <p className="text-xs text-rose-400 px-1">{urlError}</p>
                ) : (
                  <p className="text-[10px] text-zinc-500 px-1 italic">
                    Supports: YouTube (youtube.com, youtu.be), SoundCloud, Vimeo, or direct audio URLs (mp3, m4a, etc.)
                  </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                placeholder="Song Title" 
                className="bg-zinc-800 p-4 rounded-lg outline-none focus:ring-1 ring-emerald-500 border border-zinc-700"
                value={songForm.title}
                onChange={e => setSongForm({ ...songForm, title: e.target.value })}
              />
              <input 
                required
                placeholder="Artist" 
                className="bg-zinc-800 p-4 rounded-lg outline-none focus:ring-1 ring-emerald-500 border border-zinc-700"
                value={songForm.artist}
                onChange={e => setSongForm({ ...songForm, artist: e.target.value })}
              />
            </div>
            <input 
              placeholder="Album" 
              className="bg-zinc-800 p-4 rounded-lg outline-none focus:ring-1 ring-emerald-500 border border-zinc-700"
              value={songForm.album}
              onChange={e => setSongForm({ ...songForm, album: e.target.value })}
            />
            
            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 p-3 rounded-lg font-bold hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-emerald-500 text-black p-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
                disabled={!songForm.url || !songForm.title}
              >
                Add Song
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </motion.div>
  );
};
