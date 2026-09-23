"use client";

import Description from "./description";
import { GameDescription } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "../pagination";
import GameSearchBar from "./search-bar";

type Props = {
  descriptions: GameDescription[];
  hideMCSMessage?: boolean;
};

export default function GamesDescriptionList({
  descriptions,
  hideMCSMessage,
}: Props) {
  const pagination = usePagination<GameDescription>();

  return (
    <div className="flex flex-col w-full h-full items-center p-2 gap-4">
      <GameSearchBar
        onSearch={(name, type) => {
          const compareNames = (_name: string) =>
            _name.toLowerCase().startsWith(name.toLowerCase());

          const compareTypes = (_type: GameDescription["type"]) =>
            _type === type;

          const _descriptions = [];

          if (name.length > 0 && !type) {
            _descriptions.push(
              ...descriptions.filter(({ name }) => compareNames(name)),
            );
          } else if (type && name.length === 0) {
            _descriptions.push(
              ...descriptions.filter(
                ({ name, type }) => compareNames(name) && compareTypes(type),
              ),
            );
          } else if (name.length === 0 && !type) {
            _descriptions.push(...descriptions);
          }

          pagination.paginate(_descriptions);
        }}
      />
      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {pagination.data.map((description) => (
          <li
            key={description.id}
            className="flex items-center justify-center rounded-sm w-50 h-50 gap-1 hover:cursor-pointer hover:scale-105 transition duration-400 ease-in-out"
          >
            <Description description={description} />
          </li>
        ))}
        {!hideMCSMessage && (
          <div className="w-full h-full rounded-md">
            <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
              <span className="text-xl font-medium text-slate-600">
                More coming soon...
              </span>
            </div>
          </div>
        )}
      </ul>
      <Pagination
        text={`${pagination.pageNumber}/${pagination.totalPages}`}
        onFirst={pagination.first}
        onPrevious={pagination.previous}
        onNext={pagination.next}
        onLast={pagination.last}
      />
    </div>
  );
}
