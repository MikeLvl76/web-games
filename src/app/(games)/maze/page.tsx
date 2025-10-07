"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { stringifyTime } from "@/utils/misc/time-string";
import { Maze } from "@/utils/p5/maze/maze";
import { Player } from "@/utils/p5/maze/player";
import p5 from "p5";
import { memo, useCallback, useEffect, useState } from "react";

type Options = {
  size: number;
  enablePlayerPath: boolean;
  enableReset: boolean;
  enableCountdown: boolean;
};

export default function MazePage() {
  const [options, setOptions] = useState<Options>({
    size: 30,
    enableCountdown: false,
    enablePlayerPath: true,
    enableReset: true,
  });
  const [startGame, setStartGame] = useState(false);
  const [countdown, setCountdown] = useState<{ value: number; text: string }>({
    value: 0,
    text: "00:00",
  });

  useEffect(() => {
    if (!options.enableCountdown) return;

    let time = 60 * Math.floor(options.size / 4);

    const interval = setInterval(() => {
      time--;

      setCountdown({
        value: time,
        text: stringifyTime(time),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [options.enableCountdown, options.size]);

  const sketch = useCallback(
    (p: p5) => {
      let maze: Maze;
      let player: Player;
      const defaultCountdown = countdown.value;

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
          p.background(0);
          p.textAlign(p.CENTER);
          p.fill(0, 255, 0);
          p.textSize(64);
          p.text("Game over", p.width * 0.5, p.height * 0.5);

          p.fill(255);
          p.textSize(32);
          p.text(
            `You found the exit in ${stringifyTime(
              defaultCountdown - countdown.value
            )} by moving ${player.movesCount} times!`,
            p.width * 0.5,
            p.height * 0.7
          );
        }

        if (countdown.value === 0) {
          p.noLoop();
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
    [countdown, options.enablePlayerPath, options.enableReset, options.size]
  );

  const OptionsMenu = memo(
    ({ enableCountdown, enablePlayerPath, enableReset, size }: Options) => (
      <div className="flex flex-col items-center gap-4 w-[40vw] h-[40vh] rounded-md p-2">
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
            <label>20</label>
            <input
              type="range"
              value={size}
              min={20}
              step={1}
              max={40}
              onChange={(e) => {
                e.preventDefault();
                setOptions((prev) => ({
                  ...prev,
                  size: parseInt(e.target.value),
                }));
              }}
              className="hover:cursor-grab"
            />
            <label>40</label>
          </div>
        </div>
        <div className="flex justify-center mt-4 w-full">
          <button
            onClick={() => setStartGame(true)}
            className="w-fit h-fit p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer"
          >
            Start game
          </button>
        </div>
      </div>
    )
  );
  OptionsMenu.displayName = "OptionsMenu";

  return (
    <div className="flex flex-row gap-2">
      {startGame ? (
        <>
          <P5Sketch sketch={sketch} />
          <div className="flex flex-col items-start gap-4 w-[15vw]">
            <span className="font-bold text-3xl">Find exit.</span>
            <div className="w-full">
              <label className="place-self-center text-center text-xl text-slate-600 font-bold">
                Controls
              </label>
              <div className="grid grid-rows-4">
                <div className="flex flex-row items-center justify-between">
                  <p>Move</p>
                  <p className="font-bold text-slate-700">ZQSD / Arrow keys</p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p>Show path</p>
                  {options.enablePlayerPath ? (
                    <p className="font-bold text-slate-700">H</p>
                  ) : (
                    <p className="text-red-600 font-bold">Disabled</p>
                  )}
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p>Reset position</p>
                  {options.enableReset ? (
                    <p className="font-bold text-slate-700">R</p>
                  ) : (
                    <p className="text-red-600 font-bold">Disabled</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <p>Countdown</p>
              {options.enableCountdown ? (
                <p className="font-bold text-slate-700">{countdown.text}</p>
              ) : (
                <p className="text-red-600 font-bold">Disabled</p>
              )}
            </div>
            <button
              onClick={() => setStartGame(false)}
              className="w-fit h-fit p-2 bg-blue-500 text-white font-bold rounded-md hover:cursor-pointer"
            >
              Return to menu
            </button>
          </div>
        </>
      ) : (
        <OptionsMenu {...options} />
      )}
    </div>
  );
}
