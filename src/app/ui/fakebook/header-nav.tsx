"use client";

import { FAKEBOOK_FRIEND_URL, FAKEBOOK_GROUP_URL, FAKEBOOK_NEWSFEED_URL, FAKEBOOK_SEARCH_URL, FAKEBOOK_URL, HOME_URL, SIGNIN_URL, SIGNUP_URL } from "@/app/lib/url_paths";
import { profileService } from "@/app/services/fakebook/profile.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { faArrowLeft, faNewspaper, faPlus, faSearch, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { CircleIconButton } from "../buttons";
import { useAppContext } from "@/app/context/AppContext";

const navItemClass = "flex-auto shrink-0 flex flex-wrap items-end justify-center py-3 text-lg relative border-t-2 border-t-gray-300";
const navItemActiveClass = "flex-auto shrink-0 flex flex-wrap items-end justify-center py-3 text-lg relative border-t-2 border-t-blue-600 bg-blue-100";
const navItemIconClass = "w-full mt-auto text-center text-gray-600";
const navItemActiveIconClass = "w-full mt-auto text-center text-blue-600";

const mainMenuItems = [
  { icon: faNewspaper, path: FAKEBOOK_NEWSFEED_URL },
  { icon: faUserPlus, path: FAKEBOOK_FRIEND_URL },
  { icon: faUsers, path: FAKEBOOK_GROUP_URL },
  { icon: faSearch, path: FAKEBOOK_SEARCH_URL },
]

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const activeProfile = useFakebookStore(state => state.activeProfile);
  const setActiveProfile = useFakebookStore(state => state.setActiveProfile);
  const setNewPostModalOpen = useFakebookStore(state => state.setNewPostModalOpen);
  const { userBehavior } = useAppContext();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const newPostBtnRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!newPostBtnRef.current) return;

    if (userBehavior.scrollDirection === "up") {
      newPostBtnRef.current.style.opacity = "1";
      newPostBtnRef.current.style.scale = "1";
    } else if (userBehavior.scrollDirection === "down") {
      newPostBtnRef.current.style.opacity = "0";
      newPostBtnRef.current.style.scale = "0";
    }
  }, [userBehavior]);

  return (
    <header className="w-full bg-white fixed bottom-0 left-0 z-10">
      <div className="nav-wrapper ml-auto flex-auto flex justify-between">
        {mainMenuItems.map((menu, index) => {
          const isActive = menu.path === pathname;
          return (
            <Link key={index} href={menu.path} className={isActive ? navItemActiveClass : navItemClass} >
              <div className={isActive ? navItemActiveIconClass : navItemIconClass}>
                <FontAwesomeIcon icon={menu.icon} />
              </div>
            </Link>
          )
        })}
        <div className={navItemClass} onClick={() => { setMenuOpen(true) }}>
          <div className={pathname === null ? navItemActiveIconClass : navItemIconClass}><FontAwesomeIcon icon={faBars} /></div>
        </div>
      </div>
      {pathname === FAKEBOOK_NEWSFEED_URL && (
        <div
          className="absolute z-10 right-3 bottom-full mb-3 w-14 h-14 rounded-full shadow-md bg-blue-100 text-blue-600 transition-all"
          ref={newPostBtnRef}>
          <CircleIconButton icon={faPlus} aria-label="New Post" className="w-full h-full" size="medium" color="inherit"
            onClick={() => setNewPostModalOpen(true)}
          />
        </div>
      )}
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
