"use client";

import { User } from "@/modules/freechat/shared/types";
import { createContext, useContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
})

export const AuthProvider = ({ children, initial }: { children: React.ReactNode; initial: AuthContextType }) => {
  return (
    <AuthContext.Provider value={initial}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
