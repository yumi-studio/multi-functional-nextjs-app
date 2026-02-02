"use client";

import { FAKEBOOK_PROFILE_URL, FAKEBOOK_URL, HOME_URL, SIGNIN_URL, SIGNUP_URL } from "@/app/lib/url_paths";
import { profileService } from "@/app/services/fakebook/profile.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { useUserStore } from "@/app/stores/user-store";
import { Link } from "@/i18n/navigation";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowLeftLong, faPager, faSearch, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, EventHandler, MouseEvent, MouseEventHandler, useEffect, useRef, useState } from "react";

const navItemClass = "flex flex-wrap items-end justify-center py-2 gap-y-1";
const navItemIconClass = "w-full mt-auto text-center";
const navItemTextClass = "text-xs";
const navItemActiveIconClass = navItemIconClass
  + " border-[2px] rounded-full bg-blue-400 text-white absolute bottom-full transform translate-y-1/2"
  + " aspect-square max-w-14 flex items-center justify-center text-sm"
  + " ";
const navItemActiveTextClass = "text-sm font-bold border-b"

export default function HeaderNav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const activeProfile = useFakebookStore(state => state.activeProfile);
  const setActiveProfile = useFakebookStore(state => state.setActiveProfile);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const onChangeAvatarClick = (e: MouseEvent) => {
    avatarInputRef.current?.click();
  }

  const onAvatarInputChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ?? [];
    if (files.length === 0) return;

    const result = await profileService.updateAvatar({ file: files[0] });

    if (activeProfile && result.success && result.data) {
      setActiveProfile({ ...activeProfile, avatarUrl: result.data });
    }
  }

  return (
    <header className="w-full bg-white absolute bottom-0 left-0 z-10">
      <div className="nav-wrapper ml-auto flex-auto flex justify-between px-3">
        <div className={navItemClass} onClick={() => setSearchOpen(true)}>
          <div className={navItemIconClass}><FontAwesomeIcon icon={faPager} width="1rem" height="1rem" /></div>
          <div className={navItemTextClass}>Pages</div>
        </div>
        <div className={navItemClass} onClick={() => setSearchOpen(true)}>
          <div className={navItemIconClass}><FontAwesomeIcon icon={faUserGroup} width="1rem" height="1rem" /></div>
          <div className={navItemTextClass}>Groups</div>
        </div>
        <div className={navItemClass} onClick={() => setSearchOpen(true)}>
          <div className={navItemActiveIconClass}><FontAwesomeIcon className="" icon={faHome} width="1rem" height="1rem" /></div>
          <div className={navItemActiveTextClass}>Home</div>
        </div>
        <div className={navItemClass} onClick={() => setSearchOpen(true)}>
          <div className={navItemIconClass}><FontAwesomeIcon icon={faSearch} width="1rem" height="1rem" /></div>
          <div className={navItemTextClass}>Search</div>
        </div>
        <div className={navItemClass} onClick={() => { setMenuOpen(true) }}>
          <div className={navItemIconClass}><FontAwesomeIcon className="" icon={faBars} width="1rem" height="1rem" /></div>
          <div className={navItemTextClass}>Menu</div>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 z-10`}>
        <div
          className={`h-svh absolute bottom-0 right-0 bg-black transition-opacity ease-in-out duration-200 ${menuOpen ? "opacity-50 w-full" : "opacity-0 w-0"}`}
          onClick={() => setMenuOpen(false)}></div>
        <nav className={
          `main-nav transition-all ease-in-out duration-200 absolute z-10 bottom-0 right-0 h-svh bg-white overflow-hidden ${menuOpen ? "opacity-100 w-80" : "opacity-0 w-0"}`
        }>
          <div className="nav-inner p-3 w-80 flex flex-col h-full">
            {activeProfile && (
              <>
                <div className="mb-3 text-center">
                  <div className="bg-gray-200 w-xs aspect-square max-w-full m-auto rounded-full overflow-hidden border-4 border-gray-500"
                    onClick={onChangeAvatarClick}
                  >
                    {activeProfile?.avatarUrl && (
                      <Image src={activeProfile?.avatarUrl} alt="Avatar"
                        className="w-full h-full object-cover object-center" width={240} height={240} />
                    )}
                    {!activeProfile?.avatarUrl && (
                      <FontAwesomeIcon className="min-w-full min-h-full" icon={faUser} widthAuto size="10x" color="gray" />
                    )}
                    <input type="file" accept="image/*" ref={avatarInputRef} onChange={onAvatarInputChanged} hidden />
                  </div>
                  <div className="mt-3 flex justify-between items-center gap-2">
                    <div className="flex-auto p-2 bg-gray-200 rounded-md wrap-break-word">
                      <b>{activeProfile.name}</b>
                    </div>
                    <Link href={FAKEBOOK_URL}>
                      <Button type="button" size="small">Switch</Button>
                    </Link>
                  </div>
                </div>
                <div className="mb-3 p-2 bg-gray-200 rounded-md">Newsfeed</div>
                <div className="mb-3 p-2 bg-gray-200 rounded-md">Stories</div>
                <div className="mb-3 p-2 bg-gray-200 rounded-md">Profile</div>
                <div className="mb-3 p-2 bg-gray-200 rounded-md">Settings</div>
              </>
            )}
            {!activeProfile && (
              <>
                <div className="mb-3 p-2 bg-gray-200 rounded-md" onClick={() => router.push(SIGNIN_URL)} >Login</div>
                <div className="p-2 bg-gray-200 rounded-md" onClick={() => router.push(SIGNUP_URL)} >Register</div>
              </>
            )}
            <div className="mt-auto p-2 bg-gray-200 rounded-md">
              <Link href={HOME_URL}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="inline-block ml-2">Browse Apps</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className={`fixed bottom-0 left-0 right-0 z-10 `}>
        <div
          className={`h-svh absolute bottom-0 right-0 bg-black transition-all ease-in-out duration-200 ${searchOpen ? "opacity-50 w-full" : "opacity-0 w-0"}`}
          onClick={() => setSearchOpen(false)}></div>
        <div className={
          `transition-all ease-in-out duration-200 fixed z-10 bottom-0 right-0 h-svh bg-white overflow-hidden ${searchOpen ? "opacity-100 w-full" : "opacity-0 w-0"}`
        }>
          <div className="w-svw flex flex-col relative">
            <div className="results flex-auto h-[100px]">
              <div className="h-[2000px]">Bruh</div>
            </div>
            <div className="w-full sticky bottom-0 p-2 bg-white border-t border-gray-300 flex gap-2 flex-wrap">
              <input type="text" className="w-full outline-none border rounded-sm p-2" />
              <button className="flex-auto p-2 bg-gray-500 rounded-sm" onClick={() => setSearchOpen(false)}>Close</button>
              <button className="flex-auto p-2 bg-blue-300 rounded-sm" onClick={() => { }}>Search</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
