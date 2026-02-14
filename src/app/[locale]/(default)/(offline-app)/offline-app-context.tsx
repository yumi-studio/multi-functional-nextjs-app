"use client";

import { createContext } from "react";
import { User } from "@/app/lib/offline-app/definitions";

type OfflineAppContextType = {
  user: User | null
}

const OfflineAppContext = createContext<OfflineAppContextType | null>(null);

export const OfflineAppProvider = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <OfflineAppContext.Provider value={{
      user: null
    }}>
      {children}
    </OfflineAppContext.Provider>
  )
}

export const useOfflineAppContext = () => {

}
