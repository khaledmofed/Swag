/**
 * YouTube utility functions for video handling
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Regular expression to match various YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[7].length === 11) ? match[7] : null;
}

/**
 * Check if a URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

/**
 * Generate YouTube embed URL with parameters
 */
export function getYouTubeEmbedUrl(videoId: string, options: {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
  rel?: boolean;
  showinfo?: boolean;
  start?: number;
  end?: number;
} = {}): string {
  const {
    autoplay = true,
    mute = true,
    loop = true,
    controls = false,
    modestbranding = true,
    rel = false,
    showinfo = false,
    start,
    end
  } = options;

  const params = new URLSearchParams();
  
  if (autoplay) params.append('autoplay', '1');
  if (mute) params.append('mute', '1');
  if (loop) {
    params.append('loop', '1');
    params.append('playlist', videoId); // Required for loop to work
  }
  if (!controls) params.append('controls', '0');
  if (modestbranding) params.append('modestbranding', '1');
  if (!rel) params.append('rel', '0');
  if (!showinfo) params.append('showinfo', '0');
  if (start) params.append('start', start.toString());
  if (end) params.append('end', end.toString());
  
  // Additional parameters for better embedding
  params.append('enablejsapi', '1');
  params.append('origin', typeof window !== 'undefined' ? window.location.origin : '');
  params.append('playsinline', '1');
  params.append('iv_load_policy', '3'); // Hide annotations

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'maxres'): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
}
