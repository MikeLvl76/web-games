"use client";

import { CardRank, Card } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export function usePackGenerator() {
  const [pack, setPack] = useState<Card[]>([]);

  const generatePack = useCallback(() => {
    const symbols = ["heart", "spade", "diamond", "club"] as const;
    const colors = ["red", "black"] as const;

    const ranks: CardRank[] = [
      { name: "ace", value: 1 },
      ...Array.from({ length: 9 }, (_, i) => ({
        name: `${i + 2}`,
        value: i + 2,
      })),
      { name: "jack", value: 11 },
      { name: "queen", value: 12 },
      { name: "king", value: 13 },
    ];

    const isValidPair = (symbol: string, color: string) =>
      (["club", "spade"].includes(symbol) && color === "black") ||
      (["heart", "diamond"].includes(symbol) && color === "red");

    setPack(
      ranks.flatMap((rank) =>
        symbols.flatMap((symbol) =>
          colors
            .filter((color) => isValidPair(symbol, color))
            .map(
              (color) =>
                ({
                  id: `card-${rank.name}-${symbol}-${color}`,
                  rank,
                  symbol,
                  color,
                  isHidden: true,
                } satisfies Card)
            )
        )
      )
    );
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => generatePack(), []);

  return { pack, generatePack };
}
