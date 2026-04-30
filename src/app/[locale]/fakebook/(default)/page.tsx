import { Metadata } from "next";
import View from "@/app/(module)/(md_fakebook)/[locale]/fakebook/(default)/view";

export const metadata: Metadata = {
  title: "Home"
}

export default async function Page() {
  return (
    <View />
  )
}
