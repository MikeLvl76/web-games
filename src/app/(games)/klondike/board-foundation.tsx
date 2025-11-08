"use client";

import CardSymbolIcon from "@/components/generic/card-symbol-icon";
import Droppable from "@/components/generic/droppable";
import { useMemo } from "react";
import { CardContainer } from "./card-container";
import {
  CardSymbol,
  Card,
  DroppableDataType,
  SYMBOL_COLOR,
  CardColor,
} from "@/hooks/games/klondike/use-utils";

type Props = {
  foundation: { symbol: CardSymbol; cards: Card[] };
};

export function BoardFoundation({ foundation }: Props) {
  const lastCard = useMemo(() => {
    const [last] = foundation.cards.slice(-1);
    return last;
  }, [foundation.cards]);

  return (
    <Droppable<DroppableDataType>
      nodeId={`drop-seq-${foundation.symbol}`}
      data={{
        accepts: ["draw-drag", "col-drag"],
        type: "sequence",
        symbol: foundation.symbol,
      }}
      disabled={foundation.cards.length === 13}
    >
      <div className="relative w-24 h-32">
        <div className="absolute inset-0 flex justify-center items-center rounded-md bg-slate-400/70">
          <CardSymbolIcon
            symbol={foundation.symbol}
            color={SYMBOL_COLOR[foundation.symbol] as CardColor}
          />
        </div>
        {foundation.cards.length > 0 && (
          <CardContainer
            symbol={foundation.symbol}
            color={SYMBOL_COLOR[foundation.symbol] as CardColor}
            rank={lastCard.rank.name}
            className="relative flex flex-col justify-center items-center gap-2 w-24 h-32 rounded-md bg-slate-200"
          />
        )}
      </div>
    </Droppable>
  );
}
