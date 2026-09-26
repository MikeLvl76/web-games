"use client";

import { useEffect, useState } from "react";
import WordSearchGame from "./game";
import Menu from "@/components/custom/menu";

type Config = {
  enableCountdown: boolean;
  gridSize: number;
  wordLength: number;
  listSize: number;
};

const GRID_DENSITY = 2;
const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 20;

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    enableCountdown: true,
    gridSize: 36,
    wordLength: 3,
    listSize: 8,
  });

  useEffect(() => {
    const size = Math.min(
      Math.max(
        Math.ceil(
          Math.sqrt(config.wordLength * config.listSize * GRID_DENSITY),
        ),
        MIN_GRID_SIZE,
      ),
      MAX_GRID_SIZE,
    );

    setConfig((prev) => ({ ...prev, gridSize: size }));
  }, [config.wordLength, config.listSize]);

  return (
    <div>
      {startGame ? (
        <WordSearchGame {...config} />
      ) : (
        <Menu
          gameName="Word search"
          description="Find all words in the grid."
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[]}
          inputs={[
            {
              label: "Word length",
              inputProps: {
                type: "number",
                min: 3,
                max: 18,
                defaultValue: 3,
                step: 1,
                onChange: (event) => {
                  const value = Number(event.target.value);
                  if (value < 3 || value > 18) return;

                  setConfig((prev) => ({
                    ...prev,
                    wordLength: Number(event.target.value),
                  }));
                },
                className:
                  "w-20 h-8 text-slate-800 outline-none focus:outline-none",
              },
            },
            {
              label: "List size",
              inputProps: {
                type: "number",
                min: 5,
                max: 25,
                defaultValue: 5,
                step: 1,
                onChange: (event) => {
                  const value = Number(event.target.value);
                  if (value < 5 || value > 25) return;

                  setConfig((prev) => ({
                    ...prev,
                    listSize: Number(event.target.value),
                  }));
                },
                className:
                  "w-20 h-8 text-slate-800 outline-none focus:outline-none",
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
          ]}
        />
      )}
    </div>
  );
}
