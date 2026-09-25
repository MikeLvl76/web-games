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
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[]}
          switches={[
            {
              label: "Enable time",
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
              label: "Select size",
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
