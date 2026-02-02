"use client";

import { useEffect } from "react";
import NoAuth from "./no-auth";
import { useUserStore } from "@/app/stores/user-store";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userDetail = useUserStore(state => state.userDetail);

  if (!userDetail) {
    return <NoAuth />;
  }

  return children;
}
