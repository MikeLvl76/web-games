"use client";

import { stringifyTime } from "@/lib/utils";
import { memo, useEffect, useState } from "react";

type Props = {
  hasEnded?: boolean;
};

export const BoardTimer = memo(({ hasEnded }: Props) => {
  const [timer, setTimer] = useState(
    stringifyTime(0, { includeDay: true, includeHour: true })
  );

  useEffect(() => {
    if (hasEnded) return;

    let time = 0;
    const interval = setInterval(() => {
      time++;

      setTimer(stringifyTime(time, { includeDay: true, includeHour: true }));
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
