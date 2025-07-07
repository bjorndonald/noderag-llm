import { Section } from "@/components/atoms/section";
import cx, { twc } from "@/utils/cx";
import LogoSVG from "@/components/atoms/logo";
import Link from "next/link";

const LogoPreview = twc.div`
    flex flex-col
    items-center
    justify-center
    border
    border-divider
    border-dashed
    p-6 
    w-full
    text-center
`;

export const Logo = () => (
  <Section id="logo">
    <h2 className={"text-lg"}>Logo</h2>
    <div
      className={cx(
        "grid grid-cols-1 place-items-center items-center tablet-sm:grid-cols-2",
        "border-collapse border border-dashed border-divider",
      )}
    >
      <LogoPreview className={"bg-light dark:bg-dark"}>
        <LogoSVG className={"size-12"} />
      </LogoPreview>
      <LogoPreview className={"bg-dark dark:bg-light"}>
        <LogoSVG
          className={"size-12"}
          fgClassName={"fill-dark dark:fill-light"}
        />
      </LogoPreview>
    </div>
  </Section>
);
