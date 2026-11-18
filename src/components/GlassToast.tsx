import { useEffect, useRef, useState, CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface GlassToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const ToastContent: React.FC<GlassToastProps> = ({ message, open, onClose }) => {
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (open) {
      timeoutRef.current = window.setTimeout(onClose, 1800);
    }
    return () => window.clearTimeout(timeoutRef.current);
  }, [open, onClose]);

  if (!open) return null;

  const sheenStyle: CSSProperties = { '--sheen-opacity': 1 } as CSSProperties;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div className="glass-card px-5 py-3 flex items-center gap-3" style={sheenStyle}>
        <svg className="w-5 h-5 text-copper-warm flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="font-mono text-sm text-ink-primary">{message}</span>
      </div>
    </div>
  );
};

export const GlassToast: React.FC<Omit<GlassToastProps, 'onClose'>> = ({ message, open }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (open) setVisible(true);
  }, [open]);

  if (!mounted) return null;

  const handleClose = () => setVisible(false);

  return createPortal(
    <ToastContent message={message} open={visible} onClose={handleClose} />,
    document.body
  );
};