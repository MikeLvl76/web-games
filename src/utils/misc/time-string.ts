type TimeOptions = {
  includeHour?: boolean;
  includeDay?: boolean;
};

export const stringifyTime = (time: number, options?: TimeOptions) => {
  const timeUnits = [];

  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  timeUnits.push(seconds, minutes);

  if (options) {
    const { includeHour, includeDay } = options;

    if (includeHour) {
      const hours = Math.floor((time % (3600 * 24)) / 3600);
      timeUnits.push(hours);
    }

    if (includeDay) {
      const days = Math.floor(time / (3600 * 24));
      timeUnits.push(days);
    }
  }

  return timeUnits
    .map((unit) => unit.toString().padStart(2, "0"))
    .reverse()
    .join(":");
};
