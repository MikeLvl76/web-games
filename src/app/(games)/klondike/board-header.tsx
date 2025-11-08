"use client";

import { memo } from "react";
import { GameStacks } from "@/hooks/games/klondike/use-utils";
import { BoardFoundation } from "./board-foundation";
import { BoardDrawnCards } from "./board-drawn-cards";
import { BoardPack } from "./board-pack";

type Props = {
  stacks: GameStacks;
  onDrawCard: () => void;
};

export const BoardHeader = memo(({ stacks, onDrawCard }: Props) => {
  return (
    <div className="flex flex-row justify-evenly items-center h-48 select-none">
      <BoardFoundation
        foundation={{
          symbol: "club",
          cards: stacks[`club_foundation`].cards,
        }}
      />
      <BoardFoundation
        foundation={{
          symbol: "spade",
          cards: stacks[`spade_foundation`].cards,
        }}
      />
      <BoardFoundation
        foundation={{
          symbol: "heart",
          cards: stacks[`heart_foundation`].cards,
        }}
      />
      <BoardFoundation
        foundation={{
          symbol: "diamond",
          cards: stacks[`diamond_foundation`].cards,
        }}
      />
      <div className="relative w-24 h-32" />

      <div className="relative w-24 h-32">
        <BoardDrawnCards drawnCards={stacks.draw.cards} />
      </div>

      <div className="relative w-24 h-32">
        <div className="absolute inset-0 rounded-md bg-slate-400/70" />
        <BoardPack pack={stacks.pack.cards} onDrawCard={onDrawCard} />
      </div>
    </div>
  );
});
BoardHeader.displayName = "BoardHeader";
