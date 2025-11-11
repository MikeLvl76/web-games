"use client";

import { memo } from "react";
import { Card, GameStacks } from "@/hooks/games/klondike/use-utils";
import { BoardFoundation } from "./board-foundation";
import { BoardDrawnCards } from "./board-drawn-cards";
import { BoardPack } from "./board-pack";

type Props = {
  stacks: GameStacks;
  onDrawCard: () => void;
  isCardActive?: (card: Card) => boolean;
};

export const BoardHeader = memo(
  ({ stacks, onDrawCard, isCardActive }: Props) => {
    return (
      <div className="flex flex-row justify-evenly items-center h-48 select-none">
        <BoardFoundation
          name="club_foundation"
          symbol="club"
          foundation={stacks[`club_foundation`]}
        />
        <BoardFoundation
          name="spade_foundation"
          symbol="spade"
          foundation={stacks[`spade_foundation`]}
        />
        <BoardFoundation
          name="heart_foundation"
          symbol="heart"
          foundation={stacks[`heart_foundation`]}
        />
        <BoardFoundation
          name="diamond_foundation"
          symbol="diamond"
          foundation={stacks[`diamond_foundation`]}
        />
        <div className="relative w-24 h-32" />

        <div className="relative w-24 h-32">
          <BoardDrawnCards
            name="draw"
            draw={stacks.draw}
            isCardActive={isCardActive}
          />
        </div>

        <div className="relative w-24 h-32">
          <div className="absolute inset-0 rounded-md bg-slate-400/70" />
          <BoardPack pack={stacks.pack.cards} onDrawCard={onDrawCard} />
        </div>
      </div>
    );
  }
);
BoardHeader.displayName = "BoardHeader";
