import { EXPERIENCE_CONTENT } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="relative">
      <Reveal delay={0} className="h-full flex flex-col">
        <SilkscreenLabel className="mb-8" refDes="REV A">
          EXPERIENCE
        </SilkscreenLabel>

        <div className="space-y-6 flex-1">
          {EXPERIENCE_CONTENT.map((exp) => (
            <GlassCard key={exp.rev} className="relative overflow-hidden p-6 h-full" tilt={false} sheen>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <SilkscreenLabel className="mb-1">{exp.role}</SilkscreenLabel>
                  <p className="text-ink-primary font-medium text-lg">
                    {exp.organization}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <SilkscreenLabel className="text-ink-tertiary">{exp.location}</SilkscreenLabel>
                  <SilkscreenLabel className="text-copper-warm">{exp.period}</SilkscreenLabel>
                </div>
              </div>

              <ul className="space-y-3" role="list">
                {exp.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-ink-secondary leading-relaxed relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-copper-warm/50"
                  >
                    <span className="text-base">{bullet}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </Reveal>
    </section>
  );
};