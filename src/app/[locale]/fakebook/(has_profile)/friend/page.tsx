import { Metadata } from "next";
import View from "@/app/(module)/(md_fakebook)/[locale]/fakebook/(has_profile)/friend/view";

export const metadata: Metadata = {
  title: "Friends Management"
}

const Page = async () => {
  return <View />
}

export default Page;
