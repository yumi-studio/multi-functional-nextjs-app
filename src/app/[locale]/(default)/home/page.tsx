import { Metadata } from "next";
import AccountBar from "@/app/ui/home/account-bar";
import AppNavigation from "@/app/ui/home/app-navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <>
      <div className="w-full max-w-80 m-auto h-svh px-2">
        <AccountBar />
        {/* <div className="h-0.5 bg-gray-800"></div> */}
        <hr color="black" />
        <AppNavigation />
      </div>
    </>
  );
}
