# YouTube Video Integration

The banner component now supports both regular video files (MP4, WebM) and YouTube videos. When a YouTube URL is provided in the `HERO_BANNER_VIDEO_URL` system setting, it will automatically embed the YouTube video instead of using the HTML5 video element.

## Features

✅ **Automatic Detection** - Detects YouTube URLs and switches to iframe embed  
✅ **Multiple URL Formats** - Supports all common YouTube URL formats  
✅ **Autoplay & Loop** - Configured for seamless background video experience  
✅ **No Controls** - Clean appearance without YouTube player controls  
✅ **Fallback Support** - Falls back to regular video if not a YouTube URL  
✅ **Thumbnail Support** - Uses YouTube thumbnail as poster image  
✅ **Responsive Design** - Scales properly on all devices  

## Supported YouTube URL Formats

The system automatically detects and extracts video IDs from these URL formats:

```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
https://www.youtube.com/v/VIDEO_ID
https://m.youtube.com/watch?v=VIDEO_ID
```

## How to Use

### 1. **Set YouTube URL in System Settings**

In your admin panel, set the `HERO_BANNER_VIDEO_URL` to any valid YouTube URL:

```
https://www.youtube.com/watch?v=YOUR_VIDEO_ID
```

### 2. **Automatic Embedding**

The banner component will automatically:
- Detect that it's a YouTube URL
- Extract the video ID
- Generate an optimized embed URL
- Display the video with autoplay, mute, and loop enabled
- Hide YouTube controls for a clean appearance

### 3. **Fallback Behavior**

If the URL is not a YouTube URL, the component will use the regular HTML5 video element as before.

## Configuration Options

The YouTube embed is configured with these parameters for optimal banner experience:

- **autoplay=1** - Video starts automatically
- **mute=1** - Video is muted (required for autoplay)
- **loop=1** - Video loops continuously
- **controls=0** - Hides YouTube player controls
- **modestbranding=1** - Reduces YouTube branding
- **rel=0** - Doesn't show related videos at the end
- **showinfo=0** - Hides video title and uploader info
- **playsinline=1** - Plays inline on mobile devices
- **iv_load_policy=3** - Hides video annotations

## Technical Implementation

### Files Modified/Added:

1. **`lib/youtube.ts`** - YouTube utility functions
   - `extractYouTubeVideoId()` - Extracts video ID from URLs
   - `isYouTubeUrl()` - Checks if URL is a YouTube URL
   - `getYouTubeEmbedUrl()` - Generates optimized embed URL
   - `getYouTubeThumbnail()` - Gets video thumbnail URL

2. **`components/homePage/banner/index.tsx`** - Updated banner component
   - Detects YouTube URLs automatically
   - Renders iframe for YouTube videos
   - Falls back to HTML5 video for regular files
   - Uses YouTube thumbnail as poster image

### Code Example:

```tsx
// The banner component automatically handles both types:

// YouTube URL (will use iframe)
const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

// Regular video URL (will use HTML5 video)
const regularUrl = "https://example.com/video.mp4";
```

## Testing

To test the YouTube integration:

1. **Set a YouTube URL** in the `HERO_BANNER_VIDEO_URL` system setting
2. **Visit the homepage** - the video should embed and autoplay
3. **Try different URL formats** to verify detection works
4. **Test fallback** by setting a regular video URL

### Example Test URLs:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ
```

## Troubleshooting

### Video Not Playing
- Ensure the YouTube video is public and embeddable
- Check that autoplay is allowed in your browser
- Verify the video ID is correctly extracted

### Controls Showing
- The iframe is configured to hide controls
- Some YouTube videos may override these settings
- The scale transform helps hide YouTube branding

### Mobile Issues
- YouTube autoplay policies vary by device
- The `playsinline` parameter helps with mobile playback
- Consider providing a poster image fallback

## Browser Compatibility

- **Modern Browsers**: Full support for YouTube iframe embedding
- **Mobile Safari**: May require user interaction for autoplay
- **Chrome**: Full autoplay support when muted
- **Firefox**: Full support with proper configuration

## Performance Considerations

- YouTube videos load from YouTube's CDN
- No impact on your server bandwidth
- Automatic quality adjustment based on connection
- Lazy loading when video comes into viewport

## Security & Privacy

- Videos are embedded from YouTube's secure domain
- No tracking cookies are set by default
- Consider YouTube's privacy policy for your users
- The `origin` parameter is set for security
