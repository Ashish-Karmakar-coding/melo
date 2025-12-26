
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  url: string;
  duration: number; // in seconds
  dateAdded: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}

export interface PlayerState {
  currentPlaylistId: string | null;
  currentSongIndex: number;
  isPlaying: boolean;
  volume: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  progress: number;
}

export enum RepeatMode {
  OFF = 'OFF',
  ONE = 'ONE',
  ALL = 'ALL'
}

export type ViewType = 'HOME' | 'PLAYLIST' | 'SEARCH' | 'LIBRARY';
