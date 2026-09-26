"use client";

import { useState } from "react";
import TicTacToeGame from "./game";
import { CellSymbol } from "@/hooks/games/tic-tac-toe/use-utils";
import Menu from "@/components/custom/menu";

type Config = {
  playerSymbol: NonNullable<CellSymbol>;
  oppSymbol: NonNullable<CellSymbol>;
};

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    playerSymbol: "x",
    oppSymbol: "o",
  });

  return (
    <div>
      {startGame ? (
        <TicTacToeGame {...config} />
      ) : (
        <Menu
          gameName="Tic tac toe"
          description="Align three symbols horizontally, vertically or diagonally before opponent to win."
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[
            {
              label: "Player 1",
              items: [
                { value: "x", text: "X" },
                { value: "o", text: "O" },
              ],
              onValueChange: (value) => {
                setConfig((prev) => ({
                  ...prev,
                  playerColor: value as NonNullable<CellSymbol>,
                }));
              },
            },
            {
              label: "Player 2",
              items: [
                { value: "o", text: "O" },
                { value: "x", text: "X" },
              ],
              onValueChange: (value) => {
                setConfig((prev) => ({
                  ...prev,
                  oppColor: value as NonNullable<CellSymbol>,
                }));
              },
            },
          ]}
          switches={[]}
          inputs={[]}
        />
      )}
    </div>
  );
}
