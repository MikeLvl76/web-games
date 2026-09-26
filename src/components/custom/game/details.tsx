"use client";

import { JSX, memo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { ChevronDownIcon, LucideIcon, LucideProps } from "lucide-react";

type Props = {
  sections: {
    title: string;
    icon: LucideIcon;
    iconProps?: LucideProps;
    content: { infos: string[]; elements: JSX.Element[] };
  }[];
};

const Section = memo(
  ({ _section }: { _section: Props["sections"][number] }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        defaultOpen
        className="w-full"
      >
        <CollapsibleTrigger className="flex flex-row justify-between items-center w-full bg-slate-300 shadow-2xl/50 rounded-full hover:cursor-pointer p-2">
          <ChevronDownIcon
            color="black"
            size={20}
            className={`transition-transform duration-300 ${
              isOpen ? "-rotate-180" : "rotate-0"
            }`}
          />
          <span className="font-bold text-lg">{_section.title}</span>
          <_section.icon {..._section.iconProps} />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1 mt-2">
          {_section.content.infos.length > 0 && (
            <div className="w-full flex flex-col p-2">
              {_section.content.infos.map((info, i) => (
                <span
                  key={i}
                  className="text-left font-bold text-slate-700 text-wrap break-all"
                >
                  {info}
                </span>
              ))}
            </div>
          )}
          {_section.content.elements.length > 0 && (
            <div className="grid grid-cols-2 w-full p-2">
              {_section.content.elements.map((elt) => (
                <div className="flex justify-center">{elt}</div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  },
);
Section.displayName = "Section";

export default function GameDetails({ sections }: Props) {
  return (
    <div className="flex flex-col items-start gap-4 min-w-[20vw] w-fit h-fit p-4">
      {...sections.map((section, i) => <Section key={i} _section={section} />)}
    </div>
  );
}
