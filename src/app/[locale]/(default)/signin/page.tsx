"use client";

import { HOME_URL } from "@/app/lib/url_paths";
import { useUserStore } from "@/app/stores/user-store";
import LoginForm from "@/app/ui/login/form";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect } from "react";

export default function Page() {
  const isLoggedIn = useUserStore(state => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push(HOME_URL);
    }
  });

  if (isLoggedIn) {
    return;
  }

  return (
    <div className="page-signup relative h-svh w-svw flex items-center">
      <div className="absolute top-0 left-0 w-full h-full z-[-2]">
        <Image src="/fakebook-bg.png" width={640} height={640 * 3 / 4} alt="Fakebook Background" className="object-cover w-full h-full" />
      </div>
      <div className="w-full h-full absolute z-[-1] bg-transparent backdrop-blur-md"></div>
      <LoginForm />
    </div>
  );
}
