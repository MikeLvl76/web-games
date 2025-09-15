import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props = {
  nodeId: string;
  children: ReactNode;
  data?: Record<string, unknown>;
  disabled?: boolean;
};

export default function Droppable({ children, nodeId, ...restProps }: Props) {
  const { setNodeRef } = useDroppable({ id: nodeId, ...restProps });

  return <div ref={setNodeRef}>{children}</div>;
}
