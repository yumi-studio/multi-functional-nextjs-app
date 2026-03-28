"use client";

import { cn } from "@/app/lib/utils";
import HeaderNavLink from "./HeaderNavLink";
import { ABOUT_URL, CONTACT_URL, HOME_URL, PROJECTS_URL } from "@/app/lib/url_paths";

const Navigator = () => {
  return (
    <nav className={cn([
      "h-full flex justify-center items-center border border-white rounded-full",
    ])}>
      <HeaderNavLink url={HOME_URL} title="Home" />
      <HeaderNavLink url={ABOUT_URL} title="About" />
      <HeaderNavLink url={CONTACT_URL} title="Contact" />
      <HeaderNavLink url={PROJECTS_URL} title="Project" />
    </nav>
  )
}

export default Navigator;
