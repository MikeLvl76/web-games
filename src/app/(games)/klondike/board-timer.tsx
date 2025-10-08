"use client";

import { memo, useEffect, useState } from "react";

type Props = {
  hasEnded?: boolean;
};

export const BoardTimer = memo(({ hasEnded }: Props) => {
  const [timer, setTimer] = useState("0d 00:00:00");

  useEffect(() => {
    if (hasEnded) return;

    let time = 0;
    const interval = setInterval(() => {
      time++;

      const days = Math.floor(time / (3600 * 24));
      const hours = Math.floor((time % (3600 * 24)) / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;

      setTimer(
        `${days}d ${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEnded]);

  return (
    <div className="w-fit h-fit bg-transparent p-2">
      <p className="text-center text-xl font-bold text-white">Time: {timer}</p>
    </div>
  );
});
BoardTimer.displayName = "BoardTimer";
