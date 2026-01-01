
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Playlist } from '../types';
import { Icon } from './Icon';

interface SearchViewProps {
  playlists: Playlist[];
  onPlaylistClick: (id: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ playlists, onPlaylistClick }) => {
  const [query, setQuery] = useState('');

  const filteredPlaylists = useMemo(() => {
    if (!query) return [];
    return playlists.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [playlists, query]);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-32">
      <div className="relative max-w-2xl mb-8 md:mb-12">
        <Icon name="Search" className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 md:w-5 md:h-5" />
        <input 
          autoFocus
          type="text" 
          placeholder="What do you want to listen to?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-800 p-3 md:p-4 pl-10 md:pl-12 rounded-full outline-none focus:ring-2 ring-emerald-500 border border-transparent transition-all text-base md:text-lg"
        />
      </div>

      {!query ? (
        <section>
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Browse all</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {['Pop', 'Chill', 'Lo-Fi', 'Workout', 'Sleep', 'Jazz', 'Rock', 'Electronic'].map((genre, idx) => (
              <div 
                key={genre}
                className={`aspect-square p-6 rounded-xl font-black text-2xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                style={{ backgroundColor: `hsl(${idx * 45}, 70%, 30%)` }}
              >
                {genre}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 rotate-[25deg] opacity-40">
                    <Icon name="Music" size={96} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Results</h3>
          {filteredPlaylists.length === 0 ? (
            <p className="text-zinc-400 text-sm md:text-base">No playlists found matching "{query}"</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {filteredPlaylists.map(p => (
                <motion.div
                  key={p.id}
                  layoutId={p.id}
                  onClick={() => onPlaylistClick(p.id)}
                  className="bg-zinc-900/60 p-4 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer group"
                >
                  <img src={p.coverUrl} className="w-full aspect-square object-cover rounded-lg shadow-2xl mb-4" alt="" />
                  <h4 className="font-bold truncate mb-1">{p.name}</h4>
                  <p className="text-zinc-400 text-xs line-clamp-1">{p.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
