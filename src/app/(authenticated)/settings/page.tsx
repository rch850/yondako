import Button from "@/components/Button";
import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import Link from "next/link";
import { redirect } from "next/navigation";
import Layout from "../_components/Layout";
import LogoutButton from "./_components/LogoutButton";
import Footer from "@/components/Footer";

export const runtime = "edge";

export const metadata = generateMetadataTitle("設定");

export default async function Settings() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/settings"));
  }

  return (
    <Layout current="設定">
      <h2 className="font-bold text-xl">アカウント</h2>
      <LogoutButton />

      <h2 className="mt-12 font-bold text-xl">退会</h2>
      <Button
        className="mt-4 block w-full border-0 bg-rose-700 text-background text-sm md:max-w-48"
        asChild
      >
        <Link href="/settings/goodbye">アカウントを削除</Link>
      </Button>

      <Footer className="mt-16 text-center md:hidden" />
    </Layout>
  );
}
