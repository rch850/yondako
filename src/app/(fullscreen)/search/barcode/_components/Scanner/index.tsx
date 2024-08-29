"use client";

import BookDetailDrawer from "@/components/BookDetail/Drawer";
import MobileHeader from "@/components/MobileHeader";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import Quagga from "@ericblade/quagga2";
import { useCallback, useEffect, useOptimistic, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { toast } from "sonner";
import { searchFromIsbn } from "../../_actions/searchFromIsbn";
import CameraError from "../CameraError";
import OrientationError from "../OrientationError";
import { useScanner } from "./useScanner";

export default function Scanner() {
  const [isCameraError, setIsCameraError] = useState(false);
  const [searchResult, setSearchResult] = useState<BookType | null>(null);
  const [displayReadingStatus, setDisplayReadingStatus] =
    useState<ReadingStatus>(searchResult?.readingStatus ?? "none");
  const [optimisticStatus, addOptimisticStatus] =
    useOptimistic(displayReadingStatus);
  const isSearched = useRef(false);

  const { width, height } = useWindowSize();

  const handleDetected = useCallback(async (code: string) => {
    // ISBNではない or 検索済みならスキップ
    if (!code.startsWith("978") || isSearched.current) {
      return;
    }

    isSearched.current = true;
    const result = await searchFromIsbn(code);

    if (!result) {
      toast.info("書籍がみつかりませんでした", {
        description: `ISBN: ${code}`,
        onDismiss: () => {
          isSearched.current = false;
        },
        onAutoClose: () => {
          isSearched.current = false;
        },
      });

      return;
    }

    setSearchResult(result);
  }, []);

  const handleInitError = useCallback((err: unknown) => {
    console.error("InitError", err);
    setIsCameraError(true);
  }, []);

  const scannerRef = useScanner({
    width,
    height,
    landscape: false,
    onDetected: handleDetected,
    onInitError: handleInitError,
  });

  // 権限を取得
  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };

    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };

    enableCamera()
      .then(disableCamera)
      .catch((err) => {
        console.error("CameraError", err);
        setIsCameraError(true);
      });

    return () => {
      disableCamera();
    };
  }, []);

  if (screen.orientation.type !== "portrait-primary") {
    return <OrientationError />;
  }

  if (isCameraError) {
    return <CameraError />;
  }

  return (
    <>
      <MobileHeader className="fixed inset-0 z-10 h-fit text-white" />
      <div
        className="relative bg-primary-background"
        style={{ width, height }}
        ref={scannerRef}
      >
        <div className="absolute inset-x-0 top-0 h-2/5 bg-black/40">
          <div className="absolute bottom-8 w-full text-center text-white">
            <p>書籍のバーコードを映してください</p>
            <p>(数字が 978 で始まるもの)</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-black/40" />

        <canvas
          className="drawingBuffer" // これがないと Quagga に認識されない
          style={{ position: "absolute" }}
          width={width}
          height={height}
        />

        {searchResult && (
          <BookDetailDrawer
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                setSearchResult(null);
                isSearched.current = false;
              }
            }}
            bookDetailProps={{
              data: searchResult,
              status: displayReadingStatus,
              onChangeStatus: (status) => setDisplayReadingStatus(status),
              optimisticStatus,
              onChangeOptimisticStatus: (status) => addOptimisticStatus(status),
            }}
          />
        )}
      </div>
    </>
  );
}
