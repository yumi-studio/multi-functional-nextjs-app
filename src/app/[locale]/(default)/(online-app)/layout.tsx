import { AuthProvider } from "@/app/context/AuthContext";

const OnlineAppLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>{children}</AuthProvider>
  )
}

export default OnlineAppLayout;
