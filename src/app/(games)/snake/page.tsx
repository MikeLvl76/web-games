"use client";

import { useState } from "react";
import SnakeGame from "./game";
import Menu from "@/components/custom/menu";

type Config = {
  enableTime: boolean;
  size: number;
};

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
          gameName="Snake"
          description="Make the snake grow by eating food and avoid colliding with borders."
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
          inputs={[
            {
              label: "Size",
              type: "number",
              interval: { min: 3, max: 60, step: 3 },
              onChange: (value: string | number) =>
                setConfig((prev) => ({
                  ...prev,
                  size: Number(value),
                })),
            },
          ]}
        />
      )}
    </div>
  );
}
