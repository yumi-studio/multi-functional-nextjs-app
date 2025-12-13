"use client";

import { UserDetail } from "@/app/lib/definitions";
import { useEffect } from "react";
import { create } from "zustand";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";

export type UserState = {
  isLoggedIn: boolean,
  token: string | null,
  userDetail: UserDetail | null;
  setToken: (token: string | null) => void;
  setUserDetail: (userDetail: UserDetail | null) => void;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  userDetail: null,
  token: null,
  setToken: (token: string | null) => {
    if (token === null) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", token);
    }
    set({
      isLoggedIn: !!token,
      userDetail: null,
      token: token,
    });
  },
  setUserDetail: (userDetail: UserDetail | null) => set({ userDetail }),
  initializeAuth: () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      set({
        isLoggedIn: true,
        userDetail: null,
        token: storedToken,
      });
    }
  }
}))
