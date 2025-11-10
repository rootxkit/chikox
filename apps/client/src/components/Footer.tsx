'use client';

export default function Footer() {
  return (
    <footer className="border-t border-border-primary bg-background-primary py-8">
      <div className="container mx-auto px-[5%]">
        <div className="text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Chikox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
