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
          inputs={[
            {
              label: "Size",
              inputProps: {
                type: "number",
                min: 3,
                max: 60,
                defaultValue: 3,
                value: config.size,
                step: 3,
                onChange: (event) => {
                  const value = Number(event.target.value);
                  if (value < 3 || value > 60) return;

                  setConfig((prev) => ({
                    ...prev,
                    size: Number(event.target.value),
                  }));
                },
                className:
                  "w-20 h-8 text-slate-800 outline-none focus:outline-none",
              },
            },
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
