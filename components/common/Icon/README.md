# Icon Component

A centralized icon system using `react-icons` for consistent icon usage across the application.

## 🚀 Features

- **Centralized Management**: All icons managed in one place
- **Type Safety**: Full TypeScript support with auto-completion
- **Multiple Icon Sets**: Uses Feather Icons (Fi), Heroicons (Hi), and Material Design (Md)
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Customizable**: Size, color, className, and style props
- **Tree Shaking**: Only imports used icons for optimal bundle size

## 📖 Usage

### Basic Usage

```tsx
import { Icon } from '@/components/common/Icon'

function MyComponent() {
  return (
    <div>
      <Icon name="home" />
      <Icon name="arrow-right" size={24} />
      <Icon name="user" className="text-blue-500" />
    </div>
  )
}
```

### With Custom Styling

```tsx
<Icon 
  name="settings" 
  size={20}
  color="#3B82F6"
  className="hover:text-blue-600 transition-colors"
/>
```

### Interactive Icons

```tsx
<Icon 
  name="menu" 
  onClick={() => toggleMenu()}
  aria-label="Toggle menu"
  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
/>
```

### Dynamic Icons

```tsx
import { useIcon, hasIcon } from '@/components/common/Icon'

function DynamicIcon({ iconName }: { iconName: string }) {
  if (!hasIcon(iconName)) {
    return <span>Icon not found</span>
  }
  
  const IconComponent = useIcon(iconName)
  return <IconComponent size={24} />
}
```

## 🎨 Available Icons

### Navigation & UI
- `arrow-right`, `arrow-down`
- `chevron-right`, `chevron-down`
- `home`, `user`, `users`
- `menu`, `x`
- `check`, `circle`

### Business & Actions
- `briefcase`, `trending-up`
- `file-text`, `file-check`
- `mail`, `message-square`
- `plus`, `user-plus`
- `settings`, `log-out`

### Services & Tools
- `shield`, `credit-card`
- `github`, `life-buoy`
- `cloud`, `keyboard`
- `globe`, `cookie`
- `sun`, `moon`

### Alternative Styles
- `arrow-right-outline` (Heroicons style)
- `chevron-right-outline` (Heroicons style)
- `arrow-forward` (Material Design style)

## 🔧 API Reference

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IconName` | - | **Required.** Icon name from available icons |
| `size` | `number \| string` | `16` | Icon size in pixels |
| `className` | `string` | `''` | CSS classes |
| `color` | `string` | - | Icon color (CSS color value) |
| `style` | `CSSProperties` | `{}` | Inline styles |
| `onClick` | `() => void` | - | Click handler (makes icon interactive) |
| `aria-label` | `string` | `name` | Accessibility label |

### Utility Functions

- `useIcon(name)` - Get icon component by name
- `getAvailableIcons()` - Get all available icon names
- `hasIcon(name)` - Check if icon exists

## 🎯 Migration Guide

### From Lucide React

```tsx
// Before
import { ArrowRight, Home, User } from 'lucide-react'
<ArrowRight className="w-4 h-4" />

// After
import { Icon } from '@/components/common/Icon'
<Icon name="arrow-right" size={16} />
```

### From Inline SVG

```tsx
// Before
<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
</svg>

// After
<Icon name="menu" size={24} />
```

## 🔄 Adding New Icons

1. Import the icon in `types.ts`:
```tsx
import { FiNewIcon } from 'react-icons/fi'
```

2. Add to `iconMap`:
```tsx
export const iconMap = {
  // ... existing icons
  'new-icon': FiNewIcon,
} as const
```

3. The icon is now available:
```tsx
<Icon name="new-icon" />
```
