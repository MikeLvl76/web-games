"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import SnakeGame from "./game";

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    enableTime: true,
    size: 30,
  });

  return (
    <div>
      {startGame ? (
        <SnakeGame {...config} />
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
