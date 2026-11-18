import { useState, useEffect } from 'react';
import { PcbCanvas } from './components/PcbCanvas';
import { SignalSpine } from './components/SignalSpine';
import { FloatingNav } from './components/FloatingNav';
import { CoordReadout } from './components/CoordReadout';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { PublicationSection } from './components/sections/PublicationSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { EducationSection } from './components/sections/EducationSection';
import { ContactSection } from './components/sections/ContactSection';
import { NAV_ITEMS } from './content';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export default function App() {
  const [debugNets, setDebugNets] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebugNets((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-board-base text-ink-primary">
      <a href="#about" className="skip-link">
        Skip to main content
      </a>

      <PcbCanvas debugNets={debugNets} />

      <main className="relative z-10 max-w-6xl mx-auto px-6">
        <SignalSpine
          nodes={[
            { id: 'hero', ref: 'U0' },
            { id: 'about', ref: 'U1' },
            { id: 'projects', ref: 'U2' },
            { id: 'experience', ref: 'U3' },
            { id: 'publication', ref: 'DOC1' },
            { id: 'skills', ref: 'SKL' },
            { id: 'education', ref: 'U6' },
            { id: 'contact', ref: 'J1' },
          ]}
        />

        <FloatingNav sectionIds={SECTION_IDS} />
        <CoordReadout />

        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <div className="px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <ExperienceSection />
          <PublicationSection />
        </div>
        <SkillsSection />
        <EducationSection />
        <ContactSection debugNets={debugNets} onToggleDebug={() => setDebugNets((v) => !v)} />

        {/* Extra spacer at bottom for scroll spine */}
        <div className="h-16" aria-hidden="true" />
      </main>
    </div>
  );
}