import { Icon } from "@/components/atoms/icon";
import { loading } from "@/components/icons";
import cx from "@/utils/cx";
import React from "react";

const Loading = (props: { sm?: boolean }) => {
  return (
    <div
      className={cx(
        "flex w-full flex-1 flex-col items-center justify-center p-4",
        !props.sm ? "min-h-screen" : "h-full",
      )}
    >
      <Icon className={cx("size-12 animate-spin text-accent")} path={loading} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
