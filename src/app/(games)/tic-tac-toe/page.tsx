"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import TicTacToeGame from "./game";

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
          onStart={(_config) => {
            setStartGame(true);
            setConfig(_config);
          }}
        />
      )}
    </div>
  );
}
