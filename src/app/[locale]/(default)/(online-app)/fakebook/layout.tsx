import { Metadata } from "next";
import Image from "next/image";
import ProtectedRoute from "@/app/ui/protected-route";
import { FakebookProvider } from "@/app/context/FakebookContext";

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
    <div id="fakebook-app"
      className="bg-gray-200 w-full max-w-3xl mx-auto overflow-auto relative select-none z-0">
      <div className="fixed top-0 left-0 w-full h-svh -z-1">
        <div className="absolute top-0 left-0 right-0 bottom-0 z-1 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm">
        </div>
        <Image src="/fakebook-bg.png" width={1920} height={1080} alt="Fakebook Background" className="object-cover w-full h-full relative z-0" />
      </div>
      <ProtectedRoute>
        <FakebookProvider>
          {children}
        </FakebookProvider>
      </ProtectedRoute>
    </div>
  );
}
