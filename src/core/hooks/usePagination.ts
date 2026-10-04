import { useState } from "react";

import { DEFAULT_PAGE_SIZE } from "@/core/constants/filters";

const FIRST_PAGE = 1;

export const usePagination = <Item>(
  items: Item[],
  pageSize: number = DEFAULT_PAGE_SIZE,
) => {
  const [requestedPage, setRequestedPage] = useState(FIRST_PAGE);
  const pageCount = Math.max(Math.ceil(items.length / pageSize), FIRST_PAGE);
  // When filtering shrinks the list, the requested page may no longer
  // exist; showing the last available page avoids an empty table.
  const page = Math.min(requestedPage, pageCount);
  const firstItemIndex = (page - FIRST_PAGE) * pageSize;

  return {
    page,
    pageCount,
    pageItems: items.slice(firstItemIndex, firstItemIndex + pageSize),
    setPage: setRequestedPage,
    resetPage: () => setRequestedPage(FIRST_PAGE),
  };
};
