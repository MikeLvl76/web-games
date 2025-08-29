"use client";

import ImageResource from "@/components/generic/image-resource";
import { getResources, Resource } from "@/server-actions/resource";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState<Resource[]>([]);

  useEffect(() => {
    getResources()
      .then((response) => setImages(response))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <h1 className="font-bold text-2xl text-center">All your games here!</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((resource, i) => (
          <li
            key={i}
            className="flex items-center justify-center rounded-sm w-60 h-60 gap-1 hover:cursor-pointer"
          >
            <ImageResource resource={resource} />
          </li>
        ))}
      </ul>
    </div>
  );
}
