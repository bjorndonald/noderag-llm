"use client";
import { Icon } from "@/components/atoms/icon";
import { useRequest } from "@/hooks/use-request";
import { loading as loadingIcon } from "@/components/icons";
import type { NowPlayingAPIResponse } from "@/types/spotify/request";
import React from "react";
import { Clock } from "./time";
import {
  NowPlayingAlbumCover,
  NowPlayingLink,
  NowPlayingTextsContainer,
  ScrollingText,
} from "./now-playing.styles";

const FooterNowPlaying = () => {
  const { data, loading } =
    useRequest<NowPlayingAPIResponse>("/api/now-playing");
  const { track, isPlaying } = data || { isPlaying: false };

  if (loading)
    return <Icon path={loadingIcon} className="size-5 animate-spin" />;

  if (!isPlaying || !track) return <Clock />;
  const scrollingText = `${track.name} by ${track.artist}`;
  const animationDuration = scrollingText.length * 0.35;
  return (
    <NowPlayingLink
      title={`Listen to "${track.name}" by "${track.artist}" on Spotify`}
      href={track.url}
      target={"_blank"}
      data-umami-event={"Now Playing"}
      data-umami-event-from={"Footer"}
      style={{ maxWidth: "28ch" }}
    >
      <NowPlayingAlbumCover
        alt={`Album cover: "${track.album}" by "${track.artist}"`}
        src={track.image?.url || ""}
        width={24}
        height={24}
        quality={50}
      />
      <NowPlayingTextsContainer
        style={{ animationDuration: `${animationDuration}s` }}
      >
        <ScrollingText>{scrollingText}</ScrollingText>
        <ScrollingText aria-hidden={"true"} className={"select-none"}>
          {scrollingText}
        </ScrollingText>
        <ScrollingText aria-hidden={"true"} className={"select-none"}>
          {scrollingText}
        </ScrollingText>
      </NowPlayingTextsContainer>
    </NowPlayingLink>
  );
};

export default FooterNowPlaying;
