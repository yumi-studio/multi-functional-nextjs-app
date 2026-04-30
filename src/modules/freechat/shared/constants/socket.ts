export const FALLBACK_SOCKET_URL = "http://localhost:3001";
export const SOCKET_URL = process.env.NEXT_PUBLIC_FREECHAT_SOCKET_URL ?? FALLBACK_SOCKET_URL;
export const CHAT_EVENTS = {
  CHAT_ACTIVE: 'chat:active',
  CHAT_INACTIVE: 'chat:inactive',
  CHAT_TYPING: 'chat:typing',
  MESSAGE_CREATE: 'message:create',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
};