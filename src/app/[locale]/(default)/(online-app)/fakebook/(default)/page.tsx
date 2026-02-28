import { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = {
  title: "Home"
}

export default async function Page() {
  return (
    <View />
  )
}
