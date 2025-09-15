import { Card } from "@/server-actions/pack-generator";

export const compareCards = (c1: Card, c2: Card) => {
  if (
    c1.rank.value === c2.rank.value ||
    c1.symbol === c2.symbol ||
    c1.color === c2.color
  )
    return false;

  if (c1.rank.value < c2.rank.value) {
    return false;
  }

  return true;
};
