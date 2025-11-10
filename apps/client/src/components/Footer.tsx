'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
  };

  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 items-start justify-between gap-x-[8vw] gap-y-12 pb-12 sm:gap-y-10 md:gap-y-14 md:pb-18 lg:grid-cols-[1fr_0.5fr] lg:pb-20">
          <div className="flex flex-col items-start">
            <Link href="#" className="mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
                alt="Logo image"
                className="inline-block"
              />
            </Link>
            <ul className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-start gap-y-4 md:grid-flow-col md:grid-cols-[max-content] md:justify-start md:justify-items-start md:gap-x-6">
              <li className="font-semibold">
                <Link href="#">Link One</Link>
              </li>
              <li className="font-semibold">
                <Link href="#">Link Two</Link>
              </li>
              <li className="font-semibold">
                <Link href="#">Link Three</Link>
              </li>
              <li className="font-semibold">
                <Link href="#">Link Four</Link>
              </li>
              <li className="font-semibold">
                <Link href="#">Link Five</Link>
              </li>
            </ul>
          </div>
          <div className="max-w-md lg:min-w-[25rem]">
            <p className="mb-3 font-semibold md:mb-4">Subscribe</p>
            <form
              onSubmit={handleSubmit}
              className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-y-4 md:gap-4"
            >
              <div className="relative flex w-full items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-5 py-2"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs">By subscribing you agree to with our Privacy Policy</p>
          </div>
        </div>
        <div className="h-px w-full bg-black"></div>
        <div className="flex flex-col items-start justify-start pb-4 pt-6 text-sm md:flex-row md:items-center md:justify-between md:pb-0 md:pt-8 md:text-center">
          <ul className="grid grid-flow-row grid-cols-[max-content] gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0 lg:justify-center">
            <li className="underline decoration-black underline-offset-1">
              <Link href="#">Privacy Policy</Link>
            </li>
            <li className="underline decoration-black underline-offset-1">
              <Link href="#">Terms of Service</Link>
            </li>
            <li className="underline decoration-black underline-offset-1">
              <Link href="#">Cookies Settings</Link>
            </li>
          </ul>
          <p>© 2024 Relume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
