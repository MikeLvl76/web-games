"use client";

import { useState } from "react";
import Menu, { Config } from "./menu";
import KlondikeGame from "./game";

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    enableTime: true,
  });

  return (
    <div>
      {startGame ? (
        <KlondikeGame {...config} />
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
