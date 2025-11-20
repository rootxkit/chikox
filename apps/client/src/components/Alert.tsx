'use client';

import { useState } from 'react';

type AlertVariant = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  message: string;
  variant?: AlertVariant;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  error: 'bg-red-500/10 border-red-500/50 text-red-500',
  warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500',
  info: 'bg-blue-500/10 border-blue-500/50 text-blue-500',
  success: 'bg-green-500/10 border-green-500/50 text-green-500',
};

export default function Alert({
  message,
  variant = 'error',
  title,
  closable = false,
  onClose,
  className = '',
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !message) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={`p-3 border rounded text-sm ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p>{message}</p>
        </div>
        {closable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
