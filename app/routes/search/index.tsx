import IconHelp from "@/assets/icons/help.svg?react";
import BookList from "@/components/common/BookList";
import CommonLayout from "@/components/common/Layout";
import SearchBox from "@/components/common/SearchBox";
import { searchBookFromNDL } from "@/libs/ndl/api";
import { BookInfo, BookType } from "@/types/book";
import { createRoute } from "honox/factory";

const title = "キーワードで探す";

export default createRoute(async (c) => {
  let results: BookInfo[] | undefined = [];

  const query = c.req.query("q");

  if (query) {
    results = await searchBookFromNDL({ any: query, cnt: 100 });
  }

  return c.render(
    <CommonLayout current={title}>
      <div className="flex items-center">
        <form className="m-0 w-full">
          <SearchBox
            name="q"
            defaultValue={query}
            placeholder="書籍名、著者名で検索"
          />
        </form>

        <a
          className="ml-4 flex items-center shrink-0 text-xs text-text space-x-1 hover:underline"
          href="https://docs.yondako.com/data-source"
          target="_blank"
          rel="noreferrer"
        >
          <IconHelp className="w-4 h-4" />
          <span>データはどこから取得してるの？</span>
        </a>
      </div>

      <SearchResult
        results={results?.map((info) => ({
          info,
          liked: false,
          status: "none",
        }))}
        isIdle={typeof query === "undefined"}
      />
    </CommonLayout>,
    {
      title: query ? `「${query}」の検索結果` : title,
    },
  );
});

type SearchResultProps = {
  results: BookType[] | undefined;
  isIdle: boolean;
};

function SearchResult({ results, isIdle }: SearchResultProps) {
  if (isIdle) {
    return (
      <p className="mx-auto mt-12 w-fit text-center font-noto-emoji animate-bounce cursor-grab">
        ₍₍⁽⁽🐙₎₎⁾⁾
      </p>
    );
  }

  // 検索エラー
  if (!results) {
    return (
      <p className="mt-12 text-center">
        検索できませんでした。
        <wbr />
        しばらく時間をおいて再度お試しください
      </p>
    );
  }

  if (results.length === 0) {
    return <p className="mt-12 text-center">みつかりませんでした</p>;
  }

  return <BookList className="mt-8" items={results} />;
}
