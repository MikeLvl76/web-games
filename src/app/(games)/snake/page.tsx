"use client";

import P5Sketch from "@/components/ui/p5-sketch";
import p5 from "p5";

export default function SnakePage() {
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth * 0.5, p.windowHeight * 0.8);
      p.background(0);
    };

    p.draw = () => {
      p.fill(255, 0, 0);
      p.ellipse(p.width / 2, p.height / 2, 50, 50);
    };
  };
  return (
    <div className="flex flex-col items-center gap-4 p-2 w-full">
      <P5Sketch sketch={sketch} />
    </div>
  );
}
