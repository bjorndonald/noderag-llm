import { type CSSProperties } from "react";

import { Img } from "@/components/atoms/img";
import type { PartialBlog } from "@/utils/blog";
import { hexToRgb } from "@/utils/color";
import cx from "@/utils/cx";
import { formatDate } from "@/utils/date";
import { getUrlDomain } from "@/utils/domain";

import { ViewsCounter } from "../views-counter";

import { BlogPostLink } from "./item.styles";

interface BlogPostItemProps {
  post: PartialBlog;
  fullDate?: boolean;
}

const MAX_WIDTH = 96;
const MAX_HEIGHT = 72;
const getHeroProps = (heroMeta: PartialBlog["heroMeta"]) => {
  const { width = MAX_WIDTH, height = MAX_HEIGHT, ...rest } = heroMeta || {};
  return {
    width: Math.min(width, MAX_WIDTH),
    height: Math.min(height, MAX_HEIGHT),
    ...rest,
  };
};

export const BlogPostItem = (props: BlogPostItemProps) => {
  const { post, fullDate } = props;

  const a11yDate = formatDate(post.date);
  const readableDate = fullDate
    ? a11yDate
    : formatDate(post.date, false, {
        year: undefined,
      });

  const color = hexToRgb(post.color, 1, true) || "var(--color-accent-dark)";

  return (
    <BlogPostLink
      title={post.title}
      href={post.link || `/blog/${post.slug}`}
      style={{ "--tint": color } as CSSProperties}
      prefetch={false}
    >
      <div
        className={cx(
          "overflow-hidden",
          "max-w-12 rounded-1",
          "mobile-md:max-w-18",
          "mobile-lg:max-w-24",
          "transition",
          "border border-transparent",
          "group-hocus/post:border-tint-border",
          "mobile-md:row-span-2 mobile-md:mt-0.75",
        )}
        style={{ aspectRatio: "4/3" }}
      >
        <Img
          src={post.hero || ""}
          alt={`Hero image for blog post "${post.title}"`}
          {...getHeroProps(post.heroMeta)}
          className={
            "h-full transition duration-200 group-hocus/post:scale-110"
          }
        />
      </div>
      <p
        className={cx(
          "w-full font-medium tablet-md:self-end",
          "line-clamp-2 text-pretty text-xs text-primary-txt",
          "group-hocus/post:underline group-hocus/post:decoration-primary-txt",
        )}
      >
        {post.title}
      </p>
      <div
        className={cx(
          "flex flex-col",
          "col-span-2 gap-1",
          "mobile-lg:gap-0.5",
          "mobile-md:col-span-1 mobile-md:col-start-2",
        )}
      >
        <p className={"line-clamp-2 text-pretty text-2xs text-secondary-txt"}>
          {post.summary}
        </p>
        {post.link ? (
          <p className={"line-clamp-1 text-3xs text-tertiary-txt"}>
            Published on{" "}
            <span className={"underline"}>{getUrlDomain(post.link)}</span>
          </p>
        ) : null}
        <p
          className={cx(
            "flex w-full flex-row items-center",
            "gap-1.5 text-3xs text-tertiary-txt",
            "overflow-x-auto tabular-nums",
          )}
        >
          <span
            title={`This blog post was published on ${a11yDate}`}
            aria-label={`This blog post was published on ${a11yDate}`}
          >
            {readableDate}
          </span>
          {post.readingTime ? (
            <>
              <span aria-hidden={"true"} className={"font-bold"}>
                ·
              </span>
              <span
                title={`It takes ${post.readingTime} minutes to read this blog post`}
                aria-label={`It takes ${post.readingTime} minutes to read this blog post`}
              >
                {Math.ceil(post.readingTime)} min read
              </span>
            </>
          ) : null}
          {!post.link && !post.draft ? <ViewsCounter slug={post.slug} /> : null}
        </p>
      </div>
    </BlogPostLink>
  );
};
