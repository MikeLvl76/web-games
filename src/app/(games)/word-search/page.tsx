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
          ]}
          inputs={[
            {
              label: "Select word length",
              type: "number",
              interval: { min: 3, max: 18, step: 1 },
              onChange: (value: string | number) =>
                setConfig((prev) => ({
                  ...prev,
                  wordLength: Number(value),
                })),
            },
            {
              label: "Select list size",
              type: "number",
              interval: { min: 5, max: 25, step: 1 },
              onChange: (value: string | number) =>
                setConfig((prev) => ({
                  ...prev,
                  listSize: Number(value),
                })),
            },
          ]}
        />
      )}
    </div>
  );
}
