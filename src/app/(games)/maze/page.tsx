"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import { Cell } from "@/utils/p5/maze/cell";
import p5 from "p5";

export default function MazePage() {
  const sketch = (p: p5) => {
    let cell: Cell;

    p.setup = () => {
      const div = document.getElementById("p5-container");
      p.createCanvas(
        div?.offsetWidth ?? p.windowWidth * 0.5,
        div?.offsetHeight ?? p.windowHeight * 0.8
      );
      p.background(0);
      cell = new Cell(p, [p.width * 0.5, p.height * 0.5], [40, 40], "normal");
    };

    p.draw = () => {
      p.background(0);

      if (cell) {
        cell.draw();
      }
    };
  };

  return (
    <div>
      <P5Sketch sketch={sketch} />
    </div>
  );
}
