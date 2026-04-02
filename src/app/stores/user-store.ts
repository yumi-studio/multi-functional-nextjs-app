"use client";

import { UserDetail } from "@/app/lib/definitions";
import { create } from "zustand";

export type UserState = {
  userLoading: boolean;
  userDetail: UserDetail | null;
  setUserDetail: (userDetail: UserDetail | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userLoading: true,
  userDetail: null,
  setUserDetail: (userDetail: UserDetail | null) => set({ userDetail, userLoading: false }),
}))
