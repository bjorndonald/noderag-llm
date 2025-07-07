import { Img } from "@/components/atoms/img";
import { Link } from "@/components/atoms/link";
import type { Blog } from "@/content";
import cx from "@/utils/cx";
import { getUrlDomain } from "@/utils/domain";
import React from "react";

interface HeroProps {
  title: Blog["title"];
  hero?: Blog["hero"];
  source?: Blog["heroSource"];
  heroMeta?: Blog["heroMeta"];
}

const Hero = (props: HeroProps) => {
  const { title, hero, source, heroMeta } = props;

  return (
    <figure
      className={cx(
        "-z-1 overflow-hidden",
        "max-w-[calc(100vw_+_calc(100vw_-_100%))]",
        "absolute -left-[calc(100vw_-_100%)] -right-[calc(100vw_-_100%)] top-0",
        "pointer-events-none blur transition",
        "opacity-40 saturate-125 dark:opacity-65",
        // eslint-disable-next-line max-len
        "[mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0)_100%)]",
      )}
      style={{ height: "85vh", maxHeight: 384, width: "100vw" }}
    >
      <Img
        src={hero || ""}
        alt={`Cover image for blog post: "${title}"`}
        className={"h-full w-full"}
        priority
        {...heroMeta}
      />
      {source ? (
        <figcaption className={"sr-only"}>
          Image from{" "}
          <Link title={source} href={source}>
            {getUrlDomain(source, true)}
          </Link>
        </figcaption>
      ) : null}
    </figure>
  );
};

export default Hero;
