"use client";

import { useAppContext } from "@/app/context/AppContext";
import { API_AUTH_EXTERNAL_LOGIN } from "@/app/services/api-endpoints";
import { authService } from "@/app/services/auth.service";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SsoForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const redirectUrl = new URL(redirectPath, process.env.NEXT_PUBLIC_APP_URL).toString();
  const [externalAuth, setExternalAuth] = useState<{ [key: number]: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { success, data } = await authService.externalProviders();
      if (success) {
        setExternalAuth(data);
      }
    })();
  }, []);

  return (
    <div>
      <div className="text-center mb-2 flex justify-center items-center gap-3 px-3">
        <div className="h-[1px] bg-gray-400 flex-auto"></div>
        <div>Or</div>
        <div className="h-[1px] bg-gray-400 flex-auto"></div>
      </div>
      <div className="flex flex-col gap-3 mb-3">
        {externalAuth && Object.entries(externalAuth).map(entry => (
          <Link href={API_AUTH_EXTERNAL_LOGIN.replace("{provider}", entry[0]) + "?redirect=" + redirectUrl} key={entry[0]}>
            <Button type="button" size="small" variant="outlined" fullWidth>{entry[1]}</Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
