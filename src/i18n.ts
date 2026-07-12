/**
 * i18n configuration — English only on launch.
 * Architecture is ready for additional languages: add a new resources entry
 * and the corresponding src/locales/{lang}/ folder.
 *
 * Usage:
 *   import { useTranslation } from 'react-i18next';
 *   const { t } = useTranslation('common');
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English namespaces
import enCommon     from '@/locales/en/common.json';
import enNavigation from '@/locales/en/navigation.json';
import enHomepage   from '@/locales/en/homepage.json';
import enTools      from '@/locales/en/tools.json';
import enSeo        from '@/locales/en/seo.json';

const resources = {
  en: {
    common:     enCommon,
    navigation: enNavigation,
    homepage:   enHomepage,
    tools:      enTools,
    seo:        enSeo,
  },
  // Add more languages here when translations are ready:
  // es: { common: esCommon, ... },
};

const storedLang = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('counter-lang') ?? 'en')
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:          storedLang,
    fallbackLng:  'en',
    supportedLngs: ['en'],
    ns:           ['common', 'navigation', 'homepage', 'tools', 'seo'],
    defaultNS:    'common',
    interpolation: { escapeValue: false },
    react:         { useSuspense: false },
  });

export default i18n;
