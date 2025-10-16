"use client";

import { CardRank, Card } from "@/lib/utils";
import { useMemo } from "react";

export function usePackGenerator() {
  const pack = useMemo(() => {
    const ranks: CardRank[] = Array.from({ length: 10 }, (_, k) => ({
      name: k === 0 ? "ace" : `${k + 1}`,
      value: k + 1,
    })).concat(
      { name: "jack", value: 11 },
      { name: "queen", value: 12 },
      { name: "king", value: 13 }
    );

    const symbols = ["heart", "spade", "diamond", "club"] as const;
    const colors = ["black", "red"] as const;

    const pack: Card[] = [];

    for (const rank of ranks) {
      for (const symbol of symbols) {
        for (const color of colors) {
          if (
            ((symbol === "club" || symbol === "spade") && color === "red") ||
            ((symbol === "heart" || symbol === "diamond") && color === "black")
          ) {
            continue;
          }
          const card = {
            id: `card-${rank.name}-${symbol}-${color}`,
            rank,
            symbol,
            color,
            isHidden: true,
          } satisfies Card;

          pack.push(card);
        }
      }
    }

    return pack;
  }, []);

  return pack;
}
