'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border-primary bg-background-alternative py-8 sm:py-12">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8 justify-items-center md:justify-items-start text-center md:text-left">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-text-primary hover:text-accent transition-colors inline-block"
            >
              <span className="text-accent">Chiko</span>x
            </Link>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-2 sm:mb-3 text-sm sm:text-base">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/services" className="text-neutral hover:text-accent transition-colors">
                  {t('footer.services')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral hover:text-accent transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral hover:text-accent transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-text-primary mb-2 sm:mb-3 text-sm sm:text-base">
              {t('footer.contactTitle')}
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-neutral">
              <li>info@chikox.net</li>
              <li>Georgia</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-primary pt-6 sm:pt-8">
          <div className="text-center text-xs sm:text-sm text-neutral">
            <p>
              &copy; {new Date().getFullYear()} <span className="text-accent">Chiko</span>x.{' '}
              {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
