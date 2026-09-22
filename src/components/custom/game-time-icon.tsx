"use client";

import { Preview } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { HourglassIcon } from "lucide-react";

type Props = {
  playtime: Preview["estimatedPlaytime"];
};

export default function GameTimeIcon({ playtime }: Props) {
  const color: Record<typeof playtime, string> = {
    short: "green",
    medium: "yellow",
    long: "orange",
    unlimited: "red",
  };

  return (
    <Tooltip>
      <TooltipTrigger className="bg-black rounded-2xl p-2 w-fit h-fit">
        <HourglassIcon
          size={18}
          color={color[playtime]}
          fill={color[playtime]}
          className="text-sm font-medium bg-none p-1 w-fit h-fit"
        />
      </TooltipTrigger>
      <TooltipContent className="bg-black">
        <p className="text-white text-[14px] capitalize">{playtime} playtime</p>
      </TooltipContent>
    </Tooltip>
  );
}
