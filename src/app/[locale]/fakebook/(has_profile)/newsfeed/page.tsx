import { Metadata } from "next";
import View from "@/app/(module)/(md_fakebook)/[locale]/fakebook/(has_profile)/newsfeed/view";

export const metadata: Metadata = {
  title: "News feed",
};

export default async function Page() {
  return <View />
}
