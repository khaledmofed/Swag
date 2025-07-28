import { NextResponse } from "next/server";
import Parser from "rss-parser";

export async function GET() {
  const parser = new Parser();
  const feed = await parser.parseURL(
    "https://www.investing.com/rss/news_301.rss"
  );
  console.log("feed", feed);

  const items = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    content: item.contentSnippet,
    image: item.enclosure?.url || null,
  }));

  return NextResponse.json(items);
}
