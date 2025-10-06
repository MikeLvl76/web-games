"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import p5 from "p5";

export default function MazePage() {
  const sketch = (p: p5) => {
    p.setup = () => {
      const div = document.getElementById("p5-container");
      p.createCanvas(
        div?.offsetWidth ?? p.windowWidth * 0.5,
        div?.offsetHeight ?? p.windowHeight * 0.8
      );
      p.background(0);
    };

    p.draw = () => {
      p.background(0);
      p.fill(255);
      p.ellipse(p.width * 0.5, p.height * 0.5, 20, 20);
    };
  };

  return (
    <div>
      <P5Sketch sketch={sketch} />
    </div>
  );
}
