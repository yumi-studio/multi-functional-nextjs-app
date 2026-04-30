import { Metadata } from "next";
import View from "@/app/(module)/(core)/[locale]/home/view";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return <View />;
}
