'use client';

import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-background-alternative border border-border-primary rounded-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t('terms.title')}</h1>

            <div className="prose prose-sm sm:prose text-text-primary">
              <p className="text-neutral mb-4">{t('terms.lastUpdated')}</p>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.acceptance.title')}</h2>
                <p className="text-neutral">{t('terms.acceptance.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.services.title')}</h2>
                <p className="text-neutral">{t('terms.services.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.accounts.title')}</h2>
                <p className="text-neutral">{t('terms.accounts.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.intellectual.title')}</h2>
                <p className="text-neutral">{t('terms.intellectual.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.prohibited.title')}</h2>
                <p className="text-neutral">{t('terms.prohibited.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.limitation.title')}</h2>
                <p className="text-neutral">{t('terms.limitation.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.termination.title')}</h2>
                <p className="text-neutral">{t('terms.termination.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.changes.title')}</h2>
                <p className="text-neutral">{t('terms.changes.content')}</p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('terms.contact.title')}</h2>
                <p className="text-neutral">{t('terms.contact.content')}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
