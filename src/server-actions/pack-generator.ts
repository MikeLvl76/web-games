type CardSymbol = "heart" | "spade" | "diamond" | "club";
type CardColor = "black" | "red";
type CardRank = {
  name: string;
  value: number;
};

type Card = {
  rank: CardRank;
  symbol: CardSymbol;
  color: CardColor;
  isHidden: boolean;
};

export const SYMBOL_COLOR = {
  club: "black",
  spade: "black",
  heart: "red",
  diamond: "red",
};

export const generatePack = async () => {
  const ranks: CardRank[] = Array.from({ length: 10 }, (_, k) => ({
    name: k === 0 ? "ace" : `${k + 1}`,
    value: k + 1,
  })).concat(
    { name: "king", value: 11 },
    { name: "queen", value: 12 },
    { name: "jack", value: 13 }
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
};

export type { Card, CardColor, CardSymbol };
