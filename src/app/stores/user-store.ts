"use client";

import { UserDetail } from "@/app/lib/definitions";
import { create } from "zustand";

export type UserState = {
  userDetail: UserDetail | null;
  setUserDetail: (userDetail: UserDetail | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userDetail: null,
  setUserDetail: (userDetail: UserDetail | null) => set({ userDetail }),
}))
