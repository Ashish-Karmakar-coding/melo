
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

export const INITIAL_PLAYLISTS: Playlist[] = [];

export const APP_PRIMARY_COLOR = '#10b981'; // Emerald 500
