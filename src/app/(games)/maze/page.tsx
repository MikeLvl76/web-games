"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import MazeGame from "./game";

export default function Maze() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    enableCountdown: true,
    enablePath: true,
    enableReset: true,
    size: 40,
  });

  return (
    <div>
      {startGame ? (
        <MazeGame {...config} />
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
