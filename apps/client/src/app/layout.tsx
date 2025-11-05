import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chikox - Client',
  description: 'Full-stack TypeScript application'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
