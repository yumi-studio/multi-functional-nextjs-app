"use client";

import { cn } from "@/app/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";

const HeaderNavLink = ({ url, title }: { url: string, title: string }) => {
  const pathname = usePathname();
  const isActive = pathname === url;
  
  return (
    <Link href={url} className={cn([
      "h-full p-3 flex-auto text-white inline-flex items-center justify-center border border-transparent",
      isActive ? "bg-white text-gray-900" : "bg-transparent",
      "first:rounded-l-full last:rounded-r-full",
      "hover:bg-white hover:text-gray-900",
      "transition-all",
    ])}>
      <span className="uppercase">{title}</span>
    </Link>
  )
}

export default HeaderNavLink;
