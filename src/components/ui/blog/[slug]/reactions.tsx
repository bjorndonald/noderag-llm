import { getCounters } from "@/actions/counters";
import React, { Suspense } from "react";
import { ReactionsButtons } from "../reactions";

const Buttons = async ({ slug }: { slug: string }) => {
  const counters = await getCounters(slug);
  return <ReactionsButtons slug={slug} initialCounters={counters} />;
};

export const Reactions = ({ slug }: { slug?: string }) => {
  if (!slug) return null;
  return (
    <Suspense fallback={<div className={"min-h-11 min-w-11"} />}>
      <Buttons slug={slug} />
    </Suspense>
  );
};

export default Reactions;
