import { Card } from "@/server-actions/pack-generator";

export const compareCards = (c1: Card, c2: Card, includeSequence?: boolean) =>
  includeSequence
    ? c1.rank.value < c2.rank.value &&
      c1.symbol === c2.symbol &&
      c1.color === c2.color
    : c1.rank.value > c2.rank.value &&
      c1.symbol !== c2.symbol &&
      c1.color !== c2.color;
