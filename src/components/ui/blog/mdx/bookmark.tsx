import { Suspense } from "react";

import { getMetadata } from "@/actions/mdx";
import { Img } from "@/components/atoms/img";
import { Link } from "@/components/atoms/link";
import cx from "@/utils/cx";
import { getUrlDomain } from "@/utils/domain";

const AsyncBookmark = async ({ url }: { url: string }) => {
  const data = await getMetadata(url);
  if (!data) return null;

  const domain = getUrlDomain(url);

  const faviconURL =
    `https://unavatar.io/microlink/${domain}` +
    `?fallback=https://unavatar.io/duckduckgo/${domain}` +
    `?fallback=https://source.boringavatars.com/beam/20/${encodeURI(
      domain || "",
    )}`;

  return (
    <Link
      title={data.title}
      href={url}
      className={cx(
        "bg-brand-500/[0.024] text-inherit dark:bg-brand-100/5",
        "hocus:bg-brand-300/5 dark:hocus:bg-brand-100/10",
        "rounded-2.5 border border-divider font-normal",
        "group/link w-full max-w-full no-underline",
        "flex flex-row overflow-hidden",
      )}
    >
      <div className={"flex flex-col gap-1 p-4"}>
        <p
          className={cx(
            "text-pretty text-2xs text-primary-txt",
            "line-clamp-1 font-medium group-hocus/link:underline",
          )}
        >
          {data.title}
        </p>
        <p className={"line-clamp-2 text-pretty text-3xs text-secondary-txt"}>
          {data.description}
        </p>
        <div className={"mt-1 flex w-full flex-row items-center gap-2.5"}>
          <Img
            src={faviconURL}
            alt={data.title}
            width={16}
            height={16}
            className={"!my-0 max-w-4 !rounded-0"}
          />
          <span className={"line-clamp-1 text-3xs"}>{domain}</span>
        </div>
      </div>
      <div className={"min-h-0 flex-1"}>
        <Img
          src={data.image || ""}
          alt={data.title}
          width={192}
          height={108}
          className={cx(
            "aspect-video h-full w-full",
            "pointer-events-none select-none",
            "min-w-24 mobile-md:min-w-36 mobile-lg:min-w-48",
          )}
          unoptimized
        />
      </div>
    </Link>
  );
};

export const Bookmark = ({ url }: { url: string }) => (
  <Suspense fallback={<div className={"min-h-11 w-full"} />}>
    <AsyncBookmark url={url} />
  </Suspense>
);
