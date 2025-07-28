# shadcn/ui Components

This folder contains all the shadcn/ui components for the project. These components are built on top of Radix UI primitives and styled with Tailwind CSS.

## 🚀 Setup Complete

The shadcn/ui library has been successfully installed and configured with the following setup:

### ✅ **Installed Dependencies:**
- `class-variance-authority` - For component variants
- `clsx` - For conditional class names
- `tailwind-merge` - For merging Tailwind classes
- `lucide-react` - For icons
- `tailwindcss-animate` - For animations

### ✅ **Configuration Files:**
- `components.json` - shadcn/ui configuration
- `lib/utils.ts` - Utility functions (cn helper)
- Updated `tailwind.config.ts` with shadcn/ui theme variables
- Updated `app/globals.css` with CSS variables

### ✅ **Available Components:**
- `Button` - Various button variants and sizes
- `Card` - Card components with header, content, etc.
- `Input` - Form input fields
- `Label` - Form labels
- `DropdownMenu` - Dropdown menus with various features

## 📖 Usage

Import components from the `@/components/ui` directory:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>

          <div className="flex gap-2">
            <Button>Submit</Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 🎨 Theming

The components automatically adapt to your existing theme system:
- Light/Dark mode support via CSS variables
- Integrates with your existing Tailwind color palette
- Maintains consistency with your design system

## 📦 Adding More Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

## 🔧 Customization

Components can be customized by:
1. Modifying the component files directly in `components/ui/`
2. Updating CSS variables in `app/globals.css`
3. Extending the theme in `tailwind.config.ts`

## 📚 Documentation

For full documentation and component examples, visit:
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/docs/components)

## 🎯 Demo

Check out the `ShadcnDemo` component in `components/demo/ShadcnDemo.tsx` to see the components in action.

## 🔧 Dropdown Menu Integration

The dropdown menu component has been successfully integrated throughout the application:

### ✅ **Sidebar Menu (`components/layout/Header/sidemenubar.tsx`)**
- Enhanced with shadcn/ui DropdownMenu for sub-navigation
- Services menu with sub-items (Web Development, Mobile Apps, Consulting, Support)
- Market Insights menu with sub-items (Market Analysis, Trends, Reports)
- Icons for all menu items using Lucide React
- Smooth animations and proper accessibility

### ✅ **Language Toggle (`components/common/LanguageToggle.tsx`)**
- Replaced custom dropdown with shadcn/ui DropdownMenu
- Globe icon with flag emojis for visual language identification
- Check marks for active language selection
- Compact design with proper theming

### ✅ **User Profile Dropdown (`components/common/UserProfileDropdown.tsx`)**
- Professional user profile menu in header
- Avatar with user initials
- Comprehensive menu items with keyboard shortcuts
- Proper grouping with separators

### 🎨 **Features Implemented:**
- **Sub-menus**: Nested dropdown functionality
- **Icons**: Lucide React icons throughout
- **Keyboard Shortcuts**: Visual shortcut indicators
- **Separators**: Logical grouping of menu items
- **Accessibility**: Full ARIA support and keyboard navigation
- **Theme Integration**: Consistent with light/dark mode
- **Responsive Design**: Works on all screen sizes

### 📱 **Mobile Optimization:**
- Touch-friendly dropdown interactions
- Proper spacing for mobile devices
- Sidebar closes automatically after selection
- Backdrop overlay for better UX
