"use client";

import { useState } from "react";
import MazeGame from "./game";
import Menu from "@/components/custom/menu";

type Config = {
  enableCountdown: boolean;
  enablePath: boolean;
  enableReset: boolean;
  size: number;
};

export default function Page() {
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
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[]}
          switches={[
            {
              label: "Countdown",
              bool: config.enableCountdown,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enableCountdown: !prev.enableCountdown,
                })),
            },
            {
              label: "Path",
              bool: config.enablePath,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enablePath: !prev.enablePath,
                })),
            },
            {
              label: "Reset",
              bool: config.enableReset,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enableReset: !prev.enableReset,
                })),
            },
          ]}
          inputs={[
            {
              label: "Size",
              type: "number",
              interval: { min: 30, max: 50, step: 1 },
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
