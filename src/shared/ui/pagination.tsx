"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  return [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalItems <= pageSize) {
    return null;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Пагінація каталогу"
      className={cn(
        "flex flex-col items-center gap-4 sm:flex-row sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Показано{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        з <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Попередня сторінка"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Назад</span>
        </Button>

        <div className="flex items-center gap-1 px-1">
          {visiblePages.map((pageNumber, index) => {
            const prev = visiblePages[index - 1];
            const showEllipsis = prev !== undefined && pageNumber - prev > 1;

            return (
              <span key={pageNumber} className="flex items-center gap-1">
                {showEllipsis ? (
                  <span className="px-1 text-muted-foreground">…</span>
                ) : null}
                <Button
                  type="button"
                  variant={pageNumber === page ? "default" : "outline"}
                  size="sm"
                  className="min-w-9 rounded-full"
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Сторінка ${pageNumber}`}
                  aria-current={pageNumber === page ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              </span>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Наступна сторінка"
        >
          <span className="hidden sm:inline">Далі</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
