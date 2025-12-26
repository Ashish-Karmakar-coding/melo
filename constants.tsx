
import { Playlist } from './types';

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Lo-Fi Chill Beats',
    description: 'Relaxing lo-fi hip hop to study and relax to.',
    coverUrl: 'https://picsum.photos/seed/music1/400/400',
    songs: [
      {
        id: 's1',
        title: 'Midnight Coffee',
        artist: 'Chill Master',
        album: 'Night Owl',
        coverUrl: 'https://picsum.photos/seed/song1/400/400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 372,
        dateAdded: new Date().toISOString()
      },
      {
        id: 's2',
        title: 'Study Flow',
        artist: 'Lofi Girl',
        album: 'Concentration',
        coverUrl: 'https://picsum.photos/seed/song2/400/400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: 425,
        dateAdded: new Date().toISOString()
      }
    ]
  },
  {
    id: 'p2',
    name: 'Synthwave Dreams',
    description: 'Electric atmosphere for long drives.',
    coverUrl: 'https://picsum.photos/seed/music2/400/400',
    songs: [
      {
        id: 's3',
        title: 'Neon Skyline',
        artist: 'Retro Runner',
        album: 'Arcade City',
        coverUrl: 'https://picsum.photos/seed/song3/400/400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: 312,
        dateAdded: new Date().toISOString()
      }
    ]
  }
];

export const APP_PRIMARY_COLOR = '#10b981'; // Emerald 500
