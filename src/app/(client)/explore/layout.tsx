'use client';
import I18nWrapper from '@/hoc/I18nWrapper';
export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nWrapper>
      <section className="explore-layout">{children}</section>
    </I18nWrapper>
  );
}
