"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/app/stores/user-store";
import { SIGNIN_URL } from "../lib/url_paths";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userLoading = useUserStore(state => state.userLoading);
  const userDetail = useUserStore(state => state.userDetail);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !userDetail) {
      router.push(SIGNIN_URL);
    }
  }, [userDetail, userLoading]);

  return children;
}
