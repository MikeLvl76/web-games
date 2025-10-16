"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Props<T> = {
  pageSize: number;
  defaultData?: T[];
};

type Pagination<T> = {
  totalPages: number;
  pageNumber: number;
  paginate: (_data: T[]) => void;
  previous: () => void;
  next: () => void;
  first: () => void;
  last: () => void;
  data: T[];
};

export function usePagination<T>(
  { pageSize, defaultData }: Props<T> = { pageSize: 16 }
): Pagination<T> {
  const [_allData, setAllData] = useState<T[]>(defaultData ?? []);
  const [data, setData] = useState<T[]>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const totalCount = _allData.length;

  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  const skip = useMemo(
    () => (pageNumber - 1) * pageSize,
    [pageNumber, pageSize]
  );

  const paginate = useCallback((_data: T[]) => {
    setAllData(_data);
    setPageNumber(1);
  }, []);

  const previous = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  const next = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const first = useCallback(() => setPageNumber(1), []);
  const last = useCallback(() => setPageNumber(totalPages), [totalPages]);

  useEffect(() => {
    setData(_allData.slice(skip, skip + pageSize));
  }, [_allData, pageSize, skip]);

  return {
    totalPages,
    pageNumber,
    paginate,
    previous,
    next,
    first,
    last,
    data,
  };
}
