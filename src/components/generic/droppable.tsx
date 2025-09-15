import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  data?: Record<string, unknown>;
  disabled?: boolean;
};

export default function Droppable({ children, ...restProps }: Props) {
  const { setNodeRef } = useDroppable(restProps);

  return <div ref={setNodeRef}>{children}</div>;
}
