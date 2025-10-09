"use client";

import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props<T extends Record<string, unknown>> = {
  nodeId: string;
  children: ReactNode;
  data?: T;
  disabled?: boolean;
};

export default function Draggable<T extends Record<string, unknown>>({
  children,
  nodeId,
  ...restProps
}: Props<T>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: nodeId,
    ...restProps,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
