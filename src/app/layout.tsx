import { createMetadata } from "@/utils/metadata";
import "./../styles/globals.scss";
import cx from "classnames";
import { Inter, Manrope } from "@/styles/fonts";
import Script from "next/script";
import { Meta } from "./meta";
import { Providers } from "@/providers";
import Header from "@/components/layout/Header";
import { GoogleAnalytics } from "@next/third-parties/google";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  ...createMetadata({
    title: "Bjorn-Donald Bassey - Full-stack Software Engineer",
    description:
      "Passionate and creative full-stack software engineer from Colombia 🇳🇬  Detail- driven, I strive to build great-looking, user - friendly software while enhancing my skills along the way",
    keywords: [
      "bjorn-donald bassey",
      "bjorn",
      "bjorn-donald",
      "bassey",
      "open-source",
      "full-stack",
      "software engineer",
      "nigeria",
      "bio",
      "developer",
      "portfolio",
      "developement",
      "web",
    ],
  }),
};

const { UMAMI_WEBSITE_ID: umamiWebsiteId = "" } = process.env;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      id="page"
      lang="en"
      className={cx(Inter.className, Manrope.variable)}
      suppressHydrationWarning
    >
      <head>
        <Meta />
        

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GZTL6G4HZJ"
        ></Script>
      </head>
      <body>
        <Providers>
          <div className="flex h-full w-full flex-col">
            <div className="relative flex h-full w-full flex-1 transition-colors z-0">
              <div className="relative flex h-full w-full flex-row">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-[260px]">
                  <Header />
                  <div className="flex-1 mb-14">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-GZTL6G4HZJ" />
    </html>
  );
}
