import {
  allReadableBlogs,
  allReadableBlogsWithContent,
  type PartialBlog,
} from "@/utils/blog";
import { getDate } from "@/utils/date";
import { createMetadata } from "@/utils/metadata";

import type { BlogPostPageContext } from "./types";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Hero from "./hero";
import Header from "./header";
import cx from "@/utils/cx";
import { ShareButton } from "../ShareButton";
import { OutlinedLinkButton } from "@/components/atoms/link-button";
import { Icon } from "@/components/atoms/icon";
import Reactions from "./reactions";

const blogPostStructuredData = (post?: PartialBlog): string => {
  if (!post) return "";
  const date = getDate(post.date) || new Date(post.date);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    description: post.summary,
    image: `https://bjorncode.dev/blog/${post.slug}/opengraph-image`,
    url: `https://bjorncode.dev/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Bjorn-Donald Bassey",
      url: "https://bjorncode.dev/about",
    },
  });
};

export default function BlogPostPage(context: BlogPostPageContext) {
  const { slug } = context.params;
  const post = allReadableBlogsWithContent.find(b => b.slug === slug);
  if (!slug || !post) return notFound();
  if (post.link) return redirect(post.link);
  return (
    <>
      <Hero
        title={post.title}
        hero={post.hero}
        source={post.heroSource}
        heroMeta={post.heroMeta}
      />
      <Header post={post} />
      <hr
        className={cx(
          "m-0 h-px w-full border-none bg-divider",
          "-my-6",
          "-mx-3 w-[calc(100%_+_1.5rem)]",
          "tablet-md:mx-0 tablet-md:w-full",
        )}
      />
      <div
        className={cx(
          "flex flex-col-reverse gap-8",
          "tablet-md:flex-row tablet-md:items-center",
          "justify-between tablet-md:gap-4",
        )}
      >
        <div className={"flex flex-row items-center gap-2.5 tablet-md:gap-3"}>
          <ShareButton title={"Share blog post"} slug={slug || ""} />
          <OutlinedLinkButton
            title={"Edit blog post"}
            href={`https://github.com/bjorndonald/bjorncode.dev/edit/main/content/${slug}.mdx`}
            className={"pr-3.5"}
          >
            <Icon
              className={"size-5"}
              path={
                // eslint-disable-next-line max-len
                "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
              }
            />
            <span>Edit on GitHub</span>
          </OutlinedLinkButton>
        </div>
        <Reactions slug={slug} />
      </div>
      <script type={"application/ld+json"} suppressHydrationWarning>
        {blogPostStructuredData(post)}
      </script>
    </>
  );
}

export const generateStaticParams = () =>
  allReadableBlogs
    .filter(post => !post.link)
    .map(post => ({ slug: post.slug }));

export function generateMetadata(
  context: BlogPostPageContext,
): Metadata | undefined {
  const { slug } = context.params;
  if (!slug) return undefined;
  const post = allReadableBlogsWithContent.find(b => b.slug === slug);
  if (!post) return undefined;

  const { title, date, summary } = post;
  const metadata = createMetadata({
    title: `${title} | Blog – Bjorn-Donald Bassey`,
    description: summary || "Blog post by Bjorn-Donald Bassey",
    exactUrl: `https://bjorncode.dev/blog/${slug}`,
    keywords: post.keywords,
  });
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article", publishedTime: date },
  };
}
