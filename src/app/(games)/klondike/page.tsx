"use client";

import { useState } from "react";
import KlondikeGame from "./game";
import Menu from "@/components/custom/menu";

type Config = {
  enableTime: boolean;
};

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
          gameName="Klondike"
          description="Complete four suites of cards from ace to king to win."
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[]}
          switches={[
            {
              label: "Time",
              bool: config.enableTime,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enableTime: !prev.enableTime,
                })),
            },
          ]}
          inputs={[]}
        />
      )}
    </div>
  );
}
