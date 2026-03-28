"use client";

import { useState } from "react";
import { faUser, faChevronDown, faChevronUp, faCircleArrowRight, faDoorClosed, faSignOut, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/app/lib/utils";
import ThemeSwitcher from "@/app/ui/theme-switcher";
import { useUserStore } from "@/app/stores/user-store";
import { Link } from "@/i18n/navigation";
import { ACCOUNT_URL, SIGNIN_URL, SIGNUP_URL } from "@/app/lib/url_paths";
import { authService } from "@/app/services/auth.service";
import { toast } from "react-toastify";

const HeaderRight = () => {
  const [open, setOpen] = useState(false);
  const userDetail = useUserStore(state => state.userDetail);
  const setUserDetail = useUserStore(state => state.setUserDetail);
  const handleMouseLeave = () => {
    setOpen(false);
  }
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
    <div className="w-full h-full inline-flex items-center justify-end relative gap-3">
      <div className="inline-flex items-center justify-center h-full px-2 border border-white rounded-full cursor-pointer relative"
        onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faUser} fontSize="1rem" color="white" />
        {userDetail && (
          <span className="inline-block text-white font-semibold px-1">Hi, {userDetail.firstName}</span>
        )}
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} fontSize="1rem" color="white" />
        <div className={cn([
          open ? "scale-y-100" : "scale-y-0",
          "absolute z-10 top-full right-0 w-auto min-w-36 mt-1 flex flex-col shadow-md",
          "transition-transform origin-top"
        ])} onMouseLeave={handleMouseLeave}>
          <div className="z-10 relative bg-white border border-white rounded-2xl overflow-hidden">
            {userDetail ? (
              <>
                <Link href={ACCOUNT_URL} className="flex items-center justify-center p-2">
                  <span className="whitespace-nowrap">Account center</span>
                </Link>
                <hr className="text-gray-300" />
                <div className="m-1">
                  <button className="flex items-center justify-center gap-2 w-full text-left cursor-pointer text-red-400 border p-1 rounded-xl"
                    onClick={handleLogoutClick}>
                    <span className="whitespace-nowrap font-semibold">Logout</span>
                    <FontAwesomeIcon icon={faSignOut} fontSize="1rem" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-2 py-1 whitespace-nowrap " onClick={() => setOpen(false)}>
                  <Link href={SIGNIN_URL} className="flex items-center gap-2">
                    <span>Login</span>
                    <FontAwesomeIcon icon={faSignIn} fontSize="1rem" className="ml-auto" />
                  </Link>
                </div>
                <hr className="text-gray-300" />
                <div className="px-2 py-1 whitespace-nowrap" onClick={() => setOpen(false)}>
                  <Link href={SIGNUP_URL} className="flex items-center gap-2">
                    <span>Register</span>
                    <FontAwesomeIcon icon={faSignIn} fontSize="1rem" className="ml-auto" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="inline-flex items-center shrink-0">
        <ThemeSwitcher height={36} width={36} />
      </div>
    </div>
  )
}

export default HeaderRight;
