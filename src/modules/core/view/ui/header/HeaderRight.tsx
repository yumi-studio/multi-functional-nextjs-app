"use client";

import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import { faUser, faChevronDown, faChevronUp, faCircleArrowRight, faDoorClosed, faSignOut, faSignIn, faFlagUsa } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from "react-toastify";
import { cn } from "@/app/lib/utils";
import ThemeSwitcher from "@/app/ui/theme-switcher";
import { useUserStore } from "@/app/stores/user-store";
import { Link, redirect, usePathname, useRouter } from "@/i18n/navigation";
import { ACCOUNT_URL, SIGNIN_URL, SIGNUP_URL } from "@/app/lib/url_paths";
import { authService } from "@/app/services/auth.service";
import { useLocale } from "next-intl";

const AccountMenuItem = ({ title, icon, url, onClick }: { title: string, icon?: IconProp, url: string, onClick?: () => void }) => {
  return (
    <Link href={url} className={cn([
      "flex items-center justify-center gap-1 px-2 py-1 transition-colors",
      "hover:bg-gray-300"
    ])}
      onClick={onClick}
    >
      <span className="whitespace-nowrap capitalize">{title}</span>
      {icon && <FontAwesomeIcon icon={icon} fontSize="1rem" />}
    </Link>
  );
}

const LogoutButton = () => {
  const setUserDetail = useUserStore(state => state.setUserDetail);
  const handleLogoutClick = async () => {
    const { success } = await authService.logout();
    if (success) {
      setUserDetail(null);
      toast.success("Logout successfully!");
    } else {
      toast.error("Failed to logout.");
    }
  }

  return (
    <button className={cn([
      "flex items-center justify-center gap-2 w-full cursor-pointer text-red-600 border-t px-2 py-1 rounded-b-lg transition-colors",
      "hover:bg-red-600 hover:text-white"
    ])}
      onClick={handleLogoutClick}>
      <span className="whitespace-nowrap font-semibold">Logout</span>
      <FontAwesomeIcon icon={faSignOut} fontSize="1rem" />
    </button>
  )
}

type LocaleMenuItemProps = { title: string, locale: string, switchLocale: (locale: string) => void };
const LocaleMenuItem = ({ title, locale, switchLocale }: LocaleMenuItemProps) => {
  const currentLocale = useLocale();

  return (
    <div className={cn([
      "text-center",
      currentLocale === locale ? "bg-blue-100" : "hover:bg-blue-300",
    ])}>
      <span onClick={() => switchLocale(locale)}>{title}</span>
    </div>
  );
}

const HeaderRight = () => {
  const [open, setOpen] = useState(false);
  const currentLocale = useLocale();
  const router = useRouter();

  const switchLocale = useCallback((locale: string) => {
    Cookies.set('locale', locale);
    router.refresh();
    setOpen(false);
  }, [router]);

  return (
    <div className="w-full h-full inline-flex items-center justify-end relative gap-3">
      {/* <div className="inline-flex items-center justify-center h-full px-3 border border-white rounded-full cursor-pointer relative"
        onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faUser} fontSize="1rem" color="white" />
        {userDetail && (
          <span className="inline-block text-white font-semibold px-1">Hi, {userDetail.firstName}</span>
        )}
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} fontSize="1rem" color="white" />
        <div className={cn([
          open ? "scale-y-100" : "scale-y-0",
          "absolute z-10 top-full right-0 w-auto min-w-36 mt-1 flex flex-col shadow-md rounded-b-xl",
          "transition-transform origin-top"
        ])}>
          <div className="z-10 relative bg-white rounded-xl overflow-hidden">
            {userDetail ? (
              <>
                <AccountMenuItem title="Account center" url={ACCOUNT_URL} />
                <LogoutButton />
              </>
            ) : (
              <>
                <AccountMenuItem title="Login" icon={faSignIn} url={SIGNIN_URL} onClick={() => setOpen(false)} />
                <AccountMenuItem title="Register" icon={faSignIn} url={SIGNUP_URL} onClick={() => setOpen(false)} />
              </>
            )}
          </div>
        </div>
      </div> */}
      {/* <div className="hidden items-center shrink-0">
        <ThemeSwitcher height={36} width={36} />
      </div> */}
      <div className="inline-flex items-center justify-end relative gap-3">
        {/* Language selector */}
        <div className="inline-flex items-center relative cursor-pointer">
          <span
            className="text-gray-700 font-bold inline-flex items-center justify-center gap-1"
            onClick={() => setOpen(!open)}>
            <span>{currentLocale.toUpperCase()}</span>
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} fontSize="1rem" />
          </span>
          <div className={cn([
            open ? "scale-y-100" : "scale-y-0",
            "absolute z-10 top-full right-0 w-full mt-1 flex flex-col shadow-md",
            "transition-transform origin-top"
          ])}>
            <div className="z-10 relative bg-white border border-white rounded-md overflow-hidden">
              <LocaleMenuItem title="EN" locale="en" switchLocale={switchLocale} />
              <LocaleMenuItem title="VN" locale="vi" switchLocale={switchLocale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderRight;
