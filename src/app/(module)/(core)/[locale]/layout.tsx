import { cn } from "@/app/lib/utils";
import HeaderRight from "../ui/header/HeaderRight";
import Navigator from "../ui/header/Navigator";

const Layout = async ({ children }: LayoutProps<'/'>) => {
  return (
    <div className={cn([
      'w-svw h-svh relative z-0 bg-white',
    ])}>
      {/* Fixed top header */}
      <header className="bg-blue-200 group/l1 border-b border-b-white absolute z-10 top-0 left-0 right-0  backdrop-blur-md rounded-b-lg">
        {/* Header wrapper */}
        <div className="h-16 w-full max-w-7xl mx-auto px-3 flex items-center relative">
          {/* Navigator */}
          <div className={cn([
            "w-full h-full flex-auto flex items-center"
          ])}>
            <Navigator />
          </div>

          {/* Account menu */}
          <div className="w-20 h-full py-3 ml-auto">
            <HeaderRight />
          </div>
        </div>
      </header>

      {/* Fixed starry background */}
      {/* <StarryBackground /> */}

      {/* Main page sections */}
      <main className="w-full h-full max-w-7xl mx-auto overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout;
