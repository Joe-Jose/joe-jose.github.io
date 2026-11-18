import { Fragment } from 'react';
import { BOM_SKILLS, BOM_FOOTER_NOTE } from '../../content';
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

const CATEGORY_LABELS: Record<string, string> = {
  'Languages': 'LANG',
  'Embedded & Firmware': 'FW',
  'Hardware & MCUs': 'HW',
  'Protocols & HDLs': 'BUS',
  'Tools & EDA': 'EDA',
  'Engineering': 'ENG',
};

export const SkillsSection: React.FC = () => {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] || cat.toUpperCase().slice(0, 4),
    items: BOM_SKILLS.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="relative py-20 px-6 md:px-12">
      <Reveal delay={0} className="max-w-4xl">
        <SilkscreenLabel className="mb-8" refDes="BOM">
          BILL OF MATERIALS
        </SilkscreenLabel>

        <GlassCard className="p-6 overflow-hidden" tilt sheen>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-copper/20">
                  <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen w-16">Ref</th>
                  <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen">Component</th>
                  <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen w-24">Category</th>
                  <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen">Spec Note</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map((group) => (
                  <Fragment key={group.category}>
                    <tr className="border-b border-copper/10">
                      <td className="py-2 font-mono text-copper-warm" colSpan={4}>
                        <SilkscreenLabel>{group.label} // {group.category}</SilkscreenLabel>
                      </td>
                    </tr>
                    {group.items.map((skill) => (
                      <tr
                        key={skill.ref}
                        className="border-b border-copper/10 last:border-0 transition-colors hover:bg-board-raised/30"
                      >
                        <td className="py-2.5 font-mono text-ink-tertiary">{skill.ref}</td>
                        <td className="py-2.5 text-ink-primary font-medium">{skill.component}</td>
                        <td className="py-2.5">
                          <SilkscreenLabel>{group.label}</SilkscreenLabel>
                        </td>
                        <td className="py-2.5 text-ink-secondary text-sm">{skill.specNote}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-copper/10 flex items-center justify-between">
            <SilkscreenLabel className="text-copper-warm">{BOM_FOOTER_NOTE}</SilkscreenLabel>
            <SilkscreenLabel>TOTAL: {BOM_SKILLS.length} ITEMS</SilkscreenLabel>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
};