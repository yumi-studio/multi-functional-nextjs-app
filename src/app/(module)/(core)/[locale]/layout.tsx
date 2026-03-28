import { cn } from "@/app/lib/utils";
import Image from "next/image";
import HeaderRight from "../ui/header/HeaderRight";
import Navigator from "../ui/header/Navigator";
import Logo from "../ui/header/Logo";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={cn([
      'w-svw h-svh relative z-0 bg-white',
      'dark:bg-gray-900'
    ])}>
      {/* Fixed top header */}
      <header className="group/l1 border-b border-b-white absolute z-10 top-0 left-0 right-0 backdrop-blur-md">
        <div className={cn([
          "transition-opacity bg-white opacity-25 absolute top-0 left-0 w-full h-full -z-1",
          "group-hover/l1:opacity-50"
        ])}></div>
        {/* Header wrapper */}
        <div className="h-16 w-full max-w-7xl mx-auto flex items-center justify-between px-3">
          {/* Logo */}
          <div className="flex-auto h-full py-3">
            <Logo />
          </div>

          {/* Navigator */}
          <div className="w-full max-w-3xl h-full py-3 mx-auto">
            <Navigator />
          </div>

          {/* Account menu */}
          <div className="flex-auto h-full py-3">
            <HeaderRight />
          </div>
        </div>
      </header>

      {/* Fixed background */}
      <div className="absolute top-0 left-0 w-full h-full -z-1">
        <Image src="/fakebook-bg.png" alt="zzz" width="1280" height="720" className="w-full h-full object-cover" />
      </div>

      {/* Main page sections */}
      <main className="w-full h-full max-w-7xl mx-auto overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout;
