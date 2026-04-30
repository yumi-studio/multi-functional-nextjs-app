"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/app/lib/utils";
import { ABOUT_URL, CONTACT_URL, HOME_URL, PROJECTS_URL } from "@/app/lib/url_paths";
import Logo from "@/modules/core/view/ui/header/Logo";
import HeaderNavLink from "@/modules/core/view/ui/header/HeaderNavLink";

const Navigator = () => {
  const tNav = useTranslations("header.nav");

  return (
    <nav className={cn([
      "w-full h-10 flex items-center gap-4",
    ])}>
      {/* Logo */}
      <div className="w-auto h-10">
        <Logo />
      </div>
      <div className="w-auto">
        <HeaderNavLink url={HOME_URL} title={tNav("home")} />
        <HeaderNavLink url={ABOUT_URL} title={tNav("about")} />
        <HeaderNavLink url={CONTACT_URL} title={tNav("contact")} />
        <HeaderNavLink url={PROJECTS_URL} title={tNav("projects")} />
      </div>
    </nav>
  )
}

export default Navigator;
