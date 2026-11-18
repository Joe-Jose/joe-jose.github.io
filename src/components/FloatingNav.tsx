import { useEffect, useRef, useState, CSSProperties } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { NAV_ITEMS } from '../content';
import { SilkscreenLabel } from './ui/SilkscreenLabel';

interface FloatingNavProps {
  sectionIds: string[];
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ sectionIds }) => {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sectionIds[0] || '');
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-20% 0px -60% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const sheenStyle: CSSProperties = { '--sheen-opacity': 1 } as CSSProperties;

  return (
    <>
      {/* Desktop: centered top pill */}
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <div className="glass-card px-5 py-2 pointer-events-auto" style={sheenStyle}>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-pill transition-all duration-300 ${
                  activeId === item.id
                    ? 'text-ink-primary bg-board-raised/50 before:content-[""] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-copper-warm'
                    : 'text-ink-tertiary hover:text-ink-primary'
                }`}
                style={{ transitionDelay: `${idx * 40}ms` } as CSSProperties}
              >
                <SilkscreenLabel>{item.tp}</SilkscreenLabel>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile: bottom pill */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <div className="glass-card px-3 py-1.5 pointer-events-auto" style={sheenStyle}>
          <div className="flex items-center gap-0.5">
            {NAV_ITEMS.slice(0, 5).map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-pill transition-all duration-300 ${
                  activeId === item.id
                    ? 'text-ink-primary bg-board-raised/50'
                    : 'text-ink-tertiary hover:text-ink-primary'
                }`}
                style={{ transitionDelay: `${idx * 40}ms` } as CSSProperties}
              >
                <SilkscreenLabel className="text-[9px]">{item.tp}</SilkscreenLabel>
                <span className="hidden">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};