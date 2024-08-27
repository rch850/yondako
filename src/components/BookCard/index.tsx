"use client";

import IconDotsVertical from "@/assets/icons/dots-vertical.svg";
import type { BookType } from "@/types/book";
import BookDrawer from "../BookDrawer";
import BookReadingStatusForm from "../BookReadingStatusForm";
import { BookThumbnail } from "../BookThumbnail";

export type BookCardProps = {
  data: BookType;
  hideReadingStatusBadge?: boolean;
};

export default function BookCard({ data }: BookCardProps) {
  return (
    <div className="relative w-full text-left text-primary-foreground">
      <div className="mt-8 flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl bg-tertiary-background p-4 pl-36">
        <div className="space-y-1">
          <p className="line-clamp-3 font-bold text-sm leading-5">
            {data.detail.title}
          </p>

          {data.detail.authors && (
            <p className="line-clamp-1 text-secondary-foreground text-xxs">
              {data.detail.authors.join(", ")}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <BookReadingStatusForm
            className="shrink-0"
            bookId={data.detail.ndlBibId}
            bookTitle={data.detail.title}
            defaultStatus={data.readingStatus}
            compact
          />

          <BookDrawer data={data}>
            <button className="rounded-2xl bg-tertiary-background p-1 transition hover:brightness-95">
              <IconDotsVertical className="h-4 w-4" />
            </button>
          </BookDrawer>
        </div>
      </div>

      <BookThumbnail
        className="absolute top-4 left-4 w-28 border-4 border-tertiary-background shadow-xl"
        src={data.detail.thumbnailUrl}
      />
    </div>
  );
}
