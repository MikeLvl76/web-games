"use client";

import { Preview } from "@/lib/utils";
import {
  LucideIcon,
  PuzzleIcon,
  SwordsIcon,
  UserRoundIcon,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

type Props = {
  gameType: Preview["type"];
  size?: number;
  fill?: string;
  color?: string;
};

export default function GameTypeIcon({ gameType, size, fill, color }: Props) {
  const TypeIcon: Record<typeof gameType, LucideIcon> = {
    puzzle: PuzzleIcon,
    versus: SwordsIcon,
    solo: UserRoundIcon,
  };

  const Icon = TypeIcon[gameType];

  return (
    <Tooltip>
      <TooltipTrigger className="bg-black rounded-2xl p-2 w-fit h-fit">
        <Icon
          size={size ?? 16}
          color={color ?? "white"}
          fill={fill ?? "white"}
          className="text-sm font-medium bg-none p-1 w-fit h-fit"
        />
      </TooltipTrigger>
      <TooltipContent className="bg-black">
        <p className="text-white text-[14px] capitalize">{gameType}</p>
      </TooltipContent>
    </Tooltip>
  );
}
