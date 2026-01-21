
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Playlist } from '../types';
import { Icon } from './Icon';

interface HomeViewProps {
  playlists: Playlist[];
  onPlaylistClick: (id: string) => void;
  onAddPlaylist: (name: string, description: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ playlists, onPlaylistClick, onAddPlaylist }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 pb-32"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{greeting}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 text-sm md:text-base"
        >
          <Icon name="Plus" size={18} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline">Create Playlist</span>
          <span className="sm:hidden">Create</span>
        </button>
      </header>

      {/* Quick Access */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {playlists.slice(0, 6).map(p => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onPlaylistClick(p.id)}
            className="flex items-center bg-zinc-800/40 hover:bg-zinc-800/80 rounded-md overflow-hidden cursor-pointer transition-colors group border border-white/5"
          >
            <img src={p.coverUrl} className="w-20 h-20 object-cover shadow-lg" alt="" />
            <div className="p-4 flex-1 flex items-center justify-between">
              <span className="font-bold truncate">{p.name}</span>
              <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl shadow-black/40">
                <Icon name="Play" fill="currentColor" size={20} className="text-black" />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Made For You */}
      <section>
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Made For You</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
          {playlists.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onPlaylistClick(p.id)}
              className="bg-zinc-900/60 p-4 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer group border border-white/5"
            >
              <div className="relative aspect-square mb-4">
                <img src={p.coverUrl} className="w-full h-full object-cover rounded-lg shadow-2xl" alt="" />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl shadow-black/40">
                  <Icon name="Play" fill="currentColor" size={24} className="text-black ml-1" />
                </button>
              </div>
              <h4 className="font-bold text-base truncate mb-1">{p.name}</h4>
              <p className="text-zinc-400 text-xs line-clamp-2">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 w-full max-w-md p-8 rounded-2xl border border-zinc-700 shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">New Playlist</h3>
            <div className="flex flex-col gap-4">
              <input
                autoFocus
                type="text"
                placeholder="Playlist Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-zinc-800 p-4 rounded-lg outline-none focus:ring-2 ring-emerald-500 transition-all border border-zinc-700"
              />
              <textarea
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-zinc-800 p-4 rounded-lg outline-none focus:ring-2 ring-emerald-500 transition-all border border-zinc-700 h-32 resize-none"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 p-3 rounded-lg font-bold hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onAddPlaylist(newName || 'Unnamed Playlist', newDesc);
                    setIsModalOpen(false);
                    setNewName('');
                    setNewDesc('');
                  }}
                  className="flex-1 bg-emerald-500 text-black p-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
