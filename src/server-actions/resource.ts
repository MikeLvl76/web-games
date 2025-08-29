"use server";

import fs from "fs";
import path from "path";

export type Resource = {
  filename: string;
  urlpath: string;
  filepath: string;
};

export const getResources = async () => {
  const imagesDir = "images";
  const dir = path.resolve("public", imagesDir);
  const filenames = fs.readdirSync(dir, { withFileTypes: true });

  const resources: Resource[] = filenames.map((file) => ({
    filename: `${file.name
      .substring(0, 1)
      .toLocaleUpperCase()}${file.name.substring(1)}`,
    urlpath: file.name.substring(0, file.name.indexOf(".")),
    filepath: `/${imagesDir}/${file.name}`,
  }));

  return resources;
};
