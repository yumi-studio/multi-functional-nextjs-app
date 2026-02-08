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
      <main className="relative z-9 main-content w-full flex flex-auto overflow-auto">
        <section className="w-full overflow-auto p-3">
          {children}
        </section>
      </main>
    </>
  );
}
