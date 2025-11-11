"use client";

import CardSymbolIcon from "@/components/generic/card-symbol-icon";
import Droppable from "@/components/generic/droppable";
import { CardContainer } from "./card-container";
import {
  CardSymbol,
  DroppableDataType,
  SYMBOL_COLOR,
  CardColor,
  Stack,
  GameStacks,
} from "@/hooks/games/klondike/use-utils";

type Props = {
  name: keyof GameStacks;
  symbol: CardSymbol;
  foundation: Stack;
};

export function BoardFoundation({ name, foundation, symbol }: Props) {
  const lastCard = foundation.cards[foundation.cards.length - 1];

  return (
    <Droppable<DroppableDataType>
      nodeId={`drop-foundation-${foundation.id}`}
      data={{
        accepts: ["draw", "pile"],
        type: "foundation",
        targetName: name,
      }}
      disabled={foundation.cards.length === 13}
    >
      <div className="relative w-24 h-32">
        <div className="absolute inset-0 flex justify-center items-center rounded-md bg-slate-400/70">
          <CardSymbolIcon
            symbol={symbol}
            color={SYMBOL_COLOR[symbol] as CardColor}
          />
        </div>
        {foundation.cards.length > 0 && (
          <CardContainer
            symbol={lastCard.symbol}
            color={lastCard.color}
            rank={lastCard.rank.name}
            className="relative flex flex-col justify-center items-center gap-2 w-24 h-32 rounded-md bg-slate-200"
          />
        )}
      </div>
    </Droppable>
  );
}
