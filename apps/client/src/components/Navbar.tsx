'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="relative z-[999] flex min-h-16 w-full items-center border-b border-border-primary bg-background-primary px-[5%] md:min-h-18">
      <div className="mx-auto flex size-full max-w-full items-center justify-between">
        <Link href="/">
          <Image
            src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
            alt="Logo image"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="absolute hidden h-screen overflow-auto border-b border-border-primary bg-background-primary px-[5%] pb-24 pt-4 md:pb-0 lg:static lg:ml-6 lg:flex lg:h-auto lg:flex-1 lg:items-center lg:justify-between lg:border-none lg:bg-none lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center lg:flex-row"></div>
          <div className="flex items-center gap-4">
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-5 py-2">
              Button
            </button>
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-5 py-2">
              Button
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="my-[3px] h-0.5 w-6 bg-black"></span>
          <span className="my-[3px] h-0.5 w-6 bg-black"></span>
          <span className="my-[3px] h-0.5 w-6 bg-black"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="absolute left-0 right-0 top-full w-full overflow-hidden lg:hidden"
        style={{ height: isMobileMenuOpen ? 'auto' : '0' }}
      >
        <div
          className="absolute left-0 right-0 top-0 block h-dvh overflow-auto border-b border-border-primary bg-background-primary px-[5%] pb-8 pt-4"
          style={{ transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <div className="flex flex-col">
            <Link href="#" className="block py-3 text-md">
              Link One
            </Link>
            <Link href="#" className="block py-3 text-md">
              Link Two
            </Link>
            <Link href="#" className="block py-3 text-md">
              Link Three
            </Link>

            <div className="mt-6 flex flex-col gap-4">
              <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-5 py-2">
                Button
              </button>
              <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-5 py-2">
                Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
