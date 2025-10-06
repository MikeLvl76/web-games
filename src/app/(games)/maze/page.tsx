"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { Maze } from "@/utils/p5/maze/maze";
import p5 from "p5";

export default function MazePage() {
  const sketch = (p: p5) => {
    let maze: Maze;

    p.setup = () => {
      const div = document.getElementById("p5-container");
      p.createCanvas(
        div?.offsetWidth ?? p.windowWidth * 0.5,
        div?.offsetHeight ?? p.windowHeight * 0.8
      );
      p.background(0);
      maze = new Maze(p, 225);
      maze.generate();
      maze.setEntryAndExit();
    };

    p.draw = () => {
      p.background(0);

      if (maze) {
        maze.draw();
      }
    };
  };

  return (
    <div>
      <P5Sketch sketch={sketch} />
    </div>
  );
}
