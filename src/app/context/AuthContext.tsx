"use client"

import { createContext, useContext, useEffect } from "react"
import { useUserStore } from "@/app/stores/user-store"
import { userService } from "@/app/services/user.service";
import apiClient from "@/app/services/api-client";
import { HttpStatusCode } from "axios";

type AuthContextType = {};

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUserDetail = useUserStore(state => state.setUserDetail);
  const isLoggedIn = useUserStore(state => state.isLoggedIn);
  const setIsLoggedIn = useUserStore(state => state.setIsLoggedIn);

  useEffect(() => {
    const checkResponseUnauthorized = apiClient.interceptors.response.use(
      (res) => {
        if (res.status === HttpStatusCode.Unauthorized) {
          setIsLoggedIn(false);
        }

        return res.data;
      },
      (error) => {
        Promise.reject(error)
      }
    );

    return () => {
      apiClient.interceptors.response.eject(checkResponseUnauthorized);
    }
  });

  useEffect(() => {
    userService.me()
      .then(result => {
        if (result.success && result.data) {
          setUserDetail(result.data);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(err => {
        setIsLoggedIn(false);
      });
  });

  useEffect(() => {
    if (isLoggedIn) {
      userService.me()
        .then(result => {
          if (result.success && result.data) {
            setUserDetail(result.data);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(err => {
          setIsLoggedIn(false);
        });
    }
  }, [isLoggedIn, setIsLoggedIn, setUserDetail])

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
