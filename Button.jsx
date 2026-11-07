import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button Component
 * Follows the Electric Glass & Precision Syntax design specification:
 * - Gradient Primary: linear-gradient(135deg, #00E5FF 0%, #2979FF 50%, #B324E5 100%), border-white/40, glowing cobalt shadow on hover.
 * - Frosted Glass: rgba(255, 255, 255, 0.75) backdrop-blur-md, specular top border, cobalt glow on hover.
 */
export default function Button({
  children,
  variant = 'gradient',
  size = 'md',
  icon,
  iconPosition = 'left',
  to,
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-label-ui text-label-ui transition-all duration-200 cursor-pointer select-none active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none rounded-lg';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 rounded-lg gap-2',
    lg: 'px-6 py-3.5 rounded-xl text-sm gap-2.5',
  };

  const variantStyles = {
    // Gradient Primary Button
    gradient: 'btn-gradient-primary shadow-sm',
    'gradient-cobalt': 'btn-gradient-primary shadow-sm',
    
    // Frosted Glass Button
    glass: 'btn-frosted-glass shadow-xs',
    
    // Solid Cobalt Primary
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm hover:shadow-glow-cobalt border border-white/20',
    
    // Structural Secondary Glass
    secondary: 'bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface border border-outline-variant/40 hover:border-primary/40',
    
    // Outline Glass
    outline: 'bg-transparent border border-outline-variant/60 text-on-surface hover:border-primary hover:text-primary hover:bg-white/40',
    
    // Ghost
    ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/60',
    
    // High-contrast White
    white: 'bg-white text-on-surface font-semibold shadow-card-default hover:shadow-glow-cobalt border border-white hover:bg-white/95',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.gradient} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-lg leading-none shrink-0">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-lg leading-none shrink-0">{icon}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
