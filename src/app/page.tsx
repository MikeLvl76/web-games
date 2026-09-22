"use client";

import PreviewList from "@/components/custom/preview-list";
import { usePreviews } from "@/hooks/use-previews";

export default function HomePage() {
  const previews = usePreviews({ sort: "asc" });

  return <PreviewList previews={previews} />;
}
