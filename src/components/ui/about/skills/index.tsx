import type { CSSProperties } from "react";

import { Icon } from "@/components/atoms/icon";
import { Section } from "@/components/atoms/section";
import { hexToRgb } from "@/utils/color";
import cx from "@/utils/cx";

import { skills } from "./data";

export const Skills = () => {
  return (
    <Section id={"skills"}>
      <h2>Skills</h2>
      <ul className={"flex flex-wrap items-center gap-2.5"}>
        {skills
          .filter(skill => !skill.hide)
          .map(skill => {
            const color = hexToRgb(skill.color, 0, true);
            return (
              <li className={"block"} key={skill.name}>
                <span
                  className={cx(
                    "flex items-center gap-1.5",
                    "min-h-9 rounded-2 py-1.5 pl-3 pr-3.5",
                    "border border-divider",
                    "cursor-default text-3xs font-medium",
                    "transition-colors",
                    "bg-brand-200/5 dark:bg-brand-700/10",
                    "hocus:!bg-tint-bg",
                    "hocus:border-tint-border",
                  )}
                  style={{ "--tint": color } as CSSProperties}
                >
                  <Icon path={skill.icon} className={"size-4"} />
                  <span>{skill.name}</span>
                </span>
              </li>
            );
          })}
      </ul>
    </Section>
  );
};
