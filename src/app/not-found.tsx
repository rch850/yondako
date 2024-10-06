import { generateMetadataTitle } from "#src/lib/metadata";
import ErrorPage from "./_components/ErrorPage";

export const metadata = generateMetadataTitle("NotFound");

export default function NotFound() {
  return (
    <ErrorPage title="NotFound">
      <p>ページが見つかりませんでした 🫥</p>
      <p>URLが間違っていないかご確認ください</p>
    </ErrorPage>
  );
}
