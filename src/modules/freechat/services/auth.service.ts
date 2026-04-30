import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers';
import { cache } from 'react';
import { JwtPayload } from '@/modules/freechat/shared/types';
import { ENCODED_SESSION_SECRET, JWT_COOKIE_KEY } from '@/modules/freechat/shared/constants';

export async function encrypt(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(ENCODED_SESSION_SECRET)
}

export async function decrypt(jwtToken: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(jwtToken, ENCODED_SESSION_SECRET, {
      algorithms: ['HS256'],
    })
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function createJwt(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set(JWT_COOKIE_KEY, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteJwt() {
  const cookieStore = await cookies();
  cookieStore.delete(JWT_COOKIE_KEY);
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(JWT_COOKIE_KEY)?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    // redirect(FREECHAT_LOGIN_URL);
    return { isAuth: false, userId: null }
  }

  return { isAuth: true, userId: session.userId }
})
