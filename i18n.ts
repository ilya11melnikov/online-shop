import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ru'];

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4+: `requestLocale` нужно await'ить
  const resolvedLocale = await requestLocale;

  if (!resolvedLocale || !locales.includes(resolvedLocale)) notFound();

  return {
    // Добавляем это поле, чтобы TypeScript не ругался
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});