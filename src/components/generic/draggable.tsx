"use client";

import { DndDefaultDataType } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props<T extends DndDefaultDataType> = {
  nodeId: string;
  children: ReactNode;
  data?: T;
  disabled?: boolean;
};

export default function Draggable<T extends DndDefaultDataType>({
  children,
  nodeId,
  ...restProps
}: Props<T>) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: nodeId,
    ...restProps,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
