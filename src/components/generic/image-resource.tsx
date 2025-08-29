"use client";

import { Resource } from "@/server-actions/resource";
import { FileWarning } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";

type Props = { resource: Resource };

const ImageResource = memo(({ resource }: Props) => {
  const { filename, urlpath, filepath } = resource;
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 bg-slate-200 w-60 h-60 ">
        <FileWarning size={32} color="#5c5958" />
        <p className="font-bold text-center">Image could not load.</p>
      </div>
    );
  }

  return (
    <Link href={urlpath}>
      <Image
        alt={filename}
        src={filepath}
        width={600}
        height={600}
        priority
        onError={() => setError(true)}
      />
    </Link>
  );
});
ImageResource.displayName = "ImageResource";

export default ImageResource;
