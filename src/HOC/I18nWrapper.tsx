'use client';
import useInitI18n from '@/hooks/useInitI18n';
import i18n from '@/locales/i18n';
import { I18nextProvider } from 'react-i18next';

export default function I18nWrapper({ children }: { children: React.ReactNode }) {
  useInitI18n();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
