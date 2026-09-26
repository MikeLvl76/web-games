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
          gameName="Maze"
          description="Find the exit to win."
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[]}
          inputs={[
            {
              label: "Size",
              inputProps: {
                type: "number",
                min: 30,
                max: 50,
                defaultValue: 30,
                value: config.size,
                step: 1,
                onChange: (event) => {
                  const value = Number(event.target.value);
                  if (value < 30 || value > 50) return;

                  setConfig((prev) => ({
                    ...prev,
                    size: value,
                  }));
                },
                className: "w-20 h-8 text-slate-800 outline-none focus:outline-none"
              },
            },
            {
              label: "Countdown",
              inputProps: {
                type: "checkbox",
                checked: config.enableCountdown,
                onChange: () =>
                  setConfig((prev) => ({
                    ...prev,
                    enableCountdown: !prev.enableCountdown,
                  })),
                className: "w-4 h-4 hover:cursor-pointer",
              },
            },
            {
              label: "Path",
              inputProps: {
                type: "checkbox",
                checked: config.enablePath,
                onChange: () =>
                  setConfig((prev) => ({
                    ...prev,
                    enablePath: !prev.enablePath,
                  })),
                className: "w-4 h-4 hover:cursor-pointer",
              },
            },
            {
              label: "Reset",
              inputProps: {
                type: "checkbox",
                checked: config.enableReset,
                onChange: () =>
                  setConfig((prev) => ({
                    ...prev,
                    enableReset: !prev.enableReset,
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
