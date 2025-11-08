"use client";

import { GameStacks } from "@/hooks/games/klondike/use-utils";
import { BoardHeader } from "./board-header";
import { BoardMain } from "./board-main";

type Props = {
  stacks: GameStacks;
  onDrawCard: () => void;
};

export function Board({ stacks, onDrawCard }: Props) {
  return (
    <div className="flex flex-col w-[80%] h-[75%] gap-4 p-4 bg-green-800 rounded-md">
      <BoardHeader stacks={stacks} onDrawCard={onDrawCard} />
      <BoardMain stacks={stacks} />
    </div>
  );
}
