import { useState, CSSProperties, Fragment } from 'react';
import { CONTACT_CONTENT, PLACEHOLDERS, SITE_META } from '../../content';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';
import { GlassToast } from '../GlassToast';
import { useAssetExists } from '../../hooks/useAssetExists';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showNetDebug, setShowNetDebug] = useState(false);
  const resumeExists = useAssetExists(PLACEHOLDERS.RESUME_PDF, 'application/pdf');

  const pins = [
    { label: 'EMAIL', value: CONTACT_CONTENT.email, action: () => copyEmail() },
    { label: 'LINKEDIN', value: CONTACT_CONTENT.linkedin, action: () => window.open(CONTACT_CONTENT.linkedin, '_blank', 'noopener,noreferrer') },
    { label: 'GITHUB', value: CONTACT_CONTENT.github, action: () => window.open(CONTACT_CONTENT.github, '_blank', 'noopener,noreferrer') },
    { label: 'RESUME', value: resumeExists ? 'DOWNLOAD' : 'UNAVAILABLE', action: resumeExists ? () => window.open(PLACEHOLDERS.RESUME_PDF, '_blank') : () => {} },
  ];

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_CONTENT.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="relative py-20 px-6 md:px-12">
      <Reveal delay={0} className="max-w-2xl">
        <SilkscreenLabel className="mb-8" refDes={CONTACT_CONTENT.ref}>
          {CONTACT_CONTENT.connectorLabel}
        </SilkscreenLabel>

        <div className="relative mb-8" style={{ width: 120, height: 200 }}>
          <svg viewBox="0 0 120 200" className="w-full h-full" fill="none" aria-hidden="true">
            <rect x="20" y="10" width="80" height="180" rx="8" fill="#0D0F12" stroke="rgba(200, 147, 90, 0.35)" strokeWidth="1.5" />
            
            {pins.map((pin, i) => (
              <Fragment key={pin.label}>
                <circle
                  cx="60"
                  cy={35 + i * 45}
                  r="12"
                  fill="#14171B"
                  stroke="rgba(227, 183, 120, 0.2)"
                  strokeWidth="1"
                />
                <circle
                  cx="60"
                  cy={35 + i * 45}
                  r="6"
                  fill="rgba(200, 147, 90, 0.15)"
                />
                <text
                  x="60"
                  y={35 + i * 45 + 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="7"
                  fontWeight="600"
                  letterSpacing="0.08em"
                  fill="#E3B778"
                >
                  {i + 1}
                </text>
              </Fragment>
            ))}

            <circle cx="28" cy="18" r="3" fill="#E3B778" />
          </svg>

          <div className="absolute left-full top-1/2 -translate-y-1/2 pl-6 flex flex-col gap-11" style={{ height: '180px' }}>
            {pins.map((pin, i) => (
              <button
                key={pin.label}
                type="button"
                onClick={pin.action}
                disabled={pin.label === 'RESUME' && !resumeExists}
                className="flex items-center gap-3 group pointer-events-auto"
                style={{ transitionDelay: `${i * 60}ms` } as CSSProperties}
              >
                <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-board-panel border border-copper/30 flex items-center justify-center transition-all duration-300 group-hover:border-copper-warm group-hover:bg-board-raised">
                  <SilkscreenLabel className="text-[9px] text-ink-tertiary group-hover:text-copper-warm">{pin.label}</SilkscreenLabel>
                </div>
                <span className="font-mono text-sm text-ink-secondary group-hover:text-ink-primary transition-colors whitespace-nowrap">
                  {pin.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-copper/10 flex items-center justify-between">
          <SilkscreenLabel>{SITE_META.footerSilkscreen}</SilkscreenLabel>
          
          <button
            type="button"
            onClick={() => setShowNetDebug(!showNetDebug)}
            className="px-3 py-1.5 rounded-pill border border-copper/20 text-ink-tertiary hover:text-ink-primary hover:border-copper/50 transition-colors font-mono text-[10px] tracking-[0.12em] uppercase"
          >
            NET_DEBUG: {showNetDebug ? 'ON' : 'OFF'}
          </button>
        </div>
      </Reveal>

      <GlassToast message={copied ? `ACK: copied ${CONTACT_CONTENT.email}` : ''} open={copied} />
    </section>
  );
};