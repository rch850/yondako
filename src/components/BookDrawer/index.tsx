"use client";

import type { BookType } from "@/types/book";
import { Drawer } from "vaul";
import BookReadingStatusForm from "../BookReadingStatusForm";
import { BookThumbnail } from "../BookThumbnail";
import { DescriptionBlock } from "./DescriptionBlock";
import ECLinks from "./ECLinks";

type Props = {
  data: BookType;
};

export default function BookDrawer({ data }: Props) {
  const { title, thumbnailUrl, authors, publishers, isbn } = data.detail;

  return (
    <Drawer.Root open={true}>
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-primary-background px-6 pb-8">
          <Drawer.Handle className="mt-2 bg-primary-foreground" />
          <BookThumbnail
            className="mx-auto mt-8 h-40 border border-secondary-border"
            src={thumbnailUrl}
          />
          <div className="mx-auto max-w-sm">
            <Drawer.Title className="mt-4 text-center font-bold">
              {title}
            </Drawer.Title>

            {(authors || publishers) && (
              <Drawer.Description className="mt-4 flex justify-center rounded-2xl bg-tertiary-background px-4 py-2">
                {authors && (
                  <DescriptionBlock label="著者" value={authors.join(", ")} />
                )}
                {authors && publishers && (
                  <div className="mx-4 w-[1px] bg-secondary-foreground" />
                )}
                {publishers && (
                  <DescriptionBlock
                    label="出版社"
                    value={publishers.join(", ")}
                  />
                )}
              </Drawer.Description>
            )}

            <div className="mt-8">
              <BookReadingStatusForm
                className="mx-auto w-fit space-x-10 text-accent"
                currentStatus={data.readingStatus}
              />
            </div>

            {isbn && <ECLinks isbn={isbn} />}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
