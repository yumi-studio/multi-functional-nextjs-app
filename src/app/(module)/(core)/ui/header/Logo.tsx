"use client";

import { cn } from "@/app/lib/utils";

const Logo = () => {
  return (
    <div className={cn([
      "border border-white h-full w-36 flex items-center justify-center bg-white transition-colors rounded-full",
    ])}>
      <div className="inline-flex items-center justify-center font-bold">YUMI Studio</div>
    </div>
  )
}

export default Logo;
