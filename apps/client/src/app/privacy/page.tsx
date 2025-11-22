'use client';

import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-background-alternative border border-border-primary rounded-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t('privacy.title')}</h1>

            <div className="prose prose-sm sm:prose text-text-primary">
              <p className="text-neutral mb-4">{t('privacy.lastUpdated')}</p>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.introduction.title')}</h2>
                <p className="text-neutral">{t('privacy.introduction.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.collection.title')}</h2>
                <p className="text-neutral">{t('privacy.collection.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.usage.title')}</h2>
                <p className="text-neutral">{t('privacy.usage.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.sharing.title')}</h2>
                <p className="text-neutral">{t('privacy.sharing.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.cookies.title')}</h2>
                <p className="text-neutral">{t('privacy.cookies.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.security.title')}</h2>
                <p className="text-neutral">{t('privacy.security.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.rights.title')}</h2>
                <p className="text-neutral">{t('privacy.rights.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.children.title')}</h2>
                <p className="text-neutral">{t('privacy.children.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.changes.title')}</h2>
                <p className="text-neutral">{t('privacy.changes.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('privacy.contact.title')}</h2>
                <p className="text-neutral">{t('privacy.contact.content')}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
