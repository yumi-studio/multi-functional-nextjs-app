"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { SIGNIN_URL } from "@/app/lib/url_paths";
import { Button, Dialog } from "@mui/material";

export default function NoAuth() {
  const path = usePathname();
  const loginUrl = SIGNIN_URL + "?redirect=" + path;

  return (
    <>
      <Dialog open>
        <div className="p-2">
          <p className="mb-2"><b>Login required.</b></p>
          <Button type="button" variant="contained" size="small">
            <Link href={loginUrl}>Go to login</Link>
          </Button>
        </div>
      </Dialog>
    </>
  )
}
