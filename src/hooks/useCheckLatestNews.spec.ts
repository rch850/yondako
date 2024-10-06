import { beforeEach, describe, expect, test } from "bun:test";
import { renderHook } from "@testing-library/react-hooks";
import { useCheckLatestNews } from "#src/hooks/useCheckLatestNews";

describe("useCheckLatestNews", () => {
  const lastNewsCheckedKey = "lastNewsChecked";

  beforeEach(() => {
    localStorage.clear();
  });

  test("新着のお知らせがある場合trueが返る", () => {
    const latestNewsTimestamp = Date.now();
    localStorage.setItem(
      lastNewsCheckedKey,
      (latestNewsTimestamp - 1000).toString(),
    );

    const { result } = renderHook(() =>
      useCheckLatestNews(latestNewsTimestamp),
    );

    expect(result.current).toBe(true);
  });

  test("新着のお知らせがない場合falseが返る", () => {
    const latestNewsTimestamp = Date.now();
    localStorage.setItem(
      lastNewsCheckedKey,
      (latestNewsTimestamp + 1000).toString(),
    );

    const { result } = renderHook(() =>
      useCheckLatestNews(latestNewsTimestamp),
    );

    expect(result.current).toBe(false);
  });

  test("localStorageに値がない場合trueが返る", () => {
    const latestNewsTimestamp = Date.now();

    const { result } = renderHook(() =>
      useCheckLatestNews(latestNewsTimestamp),
    );

    expect(result.current).toBe(true);
  });
});
