"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import WordSearchGame from "./game";

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    enableCountdown: true,
    gridSize: 36,
    wordLength: 3,
    listSize: 8,
  });

  return (
    <div>
      {startGame ? (
        <WordSearchGame {...config} />
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
