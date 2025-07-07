import { Img } from "@/components/atoms/img";
import { Link } from "@/components/atoms/link";
import { twc } from "@/utils/cx";

export const TemplateLink = twc(Link)`
    font-normal
    group/template no-underline
    relative
    p-2.5 mobile-lg:p-3
    tablet-md:rounded-2.5
    -mx-3
    w-[calc(100%_+_1.5rem)]
    bg-transparent
    transition-colors
    hocus:bg-tint-bg
    flex flex-row
    items-center
    gap-2
    place-items-stretch
    mobile-lg:gap-3
    mobile-lg:items-start
    tablet-md:gap-3.5
`;

export const TemplateIcon = twc(Img)`
    rounded-2 p-1.5
    transition-all
    aspect-square object-contain
    bg-tint-bg
    drop-shadow-none
    group-hocus/template:p-1
    group-hocus/template:saturate-125
    group-hocus/template:!bg-transparent
    group-hocus/template:drop-shadow-[0_1px_2px_rgba(var(--tint)/0.5)]
`;
