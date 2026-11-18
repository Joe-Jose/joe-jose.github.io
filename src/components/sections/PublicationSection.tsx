import { PUBLICATION_CONTENT } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { MetalText } from '../ui/MetalText';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';
import { CopperButton } from '../ui/CopperButton';
import { useAssetExists } from '../../hooks/useAssetExists';

export const PublicationSection: React.FC = () => {
  const linkExists = useAssetExists(PUBLICATION_CONTENT.url);

  return (
    <section id="publication" className="relative">
      <Reveal delay={0} className="h-full flex flex-col">
        <SilkscreenLabel className="mb-6" refDes={PUBLICATION_CONTENT.ref}>
          {PUBLICATION_CONTENT.badge}
        </SilkscreenLabel>

        <GlassCard className="p-6 relative overflow-hidden flex-1" tilt={false} sheen>
          <div className="absolute top-4 right-4 pointer-events-none opacity-5">
            <svg className="w-24 h-24 text-copper/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <div className="relative z-10">
            <h3 className="mb-3 pr-16">
              <MetalText size="xl" sheen>
                {PUBLICATION_CONTENT.title}
              </MetalText>
            </h3>

            <p className="text-ink-secondary leading-relaxed mb-6 max-w-xl">
              {PUBLICATION_CONTENT.description}
            </p>

            {linkExists && (
              <CopperButton variant="primary" asChild>
                <a href={PUBLICATION_CONTENT.url} target="_blank" rel="noopener noreferrer">
                  {PUBLICATION_CONTENT.linkLabel}
                </a>
              </CopperButton>
            )}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
};