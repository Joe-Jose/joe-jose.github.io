import { BOM_SKILLS } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';

const CATEGORY_ORDER = [
  'Languages',
  'Embedded & Firmware',
  'Hardware & MCUs',
  'Protocols & HDLs',
  'Tools & EDA',
  'Engineering',
] as const;

const CATEGORY_TITLES: Record<string, string> = {
  Engineering: 'Soft skills',
};

export const SkillsSection: React.FC = () => {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: BOM_SKILLS.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="relative px-6 md:px-12 py-12 md:py-16">
      <Reveal delay={0}>
        <SilkscreenLabel className="mb-6" refDes="BOM">
          SKILLS
        </SilkscreenLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grouped.map((group) => (
            <GlassCard key={group.category} className="p-5" tilt={false} sheen>
              <SilkscreenLabel className="block mb-3 text-copper-warm/80">
                {CATEGORY_TITLES[group.category] ?? group.category}
              </SilkscreenLabel>
              <ul className="divide-y divide-copper/10">
                {group.items.map((skill) => (
                  <li key={skill.ref} className="flex items-baseline gap-3 py-2">
                    <span className="w-9 flex-shrink-0 font-mono text-[10px] text-ink-tertiary">{skill.ref}</span>
                    <span className="text-sm text-ink-primary">{skill.component}</span>
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
