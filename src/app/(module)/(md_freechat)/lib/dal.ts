// Data access layer

import 'server-only';

import { cookies } from 'next/headers'
import { cache } from 'react';
import * as authService from '@/modules/freechat/services/auth.service';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(authService.JWT_COOKIE_KEY)?.value
  const session = await authService.decrypt(cookie)

  if (!session?.userId) {
    // redirect(FREECHAT_LOGIN_URL);
    return { isAuth: false, userId: null }
  }

  return { isAuth: true, userId: session.userId }
})
