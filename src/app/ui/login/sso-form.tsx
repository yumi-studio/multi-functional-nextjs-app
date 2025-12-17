"use client";

import { useAppContext } from "@/app/context/AppContext";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function SsoForm() {
  const appCtx = useAppContext();
	const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
	const redirectUrl = new URL(redirectPath, process.env.NEXT_PUBLIC_APP_URL).toString();
	const loginGoogleUrl = process.env.NEXT_PUBLIC_API_HOST + "/api/v1/auth/login-google?redirect=" + redirectUrl;

	return (
		<div>
			<div className="text-center mb-2 flex justify-center items-center gap-3 px-3">
				<div className="h-[1px] bg-gray-400 flex-auto"></div>
				<div>Or</div>
				<div className="h-[1px] bg-gray-400 flex-auto"></div>
			</div>
			<div className="flex flex-col gap-3 mb-3">
				<Link href={loginGoogleUrl}>
					<Button type="button" size="small" variant="outlined" fullWidth>Google</Button>
				</Link>
				<Button type="button" size="small" variant="outlined" fullWidth onClick={() => appCtx.alertInDevelop()}>Facebook</Button>
				<Button type="button" size="small" variant="outlined" fullWidth onClick={() => appCtx.alertInDevelop()}>Microsoft</Button>
			</div>
		</div>
	)
}
