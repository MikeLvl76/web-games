"use client";

import P5Sketch from "@/components/custom/p5-sketch";
import { stringifyTime } from "@/lib/utils";
import { Maze } from "@/lib/p5/maze/maze";
import { Player } from "@/lib/p5/maze/player";
import { RotateCcw } from "lucide-react";
import p5 from "p5";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameStatus } from "@/components/custom/game-status";
import { Button } from "@/components/ui/button";

type Props = {
  enableCountdown: boolean;
  enablePath: boolean;
  enableReset: boolean;
  size: number;
};

export default function MazeGame({
  enableCountdown,
  enablePath,
  enableReset,
  size,
}: Props) {
  const [countdown, setCountdown] = useState<{ value: number; text: string }>({
    value: 60 * Math.floor(size / 10),
    text: stringifyTime(60 * Math.floor(size / 10)),
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
    if (!enableCountdown || gameOver) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

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
  }, [gameOver, enableCountdown, size]);

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
        p.frameRate(60);
        p.background(0);
        maze = new Maze(p, Math.pow(size, 2));
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

        if (p.key === "h" && enablePath) {
          player.showVisitedCells = !player.showVisitedCells;
        }

        if (p.key === "r" && enableReset) {
          player.reset();
        }
      };
    },
    [enablePath, enableReset, size]
  );

  return (
    <div className="flex flex-row justify-center gap-8 p-2">
      <div className="flex w-[80%] justify-end">
        <P5Sketch sketch={sketch} refresh={refresh} />
      </div>
      <div className="flex w-[20%]">
        <GameStatus
          title="Maze"
          description="Find exit"
          controls={[
            { label: "Move", value: "ZQSD / Arrow keys" },
            {
              label: "Show path",
              value: enablePath ? "H" : "Disabled",
            },
            {
              label: "Reset position",
              value: enableReset ? "R" : "Disabled",
            },
          ]}
          infos={[
            {
              label: "Countdown",
              value: enableCountdown ? countdown.text : "Disabled",
            },
          ]}
          options={[
            // <Button
            //   key="menu-button"
            //   variant="default"
            //   className="flex w-fit h-fit p-2 bg-green-700 rounded-md hover:cursor-pointer"
            //   onClick={() => {
            //     gameOverRef.current = false;
            //     setGameOver(false);
            //     setCountdown({
            //       value: 60 * Math.floor(size / 10),
            //       text: stringifyTime(60 * Math.floor(size / 10)),
            //     });
            //     clearInterval(intervalRef.current!);
            //     intervalRef.current = setInterval(() => {
            //       setCountdown((prev) => {
            //         const time = Math.max(prev.value - 1, 0);
            //         return {
            //           value: time,
            //           text: stringifyTime(time),
            //         };
            //       });
            //     }, 1000);
            //   }}
            // >
            //   <p className="text-white font-bold text-md text-center">Menu</p>
            //   <CornerDownLeft color="white" size={32} />
            // </Button>,
            <Button
              key="restart-button"
              variant="default"
              className="flex w-fit h-fit p-2 bg-blue-400 rounded-md hover:cursor-pointer"
              onClick={() => {
                setRefresh((prev) => prev + 1);
                gameOverRef.current = false;
                setGameOver(false);
                setCountdown({
                  value: 60 * Math.floor(size / 10),
                  text: stringifyTime(60 * Math.floor(size / 10)),
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
  );
}
