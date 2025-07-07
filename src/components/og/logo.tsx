import React, { type ComponentProps } from "react";
import cx from "@/utils/cx";

interface LogoProps extends ComponentProps<"svg"> {
  bClassName?: string;
  fgClassName?: string;
}

const Logo = ({ bClassName, fgClassName, ...props }: LogoProps) => {
  return (
    <svg
      width="130"
      height="180"
      {...props}
      viewBox="0 0 130 180"
      className={cx("size-6", props.className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_16_11)">
        <g clipPath="url(#clip1_16_11)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-1 48.4998H37.6522V114.25C37.6522 119.58 39.2268 124.791 42.1769 129.223C45.1269 133.655 49.32 137.109 54.2258 139.149C59.1316 141.189 64.5298 141.722 69.7378 140.682C74.9457 139.642 79.7295 137.076 83.4843 133.307C87.239 129.538 89.796 124.735 90.8319 119.508C91.8679 114.28 91.3362 108.861 89.3041 103.936C87.2721 99.0119 83.8309 94.8028 79.4158 91.8415C75.0007 88.8802 69.81 87.2996 64.5 87.2996H47.3153V48.4998H64.5C77.4547 48.4998 90.1184 52.3559 100.89 59.5806C111.661 66.8054 120.057 77.0741 125.014 89.0884C129.972 101.103 131.269 114.323 128.741 127.077C126.214 139.831 119.976 151.547 110.816 160.742C101.655 169.938 89.9842 176.2 77.2784 178.737C64.5727 181.274 51.4028 179.972 39.4342 174.995C27.4657 170.019 17.236 161.591 10.0387 150.779C2.84151 139.966 -1 127.254 -1 114.25L-1 48.4998Z"
            fill="#0A85F7"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M37.6522 38.7998H-1V0H18.3261C23.4473 0.0142999 28.3547 2.0628 31.976 5.69789C35.5972 9.33299 37.6379 14.2591 37.6522 19.3999V38.7998Z"
            className="#fff"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_16_11">
          <rect
            className={cx("fill-accent", bClassName)}
            width="130"
            height="180"
            fill={props.style?.fill || props.fill || "#333333"}
          />
        </clipPath>
        <clipPath id="clip1_16_11">
          <rect
            width="131"
            height="180"
            fill="white"
            transform="translate(-1)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Logo;
