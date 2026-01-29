import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Указываем явный путь к модулю конфигурации next-intl
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  /* здесь можно оставить другие настройки, если появятся */
};

export default withNextIntl(nextConfig);
