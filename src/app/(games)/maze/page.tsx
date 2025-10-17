"use client";

import P5Sketch from "@/components/generic/p5-sketch";
import { stringifyTime } from "@/lib/utils";
import { Maze } from "@/lib/p5/maze/maze";
import { Player } from "@/lib/p5/maze/player";
import { CornerDownLeft, RotateCcw } from "lucide-react";
import p5 from "p5";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { GameStatus } from "@/components/generic/game-status";
import { Button } from "@/components/ui/button";

type Options = {
  size: number;
  enablePlayerPath: boolean;
  enableReset: boolean;
  enableCountdown: boolean;
};

export default function MazePage() {
  const [options, setOptions] = useState<Options>({
    size: 40,
    enableCountdown: true,
    enablePlayerPath: true,
    enableReset: true,
  });
  const [startGame, setStartGame] = useState(false);
  const [countdown, setCountdown] = useState<{ value: number; text: string }>({
    value: 60 * Math.floor(options.size / 10),
    text: stringifyTime(60 * Math.floor(options.size / 10)),
  });
  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);
  const timeRef = useRef(countdown);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    timeRef.current = countdown;
  }, [countdown]);

  useEffect(() => {
    if (!options.enableCountdown || gameOver) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        const time = Math.max(prev.value - 1, 0);
        return {
          value: time,
          text: stringifyTime(time),
        };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [gameOver, options.enableCountdown, options.size]);

  useEffect(() => {
    if (countdown.value === 0) {
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      gameOverRef.current = true;
      setGameOver(true);
    }
  }, [countdown.value]);

  const sketch = useCallback(
    (p: p5) => {
      let maze: Maze;
      let player: Player;
      const defaultCountdown = timeRef.current.value;

      p.setup = () => {
        const div = document.getElementById("p5-container");
        p.createCanvas(
          (div?.offsetWidth ?? p.windowWidth) * 0.9,
          (div?.offsetHeight ?? p.windowHeight) * 1.15
        );
        p.frameRate(10);
        p.background(0);
        maze = new Maze(p, Math.pow(options.size, 2));
        player = new Player(p, maze);
      };

      p.draw = () => {
        p.background(0);

        if (maze && player) {
          maze.draw();
          player.move();
          player.draw();
        }

        if (player.exitFound) {
          p.noLoop();
          gameOverRef.current = true;
          p.noStroke();
          p.background(0);
          p.textAlign(p.CENTER);
          p.fill(0, 255, 0);
          p.textSize(64);
          p.text("Game over", p.width * 0.5, p.height * 0.5);

          p.fill(255);
          p.textSize(32);
          p.text(
            `You found the exit in ${stringifyTime(
              defaultCountdown - timeRef.current.value
            )} by moving ${player.movesCount} times!`,
            p.width * 0.5,
            p.height * 0.7
          );
        } else if (gameOverRef.current) {
          p.noLoop();
          p.noStroke();
          p.background(0);
          p.textAlign(p.CENTER);
          p.fill(255, 0, 0);
          p.textSize(64);
          p.text("Game over", p.width * 0.5, p.height * 0.5);

          p.fill(255);
          p.textSize(32);
          p.text("Time has run out!", p.width * 0.5, p.height * 0.7);
        }
      };

      p.keyPressed = () => {
        if (!player) return;

        if (p.key === "h" && options.enablePlayerPath) {
          player.showVisitedCells = !player.showVisitedCells;
        }

        if (p.key === "r" && options.enableReset) {
          player.reset();
        }
      };
    },
    [options.enablePlayerPath, options.enableReset, options.size]
  );

  const OptionsMenu = memo(
    ({ enableCountdown, enablePlayerPath, enableReset, size }: Options) => (
      <div className="flex flex-col items-center gap-4 w-[40vw] h-[40vh] rounded-md p-2 select-none">
        <div className="flex flex-row justify-between items-center w-1/4">
          <label>Enable countdown</label>
          <input
            type="checkbox"
            checked={enableCountdown}
            onChange={() =>
              setOptions((prev) => ({
                ...prev,
                enableCountdown: !prev.enableCountdown,
              }))
            }
            className="hover:cursor-pointer"
          />
        </div>
        <div className="flex flex-row justify-between items-center w-1/4">
          <label>Enable player path</label>
          <input
            type="checkbox"
            checked={enablePlayerPath}
            onChange={() =>
              setOptions((prev) => ({
                ...prev,
                enablePlayerPath: !prev.enablePlayerPath,
              }))
            }
            className="hover:cursor-pointer"
          />
        </div>
        <div className="flex flex-row justify-between items-center w-1/4">
          <label>Enable reset</label>
          <input
            type="checkbox"
            checked={enableReset}
            onChange={() =>
              setOptions((prev) => ({
                ...prev,
                enableReset: !prev.enableReset,
              }))
            }
            className="hover:cursor-pointer"
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-2 w-1/4">
          <label className="place-self-start">
            Size ({size}x{size})
          </label>
          <div className="flex flex-row justify-center items-center ml-4 w-full gap-2">
            <label>30</label>
            <input
              type="range"
              value={size}
              min={30}
              step={1}
              max={50}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  size: Number(e.target.value),
                }))
              }
              className="hover:cursor-grab"
            />
            <label>50</label>
          </div>
        </div>
        <div className="flex justify-center mt-4 w-full">
          <button
            onClick={() => {
              setStartGame(true);
              gameOverRef.current = false;
            }}
            className="w-fit h-fit p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer"
          >
            Start game
          </button>
        </div>
      </div>
    )
  );
  OptionsMenu.displayName = "OptionsMenu";

  return startGame ? (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <P5Sketch sketch={sketch} refresh={refresh} />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Find exit"
          infos={[
            { label: "Move", value: "ZQSD / Arrow keys" },
            {
              label: "Show path",
              value: options.enablePlayerPath ? "H" : "Disabled",
            },
            {
              label: "Reset position",
              value: options.enableReset ? "R" : "Disabled",
            },
            {
              label: "Countdown",
              value: options.enableCountdown ? countdown.text : "Disabled",
            },
          ]}
          options={[
            <Button
              key="menu-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-green-700 rounded-md hover:cursor-pointer"
              onClick={() => {
                setStartGame(false);
                gameOverRef.current = false;
                setGameOver(false);
                setCountdown({
                  value: 60 * Math.floor(options.size / 10),
                  text: stringifyTime(60 * Math.floor(options.size / 10)),
                });
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setCountdown((prev) => {
                    const time = Math.max(prev.value - 1, 0);
                    return {
                      value: time,
                      text: stringifyTime(time),
                    };
                  });
                }, 1000);
              }}
            >
              <p className="text-white font-bold text-md text-center">Menu</p>
              <CornerDownLeft color="white" size={32} />
            </Button>,
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setRefresh((prev) => prev + 1);
                gameOverRef.current = false;
                setGameOver(false);
                setCountdown({
                  value: 60 * Math.floor(options.size / 10),
                  text: stringifyTime(60 * Math.floor(options.size / 10)),
                });
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(() => {
                  setCountdown((prev) => {
                    const time = Math.max(prev.value - 1, 0);
                    return {
                      value: time,
                      text: stringifyTime(time),
                    };
                  });
                }, 1000);
              }}
            >
              <p className="text-white font-bold text-md text-center">
                Restart
              </p>
              <RotateCcw color="white" size={32} />
            </Button>,
          ]}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-1 justify-center items-center h-full">
      <OptionsMenu {...options} />
    </div>
  );
}
