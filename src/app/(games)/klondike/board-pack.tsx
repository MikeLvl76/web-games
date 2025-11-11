"use client";

import { Card } from "@/hooks/games/klondike/use-utils";

type Props = {
  pack: Card[];
  onDrawCard: () => void;
};

export function BoardPack({ pack, onDrawCard }: Props) {
  return (
    <div
      onClick={onDrawCard}
      className={`relative flex justify-center items-center w-24 h-32 rounded-md hover:cursor-pointer ${
        pack.length > 0 ? "bg-red-700 border-2 border-black" : "bg-slate-400/70"
      } `}
    >
      {pack.length > 0 && <p className="text-xl text-white">{pack.length}</p>}
    </div>
  );
}
