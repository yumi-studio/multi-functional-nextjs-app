import SignUpForm from "@/app/ui/signup/form";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register"
}

export default function Page() {
  return (
    <div className="relative h-full w-full flex items-center">
      <SignUpForm />
    </div>
  )
}
