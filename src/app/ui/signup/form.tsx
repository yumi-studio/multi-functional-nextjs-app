"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Complete from "./complete";
import { authService } from "@/app/services/auth.service";

type SignupState = "begin" | "submit" | "fail" | "complete" | "end";

export default function SignUpForm() {
  const t = useTranslations();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [validated, setValidated] = useState<{ [key: string]: string[] }>({
    username: [],
    email: [],
    password: [],
    confirmPassword: [],
    firstName: [],
    lastName: [],
  });

  const [signupState, setSignupState] = useState<SignupState>("begin");

  const [passwordStrength, setPasswordStrength] = useState(0);

  function checkUsername(username: string) {
    const errors: string[] = [];

    if (!/^[a-zA-Z0-9._]{3,20}$/.test(username)) {
      errors.push(t("signup.error.username.invalid_chars"));
    }

    // Không bắt đầu hoặc kết thúc bằng dấu . hoặc _
    if (/^[._]|[._]$/.test(username)) {
      errors.push(t("signup.error.username.start_end_char"));
    }

    setValidated(prev => { return { ...prev, username: errors } });
  }

  function checkEmail(email: string) {
    const errors: string[] = [];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.toLowerCase())) {
      errors.push(t("signup.error.email.invalid"));
    }

    setValidated(prev => { return { ...prev, email: errors } });
  }

  // Simple password strength meter (0-3)
  function checkStrength(pw: string) {
    let score = 0;
    const errors: string[] = [];

    if (pw.length >= 8) {
      score++;
    } else {
      errors.push(t("signup.error.password.invalid"));
    }
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    setPasswordStrength(score);
    setValidated(prev => { return { ...prev, password: errors } });
  }

  function checkConfirmPassword(confirm_pw: string) {
    const errors: string[] = [];
    if (confirm_pw !== form.password) {
      errors.push(t("signup.error.password.not_match"));
    }
    setValidated(prev => { return { ...prev, confirmPassword: errors } });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "username") checkUsername(value);
    if (name === "email") checkEmail(value);
    if (name === "password") checkStrength(value);
    if (name === "confirmPassword") checkConfirmPassword(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // toast("Lmao");
    // Handle signup logic here
    try {
      setSignupState("submit");
      const result = await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        birthDate: "2000-10-21",
        gender: 0
      });

      if (result.success) {
        setSignupState("complete");
      } else {
        setSignupState("fail");
      }
    } catch (err) {
      setSignupState("fail");
    }
  }

  return signupState !== "complete" ? (
    <>
      <div className="m-auto w-[90%] h-auto max-w-80 bg-white px-3 rounded-lg border border-gray-900">
        <h4 className="text-center mb-8 bg-white relative">
          <div className={
            "bg-white w-64 px-3 py-2 uppercase rounded-full border border-gray-900 absolute z-10 transform left-1/2 top-1/2 -translate-1/2"
          }>
            {t("page.title.signup")}
          </div>
        </h4>
        <form className="block space-y-3" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={"w-full border outline-none rounded px-2 py-2"
                + (validated.username.length ? " border-red-600" : "")
              }
              value={form.username}
              onChange={handleChange}
            />
            {validated.username.length > 0 && (
              <div className="text-red-600 my-1 text-sm">
                {validated.username.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={"w-full border outline-none rounded px-2 py-2"
                + (validated.username.length ? " border-red-600" : "")
              }
              value={form.email}
              onChange={handleChange}
            />
            {validated.email.length > 0 && (
              <div className="text-red-600 my-1 text-sm">
                {validated.email.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={"w-full border outline-none rounded px-2 py-2"
                + (validated.username.length ? " border-red-600" : "")
              }
              value={form.password}
              onChange={handleChange}
            />
            <div className="mt-1 h-2 w-full bg-gray-200 rounded">
              <div
                className={`h-2 rounded transition-all ${passwordStrength === 0
                  ? "w-1/4 bg-red-400"
                  : passwordStrength === 1
                    ? "w-2/4 bg-yellow-400"
                    : passwordStrength === 2
                      ? "w-3/4 bg-blue-400"
                      : "w-full bg-green-500"
                  }`}
              ></div>
            </div>
            <div className="text-xs mt-1 text-gray-500">
              {passwordStrength === 0
                ? t("signup.error.password.weak")
                : passwordStrength === 1
                  ? t("signup.error.password.fair")
                  : passwordStrength === 2
                    ? t("signup.error.password.good")
                    : t("signup.error.password.strong")}
            </div>
            {validated.password.length > 0 && (
              <div className="text-red-600 my-1 text-sm">
                {validated.password.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={"w-full border outline-none rounded px-2 py-2"
                + (validated.username.length ? " border-red-600" : "")
              }
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {validated.confirmPassword.length > 0 && (
              <div className="text-red-600 my-1 text-sm">
                {validated.confirmPassword.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              className={"w-full border outline-none rounded px-2 py-2"
                + (validated.firstName.length ? " border-red-600" : "")
              }
              value={form.firstName}
              onChange={handleChange}
            />
            {validated.firstName.length > 0 && (
              <div className="text-red-600 my-1 text-sm">
                {validated.firstName.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              className={"w-full border outline-none rounded px-2 py-2"
                + (validated.lastName.length ? " border-red-600" : "")
              }
              value={form.lastName}
              onChange={handleChange}
            />
            {validated.lastName.length > 0 && (
              <div className="text-red-600 my-1 text-sm">
                {validated.lastName.map((error, key) => (
                  <div key={key}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
          >
            {(signupState === "begin" || signupState === "fail") && (
              <span>{t("signup.submit")}</span>
            )}
            {signupState === "submit" && (
              <span>{t("signup.submiting")}</span>
            )}
          </button>
        </form>
      </div>
    </>
  ) : (
    <>
      <Complete />
    </>
  )
}
