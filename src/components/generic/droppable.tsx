"use client";

import { DndDefaultDataType } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props<T extends DndDefaultDataType> = {
  nodeId: string;
  children: ReactNode;
  data?: T;
  disabled?: boolean;
};

export default function Droppable<T extends DndDefaultDataType>({
  children,
  nodeId,
  ...restProps
}: Props<T>) {
  const { setNodeRef } = useDroppable({ id: nodeId, ...restProps });

  return <div ref={setNodeRef}>{children}</div>;
}
