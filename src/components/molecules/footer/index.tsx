import React from "react";
import {
  Description,
  Details,
  FooterLink,
  LinksList,
  StyledFooter,
} from "./footer.styles";
import cx from "@/utils/cx";
import Logo from "@/components/atoms/logo";
import { SocialLinks } from "../social-links";
import { linksGroups } from "./footer.data";
import FooterNowPlaying from "./now-playing";

const Footer = () => {
  return (
    <StyledFooter>
      <Details>
        <FooterLink
          title="Bjorn-Donald - Home Page"
          href={"/"}
          className={cx(
            "self-start",
            "flex flex-row items-center text-xs font-bold",
            "gap-2 no-underline saturate-125 dark:saturate-150",
            "hocus:underline hocus:decoration-brand-500",
            "dark:hocus:decoration-brand-300",
          )}
        >
          <Logo />
          <span className="text-accent">Bjorn-Donald</span>
        </FooterLink>
        <Description>
          Passionate and creative full-stack software engineer from Nigeria{" "}
          <span role={"img"} aria-label={"Nigeria flag"}>
            🇳🇬
          </span>
        </Description>
        <SocialLinks />
      </Details>
      {linksGroups.map(group => {
        return (
          <LinksList key={group.title}>
            <p
              className={
                "select-none font-manrope text-3xs font-bold uppercase tracking-wider text-tertiary-txt"
              }
            >
              {group.title}
            </p>
            <ul
              title={group.a11yTitle}
              aria-label={group.a11yTitle}
              className="flex flex-col gap-2"
            >
              {group.links.map(link => {
                const className = `hocus:${link.className}`;
                return (
                  <li key={link.title}>
                    <FooterLink
                      title={link.a11yTitle || link.title}
                      href={link.href}
                      className={className}
                      {...link.props}
                      prefetch={false}
                    >
                      {link.title}
                    </FooterLink>
                  </li>
                );
              })}
            </ul>
          </LinksList>
        );
      })}
      {/* <div
        className={
          "col-span-2 flex min-h-6 flex-row items-center justify-start self-start"
        }
      >
        <FooterNowPlaying />
      </div> */}
    </StyledFooter>
  );
};

export default Footer;
