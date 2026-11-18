import { forwardRef } from 'react';

interface MetalTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  sheen?: boolean;
}

export const MetalText = forwardRef<HTMLSpanElement, MetalTextProps>(
  ({ children, className = '', size = 'md', sheen = true, style, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    };

    return (
      <span
        ref={ref}
        className={`metal-text font-semibold ${sheen ? 'metal-text-sheen' : ''} ${sizeClasses[size]} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </span>
    );
  }
);

MetalText.displayName = 'MetalText';