"use client";

import { cn } from "@/app/lib/utils";

const Logo = () => {
  return (
    <div className={cn([
      "border-3 h-full w-36 flex items-center justify-center bg-white text-gray-700 rounded-lg",
    ])}>
      <div className="inline-flex items-center justify-center font-bold">NTD Solutions</div>
    </div>
  )
}

export default Logo;
