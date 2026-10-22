import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'teal' | 'amber' | 'neutral' | 'outline' | 'success';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-brand-primary-light text-brand-primary border border-brand-primary/10',
    teal: 'bg-teal-50 text-teal-800 border border-teal-200/60',
    amber: 'bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/50',
    outline: 'bg-white text-slate-700 border border-brand-border',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
