"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import FourInARowGame from "./game";

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    playerColor: "red",
    oppColor: "yellow",
    enableTime: true,
  });

  return (
    <div>
      {startGame ? (
        <FourInARowGame {...config} />
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
