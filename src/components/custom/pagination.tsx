"use client";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

type Props = {
  text: string;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
};

export default function Pagination(props: Props) {
  return (
    <div className="flex flex-row justify-center items-center py-4 gap-4">
      <ChevronsLeft className="hover:cursor-pointer" onClick={props.onFirst} />
      <ChevronLeft
        className="hover:cursor-pointer"
        onClick={props.onPrevious}
      />
      <span>{props.text}</span>
      <ChevronRight className="hover:cursor-pointer" onClick={props.onNext} />
      <ChevronsRight className="hover:cursor-pointer" onClick={props.onLast} />
    </div>
  );
}
