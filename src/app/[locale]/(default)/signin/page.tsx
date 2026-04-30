"use client";

import { useEffect } from "react";
import Image from "next/image";
import { HOME_URL } from "@/app/lib/url_paths";
import { useUserStore } from "@/app/stores/user-store";
import { useRouter } from "@/i18n/navigation";
import LoginForm from "@/app/ui/signin/form";

export default function Page() {
  const userDetail = useUserStore(state => state.userDetail);
  const router = useRouter();

  useEffect(() => {
    if (userDetail) {
      router.push(HOME_URL);
    }
  }, [userDetail]);

  if (userDetail) {
    return;
  }

  return (
    <div className="relative h-full w-full flex items-center">
      <LoginForm />
    </div>
  );
}
