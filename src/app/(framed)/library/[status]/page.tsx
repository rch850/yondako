import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { is, safeParse } from "valibot";
import { Loading } from "#src/components/Loading/index";
import { readingStatusMetadata } from "#src/constants/status";
import { auth } from "#src/lib/auth";
import { generateMetadataTitle } from "#src/lib/metadata";
import { createSignInPath } from "#src/lib/path";
import { type Order, orderSchema } from "#src/types/order";
import { pageIndexSchema } from "#src/types/page";
import {
  type ReadingStatus,
  readingStatusSchemaWithoutNone,
} from "#src/types/readingStatus";
import { LibraryBookList } from "./_components/LibraryBookList";
import Tab from "./_components/Tab";

export const runtime = "edge";

type Props = {
  params: {
    status: ReadingStatus;
  };
  searchParams: {
    page?: string;
    q?: string;
    order?: Order;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  const readingStatus = readingStatusMetadata.get(params.status);

  if (!readingStatus || !is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  return generateMetadataTitle(readingStatus.label);
}

export default async function Library({ params, searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath(`/library/${params.status}`));
  }

  // ライブラリのステータスが不正な場合は404にリダイレクト
  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  // ページ数
  const pageParseResult = safeParse(
    pageIndexSchema,
    Number.parseInt(searchParams.page ?? "1"),
  );
  const page = pageParseResult.success ? pageParseResult.output : 1;

  // ソート順
  const orderParseResult = safeParse(orderSchema, searchParams.order);
  const orderType = orderParseResult.success ? orderParseResult.output : "desc";

  return (
    <>
      <Tab current={params.status} />
      <Suspense
        fallback={
          <Loading
            className="mt-12 justify-start lg:mt-0 lg:justify-center"
            title="読み込んでいます"
          />
        }
      >
        <LibraryBookList
          status={params.status}
          page={page}
          order={orderType}
          titleKeyword={searchParams.q}
        />
      </Suspense>
    </>
  );
}
