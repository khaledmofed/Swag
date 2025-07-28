import { getImageUrl } from "@/lib/utils";

interface NewsItemProps {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  image?: string;
  source: string;
}

const NewsItem = ({ title, link, pubDate, content, image }: NewsItemProps) => {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const imgSrc = getImageUrl(image) || "/images/Placeholder.png";

  return (
    <article className="flex gap-4 item-center hover:bg-gray-50/50 transition-colors duration-200 py-2 rounded-lg">
      <div className="flex-shrink-0">
        <img
          src={imgSrc}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/Placeholder.png";
          }}
          alt={title}
          className="w-32 h-32 object-cover rounded"
        />
      </div>

      <div className="flex-1 flex flex-col  justify-center min-w-0">
        <h3 className="text-lg font-medium text-foreground mb-2 line-clamp-2 leading-tight">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {title}
          </a>
        </h3>

        {content && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {content}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{getTimeAgo(pubDate)}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsItem;
