type CardSymbol = "heart" | "spade" | "diamond" | "club";
type CardColor = "black" | "red";

type Card = {
  value: string;
  symbol: CardSymbol;
  color: CardColor;
};

export const generatePack = async () => {
  const suite = Array.from({ length: 10 }, (_, k) =>
    k === 0 ? "ace" : `${k + 1}`
  ).concat("king", "queen", "jack");
  const symbols = ["heart", "spade", "diamond", "club"] as const;
  const colors = ["black", "red"] as const;

  const pack: Card[] = [];

  for (const value of suite) {
    for (const symbol of symbols) {
      for (const color of colors) {
        if (
          ((symbol === "club" || symbol === "spade") && color === "red") ||
          ((symbol === "heart" || symbol === "diamond") && color === "black")
        ) {
          continue;
        }
        const card = {
          value,
          symbol,
          color,
        } satisfies Card;

        pack.push(card);
      }
    }
  }

  return pack;
};

export type { Card, CardColor, CardSymbol };
