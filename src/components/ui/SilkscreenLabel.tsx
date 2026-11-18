import { forwardRef } from 'react';

interface SilkscreenLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  refDes?: string;
  netName?: string;
  tag?: string;
}

export const SilkscreenLabel = forwardRef<HTMLSpanElement, SilkscreenLabelProps>(
  ({ children, className = '', refDes, netName, tag, ...props }, ref) => {
    const content = children ?? refDes ?? netName ?? tag;
    return (
      <span
        ref={ref}
        className={`font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen ${className}`}
        {...props}
      >
        {content}
      </span>
    );
  }
);

SilkscreenLabel.displayName = 'SilkscreenLabel';