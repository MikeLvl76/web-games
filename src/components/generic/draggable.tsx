import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  data?: Record<string, unknown>;
  disabled?: boolean;
};

export default function Draggable({ children, ...restProps }: Props) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable(restProps);

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
