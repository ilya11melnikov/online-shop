import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always' 
});

// Next.js 16: proxy.ts expects a named `proxy` export (middleware -> proxy)
export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  // Попробуем этот вариант, он более универсальный
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};