"use server";

import { createBook, getBook } from "@/db/queries/book";
import { upsertReadingStatus } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import { type SearchOptions, searchBooksFromNDL } from "@/lib/ndl";
import type { BookIdentifiers, BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";

type UpdateReadingStatusResult = {
  book?: BookType;
  error?: string;
};

/**
 * 読書ステータスを更新
 * @param bookIdentifiers 書籍識別子
 * @param status 読書ステータス
 * @returns 更新結果
 */
export async function updateReadingStatus(
  bookIdentifiers: BookIdentifiers,
  status: ReadingStatus,
): Promise<UpdateReadingStatusResult> {
  const session = await auth();

  if (!session || !session.user?.id) {
    return {
      error: "この操作にはログインが必要です",
    };
  }

  // Dbに登録されているか確認
  let bookDetail = await getBook(bookIdentifiers);

  // DBに無い場合登録する
  if (!bookDetail) {
    const opts: SearchOptions = {
      cnt: 1,
    };

    if (bookIdentifiers.ndlBibId) {
      // NDL書誌IDがある場合はそれを優先
      opts.any = bookIdentifiers.ndlBibId;
    } else if (bookIdentifiers.isbn) {
      // NDL書誌IDが無い場合はISBNで検索
      opts.isbn = bookIdentifiers.isbn;
    } else {
      // どちらも無い場合はエラー
      return {
        error: "この書籍は未対応のため登録できません",
      };
    }

    const results = await searchBooksFromNDL(opts);
    const book = results?.books.at(0);

    // データが無いもしくは書籍識別子が一致しない場合はエラー
    if (
      !results ||
      !book ||
      (bookIdentifiers.ndlBibId &&
        book.ndlBibId !== bookIdentifiers.ndlBibId) ||
      (bookIdentifiers.isbn && book.isbn !== bookIdentifiers.isbn)
    ) {
      return {
        error: "対象の書籍データを取得できませんでした",
      };
    }

    bookDetail = await createBook(book);
  }

  // 読書ステータスの変更をDBに反映
  const resultReadingStatus = await upsertReadingStatus(
    session.user.id,
    bookDetail.id,
    status,
  );

  return {
    book: {
      detail: bookDetail,
      readingStatus: resultReadingStatus,
    },
  };
}
