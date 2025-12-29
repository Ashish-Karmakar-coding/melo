
import { Playlist } from './types';

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

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Lo-Fi Chill Beats',
    description: 'Relaxing lo-fi hip hop to study and relax to.',
    coverUrl: generateGradientUrl('music1'),
    songs: [
      {
        id: 's1',
        title: 'Midnight Coffee',
        artist: 'Chill Master',
        album: 'Night Owl',
        coverUrl: generateGradientUrl('song1'),
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 372,
        dateAdded: new Date().toISOString()
      },
      {
        id: 's2',
        title: 'Study Flow',
        artist: 'Lofi Girl',
        album: 'Concentration',
        coverUrl: generateGradientUrl('song2'),
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
    coverUrl: generateGradientUrl('music2'),
    songs: [
      {
        id: 's3',
        title: 'Neon Skyline',
        artist: 'Retro Runner',
        album: 'Arcade City',
        coverUrl: generateGradientUrl('song3'),
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: 312,
        dateAdded: new Date().toISOString()
      }
    ]
  }
];

export const APP_PRIMARY_COLOR = '#10b981'; // Emerald 500
