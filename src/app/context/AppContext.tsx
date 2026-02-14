"use client"

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { HttpStatusCode } from "axios";
import { userIdb } from "@/app/lib/indexDb";
import apiClient from "@/app/services/api-client";
import { useUserStore } from "@/app/stores/user-store";

type UserConfig = {
  remember_login: boolean;
  save_email: string;
  save_password: string;
}

type UserBehavior = {
  scrollDirection: 'none' | 'up' | 'down'
}

const AppContext = createContext<{
  isAppReady: boolean;
  userConfig: UserConfig;
  userBehavior: UserBehavior;
  alertInDevelop: () => void;
  setUserConfig: (userConfig: UserConfig) => void;
  setUserBehavior: Dispatch<SetStateAction<UserBehavior>>;
  showLoading: () => void;
  hideLoading: () => void;
} | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [loading, setLoading] = useState({
    enable: false,
    count: 0,
  });
  const [userConfig, setUserConfig] = useState<UserConfig>({
    remember_login: false,
    save_email: "",
    save_password: "",
  });
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    scrollDirection: 'none'
  });
  const setUserDetail = useUserStore(state => state.setUserDetail);

  const alertInDevelop = () => {
    toast("In develop ... or not", { theme: "light", transition: Bounce });
  }

  useEffect(() => {
    let lastScrollY = 0;
    let checkScrollTick = false;
    const eventBlockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    }
    const handleScroll = () => {
      let currentScrollY = window.scrollY;
      if (!checkScrollTick && lastScrollY !== currentScrollY) {
        checkScrollTick = true;
        setTimeout(() => {
          if (lastScrollY > currentScrollY) {
            setUserBehavior(prev => ({ ...prev, scrollDirection: 'down' }));
          } else if (lastScrollY < currentScrollY) {
            setUserBehavior(prev => ({ ...prev, scrollDirection: 'up' }));
          } else {
            setUserBehavior(prev => ({ ...prev, scrollDirection: 'none' }));
          }

          checkScrollTick = false;
        }, 100);
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener<"contextmenu">("contextmenu", eventBlockContextMenu);
    document.addEventListener<"scroll">("scroll", handleScroll);

    const checkResponseUnauthorized = apiClient.interceptors.response.use(
      (res) => {
        if (res.status === HttpStatusCode.Unauthorized) {
          setUserDetail(null);
        }

        return res.data;
      },
      (error) => {
        Promise.reject(error)
      }
    );

    (async () => {
      // Do all necessary loading before app ready
      const _userConfig = await userIdb.get('config');

      if (_userConfig) {
        setUserConfig({ ...userConfig, ..._userConfig });
      } else {
        userIdb.set('config', userConfig);
      }

      setIsAppReady(true);
    })();

    return () => {
      document.removeEventListener("contextmenu", eventBlockContextMenu);
      document.removeEventListener("scroll", handleScroll);
      apiClient.interceptors.response.eject(checkResponseUnauthorized);
    }
  }, []);

  useEffect(() => {
    userIdb.set('config', userConfig);
  }, [userConfig])

  return (
    <AppContext.Provider value={{
      isAppReady,
      userConfig,
      userBehavior,
      alertInDevelop,
      setUserConfig,
      setUserBehavior,
      showLoading: () => setLoading(prev => ({ enable: true, count: prev.count + 1 })),
      hideLoading: () => setLoading(prev => ({ enable: ((prev.count - 1) > 0), count: prev.count - 1 })),
    }}>
      {loading.enable && (
        <div className="flex items-center justify-center bg-gray-50 opacity-50 absolute z-[9999] top-0 left-0 w-svw h-svh">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {isAppReady && children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
