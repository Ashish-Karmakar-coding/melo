
import React from 'react';
import { ViewType, Playlist } from '../types';
import { Icon } from './Icon';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (v: ViewType) => void;
  playlists: Playlist[];
  onPlaylistClick: (id: string) => void;
  onAddPlaylist: () => void;
  onImportPlaylist: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportAllPlaylists: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  playlists,
  onPlaylistClick,
  onAddPlaylist,
  onImportPlaylist,
  onExportAllPlaylists
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass p-6 gap-8 z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/logo.png" className="w-full h-full object-cover" alt="Melo Logo" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Melo</h1>
        </div>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => onViewChange('HOME')}
            className={`flex items-center gap-3 font-medium transition-colors ${currentView === 'HOME' ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'}`}
          >
            <Icon name="Home" />
            Home
          </button>
          <button
            onClick={() => onViewChange('SEARCH')}
            className={`flex items-center gap-3 font-medium transition-colors ${currentView === 'SEARCH' ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'}`}
          >
            <Icon name="Search" />
            Search
          </button>
        </nav>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between text-zinc-400 uppercase text-xs font-bold tracking-widest">
            <span>Playlists</span>
            <div className="flex gap-2">
              <label className="cursor-pointer hover:text-white" title="Import Playlist">
                <Icon name="Upload" size={14} />
                <input type="file" className="hidden" accept=".json" onChange={onImportPlaylist} />
              </label>
              {playlists.length > 0 && (
                <button onClick={onExportAllPlaylists} className="hover:text-white" title="Download All Playlists">
                  <Icon name="Download" size={14} />
                </button>
              )}
              <button onClick={onAddPlaylist} className="hover:text-white" title="Add Playlist">
                <Icon name="Plus" size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-2">
            {playlists.map(p => (
              <button
                key={p.id}
                onClick={() => onPlaylistClick(p.id)}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left truncate py-1"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass flex items-center justify-around z-50 px-6 pb-safe">
        <button onClick={() => onViewChange('HOME')} className={currentView === 'HOME' ? 'text-emerald-500' : 'text-zinc-400'}>
          <Icon name="Home" />
        </button>
        <button onClick={() => onViewChange('SEARCH')} className={currentView === 'SEARCH' ? 'text-emerald-500' : 'text-zinc-400'}>
          <Icon name="Search" />
        </button>
        <button onClick={() => onViewChange('HOME')} className="text-zinc-400">
          <Icon name="ListMusic" />
        </button>
      </nav>
    </>
  );
};
