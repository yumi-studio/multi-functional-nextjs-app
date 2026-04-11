import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers';

const secretKey = process.env.FREECHAT_SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
export const JWT_COOKIE_KEY = 'freechat_token';

type JwtPayload = {
  userId: string,
  expiresAt: Date,
}

export async function encrypt(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(jwtToken: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(jwtToken, encodedKey, {
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
