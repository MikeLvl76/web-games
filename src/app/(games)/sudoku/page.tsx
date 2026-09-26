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
          inputs={[]}
        />
      )}
    </div>
  );
}
