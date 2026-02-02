"use client";

import { SIGNIN_URL, SIGNUP_URL } from "@/app/lib/url_paths";
import { authService } from "@/app/services/auth.service";
import { useUserStore } from "@/app/stores/user-store";
import { Link } from "@/i18n/navigation";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AccountBar() {
  const t = useTranslations();
  const userDetail = useUserStore(state => state.userDetail);
  const setUserDetail = useUserStore(state => state.setUserDetail);
  const [showLogout, setShowLogout] = useState(false);

  const onLogoutConfirm = async () => {
    setShowLogout(false);
    const { success } = await authService.logout();
    if (success) {
      setUserDetail(null);
    }
  }

  const onLogoutCancel = () => {
    setShowLogout(false);
  }

  return (
    <div className="top-nav flex gap-2 py-2">
      {userDetail && (
        <div className="w-full flex justify-between items-center">
          <span>Welcome, {userDetail.firstName} {userDetail.lastName}!</span>
          <Button type="button" variant="contained" size="small" onClick={() => setShowLogout(true)}>Logout</Button>
          {showLogout && (
            <div className="fixed top-1/2 left-1/2 z-[99999] transform -translate-1/2 w-9/12 h-auto bg-white border rounded-md">
              <div className="p-2 text-center">Are you sure?</div>
              <hr />
              <div className="p-2 flex gap-2 justify-center">
                <Button variant="contained" type="button" className="flex-auto" onClick={() => onLogoutConfirm()}>Yes</Button>
                <Button variant="outlined" type="button" className="flex-auto" onClick={() => onLogoutCancel()}>No</Button>
              </div>
            </div>
          )}
        </div>
      )}
      {!userDetail && (
        <div className="w-full flex gap-2">
          <Button type="button" variant="contained">
            <Link href={SIGNIN_URL}>{t("page.title.signin")}</Link>
          </Button>
          <Button type="button" variant="outlined">
            <Link href={SIGNUP_URL}>{t("page.title.signup")}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
