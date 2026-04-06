import { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = {
  title: "Friends Management"
}

const Page = async () => {
  return <View />
}

export default Page;
