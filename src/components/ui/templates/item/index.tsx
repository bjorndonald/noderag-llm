import { type CSSProperties } from "react";

import type { Template } from "@/content";
import { hexToRgb } from "@/utils/color";
import cx from "@/utils/cx";

import { TemplateIcon, TemplateLink } from "./item.styles";
import { StarsCounter } from "./stars-count";

interface TemplateItemProps {
  template: Template;
}

export const TemplateItem = ({ template }: TemplateItemProps) => {
  const color =
    hexToRgb(template.darkColor || template.color, 1, true) ||
    "var(--color-accent-dark)";
  return (
    <TemplateLink
      title={template.name}
      href={template.url}
      style={{ "--tint": color } as CSSProperties}
      data-umami-event={"View template"}
      data-umami-event-template={template.name}
    >
      <TemplateIcon
        src={`/media/templates/${template.icon || ""}`}
        alt={`Icon for template "${template.name}"`}
        width={56}
        height={56}
        blurDataURL={template.iconMeta?.blurDataURL}
        placeholder={template.iconMeta?.placeholder}
      />
      <div className={"flex flex-col gap-0.5"}>
        <div className={"flex flex-row items-center gap-3"}>
          <p
            className={cx(
              "font-medium",
              "line-clamp-2 text-pretty text-xs text-primary-txt",
              "group-hocus/template:underline group-hocus/template:decoration-primary-txt",
            )}
          >
            {template.name}
          </p>
          <StarsCounter repo={template.repo || ""} owner={template.owner} />
        </div>
        <p className={"line-clamp-2 text-pretty text-2xs text-secondary-txt"}>
          {template.description}
        </p>
      </div>
    </TemplateLink>
  );
};
