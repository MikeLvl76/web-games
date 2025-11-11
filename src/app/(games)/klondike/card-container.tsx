"use client";

import CardSymbolIcon from "@/components/generic/card-symbol-icon";
import { CardSymbol, CardColor } from "@/hooks/games/klondike/use-utils";
import { memo } from "react";

type Props = {
  symbol: CardSymbol;
  color: CardColor;
  rank: string;
  className?: string;
};

export const CardContainer = memo(
  ({ symbol, color, rank, className }: Props) => (
    <div className={className}>
      <CardSymbolIcon symbol={symbol} color={color} />
      <p className="text-lg font-bold">{rank}</p>
    </div>
  )
);
CardContainer.displayName = "CardContainer";
