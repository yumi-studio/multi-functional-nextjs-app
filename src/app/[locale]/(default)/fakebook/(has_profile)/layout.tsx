import HeaderNav from "@/app/ui/fakebook/header-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | Fakebook`,
    default: "Fakebook",
  },
  description: "Just a very fake version of Facebook.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderNav />
      <main className="main-content w-full flex flex-auto overflow-auto">
        <aside className="left-side flex-auto px-3 py-2 invisible hidden xl:block">Left side</aside>
        <section className="w-full xl:flex-[1200px] xl:max-w-[1200px] overflow-auto p-3 h-full bg-[rgba(255,255,255,0.5)] backdrop-blur-sm no-scrollbar">
          {children}
        </section>
        <aside className="right-side flex-auto px-3 py-2 invisible hidden xl:block">Right side</aside>
      </main>
    </>
  );
}
