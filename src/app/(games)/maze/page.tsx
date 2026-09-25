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
              label: "Enable countdown",
              bool: config.enableCountdown,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enableCountdown: !prev.enableCountdown,
                })),
            },
            {
              label: "Enable path",
              bool: config.enablePath,
              onChange: () =>
                setConfig((prev) => ({
                  ...prev,
                  enablePath: !prev.enablePath,
                })),
            },
            {
              label: "Enable reset",
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
              label: "Select size",
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
