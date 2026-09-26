"use client";

import { useState } from "react";
import SudokuGame from "./game";
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
        <SudokuGame {...config} />
      ) : (
        <Menu
          gameName="Sudoku"
          description="Fill the grid with correct numbers."
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
