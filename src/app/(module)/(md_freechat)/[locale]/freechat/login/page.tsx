"use server";

import { redirect } from "next/navigation";
import { FREECHAT_URL } from "../../../lib/url";
import View from "./view";
import { verifyAuthUser } from "../../../actions";

const LoginPage = async ({ }: PageProps<'/[locale]/freechat/login'>) => {
  let user;
  try {
    user = await verifyAuthUser();
  } catch (error) {
    user = null;
  }

  if (user) {
    redirect(FREECHAT_URL);
  }
  
  return <View />
}

export default LoginPage;
