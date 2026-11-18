import { ABOUT_CONTENT } from '../../content';
import { MetalText } from '../ui/MetalText';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 px-6 md:px-12">
      <Reveal delay={0} className="max-w-4xl">
        <SilkscreenLabel className="mb-6" refDes={ABOUT_CONTENT.ref}>
          {ABOUT_CONTENT.packageType}
        </SilkscreenLabel>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="flex-1 min-w-0">
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-baseline gap-3 mb-6">
                <MetalText size="3xl">{ABOUT_CONTENT.partNumber}</MetalText>
                <SilkscreenLabel>DATASHEET</SilkscreenLabel>
              </div>

              <h2 className="text-ink-secondary text-lg mb-4 font-medium">
                General Description
              </h2>

              <p className="text-ink-secondary leading-relaxed text-base mb-8">
                {ABOUT_CONTENT.generalDescription}
              </p>

              <h2 className="text-ink-secondary text-lg mb-4 font-medium">
                Key Features
              </h2>

              <ul className="space-y-3">
                {ABOUT_CONTENT.keyFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-ink-secondary leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-copper-warm/50" />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-96 flex-shrink-0">
            <div className="glass-card p-6 overflow-hidden">
              <h2 className="text-ink-secondary text-lg mb-4 font-medium flex items-center gap-2">
                <SilkscreenLabel>PINOUT</SilkscreenLabel>
                Electrical Characteristics
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-copper/20">
                      <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen">Pin</th>
                      <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen">Parameter</th>
                      <th className="text-left pb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-silkscreen">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ABOUT_CONTENT.pinSpecs.map((pin) => (
                      <tr key={pin.pin} className="border-b border-copper/10 last:border-0">
                        <td className="py-3 font-mono text-ink-tertiary">{pin.pin}</td>
                        <td className="py-3 font-medium text-ink-secondary">{pin.parameter}</td>
                        <td className="py-3 text-ink-primary">{pin.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};