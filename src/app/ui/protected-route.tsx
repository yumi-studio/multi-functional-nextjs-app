"use client";

import NoAuth from "./no-auth";
import { useUserStore } from "@/app/stores/user-store";
import { useEffect } from "react";
import { getActiveProfileId } from "@/app/lib/fakebook/actions";
import { profileService } from "@/app/services/fakebook/profile.service";
import { useFakebookStore } from "../stores/fakebook-store";

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
