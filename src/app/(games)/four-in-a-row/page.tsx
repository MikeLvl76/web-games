"use client";

import { useState } from "react";
import FourInARowGame from "./game";
import { Token } from "@/hooks/games/four-in-a-row/use-utils";
import Menu from "@/components/custom/menu";

type Config = {
  playerColor: NonNullable<Token>;
  oppColor: NonNullable<Token>;
  enableTime: boolean;
};

export default function Page() {
  const [startGame, setStartGame] = useState(false);
  const [config, setConfig] = useState<Config>({
    playerColor: "red",
    oppColor: "yellow",
    enableTime: true,
  });

  return (
    <div>
      {startGame ? (
        <FourInARowGame {...config} />
      ) : (
        <Menu
          onStart={() => {
            setStartGame(true);
          }}
          selectors={[
            {
              items: [
                { value: "red", text: "Red" },
                { value: "yellow", text: "Yellow" },
              ],
              onValueChange: (value) => {
                setConfig((prev) => ({
                  ...prev,
                  playerColor: value as NonNullable<Token>,
                }));
              },
            },
            {
              items: [
                { value: "yellow", text: "Yellow" },
                { value: "red", text: "Red" },
              ],
              onValueChange: (value) => {
                setConfig((prev) => ({
                  ...prev,
                  oppColor: value as NonNullable<Token>,
                }));
              },
            },
          ]}
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
          inputs={[]}
        />
      )}
    </div>
  );
}
