import { Section } from "@/components/atoms/section";
import { getColoredTextClasses } from "@/utils/colored-text";
import RSSFeedButton from "./RSSFeedButton";
import { createMetadata } from "@/utils/metadata";
import { MDX } from "./mdx";
import { notFound, redirect } from "next/navigation";
import { allReadableBlogsWithContent } from "@/utils/blog";
import type { BlogPostPageContext } from "./[slug]/types";

export default function BlogPage(context: BlogPostPageContext) {
  const { slug } = context.params;
  const post = allReadableBlogsWithContent.find(b => b.slug === slug);
  if (!slug || !post) return notFound();
  if (post.link) return redirect(post.link);
  return (
    <Section id="blog" className="gap-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className={getColoredTextClasses("orange")}>Blog</h1>
        <RSSFeedButton />
      </div>
      <MDX code={post.code} />
    </Section>
  );
}

export const metadata = createMetadata({
  title: "Blog – Bjorn-Donald",
  description:
    // eslint-disable-next-line max-len
    "Blog posts by Bjorn-Donald. Here I share some thoughts, stories, information and more about software development, programming, tech or my personal life",
  exactUrl: "https://bjorncode.dev/blog",
  keywords: [
    "tech",
    "software",
    "development",
    "thoughts",
    "opinions",
    "blog",
    "content",
    "story",
    "storytelling",
    "news",
  ],
});
