"use client";
import cx from "@/utils/cx";
import type { ImageProps, StaticImageData } from "next/image";
import Image from "next/image";
import { useState } from "react";

export const Img = (props: ImageProps) => {
  const [errored, setErrored] = useState<boolean>(false);
  return (
    <Image
      {...props}
      placeholder={
        typeof props.src !== "string"
          ? (props.src as StaticImageData).blurDataURL
            ? "blur"
            : props.placeholder
          : props.placeholder
      }
      className={cx("object-cover object-center", props.className)}
      loading={!props.priority ? "lazy" : undefined}
      decoding="async"
      onError={() => {
        setErrored(true);
      }}
      unoptimized={errored || props.unoptimized}
    />
  );
};
