"use client";

import NoAuth from "./no-auth";
import { useUserStore } from "@/app/stores/user-store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useUserStore(state => state.isLoggedIn);

  if (!isLoggedIn) {
    return <NoAuth />
  } else {
    return <>{children}</>;
  }
}
