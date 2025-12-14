"use client";

import { UserDetail } from "@/app/lib/definitions";
import { create } from "zustand";

export type UserState = {
  isLoggedIn: boolean,
  userDetail: UserDetail | null;
  setIsLoggedIn: (value: boolean) => void;
  setUserDetail: (userDetail: UserDetail | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  userDetail: null,
  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  setUserDetail: (userDetail: UserDetail | null) => set({ userDetail }),
}))
