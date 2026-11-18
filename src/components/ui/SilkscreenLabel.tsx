import { forwardRef } from 'react';

interface SilkscreenLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  refDes?: string;
  netName?: string;
  tag?: string;
}

export const SilkscreenLabel = forwardRef<HTMLSpanElement, SilkscreenLabelProps>(
  ({ children, className = '', refDes, netName, tag, ...props }, ref) => {
    const content = children ?? netName ?? tag;
    return (
      <span
        ref={ref}
        className={`font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen ${className}`}
        {...props}
      >
        {refDes && <span className="text-copper-warm/80">{refDes}</span>}
        {refDes && content ? <span className="mx-2 opacity-40">/</span> : null}
        {content}
      </span>
    );
  }
);

SilkscreenLabel.displayName = 'SilkscreenLabel';
