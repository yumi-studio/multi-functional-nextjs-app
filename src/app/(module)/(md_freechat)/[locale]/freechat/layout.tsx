import { Metadata } from "next";
import { cn } from "@/app/lib/utils";
import styles from "./freechat.module.css";
import { Link } from "@/i18n/navigation";
import { testConnection } from "../../lib/data-center";

export const metadata: Metadata = {
  title: {
    template: "%s | Freechat",
    default: "Freechat"
  }
}

const Layout = async ({ params, children }: LayoutProps<'/[locale]/freechat'>) => {
  testConnection();
  return (
    <div className={cn([
      styles.theme,
      "w-svw h-svh overflow-auto relative bg-(--fc-background)",
    ])}>
      {children}

      {/* Quick navigation */}
      <div className="fixed top-0 left-0 flex flex-col gap-2 p-2 bg-black/80">
        <Link href={'/freechat/login'}>Login</Link>
        <Link href={'/freechat/room'}>Chatroom</Link>
        <Link href={'/freechat/account'}>Account</Link>
      </div>
    </div>
  )
}

export default Layout;
