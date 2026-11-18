import { EDUCATION_CONTENT } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { MetalText } from '../ui/MetalText';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="relative py-20 px-6 md:px-12">
      <Reveal delay={0} className="max-w-2xl">
        <SilkscreenLabel className="mb-8" refDes={EDUCATION_CONTENT.ref}>
          EDUCATION
        </SilkscreenLabel>

        <GlassCard className="p-6 md:p-8" tilt sheen>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-6">
            <div>
              <MetalText size="2xl" className="mb-2">
                {EDUCATION_CONTENT.institution}
              </MetalText>
              <p className="text-ink-primary font-medium text-lg">{EDUCATION_CONTENT.degree}</p>
            </div>
            <div className="flex flex-col items-end md:items-end gap-1 text-right">
              <SilkscreenLabel className="text-copper-warm">{EDUCATION_CONTENT.honors}</SilkscreenLabel>
              <SilkscreenLabel className="text-ink-tertiary">{EDUCATION_CONTENT.period}</SilkscreenLabel>
              <div className="flex items-center gap-2 text-ink-secondary">
                <SilkscreenLabel>GPA</SilkscreenLabel>
                <span className="font-mono font-medium text-ink-primary">{EDUCATION_CONTENT.gpa}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-copper/10">
            <h4 className="text-ink-secondary text-sm mb-3 font-medium flex items-center gap-2">
              <SilkscreenLabel>COURSEWORK</SilkscreenLabel>
            </h4>
            <div className="flex flex-wrap gap-2">
              {EDUCATION_CONTENT.coursework.map((course, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-pill bg-board-raised/50 border border-copper/20 text-ink-tertiary text-sm font-mono"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
};