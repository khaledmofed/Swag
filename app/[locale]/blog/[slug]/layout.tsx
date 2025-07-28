// layout.tsx
import { MainLayout } from "@/components/layout/MainLayout"

interface BlogLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <MainLayout isBlogDetailsPage={true}>{children}</MainLayout>
}
