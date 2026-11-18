import { PROJECTS_CONTENT } from '../../content';
import { GlassCard } from '../ui/GlassCard';
import { MetalText } from '../ui/MetalText';
import { SilkscreenLabel } from '../ui/SilkscreenLabel';
import { Reveal } from '../ui/Reveal';
import { CopperButton } from '../ui/CopperButton';
import { useAssetExists } from '../../hooks/useAssetExists';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ProjectCardProps {
  project: (typeof PROJECTS_CONTENT)[number];
  index: number;
  isFeatured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isFeatured }) => {
  const reducedMotion = useReducedMotion();
  const githubExists = useAssetExists(project.githubUrl);
  const demoExists = useAssetExists(project.demoUrl);

  return (
    <Reveal delay={index * 80} y={20} className={isFeatured ? 'md:col-span-2' : ''}>
      <GlassCard tilt={!reducedMotion} sheen className="relative h-full p-6 md:p-7">
        {/* pin-1 marker */}
        <div
          className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-copper-warm border-2 border-board-base"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between gap-3 mb-3">
            <SilkscreenLabel refDes={project.ref}>{project.packageCode}</SilkscreenLabel>
            {project.status && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-[0.1em] bg-board-raised/50 border border-copper/30 text-copper-warm">
                {project.status}
              </span>
            )}
          </div>

          <h3 className="mb-1">
            <MetalText size={isFeatured ? '2xl' : 'xl'} sheen>
              {project.title}
            </MetalText>
          </h3>
          <p className="text-ink-tertiary text-sm mb-4 font-medium">{project.subtitle}</p>

          <ul className="space-y-2.5 mb-5 flex-1">
            {project.highlights.map((h, i) => (
              <li
                key={i}
                className="relative pl-4 text-sm leading-relaxed text-ink-secondary before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1 before:h-1 before:rounded-full before:bg-copper-warm/60"
              >
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.pins.map((pin) => (
              <span
                key={pin}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-board-raised/50 border border-copper/20 text-ink-secondary"
              >
                {pin}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-copper/10">
            <SilkscreenLabel>{project.period}</SilkscreenLabel>
            <div className="flex-1" />
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
        </div>
      </GlassCard>
    </Reveal>
  );
};

export const ProjectsSection: React.FC = () => {
  const featured = PROJECTS_CONTENT.find((p) => p.featured);
  const others = PROJECTS_CONTENT.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative px-6 md:px-12 py-12 md:py-16">
      <Reveal delay={0}>
        <SilkscreenLabel className="mb-6" refDes="PROJ">
          PROJECTS
        </SilkscreenLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {featured && <ProjectCard project={featured} index={0} isFeatured />}
          {others.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </Reveal>
    </section>
  );
};
