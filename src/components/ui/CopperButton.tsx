import { forwardRef, ButtonHTMLAttributes, ElementType } from 'react';

interface CopperButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  as?: ElementType;
}

export const CopperButton = forwardRef<HTMLButtonElement, CopperButtonProps>(
  ({ children, className = '', variant = 'primary', size = 'md', loading = false, disabled, asChild = false, style, as: As, ...props }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-mono text-xs tracking-[0.12em] uppercase font-medium transition-all duration-300 cubic-bezier(0.22, 1, 0.36, 1) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-warm/60 focus-visible:ring-offset-2 focus-visible:ring-offset-board-base disabled:opacity-40 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-board-panel border border-copper/30 text-ink-primary px-6 py-2.5 rounded-pill after:content-[\"\"] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-copper-warm after:transition-all after:duration-400 hover:after:w-[80%] hover:bg-board-raised',
      ghost: 'bg-transparent border border-copper/20 text-ink-secondary px-6 py-2.5 rounded-pill after:content-[\"\"] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-copper after:transition-all after:duration-400 hover:after:w-[80%] hover:text-ink-primary hover:border-copper/50',
      pill: 'bg-board-raised border border-copper/25 text-ink-primary px-4 py-2 rounded-pill after:content-[\"\"] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1.5px] after:bg-copper-warm after:transition-all after:duration-400 hover:after:w-[80%]',
    };

    const sizeClasses = {
      sm: 'text-[10px] px-3 py-1.5',
      md: 'text-xs px-5 py-2',
      lg: 'text-sm px-7 py-3',
    };

    const Component = asChild ? (As || 'span') : 'button';

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        style={style}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
          </svg>
        ) : null}
        {children}
      </Component>
    );
  }
);

CopperButton.displayName = 'CopperButton';