"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { Maze } from "@/utils/p5/maze/maze";
import { Player } from "@/utils/p5/maze/player";
import p5 from "p5";
import { memo, useState } from "react";

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

  const sketch = (p: p5) => {
    let maze: Maze;
    let player: Player;

    p.setup = () => {
      const div = document.getElementById("p5-container");
      p.createCanvas(
        div?.offsetWidth ?? p.windowWidth * 0.5,
        div?.offsetHeight ?? p.windowHeight * 0.8
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
  };

  const OptionsMenu = memo(
    ({ enableCountdown, enablePlayerPath, enableReset, size }: Options) => (
      <div className="grid grid-cols-2 gap-4 w-[40vw] h-[30vh] border-2 border-black rounded-md p-2 justify-center items-center">
        <div className="flex flex-row justify-evenly items-center min-w-1/2">
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
        <div className="flex flex-row justify-evenly items-center min-w-1/2">
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
        <div className="flex flex-row justify-evenly items-center min-w-1/2">
          <label>Enable position reset</label>
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
        <div className="flex flex-col items-center justify-center gap-2 min-w-1/2">
          <label>Size</label>
          <div className="flex flex-row justify-evenly items-center w-full">
            <label>20x20</label>
            <input
              type="range"
              defaultValue={size}
              min={20}
              max={40}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  size: parseInt(e.target.value),
                }))
              }
              className="focus:cursor-grab"
            />
            <label>40x40</label>
          </div>
        </div>
        <div className="col-span-2 justify-end">
          <button
            onClick={() => setStartGame(true)}
            className="w-fit h-fit p-2 bg-blue-500 text-white rounded-md text-center place-self-end"
          >
            Confirm
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
          <div>
            <span>Find exit of the maze.</span>
            <div>
              <label>Controls</label>
              <div className="grid grid-rows-4">
                <div>
                  <p>Move</p>
                  <p>ZQSD or arrow keys</p>
                </div>
                <div>
                  <p>Show path</p>
                  <p>{options.enablePlayerPath ? "h" : "Disabled"}</p>
                </div>
                <div>
                  <p>Reset position</p>
                  <p>{options.enableReset ? "r" : "Disabled"}</p>
                </div>
              </div>
            </div>
            <div>
              <p>Countdown</p>
              <p>Disabled</p>
            </div>
          </div>
        </>
      ) : (
        <OptionsMenu {...options} />
      )}
    </div>
  );
}
