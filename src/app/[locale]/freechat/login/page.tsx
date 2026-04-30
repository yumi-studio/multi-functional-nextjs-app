"use server";

import { redirect } from "next/navigation";
import { verifyAuthUser } from "@/modules/freechat/view/actions";
import { FREECHAT_URL } from "@/modules/freechat/shared/constants/page-endpoints";
import View from "@/app/[locale]/freechat/login/view";

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
