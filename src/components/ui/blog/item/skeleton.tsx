import cx from "@/utils/cx";

import { BlogPostLink } from "./item.styles";

const elementsBackground = "bg-brand-50 dark:bg-brand-800/50";
export const BlogPostItemSkeleton = () => (
  <BlogPostLink
    title={""}
    href={"#"}
    className={"pointer-events-none motion-safe:animate-pulse"}
    aria-disabled={true}
  >
    <div
      className={cx(
        elementsBackground,
        "h-full min-w-24",
        "max-w-12 rounded-1",
        "mobile-lg:max-w-24",
        "mobile-lg:row-span-2",
      )}
      style={{ aspectRatio: "4/3" }}
    />
    <p
      className={cx(
        elementsBackground,
        "w-full font-medium tablet-md:self-end",
        "line-clamp-2 text-pretty text-xs text-primary-txt",
        "group-hocus/post:underline group-hocus/post:decoration-primary-txt",
      )}
    ></p>
    <div
      className={cx(
        elementsBackground,
        "flex flex-col",
        "col-span-2 gap-1",
        "mobile-lg:gap-0.5",
        "mobile-lg:col-span-1 mobile-lg:col-start-2",
      )}
    >
      <p className={"line-clamp-2 text-pretty text-2xs text-secondary-txt"}></p>
      <p
        className={cx(
          "flex w-full flex-row items-center",
          "gap-1.5 text-3xs text-tertiary-txt",
          "overflow-x-auto tabular-nums",
        )}
      >
        <span></span>
      </p>
    </div>
  </BlogPostLink>
);
