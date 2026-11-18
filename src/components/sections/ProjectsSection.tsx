import { useState, CSSProperties } from 'react';
import { PROJECTS_CONTENT } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { MetalText } from '../ui/MetalText';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';
import { CopperButton } from '../ui/CopperButton';
import { useAssetExists } from '../../hooks/useAssetExists';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ProjectCardProps {
  project: typeof PROJECTS_CONTENT[0];
  index: number;
  isFeatured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isFeatured }) => {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const githubExists = useAssetExists(project.githubUrl);
  const demoExists = useAssetExists(project.demoUrl);

  const pinCount = project.pins.length;
  const pinsPerSide = Math.ceil(pinCount / 4);

  const renderPins = (side: 'top' | 'right' | 'bottom' | 'left') => {
    const start = { top: 0, right: pinsPerSide, bottom: pinsPerSide * 2, left: pinsPerSide * 3 }[side];
    const pins = project.pins.slice(start, start + pinsPerSide);
    if (pins.length === 0) return null;

    const isHorizontal = side === 'top' || side === 'bottom';
    return (
      <div
        className={`absolute flex gap-1 ${isHorizontal ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2'} ${
          side === 'top' ? 'top-0 -translate-y-1/2' :
          side === 'bottom' ? 'bottom-0 -translate-y-1/2' :
          side === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 -translate-x-1/2'
        }`}
        aria-hidden="true"
      >
        {pins.map((pin, i) => (
          <div
            key={`${side}-${i}`}
            className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${
              hovered ? 'opacity-100' : 'opacity-60'
            }`}
            style={{
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transitionDelay: `${i * 30}ms`,
            } as CSSProperties}
          >
            <div
              className={`w-1.5 h-1.5 rounded-sm transition-colors ${
                i === 0 && side === 'top' ? 'bg-copper-warm' : 'bg-copper/50'
              }`}
            />
            <SilkscreenLabel className="text-[8px] whitespace-nowrap text-ink-tertiary">{pin}</SilkscreenLabel>
          </div>
        ))}
      </div>
    );
  };

  const sheenStyle: CSSProperties = { '--sheen-opacity': hovered ? 1 : 0 } as CSSProperties;

  return (
    <Reveal delay={index * 80} y={20}>
      <GlassCard
        tilt={!reducedMotion}
        sheen
        className={`relative overflow-visible p-6 min-h-[280px] ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
        style={sheenStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-copper-warm border-2 border-board-base"
          aria-hidden="true"
        />

        <SilkscreenLabel className="absolute -top-6 left-6" refDes={project.ref} />
        <SilkscreenLabel className="absolute -top-6 right-6" refDes={project.packageCode} />

        {renderPins('top')}
        {renderPins('right')}
        {renderPins('bottom')}
        {renderPins('left')}

        <div className="relative z-10 h-full flex flex-col">
          <h3 className="mb-2">
            <MetalText size={isFeatured ? '2xl' : 'xl'} sheen>
              {project.title}
            </MetalText>
          </h3>

          <p className="text-ink-tertiary text-sm mb-3 font-medium">{project.subtitle}</p>
          <p className="text-ink-secondary text-sm mb-4 leading-relaxed flex-1">{project.summary}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.highlights.map((h, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-board-raised/50 border border-copper/20 text-ink-tertiary"
              >
                {h.slice(0, 60)}...
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-copper/10">
            <SilkscreenLabel className="text-ink-silkscreen">{project.period}</SilkscreenLabel>
            <div className="flex-1" />
            {(githubExists || demoExists) && (
              <div className="flex items-center gap-2">
                {githubExists && (
                  <CopperButton variant="ghost" size="sm" asChild>
                    <a href={project.githubUrl!} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </CopperButton>
                )}
                {demoExists && (
                  <CopperButton variant="ghost" size="sm" asChild>
                    <a href={project.demoUrl!} target="_blank" rel="noopener noreferrer">
                      Demo
                    </a>
                  </CopperButton>
                )}
              </div>
            )}
          </div>
        </div>

        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#E3B778"
                strokeWidth="1"
                strokeDasharray="280"
                strokeDashoffset="280"
                style={{
                  animation: 'pulse-draw 1.2s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                } as CSSProperties}
              />
            </svg>
          </div>
        )}
      </GlassCard>
    </Reveal>
  );
};

export const ProjectsSection: React.FC = () => {
  const featured = PROJECTS_CONTENT.find((p) => p.featured);
  const others = PROJECTS_CONTENT.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-20 px-6 md:px-12">
      <Reveal delay={0} className="max-w-6xl">
        <SilkscreenLabel className="mb-8" refDes="PROJ">
          IC PACKAGES
        </SilkscreenLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured && (
            <ProjectCard project={featured} index={0} isFeatured />
          )}
          {others.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </Reveal>

      <style>{`
        @keyframes pulse-draw {
          0% { stroke-dashoffset: 280; opacity: 0; }
          50% { opacity: 0.6; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>
    </section>
  );
};