import { Card, CardSymbol } from "@/server-actions/pack-generator";

export type DndDefaultDataType = {
  type: string;
  accepts?: string[];
  supports?: string[];
};

export type DraggableDataType = DndDefaultDataType & {
  card: Card;
  cardIndex: number;
  pileIndex: number;
};

export type DroppableDataType = DndDefaultDataType & {
  symbol?: CardSymbol;
  pileIndex?: number;
};
