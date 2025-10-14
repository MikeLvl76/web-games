"use server";

export type Preview = {
  id: string;
  name: string;
  url: string;
  filepath: string;
  type: "puzzle" | "versus" | "solo";
  estimatedPlaytime: string;
};

export const getGamesPreview = async () => {
  const getFilepath = (filename: string) => {
    return `/images/${filename}.png`;
  };

  const PREVIEWS: Preview[] = [
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
      name: "Match 3",
      url: "match-3",
      id: "match-3-game",
      filepath: getFilepath("match-3"),
      type: "solo",
      estimatedPlaytime: "5 min",
    },
  ];

  return PREVIEWS;
};
