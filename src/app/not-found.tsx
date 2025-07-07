/* eslint-disable @next/next/no-img-element */
import { LinkButton } from "@/components/atoms/link-button";
import { Section } from "@/components/atoms/section";
import { getColoredTextClasses } from "@/utils/colored-text";
import { createMetadata } from "@/utils/metadata";

export default function NotFound() {
  return (
    <Section id="error" className={"-m-7 h-full w-full flex-1 tablet-sm:-mb-8"}>
      <h1 className={getColoredTextClasses("red", "mb-4")}>
        Woops! ~ Page not found
      </h1>
      <p>
        Unfortunately, the page you&apos;re looking for doesn&apos;t exist or
        has been moved.
      </p>
      <p className="-mt-3">Please double check the URL for types. Otherwise,</p>
      <LinkButton href={"/"} title={"Home page"} className={"mb-5 mt-1.5"}>
        Go back home
      </LinkButton>
      <img
        src={"/media/site/404.gif"}
        alt={"John Travolta gif"}
        className={"mx-auto mt-auto w-full"}
        style={{ maxWidth: 425, filter: "drop-shadow(0 0 2px #fff)" }}
      />
    </Section>
  );
}

export const metadata = createMetadata({
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has been moved.",
  keywords: ["404", "not found", "page not found"],
  image: "https://bjorncode.dev/404-og.png",
});
