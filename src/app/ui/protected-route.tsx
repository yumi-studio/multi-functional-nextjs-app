"use client";

import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/app/stores/user-store";
import { SIGNIN_URL } from "../lib/url_paths";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userDetail = useUserStore(state => state.userDetail);
  const router = useRouter();

  useEffect(() => {
    if (!userDetail) {
      router.push(SIGNIN_URL);
    }
  }, [userDetail]);

  return children;
}
