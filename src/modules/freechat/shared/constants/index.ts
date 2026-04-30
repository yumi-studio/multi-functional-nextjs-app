export const PASSWORD_ENCRYPT_SALT = parseInt(`${process.env.FREECHAT_PASSWORD_ENCRYPT_SALT ?? 10}`);
export const JWT_COOKIE_KEY = 'freechat_token';
export const SESSION_SECRET = process.env.FREECHAT_SESSION_SECRET;
export const ENCODED_SESSION_SECRET = new TextEncoder().encode(SESSION_SECRET);