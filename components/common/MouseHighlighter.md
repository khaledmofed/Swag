# MouseHighlighter Component

A React component that creates a visual highlighter effect that follows the mouse cursor everywhere on the page.

## Features

- 🎯 **Follows mouse cursor** - Tracks mouse movement across the entire screen
- 🎨 **Multiple variants** - Circle, Square, Glow, and Spotlight effects
- 🌈 **Theme support** - Integrates with your Tailwind theme colors
- 🎭 **Blend modes** - Various CSS blend modes for different visual effects
- ✨ **Trail effect** - Optional trailing effect for dynamic movement
- 🎛️ **Highly customizable** - Size, opacity, colors, and animation settings
- 🌙 **Dark mode support** - Automatically adapts to light/dark themes
- ⚡ **Performance optimized** - Efficient event handling and rendering

## Usage

### Basic Usage

```tsx
import MouseHighlighter from '@/components/common/MouseHighlighter';

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <h1>Welcome to my page</h1>

      {/* Add the mouse highlighter */}
      <MouseHighlighter />
    </div>
  );
}
```

### Advanced Usage

```tsx
import MouseHighlighter from '@/components/common/MouseHighlighter';

function MyPage() {
  return (
    <div>
      {/* Your page content */}

      {/* Customized mouse highlighter */}
      <MouseHighlighter
        enabled={true}
        variant="glow"
        color="primary"
        size={50}
        opacity={0.4}
        showTrail={true}
        blendMode="overlay"
        animationDuration={200}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether the highlighter is enabled |
| `size` | `number` | `40` | Size of the highlighter in pixels |
| `className` | `string` | - | Custom CSS classes for styling |
| `variant` | `'circle' \| 'square' \| 'glow' \| 'spotlight' \| 'line'` | `'circle'` | Highlighter style variant |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'custom'` | `'primary'` | Color theme |
| `customColor` | `string` | - | Custom color (when color is 'custom') |
| `opacity` | `number` | `0.3` | Opacity of the highlighter (0-1) |
| `animationDuration` | `number` | `100` | Animation duration in milliseconds |
| `showTrail` | `boolean` | `false` | Whether to show a trail effect |
| `zIndex` | `number` | `9999` | Z-index for positioning |
| `blendMode` | `'normal' \| 'multiply' \| 'screen' \| 'overlay' \| 'difference' \| 'exclusion'` | `'normal'` | CSS blend mode |
| `lineThickness` | `number` | `3` | Line thickness for line variant (in pixels) |
| `maxLineSegments` | `number` | `50` | Maximum number of line segments to keep |
| `lineFadeDuration` | `number` | `2000` | Line fade duration in milliseconds |

## Variants

### Circle
The default circular highlighter that follows the mouse.

```tsx
<MouseHighlighter variant="circle" />
```

### Square
A square-shaped highlighter.

```tsx
<MouseHighlighter variant="square" />
```

### Glow
A circular highlighter with a blur effect for a glowing appearance.

```tsx
<MouseHighlighter variant="glow" />
```

### Spotlight
Creates a reverse highlight effect, darkening the area around the cursor.

```tsx
<MouseHighlighter variant="spotlight" size={200} />
```

### Line
Creates smooth, short colored lines that follow the mouse movement, like drawing with a fine pen. Lines are automatically broken into shorter segments for smoother appearance.

```tsx
<MouseHighlighter
  variant="line"
  lineThickness={1.5}
  maxLineSegments={80}
  lineFadeDuration={1200}
  animationDuration={50}
/>
```

## Color Themes

The component integrates with your Tailwind theme colors:

- `primary` - Uses your primary theme colors
- `secondary` - Uses your secondary theme colors
- `accent` - Uses your accent theme colors
- `custom` - Allows you to specify a custom color

```tsx
{/* Theme colors */}
<MouseHighlighter color="primary" />
<MouseHighlighter color="secondary" />
<MouseHighlighter color="accent" />

{/* Custom color */}
<MouseHighlighter color="custom" customColor="#ff6b6b" />
```

## Blend Modes

Different blend modes create various visual effects:

```tsx
{/* Subtle overlay effect */}
<MouseHighlighter blendMode="overlay" />

{/* High contrast */}
<MouseHighlighter blendMode="difference" />

{/* Darkening effect */}
<MouseHighlighter blendMode="multiply" />
```

## Examples

### Subtle Homepage Effect
```tsx
<MouseHighlighter
  variant="glow"
  color="primary"
  size={30}
  opacity={0.2}
  blendMode="overlay"
/>
```

### Dynamic Trail Effect
```tsx
<MouseHighlighter
  variant="circle"
  color="accent"
  size={40}
  opacity={0.4}
  showTrail={true}
  animationDuration={150}
/>
```

### Spotlight Effect
```tsx
<MouseHighlighter
  variant="spotlight"
  size={300}
  opacity={0.8}
  blendMode="multiply"
/>
```

### Custom Colored Highlighter
```tsx
<MouseHighlighter
  variant="glow"
  color="custom"
  customColor="#00ff88"
  size={60}
  opacity={0.5}
/>
```

### Smooth Line Drawing Effect
```tsx
<MouseHighlighter
  variant="line"
  color="primary"
  lineThickness={1.5}
  opacity={0.5}
  maxLineSegments={80}
  lineFadeDuration={1200}
  animationDuration={50}
  blendMode="normal"
/>
```

## Demo

Visit `/mouse-highlighter-demo` to see an interactive demo with all the available options and real-time controls.

## Performance Notes

- The component uses efficient event listeners that are properly cleaned up
- Mouse tracking is optimized with `useCallback` hooks
- The component only renders when the mouse is moving and enabled
- Trail effects are limited to 5 positions to maintain performance

## Browser Support

Works in all modern browsers that support:
- CSS `position: fixed`
- CSS `transform`
- CSS `mix-blend-mode`
- React hooks

## Tips

1. **Subtle is better** - Use lower opacity values (0.1-0.3) for subtle effects
2. **Match your theme** - Use theme colors for consistency
3. **Consider performance** - Disable on mobile devices if needed
4. **Test blend modes** - Different backgrounds work better with different blend modes
5. **Size matters** - Larger sizes work better for spotlight effects, smaller for precision highlighting
