"use client";

import { LoginForm as LoginFormState } from "@/app/lib/signin/definitions";
import { SIGNUP_URL } from "@/app/lib/url_paths";
import { authService } from "@/app/services/auth.service";
import { useUserStore } from "@/app/stores/user-store";
import { useRouter } from "@/i18n/navigation";
import { Button, Checkbox } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SsoForm from "./sso-form";
import { useAppContext } from "@/app/context/AppContext";
import { userService } from "@/app/services/user.service";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get("redirect") || "/";
  const t = useTranslations();
  const { userConfig, setUserConfig } = useAppContext();
  const setUserDetail = useUserStore(state => state.setUserDetail);

  const [form, setForm] = useState<LoginFormState>({
    email: userConfig.remember_login ? userConfig.save_email : "",
    password: userConfig.remember_login ? userConfig.save_password : "",
  });
  const [showPass, setShowPass] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await authService.login({
      email: form.email,
      password: form.password
    });
    if (!result.success) return;

    const userDatailResult = await userService.me();
    if (!userDatailResult.success) return;

    setUserDetail(userDatailResult.data);
    setUserConfig({ ...userConfig, save_email: form.email, save_password: form.password });
    
    router.push(redirectPath);
  }

  return (
    <div className="m-auto w-[90%] h-auto max-w-80 bg-white px-3 rounded-lg border border-gray-900">
      <h4 className="text-center mb-8 bg-white relative">
        <div className={
          "bg-white w-64 px-3 py-2 uppercase rounded-full border border-gray-900 absolute z-10 transform left-1/2 top-1/2 -translate-1/2"
        }>
          {t("page.title.signin")}
        </div>
      </h4>
      <form
        className="block space-y-3"
        onSubmit={handleSubmit}
      >
        <div>
          <input
            type="text"
            name="email"
            className={"w-full border outline-none rounded px-2 py-2"}
            placeholder="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type={showPass ? "text" : "password"}
            name="password"
            className={"w-full border outline-none rounded px-2 py-2"}
            placeholder="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="show_hide_pass" onChange={() => setShowPass(!showPass)} checked={showPass} />
          <label htmlFor="show_hide_pass">{showPass ? "Hide password" : "Show password"}</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember_login"
            onChange={() => setUserConfig({ ...userConfig, remember_login: !userConfig.remember_login })}
            checked={userConfig.remember_login} />
          <label htmlFor="remember_login">Remember login?</label>
        </div>
        <Button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
          variant="contained"
          type="submit">
          {t("page.title.signin")}
        </Button>
        <div className="text-center my-2">
          <span>Need an account?</span><br /><Link href={SIGNUP_URL} className="text-blue-700"><u>Register now!</u></Link>
        </div>
        {useMemo(() => <SsoForm />, [])}
      </form>
    </div>
  )
}
