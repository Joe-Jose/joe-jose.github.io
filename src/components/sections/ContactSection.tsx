import { useState, Fragment } from 'react';
import { CONTACT_CONTENT, PLACEHOLDERS, SITE_META } from '../../content';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';
import { GlassToast } from '../GlassToast';
import { useAssetExists } from '../../hooks/useAssetExists';

interface ContactSectionProps {
  debugNets: boolean;
  onToggleDebug: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ debugNets, onToggleDebug }) => {
  const [copied, setCopied] = useState(false);
  const resumeExists = useAssetExists(PLACEHOLDERS.RESUME_PDF, 'application/pdf');

  const pins = [
    { label: 'EMAIL', value: CONTACT_CONTENT.email + '  (click to copy)', action: () => copyEmail() },
    { label: 'LINKEDIN', value: 'linkedin.com/in/joe-jose-298372271', action: () => window.open(CONTACT_CONTENT.linkedin, '_blank', 'noopener,noreferrer') },
    { label: 'GITHUB', value: 'github.com/Joe-Jose', action: () => window.open(CONTACT_CONTENT.github, '_blank', 'noopener,noreferrer') },
    { label: 'RESUME', value: resumeExists ? 'Download resume (PDF)' : 'Resume not available', action: resumeExists ? () => window.open(PLACEHOLDERS.RESUME_PDF, '_blank') : () => {} },
  ];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_CONTENT.email);
    } catch {
      /* clipboard can be blocked; still show the address in the toast */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="relative px-6 md:px-12 py-12 md:py-16 pb-28">
      <Reveal delay={0} className="max-w-3xl">
        <SilkscreenLabel className="mb-8" refDes={CONTACT_CONTENT.ref}>
          {CONTACT_CONTENT.connectorLabel}
        </SilkscreenLabel>

        <div className="flex items-start gap-6 md:gap-10 mb-10">
          {/* Left: 4-pin header graphic */}
          <div className="relative flex-shrink-0">
            <div className="relative" style={{ width: 88, height: 256 }}>
              <svg viewBox="0 0 88 256" className="w-full h-full" fill="none" aria-hidden="true">
                {/* Connector body */}
                <rect x="8" y="2" width="72" height="252" rx="8" fill="#0D0F12" stroke="rgba(200, 147, 90, 0.35)" strokeWidth="1.5" />
                
                {/* Pin holes - aligned with right column rows */}
                {pins.map((pin, i) => (
                  <Fragment key={pin.label}>
                    <circle
                      cx="44"
                      cy={32 + i * 64}
                      r="12"
                      fill="#14171B"
                      stroke="rgba(227, 183, 120, 0.2)"
                      strokeWidth="1"
                    />
                    <circle
                      cx="44"
                      cy={32 + i * 64}
                      r="6"
                      fill="rgba(200, 147, 90, 0.15)"
                    />
                    <text
                      x="44"
                      y={32 + i * 64 + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="9"
                      fontWeight="600"
                      letterSpacing="0.08em"
                      fill="#E3B778"
                    >
                      {i + 1}
                    </text>
                  </Fragment>
                ))}

                {/* Pin 1 marker */}
                <circle cx="17" cy="11" r="3" fill="#E3B778" />
              </svg>
            </div>
          </div>

          {/* Right: four rows, 64px each, aligned with the pins */}
          <div className="flex-1 min-w-0 flex flex-col">
            {pins.map((pin) => (
              <button
                key={pin.label}
                type="button"
                onClick={pin.action}
                disabled={pin.label === 'RESUME' && !resumeExists}
                className="group flex items-center gap-4 w-full h-16 text-left border-b border-copper/10 last:border-b-0 disabled:opacity-50"
              >
                <SilkscreenLabel className="w-20 flex-shrink-0 group-hover:text-copper-warm transition-colors">
                  {pin.label}
                </SilkscreenLabel>
                <span className="flex-1 min-w-0 font-mono text-sm text-ink-primary group-hover:text-copper-warm transition-colors truncate">
                  {pin.value}
                </span>
                <svg
                  className="w-4 h-4 text-ink-tertiary group-hover:text-copper-warm transition-colors flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Divider and footer */}
        <div className="pt-8 border-t border-copper/10 flex flex-col md:flex-row items-center md:justify-between gap-4">
          <SilkscreenLabel>{SITE_META.footerSilkscreen}</SilkscreenLabel>
          
          <button
            type="button"
            onClick={onToggleDebug}
            className="px-3 py-1.5 rounded-pill border border-copper/20 text-ink-tertiary hover:text-ink-primary hover:border-copper/50 transition-colors font-mono text-[10px] tracking-[0.12em] uppercase"
          >
            Show net labels: {debugNets ? 'ON' : 'OFF'}
          </button>
        </div>
      </Reveal>

      <GlassToast message={copied ? `ACK: copied ${CONTACT_CONTENT.email}` : ''} open={copied} />
    </section>
  );
};