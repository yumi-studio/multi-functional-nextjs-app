"use client";

import { create } from "zustand";

type UserState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
}));
