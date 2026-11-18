import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { HERO_CONTENT, PLACEHOLDERS } from '../../content';
import { MetalText } from '../ui/MetalText';
import { CopperButton } from '../ui/CopperButton';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { useAssetExists } from '../../hooks/useAssetExists';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const HeroSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [bootPhase, setBootPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const chipRef = useRef<SVGSVGElement>(null);
  const resumeExists = useAssetExists(PLACEHOLDERS.RESUME_PDF, 'application/pdf');
  const [bootSkipped, setBootSkipped] = useState(false);

  useEffect(() => {
    const done = sessionStorage.getItem('hero-boot-done');
    if (done) {
      setHasBooted(true);
      setBootSkipped(true);
      setShowContent(true);
    }
  }, []);

  const skipBoot = () => {
    if (bootSkipped) return;
    setBootSkipped(true);
    setHasBooted(true);
    setShowContent(true);
    sessionStorage.setItem('hero-boot-done', 'true');
  };

  useEffect(() => {
    if (reducedMotion || hasBooted) {
      setShowContent(true);
      return;
    }

    const phases = [
      { phase: 1, duration: 400 },
      { phase: 2, duration: 600 },
      { phase: 3, duration: 800 },
      { phase: 4, duration: 400 },
    ];

    let currentPhase = 0;
    const runBoot = () => {
      if (currentPhase >= phases.length) {
        setHasBooted(true);
        setShowContent(true);
        sessionStorage.setItem('hero-boot-done', 'true');
        return;
      }
      setBootPhase(phases[currentPhase].phase);
      setTimeout(runBoot, phases[currentPhase].duration);
      currentPhase++;
    };

    runBoot();
  }, [reducedMotion, hasBooted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      skipBoot();
    }
  };

  const handleClick = () => {
    skipBoot();
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-between px-6 md:px-12 pt-20 pb-16"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Hero section"
    >
      <SilkscreenLabel className="absolute top-8 left-8 z-10" refDes={HERO_CONTENT.ref}>
        {HERO_CONTENT.chipLabel}
      </SilkscreenLabel>

      <div className="absolute top-8 right-8 z-10 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-copper-warm animate-copper-pulse" />
          <span className="absolute inset-0 rounded-full bg-copper-warm/20 animate-ping" />
        </span>
        <SilkscreenLabel>{HERO_CONTENT.statusText}</SilkscreenLabel>
      </div>

      <div className="relative z-10 flex-shrink-0" style={{ width: 280, height: 280 }}>
        <svg
          ref={chipRef}
          viewBox="0 0 280 280"
          className="w-full h-full"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="60"
            y="60"
            width="160"
            height="160"
            rx="12"
            stroke="rgba(200, 147, 90, 0.35)"
            strokeWidth="1.5"
            fill="#0D0F12"
            style={{
              strokeDasharray: bootPhase >= 1 ? '640' : '0',
              strokeDashoffset: bootPhase >= 1 ? 0 : 640,
              transition: 'stroke-dashoffset 400ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />

          <rect
            x="104"
            y="104"
            width="72"
            height="72"
            rx="6"
            fill="#14171B"
            stroke="rgba(227, 183, 120, 0.25)"
            strokeWidth="1"
            style={{ opacity: bootPhase >= 2 ? 1 : 0, transition: 'opacity 300ms' }}
          />

          <circle
            cx="68"
            cy="68"
            r="3.5"
            fill="#E3B778"
            style={{ opacity: bootPhase >= 2 ? 1 : 0, transition: 'opacity 200ms 200ms' }}
          />

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={`t-${i}`}
              x1={72 + i * 18}
              y1={60}
              x2={72 + i * 18}
              y2={48}
              stroke="rgba(200, 147, 90, 0)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                stroke: bootPhase >= 2 ? 'rgba(200, 147, 90, 0.9)' : 'rgba(200, 147, 90, 0)',
                transition: `stroke 200ms cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 40}ms`,
              }}
            />
          ))}

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={`b-${i}`}
              x1={72 + i * 18}
              y1={220}
              x2={72 + i * 18}
              y2={232}
              stroke="rgba(200, 147, 90, 0)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                stroke: bootPhase >= 2 ? 'rgba(200, 147, 90, 0.9)' : 'rgba(200, 147, 90, 0)',
                transition: `stroke 200ms cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 40}ms`,
              }}
            />
          ))}

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={`l-${i}`}
              x1={60}
              y1={72 + i * 18}
              x2={48}
              y2={72 + i * 18}
              stroke="rgba(200, 147, 90, 0)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                stroke: bootPhase >= 2 ? 'rgba(200, 147, 90, 0.9)' : 'rgba(200, 147, 90, 0)',
                transition: `stroke 200ms cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 40}ms`,
              }}
            />
          ))}

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={`r-${i}`}
              x1={220}
              y1={72 + i * 18}
              x2={232}
              y2={72 + i * 18}
              stroke="rgba(200, 147, 90, 0)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                stroke: bootPhase >= 2 ? 'rgba(200, 147, 90, 0.9)' : 'rgba(200, 147, 90, 0)',
                transition: `stroke 200ms cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 40}ms`,
              }}
            />
          ))}

          <text
            x="140"
            y="148"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.14em"
            fill="#E3B778"
            style={{
              opacity: bootPhase >= 4 ? 1 : 0,
              transform: bootPhase >= 4 ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 300ms 200ms, transform 300ms 200ms',
            }}
          >
            JJ-SOC-26
          </text>
        </svg>

        {bootPhase >= 3 && (
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[320px] text-left pointer-events-none"
            aria-live="polite"
            role="log"
          >
            {HERO_CONTENT.bootLines.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
                className="font-mono text-[11px] text-ink-tertiary mb-1"
              >
                <span className="text-copper-warm">[ OK ]</span>{' '}
                <span className="text-ink-secondary">{line.replace('[ OK ] ', '')}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div
        className="relative z-10 max-w-xl flex-1 min-w-0 ml-8 md:ml-16"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <SilkscreenLabel className="mb-4" refDes="U0">
          BOOT COMPLETE
        </SilkscreenLabel>

        <h1 className="mb-3">
          <MetalText size="4xl" sheen>
            {HERO_CONTENT.name}
          </MetalText>
        </h1>

        <p className="mb-2 text-ink-secondary text-lg font-medium">
          {HERO_CONTENT.role}
        </p>

        <p className="mb-8 text-ink-secondary leading-relaxed max-w-lg">
          {HERO_CONTENT.tagline}
        </p>

        <div className="flex flex-wrap gap-3">
          <CopperButton
            variant="primary"
            size="lg"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })}
          >
            {HERO_CONTENT.primaryCta}
          </CopperButton>
          {resumeExists && (
            <CopperButton variant="ghost" size="lg" asChild>
              <a href={PLACEHOLDERS.RESUME_PDF} download>
                {HERO_CONTENT.secondaryCta}
              </a>
            </CopperButton>
          )}
        </div>
      </div>
    </section>
  );
};