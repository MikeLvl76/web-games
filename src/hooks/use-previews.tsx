"use client";

import { getFilepath, Preview } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  sort?: "asc" | "desc";
  filter?: (value: Preview, index: number, array: Preview[]) => boolean;
};

const DEFAULT_PREVIEWS: Preview[] = [
  {
    name: "Checkers",
    url: "checkers",
    type: "versus",
    estimatedPlaytime: "5-15 min",
    filepath: getFilepath("checkers"),
    id: "checkers-game",
  },
  {
    name: "Maze",
    url: "maze",
    type: "solo",
    estimatedPlaytime: "4-6 min",
    filepath: getFilepath("maze"),
    id: "maze-game",
  },
  {
    name: "Snake",
    url: "snake",
    type: "solo",
    estimatedPlaytime: "1 min or unlimited",
    filepath: getFilepath("snake"),
    id: "snake-game",
  },
  {
    name: "Klondike",
    url: "klondike",
    type: "puzzle",
    estimatedPlaytime: "2-10 min",
    filepath: getFilepath("klondike"),
    id: "klondike-game",
  },
  {
    name: "Sudoku",
    url: "sudoku",
    type: "puzzle",
    estimatedPlaytime: "10 min",
    filepath: getFilepath("sudoku"),
    id: "sudoku-game",
  },
  {
    name: "Tic-tac-toe",
    url: "tic-tac-toe",
    type: "versus",
    estimatedPlaytime: "1 min",
    filepath: getFilepath("tic-tac-toe"),
    id: "tic-tac-toe-game",
  },
  {
    name: "Word-search",
    url: "word-search",
    type: "puzzle",
    estimatedPlaytime: "1-3 min",
    filepath: getFilepath("word-search"),
    id: "word-search-game",
  },
  {
    name: "Four in a Row",
    url: "four-in-a-row",
    type: "versus",
    estimatedPlaytime: "1-3 min",
    filepath: getFilepath("four-in-a-row"),
    id: "four-in-a-row-game",
  },
  {
    name: "Rock, Paper, Scissors",
    url: "rock-paper-scissors",
    type: "versus",
    estimatedPlaytime: "30 sec",
    filepath: getFilepath("rock-paper-scissors"),
    id: "rock-paper-scissors-game",
  },
];

export function usePreviews({ sort, filter }: Props = {}) {
  const previews = useMemo(() => {
    const previews = [...DEFAULT_PREVIEWS];

    if (filter) {
      previews.splice(0, previews.length, ...previews.filter(filter));
    }

    if (sort) {
      previews.splice(
        0,
        previews.length,
        ...previews.sort((a, b) =>
          sort === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        )
      );
    }

    return previews;
  }, [filter, sort]);

  return previews;
}
