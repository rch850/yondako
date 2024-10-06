import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ImageQrCode from "#src/assets/images/qr-search-barcode.svg";
import MessageTako from "#src/components/MessageTako/index";
import { auth } from "#src/lib/auth";
import { generateMetadataTitle } from "#src/lib/metadata";
import { createSignInPath } from "#src/lib/path";

export const runtime = "edge";

export const metadata = generateMetadataTitle("バーコードで探す");

export default async function MobileExclusive() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search/barcode/mobile-exclusive"));
  }

  const isMobile = headers().get("X-IS-DESKTOP") === null;

  // モバイルであれば利用可能なのでリダイレクト
  if (isMobile) {
    redirect("/search/barcode");
  }

  return (
    <div className="flex h-full items-center">
      <MessageTako
        title="この機能はスマホからのみ利用可能です"
        decoration={
          <>
            <span className="absolute top-0 left-0 text-4xl">📱</span>
            <span className="-right-2 absolute bottom-7 text-3xl">💻️</span>
          </>
        }
      >
        <p className="mt-3">よかったらスマホからアクセスしてみてください 🙏</p>
        <p className="mt-1 text-xs">
          (需要があれば、デスクトップ対応するかもしれません)
        </p>
        <div className="mx-auto mt-12 w-48 rounded-2xl bg-tertiary-background p-4">
          <ImageQrCode className="text-accent" />
        </div>
      </MessageTako>
    </div>
  );
}
