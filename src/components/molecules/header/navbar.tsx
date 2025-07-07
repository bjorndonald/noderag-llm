import type { TWComponentProps } from "@/utils/cx";
import React from "react";
import {
  ButtonsGroup,
  ExtraNavLinks,
  LinksList,
  Nav,
  NavItem,
  NavLink,
  NavPageLink,
  NavPageLinkText,
} from "./navbar.styles";
import Logo from "../../atoms/logo";
import cx from "@/utils/cx";
import { SocialLinks } from "../social-links";
import { ThemeToggle } from "./theme-toggle";
import { NavToggle } from "./nav-toggle";

const toolbarLinksList = [
  {
    title: "About",
    href: "/about",
    className: "text-green",
  },
  {
    title: "Blog",
    href: "/blog",
    className: "text-orange",
  },
  {
    title: "Projects",
    href: "/projects",
    className: "text-purple",
  },
  {
    title: "Templates",
    href: "/templates",
    className: "text-yellow",
  },
  // {
  //   title: "Uses",
  //   href: "/uses",
  //   className: "text-blue",
  // },
];

interface NavbarProps extends TWComponentProps<typeof Nav> {
  path?: string;
  expanded?: boolean;
  onNavToggleClick?: () => void;
}

const Navbar = (props: NavbarProps) => {
  const { expanded, className } = props;
  return (
    <Nav id={"navigation"} className={className}>
      <NavLink
        title={"Bjorn-Donald Bassey - Home Page"}
        href={"/"}
        className={"gap-2 hocus:bg-toolbar-highlight"}
        aria-current={props.path === "/" ? "page" : undefined}
      >
        <Logo className={"saturate-125 dark:saturate-150"} />
        <span className={"text-accent saturate-125 dark:saturate-150"}>
          Bjorn-Donald
        </span>
      </NavLink>
      <LinksList
        className={
          expanded
            ? "pointer-events-auto visible max-h-full select-auto opacity-100"
            : ""
        }
      >
        {toolbarLinksList.map(link => {
          const isActive = props.path?.startsWith(link.href) || false;
          return (
            <NavItem
              key={link.href}
              className={isActive ? "before:bg-toolbar-highlight" : ""}
            >
              <NavPageLink
                key={link.href}
                href={link.href}
                title={`${link.title} page`}
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  `hocus:${link.className}`,
                  isActive ? link.className : "",
                  isActive ? "saturate-125 dark:saturate-150" : "",
                )}
                prefetch={!isActive}
              >
                <NavPageLinkText>{link.title}</NavPageLinkText>
              </NavPageLink>
            </NavItem>
          );
        })}
        <ExtraNavLinks aria-hidden={"true"} />
        <ExtraNavLinks className={"mx-auto"}>
          <SocialLinks />
        </ExtraNavLinks>
      </LinksList>
      <ButtonsGroup>
        <li>
          <ThemeToggle />
        </li>
        <li>
          <NavToggle
            title={`${expanded ? "Collapse" : "Expand"} menu`}
            aria-label={`${expanded ? "Collapse" : "Expand"} menu`}
            aria-expanded={expanded}
            aria-controls={"header"}
            onClick={props.onNavToggleClick}
          />
        </li>
      </ButtonsGroup>
    </Nav>
  );
};

export default Navbar;
