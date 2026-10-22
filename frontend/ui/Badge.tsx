import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'teal' | 'amber' | 'neutral' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-brand-primary-light text-brand-primary',
    teal: 'bg-teal-50 text-teal-800 border border-teal-200',
    amber: 'bg-amber-50 text-amber-900 border border-amber-200',
    neutral: 'bg-slate-100 text-slate-700',
    outline: 'bg-white text-slate-700 border border-brand-border'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
