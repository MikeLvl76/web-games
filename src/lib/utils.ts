import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Preview = {
  id: string;
  name: string;
  url: string;
  filepath: string;
  type: "puzzle" | "versus" | "solo";
  estimatedPlaytime: string;
  isGameAvailable: boolean;
};

export const getFilepath = (filename: string) => {
  return `/images/${filename}.png`;
};

export type CardSymbol = "heart" | "spade" | "diamond" | "club";
export type CardColor = "black" | "red";
export type CardRank = {
  name: string;
  value: number;
};
export type Card = {
  id: string;
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

export const compareCards = (c1: Card, c2: Card, includeSequence?: boolean) =>
  (includeSequence &&
    c2.rank.value - c1.rank.value === 1 &&
    c1.symbol === c2.symbol &&
    c1.color === c2.color) ||
  (c1.rank.value - c2.rank.value === 1 &&
    c1.symbol !== c2.symbol &&
    c1.color !== c2.color);

export type DndDefaultDataType = {
  type: string;
  accepts?: string[];
  supports?: string[];
};

export type DraggableDataType = DndDefaultDataType & {
  card: Card;
  cardIndex: number;
  pileIndex: number;
  sub: Card[];
};

export type DroppableDataType = DndDefaultDataType & {
  symbol?: CardSymbol;
  pileIndex?: number;
};

export type StorageData = {
  favoriteGames: string[];
};

export const createDefaultData: () => StorageData = () => ({
  favoriteGames: [],
});

export const getStorageData: () => StorageData | null = () => {
  const data = localStorage.getItem("user");
  return data ? (JSON.parse(data) as StorageData) : null;
};

export const setStorageData = (data: StorageData) =>
  localStorage.setItem("user", JSON.stringify(data));

export const clearStorageData = () => localStorage.clear();

type TimeOptions = {
  includeHour?: boolean;
  includeDay?: boolean;
};

export const stringifyTime = (time: number, options?: TimeOptions) => {
  const timeUnits = [];

  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  timeUnits.push(seconds, minutes);

  if (options) {
    const { includeHour, includeDay } = options;

    if (includeHour) {
      const hours = Math.floor((time % (3600 * 24)) / 3600);
      timeUnits.push(hours);
    }

    if (includeDay) {
      const days = Math.floor(time / (3600 * 24));
      timeUnits.push(days);
    }
  }

  return timeUnits
    .map((unit) => unit.toString().padStart(2, "0"))
    .reverse()
    .join(":");
};
