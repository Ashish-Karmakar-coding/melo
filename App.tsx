
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Playlist, Song, PlayerState, RepeatMode, ViewType } from './types';
import { INITIAL_PLAYLISTS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { HomeView } from './components/HomeView';
import { PlaylistView } from './components/PlaylistView';
import { SearchView } from './components/SearchView';

// Fix for ReactPlayer type issues with certain React versions where props are not correctly recognized
const PlayerComponent = ReactPlayer as any;

const App: React.FC = () => {
  const playerRef = useRef<any>(null);
  const skipCountRef = useRef(0);
  
  
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('melodify_playlists');
      return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
    } catch (e) {
      return INITIAL_PLAYLISTS;
    }
  });
  
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentPlaylistId: null,
    currentSongIndex: 0,
    isPlaying: false,
    volume: 0.8,
    isShuffle: false,
    repeatMode: RepeatMode.OFF,
    progress: 0,
  });

  useEffect(() => {
    localStorage.setItem('melodify_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const currentPlaylist = useMemo(() => {
    return playlists.find(p => p.id === playerState.currentPlaylistId) || null;
  }, [playlists, playerState.currentPlaylistId]);

  const currentSong = useMemo(() => {
    if (!currentPlaylist || currentPlaylist.songs.length === 0) return null;
    return currentPlaylist.songs[playerState.currentSongIndex] || null;
  }, [currentPlaylist, playerState.currentSongIndex]);

  const handlePlaySong = (playlistId: string, songIndex: number) => {
    skipCountRef.current = 0; // Reset error skip counter on manual play
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || !playlist.songs[songIndex] || !playlist.songs[songIndex].url) {
      console.error('Invalid song or playlist');
      return;
    }
    setPlayerState(prev => ({
      ...prev,
      currentPlaylistId: playlistId,
      currentSongIndex: songIndex,
      isPlaying: true,
      progress: 0
    }));
  };

  const handleNext = () => {
    if (!currentPlaylist || currentPlaylist.songs.length === 0) {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      return;
    }
    let nextIndex = playerState.currentSongIndex + 1;
    if (nextIndex >= currentPlaylist.songs.length) {
      if (playerState.repeatMode === RepeatMode.ALL) {
        nextIndex = 0;
      } else {
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
        return;
      }
    }
    skipCountRef.current = 0; // Reset error counter on manual next
    setPlayerState(prev => ({ ...prev, currentSongIndex: nextIndex, progress: 0, isPlaying: true }));
  };

  const handlePrev = () => {
    if (!currentPlaylist || currentPlaylist.songs.length === 0) {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      return;
    }
    let prevIndex = playerState.currentSongIndex - 1;
    if (prevIndex < 0) {
      if (playerState.repeatMode === RepeatMode.ALL) {
        prevIndex = currentPlaylist.songs.length - 1;
      } else {
        // Restart current song
        prevIndex = playerState.currentSongIndex;
        setPlayerState(prev => ({ ...prev, progress: 0 }));
        if (playerRef.current) {
          playerRef.current.seekTo(0, 'seconds');
        }
        return;
      }
    }
    skipCountRef.current = 0; // Reset error counter on manual prev
    setPlayerState(prev => ({ ...prev, currentSongIndex: prevIndex, progress: 0, isPlaying: true }));
  };

  const handlePlaylistClick = (id: string) => {
    setSelectedPlaylistId(id);
    setCurrentView('PLAYLIST');
  };

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

  const handleAddPlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: `p-${Date.now()}`,
      name,
      description,
      coverUrl: generateGradientUrl(name + Date.now().toString()),
      songs: []
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id));
    if (selectedPlaylistId === id) {
      setCurrentView('HOME');
      setSelectedPlaylistId(null);
    }
    if (playerState.currentPlaylistId === id) {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentPlaylistId: null }));
    }
  };

  const handleAddSong = (playlistId: string, song: Omit<Song, 'id' | 'dateAdded'>) => {
    if (!song.url || !song.title) {
      console.error('Invalid song data');
      return;
    }
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId) {
        const newSong: Song = {
          ...song,
          id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          dateAdded: new Date().toISOString()
        };
        return { ...p, songs: [...p.songs, newSong] };
      }
      return p;
    }));
  };

  const handleDeleteSong = (playlistId: string, songId: string) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId) {
        const updatedSongs = p.songs.filter(s => s.id !== songId);
        // If the deleted song was currently playing, stop playback
        if (playerState.currentPlaylistId === playlistId && currentSong?.id === songId) {
          if (updatedSongs.length === 0) {
            setPlayerState(prev => ({ ...prev, isPlaying: false, currentPlaylistId: null }));
          } else {
            const newIndex = Math.min(playerState.currentSongIndex, updatedSongs.length - 1);
            setPlayerState(prev => ({ ...prev, currentSongIndex: newIndex }));
          }
        }
        return { ...p, songs: updatedSongs };
      }
      return p;
    }));
  };

  const handleMoveSong = (fromPlaylistId: string, songId: string, toPlaylistId: string) => {
    if (fromPlaylistId === toPlaylistId) return;
    
    setPlaylists(playlists.map(p => {
      if (p.id === fromPlaylistId) {
        // Remove song from source playlist
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      if (p.id === toPlaylistId) {
        // Add song to target playlist
        const songToMove = playlists.find(pl => pl.id === fromPlaylistId)?.songs.find(s => s.id === songId);
        if (songToMove) {
          return { ...p, songs: [...p.songs, songToMove] };
        }
      }
      return p;
    }));
  };

  const handleExportPlaylist = (playlist: Playlist) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(playlist, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${playlist.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportPlaylist = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Playlist;
        if (!imported.name || !Array.isArray(imported.songs)) throw new Error('Invalid format');
        const sanitized: Playlist = { ...imported, id: `p-${Date.now()}` };
        setPlaylists(prev => [...prev, sanitized]);
      } catch (err) {
        alert('Invalid playlist file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePlayerError = (error: any) => {
    const errorMsg = typeof error === 'object' ? (error.message || JSON.stringify(error)) : error;
    console.warn('Melodify Playback Warning:', errorMsg);
    
    // Prevent infinite skipping if many songs fail in a row
    skipCountRef.current += 1;
    if (skipCountRef.current > 5) {
      console.error('Too many track errors. Playback stopped.');
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      skipCountRef.current = 0; // Reset counter
      return;
    }

    // Auto-skip failed track with a delay to allow UI to settle
    setTimeout(() => {
      if (currentPlaylist && currentPlaylist.songs.length > 0) {
        handleNext();
      } else {
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
        skipCountRef.current = 0;
      }
    }, 1500);
  };

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, 'seconds');
    }
    setPlayerState(prev => ({ ...prev, progress: time }));
  };

  const handleDuration = (duration: number) => {
    // Update the song's duration in the playlist when detected
    if (currentSong && duration > 0) {
      // Update if duration is 0 (not yet set) or if it's significantly different (more than 1 second)
      const shouldUpdate = currentSong.duration === 0 || Math.abs(currentSong.duration - duration) > 1;
      
      if (shouldUpdate) {
        setPlaylists(prevPlaylists => 
          prevPlaylists.map(playlist => {
            if (playlist.id === playerState.currentPlaylistId) {
              return {
                ...playlist,
                songs: playlist.songs.map(song => 
                  song.id === currentSong.id 
                    ? { ...song, duration: Math.round(duration) }
                    : song
                )
              };
            }
            return playlist;
          })
        );
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black text-zinc-100">
      {/* 
          Robust Player Fix (Error 153 workaround):
          YouTube API error 153 is typically caused by "Invisible Player" restrictions.
          Ad-supported content requires the player to be "viewable" (non-zero opacity, sufficiently large).
          Fix: We make the player full-screen background (fixed inset-0) with opacity 1 and z-index 0.
          Then we stack the entire application UI on top with z-index 10 and an opaque background.
          This makes the player "visible" to the YouTube Viewability Observer while hidden to the user.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PlayerComponent
          ref={playerRef}
          url={currentSong?.url || undefined}
          playing={playerState.isPlaying && !!currentSong?.url}
          volume={playerState.volume}
          onProgress={(p: any) => {
            if (p.playedSeconds !== undefined) {
              setPlayerState(prev => ({ ...prev, progress: p.playedSeconds }));
            }
          }}
          onDuration={handleDuration}
          onEnded={() => {
            if (playerState.repeatMode === RepeatMode.ONE) {
              // Repeat current song
              setPlayerState(prev => ({ ...prev, progress: 0 }));
              if (playerRef.current) {
                playerRef.current.seekTo(0, 'seconds');
              }
            } else {
              handleNext();
            }
          }}
          onError={handlePlayerError}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                enablejsapi: 1,
                playsinline: 1
              }
            },
            soundcloud: {
              options: {
                auto_play: false,
                show_artwork: false
              }
            },
            vimeo: {
              playerOptions: {
                autoplay: true,
                controls: false,
                responsive: true
              }
            },
            file: {
              forceAudio: true,
              attributes: { 
                preload: 'auto',
                controls: false
              }
            }
          }}
        />
      </div>

      {/* Main UI Layer - Must be opaque to hide the background player */}
      <div className="relative z-10 flex flex-col h-screen bg-black">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar 
            currentView={currentView}
            onViewChange={setCurrentView}
            playlists={playlists}
            onPlaylistClick={handlePlaylistClick}
            onAddPlaylist={() => handleAddPlaylist('New Playlist', 'No description')}
            onImportPlaylist={handleImportPlaylist}
          />

          <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-zinc-900 to-black">
            <AnimatePresence mode="wait">
              {currentView === 'HOME' && (
                <HomeView 
                  key="home"
                  playlists={playlists}
                  onPlaylistClick={handlePlaylistClick}
                  onAddPlaylist={handleAddPlaylist}
                />
              )}
              {currentView === 'PLAYLIST' && selectedPlaylistId && (
                <PlaylistView 
                  key={selectedPlaylistId}
                  playlist={playlists.find(p => p.id === selectedPlaylistId)!}
                  isPlaying={playerState.isPlaying && playerState.currentPlaylistId === selectedPlaylistId}
                  currentSongId={currentSong?.id}
                  playlists={playlists}
                  onPlaySong={(idx) => handlePlaySong(selectedPlaylistId, idx)}
                  onAddSong={(song) => handleAddSong(selectedPlaylistId, song)}
                  onDeleteSong={(songId) => handleDeleteSong(selectedPlaylistId, songId)}
                  onMoveSong={(songId, toPlaylistId) => handleMoveSong(selectedPlaylistId, songId, toPlaylistId)}
                  onDeletePlaylist={() => handleDeletePlaylist(selectedPlaylistId)}
                  onExport={() => handleExportPlaylist(playlists.find(p => p.id === selectedPlaylistId)!)}
                />
              )}
              {currentView === 'SEARCH' && (
                <SearchView 
                  key="search"
                  playlists={playlists}
                  onPlaylistClick={handlePlaylistClick}
                />
              )}
            </AnimatePresence>
          </main>
        </div>

        <Player 
          state={playerState}
          currentSong={currentSong}
          onPlayPause={() => setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
          onNext={handleNext}
          onPrev={handlePrev}
          onVolumeChange={(v) => setPlayerState(prev => ({ ...prev, volume: v }))}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
};

export default App;
