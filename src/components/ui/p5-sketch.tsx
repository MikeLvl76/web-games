"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

type P5SketchProps = {
  sketch: (p: p5) => void;
};

export default function P5Sketch({ sketch }: P5SketchProps) {
  const p5ContainerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    let mounted = true;

    import("p5").then((P5) => {
      if (!mounted || !p5ContainerRef.current) return;

      p5ContainerRef.current.innerHTML = "";

      const responsiveSketch = (p: p5) => {
        sketch(p);

        p.windowResized = () => {
          p.resizeCanvas(
            p5ContainerRef.current!.clientWidth,
            p5ContainerRef.current!.clientHeight
          );
        };
      };

      p5Instance.current = new P5.default(
        responsiveSketch,
        p5ContainerRef.current
      );
    });

    return () => {
      mounted = false;
      p5Instance.current?.remove();
      p5Instance.current = null;
    };
  }, [sketch]);

  return (
    <div
      ref={p5ContainerRef}
      className="flex items-center justify-center w-[70vw] h-[70vh]"
    />
  );
}
