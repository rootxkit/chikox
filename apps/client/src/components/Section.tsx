'use client';

import { ReactNode } from 'react';

type BackgroundVariant = 'primary' | 'secondary' | 'alternative' | 'none';
type PaddingVariant = 'default' | 'large' | 'none';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: BackgroundVariant;
  container?: boolean;
  id?: string;
  noPadding?: boolean;
  paddingVariant?: PaddingVariant;
  horizontalPadding?: boolean;
}

const backgroundClasses: Record<BackgroundVariant, string> = {
  primary: 'bg-background-primary',
  secondary: 'bg-background-secondary',
  alternative: 'bg-background-alternative',
  none: '',
};

const paddingClasses: Record<PaddingVariant, string> = {
  default: 'py-12 md:py-16 lg:py-24',
  large: 'py-16 md:py-24 lg:py-28',
  none: '',
};

export default function Section({
  children,
  className = '',
  background = 'none',
  container = true,
  id,
  noPadding = false,
  paddingVariant = 'default',
  horizontalPadding = false,
}: SectionProps) {
  const padding = noPadding ? '' : paddingClasses[paddingVariant];
  const bgClass = backgroundClasses[background];
  const hPadding = horizontalPadding ? 'px-[5%]' : '';

  const sectionClasses = [padding, bgClass, hPadding, className].filter(Boolean).join(' ');

  return (
    <section id={id} className={sectionClasses}>
      {container ? <div className="container">{children}</div> : children}
    </section>
  );
}
