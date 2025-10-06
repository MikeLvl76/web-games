"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { Maze } from "@/utils/p5/maze/maze";
import { Player } from "@/utils/p5/maze/player";
import p5 from "p5";

export default function MazePage() {
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
      maze = new Maze(p, 400);
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

      if (p.key === "h") {
        player.showVisitedCells = !player.showVisitedCells;
      }
    };
  };

  return (
    <div>
      <P5Sketch sketch={sketch} />
    </div>
  );
}
