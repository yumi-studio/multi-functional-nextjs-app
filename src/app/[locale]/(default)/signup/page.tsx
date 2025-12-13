import SignUpForm from "@/app/ui/signup/form";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register"
}

export default function Page() {
  return (
    <div className="page-signup relative h-svh w-svw flex items-center">
      <div className="absolute top-0 left-0 w-full h-full z-[-2]">
        <Image src="/fakebook-bg.png" width={640} height={640 * 3 / 4} alt="Fakebook Background" className="object-cover w-full h-full" />
      </div>
      <div className="w-full h-full absolute z-[-1] bg-transparent backdrop-blur-md"></div>
      <SignUpForm />
    </div>
  )
}
