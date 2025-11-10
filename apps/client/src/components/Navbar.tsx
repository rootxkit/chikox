'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-border-primary bg-background-primary">
      <div className="container mx-auto px-[5%] py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Chikox
          </Link>
          <div className="flex gap-6">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
