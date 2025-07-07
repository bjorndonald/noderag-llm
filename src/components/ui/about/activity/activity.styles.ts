import { Img } from "@/components/atoms/img";
import { Link } from "@/components/atoms/link";
import { twc } from "@/utils/cx";

export const ActivityCard = twc(Link)`
  font-normal
  block
  relative
  w-full
  h-auto
  max-h-28
  max-w-full
  rounded-2.5
  no-underline
  transition
  truncate
  border
  border-divider
  min-h-[6.125rem]
  mobile-lg:max-h-[6.125rem]
  tablet-sm:min-h-[6.5rem]
  tablet-sm:max-h-[unset]
  hocus:shadow-sm
  group/track
`;

export const BackgroundImage = twc(Img)`
  absolute
  w-[110%]
  -left-[5%]
  -top-full
  mobile-md:-top-[125%]
  -z-1
  rounded-2.5
  opacity-35
  saturate-200
  pointer-events-none
  select-none
  max-w-[unset]
  truncate
  blur-md
`;

export const Content = twc.div`
  h-full
  w-full
  flex
  flex-row
  gap-3.5
  p-3
  max-w-full
  truncate
  rounded-2
  mobile-md:max-h-28
  items-center
  bg-white/50
  dark:bg-brand-800/15
`;

export const Texts = twc.div`
  flex
  flex-col
  flex-1
  gap-1.5
  truncate
`;

export const Header = twc.p`
  flex
  items-center
  gap-3
  text-3xs
  font-semibold
  font-manrope
  tracking-wider
  text-tertiary-txt
  uppercase
`;

export const MusicBarsGroup = twc.span`
  flex
  justify-between
  w-3
  h-3
`;

export const MusicBar = twc.span.attrs({
  style: { transformOrigin: "bottom" },
})`
  w-0.75
  h-full
  bg-accent-dark
  rounded-0.75
  motion-safe:animate-music-bars
`;

export const TrackName = twc.span`
  text-2xs
  truncate
  font-medium
  text-secondary-txt
  transition-colors
  w-full
  min-h-6
  group-hocus/track:text-primary-txt
  group-hocus/track:underline
`;

export const TrackArtist = twc.span`
  -mt-2
  text-3xs
  truncate
  text-secondary-txt
  transition-colors
  w-full
  min-h-5.5
  group-hocus/track:text-primary-txt
`;

export const AlbumCover = twc(Img)`
  rounded-1 aspect-square
  w-auto h-full
  max-w-full
  max-h-18 tablet-sm:max-h-20
  border border-divider
  transition
  scale-95
  group-hocus/track:scale-100
`;
