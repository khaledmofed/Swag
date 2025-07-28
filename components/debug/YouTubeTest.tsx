'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { extractYouTubeVideoId, isYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

export function YouTubeTest() {
  const [testUrl, setTestUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Rick Roll as example
  const [result, setResult] = useState<any>(null);

  const testYouTubeUrl = () => {
    const isYT = isYouTubeUrl(testUrl);
    const videoId = extractYouTubeVideoId(testUrl);
    const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null;
    const thumbnail = videoId ? getYouTubeThumbnail(videoId) : null;

    setResult({
      isYouTube: isYT,
      videoId,
      embedUrl,
      thumbnail,
      originalUrl: testUrl
    });
  };

  const sampleUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://example.com/video.mp4', // Non-YouTube URL
  ];

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-lg mb-3">YouTube URL Test</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Test URL:</label>
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter YouTube URL..."
          />
        </div>

        <Button onClick={testYouTubeUrl} className="w-full" size="sm">
          Test URL
        </Button>

        <div>
          <label className="block text-sm font-medium mb-1">Sample URLs:</label>
          <div className="space-y-1">
            {sampleUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setTestUrl(url)}
                className="block w-full text-left text-xs p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded truncate"
                title={url}
              >
                {url}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
            <h4 className="font-semibold mb-2">Result:</h4>
            <div className="space-y-1">
              <p><strong>Is YouTube:</strong> {result.isYouTube ? 'Yes' : 'No'}</p>
              <p><strong>Video ID:</strong> {result.videoId || 'N/A'}</p>
              {result.embedUrl && (
                <p><strong>Embed URL:</strong> 
                  <span className="block break-all">{result.embedUrl}</span>
                </p>
              )}
              {result.thumbnail && (
                <div>
                  <p><strong>Thumbnail:</strong></p>
                  <img 
                    src={result.thumbnail} 
                    alt="YouTube thumbnail" 
                    className="w-full max-w-[200px] h-auto rounded mt-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
