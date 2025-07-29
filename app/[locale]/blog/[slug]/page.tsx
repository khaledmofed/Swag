import { Metadata } from "next";
import BlogDetailPage from "@/components/blogDetails";
import {
  generateBlogDetailMetadata,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";
import { SupportedLocale } from "@/lib/seo";
import { apiClient, apiEndpoints, apiRequest } from "@/lib/api";
import { BlogDetailResponse } from "@/types/api";

interface BlogPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Generate metadata for blog detail pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    // Fetch blog data for metadata
    const response = await apiRequest<BlogDetailResponse>(() =>
      apiClient.get(apiEndpoints.blogDetail(slug))
    );

    const blog = response.data;

    return generateBlogDetailMetadata(
      locale as SupportedLocale,
      blog.title,
      blog.meta_description || blog.excerpt || blog.short_description,
      blog.featured_image,
      blog.published_at,
      blog.updated_at
    );
  } catch (error) {
    // Fallback to default metadata if blog fetch fails
    return generateBlogDetailMetadata(locale as SupportedLocale);
  }
}

const BlogPage: React.FC<BlogPageProps> = async ({ params }) => {
  const { locale, slug } = await params;

  // Fetch blog data for structured data (separate from metadata to avoid duplication)
  let blog = null;
  let articleStructuredData = null;
  let breadcrumbStructuredData = null;

  try {
    const response = await apiRequest<BlogDetailResponse>(() =>
      apiClient.get(apiEndpoints.blogDetail(slug))
    );
    blog = response.data;

    // Generate article structured data
    articleStructuredData = generateArticleStructuredData(
      locale as SupportedLocale,
      blog.title,
      blog.meta_description || blog.excerpt || blog.short_description || "",
      blog.published_at,
      blog.updated_at,
      blog.featured_image,
      `https://swaggold.co/${locale}/blog/${slug}`
    );

    // Generate breadcrumb structured data
    breadcrumbStructuredData = generateBreadcrumbStructuredData(
      locale as SupportedLocale,
      [
        { name: locale === "ar" ? "الرئيسية" : "Home", url: `/${locale}` },
        { name: locale === "ar" ? "المدونة" : "Blog", url: `/${locale}/blog` },
        { name: blog.title, url: `/${locale}/blog/${slug}` },
      ]
    );
  } catch (error) {
    console.error("Error fetching blog data for structured data:", error);
  }

  return (
    <>
      {/* Article Structured Data */}
      {articleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      )}

      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}

      <BlogDetailPage blogSlug={slug} />
    </>
  );
};

export default BlogPage;
