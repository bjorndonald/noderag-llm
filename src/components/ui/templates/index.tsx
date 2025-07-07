import { Icon } from "@/components/atoms/icon";
import { LinkButton } from "@/components/atoms/link-button";
import { Section } from "@/components/atoms/section";
import { templates as allTemplates } from "@/content";
import { getColoredTextClasses } from "@/utils/colored-text";
import cx from "@/utils/cx";

import { TemplateItem } from "./item";

interface TemplatesListProps {
  title: string;
  featuredOnly?: boolean;
}

const templates = allTemplates.sort((a, b) => a.order - b.order);
export const TemplatesList = (props: TemplatesListProps) => {
  const filteredTemplates = props.featuredOnly
    ? templates.filter(it => !it.hide)
    : templates;
  const Heading = props.featuredOnly ? "h2" : "h1";
  return (
    <Section id={"templates"} className={"gap-6"}>
      <div
        className={cx(
          "flex w-full flex-col items-start gap-4",
          "mobile-md:flex-row mobile-md:items-center mobile-md:justify-between",
        )}
      >
        <Heading className={getColoredTextClasses("purple")}>
          {props.title}
        </Heading>
        {props.featuredOnly ? (
          <LinkButton
            title={"View all"}
            href={"/templates"}
            className={cx(
              "pr-3.5",
              "justify-center max-mobile-md:flex-1",
              "mobile-md:justify-start mobile-md:self-start",
            )}
            data-umami-event={"View all templates"}
          >
            <Icon
              className={"size-5"}
              path={
                "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
              }
            />
            <span>View all</span>
          </LinkButton>
        ) : null}
      </div>
      <ul>
        {filteredTemplates.map(template => (
          <li key={template.name}>
            <TemplateItem template={template} />
          </li>
        ))}
      </ul>
    </Section>
  );
};
