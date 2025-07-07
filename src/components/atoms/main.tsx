import { MAX_SITE_WIDTH } from "@/constants";
import { twc } from "@/utils/cx";

export const Main = twc.main.attrs({ style: { maxWidth: MAX_SITE_WIDTH } })`
    flex
    flex-col
    flex-1
    z-0
    pt-28 
    px-3
    pb-8
    gap-14
    w-full
    mx-auto
    tablet-md:pt-32
    tablet-md:px-0
`;
