"use client"

import { createContext, useContext, useEffect } from "react"
import { useUserStore } from "@/app/stores/user-store"
import { userService } from "@/app/services/user.service";
import apiClient from "@/app/services/api-client";
import { HttpStatusCode } from "axios";

type AuthContextType = {};

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useUserStore(state => state.initializeAuth);
  const isLoggedIn = useUserStore(state => state.isLoggedIn);
  const userDetail = useUserStore(state => state.userDetail);
  const setToken = useUserStore(state => state.setToken);
  const setUserDetail = useUserStore(state => state.setUserDetail);

  useEffect(() => {
    initializeAuth();

    const secureRequest = apiClient.interceptors.request.use(
      (config) => {
        const token = useUserStore.getState().token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );

    const checkResponseUnauthorized = apiClient.interceptors.response.use(
      (res) => {
        if (res.status === HttpStatusCode.Unauthorized) {
          setToken(null);
        }

        return res.data;
      },
      (error) => {
        Promise.reject(error)
      }
    );

    return () => {
      apiClient.interceptors.request.eject(secureRequest);
      apiClient.interceptors.response.eject(checkResponseUnauthorized);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && !userDetail) {
      userService.me()
        .then(result => {
          if (result.success && result.data) {
            setUserDetail(result.data);
          } else {
            setToken(null);
          }
        })
        .catch(err => {
          setToken(null);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userDetail]);

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
