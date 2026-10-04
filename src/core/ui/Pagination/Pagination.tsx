import { css } from "@emotion/css";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { IconButton } from "@/core/ui/IconButton/IconButton";

import { useStyles } from "./Pagination.styles";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
}: PaginationProps) => {
  const styles = useStyles();

  return (
    <nav className={css(styles.root)} aria-label="Страницы списка">
      <span className={css(styles.status)}>
        Страница {page} из {pageCount}
      </span>
      <IconButton
        label="Предыдущая страница"
        onClick={() => onPageChange(page - 1)}
        isDisabled={page <= 1}
      >
        <ChevronLeft size={ICON_SIZE} />
      </IconButton>
      <IconButton
        label="Следующая страница"
        onClick={() => onPageChange(page + 1)}
        isDisabled={page >= pageCount}
      >
        <ChevronRight size={ICON_SIZE} />
      </IconButton>
    </nav>
  );
};
