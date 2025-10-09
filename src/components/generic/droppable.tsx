"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props<T extends Record<string, unknown>> = {
  nodeId: string;
  children: ReactNode;
  data?: T;
  disabled?: boolean;
};

export default function Droppable<T extends Record<string, unknown>>({
  children,
  nodeId,
  ...restProps
}: Props<T>) {
  const { setNodeRef } = useDroppable({ id: nodeId, ...restProps });

  return <div ref={setNodeRef}>{children}</div>;
}
