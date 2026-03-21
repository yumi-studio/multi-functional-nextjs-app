import { Metadata } from "next";
import AccountBar from "@/app/ui/home/account-bar";
import AppNavigation from "@/app/ui/home/app-navigation";
import View from "./view";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return <View />;
}
