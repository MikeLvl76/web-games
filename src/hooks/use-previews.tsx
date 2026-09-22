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
    estimatedPlaytime: "medium",
    filepath: getFilepath("checkers"),
    id: "checkers-game",
  },
  {
    name: "Maze",
    url: "maze",
    type: "solo",
    estimatedPlaytime: "long",
    filepath: getFilepath("maze"),
    id: "maze-game",
  },
  {
    name: "Snake",
    url: "snake",
    type: "solo",
    estimatedPlaytime: "unlimited",
    filepath: getFilepath("snake"),
    id: "snake-game",
  },
  {
    name: "Klondike",
    url: "klondike",
    type: "puzzle",
    estimatedPlaytime: "short",
    filepath: getFilepath("klondike"),
    id: "klondike-game",
  },
  {
    name: "Sudoku",
    url: "sudoku",
    type: "puzzle",
    estimatedPlaytime: "medium",
    filepath: getFilepath("sudoku"),
    id: "sudoku-game",
  },
  {
    name: "Tic-tac-toe",
    url: "tic-tac-toe",
    type: "versus",
    estimatedPlaytime: "short",
    filepath: getFilepath("tic-tac-toe"),
    id: "tic-tac-toe-game",
  },
  {
    name: "Word-search",
    url: "word-search",
    type: "puzzle",
    estimatedPlaytime: "short",
    filepath: getFilepath("word-search"),
    id: "word-search-game",
  },
  {
    name: "Four in a Row",
    url: "four-in-a-row",
    type: "versus",
    estimatedPlaytime: "short",
    filepath: getFilepath("four-in-a-row"),
    id: "four-in-a-row-game",
  },
  {
    name: "Rock, Paper, Scissors",
    url: "rock-paper-scissors",
    type: "versus",
    estimatedPlaytime: "short",
    filepath: getFilepath("rock-paper-scissors"),
    id: "rock-paper-scissors-game",
  },
  /* 
  * non-implemented games
  {
    name: "Dino Run",
    url: "dino-run",
    type: "solo",
    estimatedPlaytime: "1 min or unlimited",
    filepath: getFilepath("dino-run"),
    id: "dino-run-game",
  },
  {
    name: "Flying Bird",
    url: "flying-bird",
    type: "solo",
    estimatedPlaytime: "1 min or unlimited",
    filepath: getFilepath("flying-bird"),
    id: "flying-bird-game",
  },
  {
    name: "Guess the word",
    url: "word-guess",
    type: "solo",
    estimatedPlaytime: "1-2 min",
    filepath: getFilepath("word-guess"),
    id: "word-guess-game",
  },
  {
    name: "Poker",
    url: "poker",
    type: "versus",
    estimatedPlaytime: "10-30 min",
    filepath: getFilepath("poker"),
    id: "poker-game",
  },
  {
    name: "Shape Dash",
    url: "shape-dash",
    type: "solo",
    estimatedPlaytime: "1-2 min",
    filepath: getFilepath("shape-dash"),
    id: "shape-dash-game",
  },
  {
    name: "Chess",
    url: "chess",
    type: "versus",
    estimatedPlaytime: "10-20 min",
    filepath: getFilepath("chess"),
    id: "chess-game",
  },
  {
    name: "Click fast",
    url: "click-fast",
    type: "solo",
    estimatedPlaytime: "1-2 min",
    filepath: getFilepath("click-fast"),
    id: "click-fast-game",
  },
  {
    name: "Don't touch",
    url: "do-not-touch",
    type: "solo",
    estimatedPlaytime: "1-2 min",
    filepath: getFilepath("do-not-touch"),
    id: "do-not-touch-game",
  },
  */
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
            : b.name.localeCompare(a.name),
        ),
      );
    }

    return previews;
  }, [filter, sort]);

  return previews;
}
