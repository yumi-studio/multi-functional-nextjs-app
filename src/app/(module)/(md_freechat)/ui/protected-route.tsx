import { ComponentProps } from "react";
import { redirect } from "next/navigation";
import { FREECHAT_LOGIN_URL } from "../lib/url";
import { AuthProvider } from "../context/auth.context";
import { verifyAuthUser } from "../actions";

const ProtectedRoute = async ({ children, skipRedirect = false }: { skipRedirect?: boolean } & ComponentProps<"div">) => {
  let user;

  try {
    user = await verifyAuthUser();
  } catch (err) {
    user = null;
  }

  if (!user && !skipRedirect) {
    redirect(FREECHAT_LOGIN_URL);
  }

  return (
    <AuthProvider initial={{ isAuthenticated: !!user, user: user ?? null }}>
      {children}
    </AuthProvider>
  );
}

export default ProtectedRoute;
