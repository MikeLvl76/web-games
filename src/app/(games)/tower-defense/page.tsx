"use client";

import { useState } from "react";
import TowerDefenseGame from "./game";
import GameMenu from "@/components/custom/menu";

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
        <TowerDefenseGame {...config} />
      ) : (
        <GameMenu
          gameName="Tower defense"
          description="Prevent enemies from reaching your tower."
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[]}
          inputs={[
            {
              label: "Time",
              inputProps: {
                type: "checkbox",
                checked: config.enableTime,
                onChange: () =>
                  setConfig((prev) => ({
                    ...prev,
                    enableTime: !prev.enableTime,
                  })),
                className: "w-4 h-4 hover:cursor-pointer",
              },
            },
          ]}
        />
      )}
    </div>
  );
}
