import { Metadata } from "next";
import Image from "next/image";
import ProtectedRoute from "@/app/ui/protected-route";

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
      className="flex flex-col items-start bg-gray-200 h-svh overflow-hidden relative select-none z-0">
      <div className="absolute top-0 left-0 w-full h-full -z-1">
        <Image src="/fakebook-bg.png" width={1920} height={1080} alt="Fakebook Background" className="object-cover w-full h-full" />
      </div>
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
}
