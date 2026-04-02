"use client";

import { cn } from "@/app/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";

const HeaderNavLink = ({ url, title, icon }: { url: string, title: string, icon?: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <Link href={url} className={cn([
      "h-full p-3 text-gray-700 inline-flex items-center justify-center border-b-2 border-transparent",
      isActive ? "border-b-gray-700" : "hover:border-b-gray-700",
      "transition-all",
    ])}>
      {icon && <span className="mr-2">{icon}</span>}
      <span className="font-bold uppercase">{title}</span>
    </Link>
  )
}

export default HeaderNavLink;
