import { Link } from "@/components/atoms/link";
import { twc } from "@/utils/cx";

export const StackContainer = twc.ul`
    relative
    overflow-hidden
    grid
    grid-cols-4
    grid-flow-dense
    py-8
    px-4
    gap-y-10
    items-center
    justify-center
    list-none
    [background-image:radial-gradient(var(--color-tertiary-txt)_1px,_transparent_1px)]
    [background-size:1rem_1rem]
    bg-repeat
    mobile-lg:[background-size:1.25rem_1.25rem]
    tablet-sm:[background-size:1.5rem_1.5rem]
`;

export const IconContainer = twc.li`
    flex
    flex-row
    m-auto
    items-center
    justify-center
    rounded-half
    p-1
    z-1
    max-w-14
    bg-background
`;

export const IconLink = twc(Link)`
    text-secondary-txt
    transform
    transition
    hocus:text-primary-txt
    hocus:scale-110
`;
