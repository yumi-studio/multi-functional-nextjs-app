"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OFFLINE_ACCOUNT_LOGIN_URL } from "@/app/lib/url_paths";
import { Box, CircularProgress } from "@mui/material";
import { useAccountStore } from "@/app/lib/offline-apps/modules/account/account.store";
import { useBackupStore } from "@/app/lib/offline-apps/modules/backup/backup.store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { currentAccount, isInitialized, initDB: initAccountDB } = useAccountStore();
  const { currentBackup, initDB: initBackupDB } = useBackupStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAndCheck = async () => {
      try {
        await initAccountDB();
        await initBackupDB();
        
        // Check after a small delay to ensure state is updated
        setTimeout(() => {
          const { currentAccount: account } = useAccountStore.getState();
          if (!account) {
            router.push(OFFLINE_ACCOUNT_LOGIN_URL);
          } else {
            setIsLoading(false);
          }
        }, 100);
      } catch (error) {
        console.error("Error initializing DB:", error);
        router.push(OFFLINE_ACCOUNT_LOGIN_URL);
      }
    };

    initializeAndCheck();
  }, [router, initAccountDB, initBackupDB]);

  if (isLoading || !isInitialized) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentAccount) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
