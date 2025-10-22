"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import CheckersGame from "./game";

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    playerColor: "black",
    oppColor: "white",
    enableTime: true,
    allowMultJumps: true,
  });

  return (
    <div>
      {startGame ? (
        <CheckersGame {...config} />
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
