"use client"

import { createContext, useContext, useEffect } from "react"
import { useUserStore } from "@/app/stores/user-store"
import { userService } from "@/app/services/user.service";
import { useAppContext } from "./AppContext";

type AuthContextType = {};

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAppReady } = useAppContext();
  const setUserDetail = useUserStore(state => state.setUserDetail);

  useEffect(() => {
    if (!isAppReady) return;

    (async () => {
      try {
        const resultUserMe = await userService.me();
        if (resultUserMe.success && resultUserMe.data) {
          setUserDetail(resultUserMe.data);
        }
      } catch (err) {
        setUserDetail(null);
      }
    })();
  }, [isAppReady]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
