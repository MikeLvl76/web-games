import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  data?: Record<string, unknown>;
  disabled?: true;
};

export default function Droppable({ children, ...restProps }: Props) {
  const { isOver, setNodeRef } = useDroppable(restProps);

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver ? "border-2 border-black" : "border-2 border-green"
      }`}
    >
      {children}
    </div>
  );
}
