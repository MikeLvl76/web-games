import fs from "fs";
import path from "path";

export const getUrls = () => {
  const imagesDir = "images";
  const dir = path.resolve("public", imagesDir);
  const filenames = fs.readdirSync(dir, { withFileTypes: true });

  return filenames.map((file) => ({
    name: `${file.name
      .substring(0, 1)
      .toLocaleUpperCase()}${file.name.substring(1)}`,
    url: file.name.substring(0, file.name.indexOf(".")),
    imageUrl: `/${imagesDir}/${file.name}`,
  }));
};
