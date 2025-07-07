import type { Blog } from "@/content";
import { hexToRgb } from "@/utils/color";
import { formatDate } from "@/utils/date";
import { getReadableColor } from "@/utils/readable-color";
import React, { type CSSProperties } from "react";
import { ViewsCounter } from "../views-counter";
import cx from "@/utils/cx";
import { Link } from "@/components/atoms/link";
import { Icon } from "@/components/atoms/icon";

interface HeaderProps {
  post: Blog;
}

const Header = ({ post }: HeaderProps) => {
  const { color, readingTime } = post;
  const readableColor = getReadableColor(color, true);
  const shadowColor = hexToRgb(readableColor, 0.85);
  const readableDate = formatDate(post.date);
  return (
    <div className={"text-shadow -mt-2 flex flex-col gap-3 shadow-background"}>
      <Link
        title={"Go back to blog posts list"}
        href={"/blog"}
        className={cx(
          "self-start no-underline hocus:underline",
          "mb-2 flex flex-row items-center gap-1.5 py-1",
        )}
      >
        <Icon
          path={
            "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          }
          className={"size-4"}
          style={{
            filter: "drop-shadow(0 0.0625rem 0.125rem var(--tw-shadow-color))",
          }}
        />
        <span>Back to blog posts</span>
      </Link>
      <h1
        className={cx(
          "text-shadow dark:text-[var(--title-color)] dark:saturate-150",
          "dark:!shadow-background",
        )}
        style={
          {
            "--tw-shadow-color": shadowColor,
            "--title-color": readableColor,
          } as CSSProperties
        }
      >
        {post.title}
      </h1>
      <p className={"text-secondary-txt"}>{post.summary}</p>
      <p
        className={cx(
          "flex flex-row items-center gap-2",
          "tabular-nums text-tertiary-txt",
          "flex-wrap",
          "text-3xs mobile-md:text-2xs",
        )}
      >
        <span
          title={`This blog post was published on ${readableDate}`}
          aria-label={`This blog post was published on ${readableDate}`}
        >
          <span className={"sr-only"}>Published on</span>
          <span>{readableDate}</span>
        </span>
        {readingTime ? (
          <>
            <span aria-hidden={"true"} className={"font-bold"}>
              ·
            </span>
            <span
              title={`It takes ${readingTime} minutes to read this blog post`}
              aria-label={`It takes ${readingTime} minutes to read this blog post`}
            >
              {Math.ceil(readingTime)} minutes read
            </span>
          </>
        ) : null}
        {!post.link && !post.draft ? (
          <ViewsCounter slug={post.slug} write />
        ) : null}
      </p>
    </div>
  );
};

export default Header;
