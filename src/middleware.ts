import i18nCreateMiddleware from 'next-intl/middleware';
import { routing as i18nRouting } from './i18n/routing';

export default i18nCreateMiddleware(i18nRouting);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}