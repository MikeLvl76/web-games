import { ReactNode } from "react";

export default function TicTacToeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[95vh] max-w-screen max-h-[95vh] justify-center items-center gap-2">
      {children}
    </div>
  );
}
