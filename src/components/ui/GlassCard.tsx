import { forwardRef, useState, CSSProperties } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean;
  sheen?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = '', tilt = true, sheen = true, style, onMouseMove, onMouseLeave, ...props }, ref) => {
    const [mx, setMx] = useState(0);
    const [my, setMy] = useState(0);
    const [tiltX, setTiltX] = useState(0);
    const [tiltY, setTiltY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!sheen && !tilt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMx(x);
      setMy(y);

      if (tilt) {
        const rotateX = (y - 50) * 0.06;
        const rotateY = (50 - x) * 0.06;
        setTiltX(rotateX);
        setTiltY(rotateY);
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (sheen) {
        setMx(50);
        setMy(0);
      }
      if (tilt) {
        setTiltX(0);
        setTiltY(0);
      }
      onMouseLeave?.(e);
    };

    const cardStyle: CSSProperties = {
      ...style,
      '--mx': `${mx}%`,
      '--my': `${my}%`,
      '--sheen-opacity': sheen ? (mx === 50 && my === 0 ? 0 : 1) : 0,
      transform: tilt ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : 'none',
      transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1)',
    } as CSSProperties;

    return (
      <div
        ref={ref}
        className={`glass-card ${className}`}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';