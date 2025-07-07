/* eslint-disable @next/next/no-img-element */
"use client";

import { Link } from "@/components/atoms/link";
import { LinkButton } from "@/components/atoms/link-button";
import { Section } from "@/components/atoms/section";
import { getColoredTextClasses } from "@/utils/colored-text";
import cx from "@/utils/cx";

const ErrorComponent = (props: { error: Error }) => {
  const { error } = props;
  const [, ...errorStack] = error.stack?.toString().split(/\r?\n/) || [];
  return (
    <Section id="error" className="h-full mt-6 w-full flex flex-col items-center ">
      <h1 className={getColoredTextClasses("red", "mb-3")}>
        Something went wrong
      </h1>
      <p>
        <span className="font-medium">Whoops!</span> Unfortunately an unexpected
        error occured.
      </p>
      <p className="-mt-2">
        Please{" "}
        <Link
          title="Create issue on Github"
          href={
            "https://github.com/bjorndonald/bjorn.dev/issues/new?assignees=bjorndonald&labels=bug&template=1_bug_report.yaml"
          }
        >
          share the details
        </Link>{" "}
        of this issue, so I can fix it for you.
      </p>
      <details className="rounded-2 flex flex-col items-center justify-center border border-divider">
        <summary className="select-none p-2 font-medium">Error details</summary>
        <div
          className={cx(
            "max-w-full overflow-hidden border-t border-divider",
            "flex flex-col gap-2 p-0",
          )}
        >
          <code
            className={cx(
              "flex flex-col border-none p-3",
              "overflow-x-auto text-nowrap",
              "no-scrollbar font-mono text-2xs",
              "max-w-full whitespace-pre-line",
              "bg-brand-200/5 dark:bg-brand-300/10",
            )}
          >
            <span className="font-medium">
              {error.name}: {error.message}
            </span>
            {errorStack.map((l, i) => (
              <span key={i} className="pl-3">
                {l}
              </span>
            ))}
          </code>
        </div>
      </details>
      <LinkButton href={"/"} title="Home page" className="mt-3 mx-auto">
        Go back home
      </LinkButton>
      <img
        src={"/media/site/giphy.gif"}
        alt={"Keep Going Oh No GIF"}
        loading={"lazy"}
        decoding={"async"}
        className={"mt-3"}
        style={{ maxWidth: 425 }}
      />
    </Section>
  );
};

export default ErrorComponent;
