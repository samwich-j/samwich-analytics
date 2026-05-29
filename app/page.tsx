'use client';

import Link from 'next/link';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SkillsSection } from '@/components/ui/SkillsSection';
import { SectionHeading } from '@/components/ui/SectionHeading';

const PROJECTS = [
  {
    title: 'Midway Open Space Bond Report',
    description: 'Designed and administered a community survey to evaluate resident support for an open space bond initiative. Conducted statistical analysis in R, produced visualizations, and delivered a professional report used to guide city planning decisions.',
    tags: ['Survey Design', 'R', 'Report Writing'],
    link: 'https://drive.google.com/file/d/1sHuA9nharRDQ-Or0MefJG4dNN2jp2kOL/view?usp=sharing',
  },
  {
    title: 'Call of Duty: Warzone Geospatial Analysis',
    description: 'Built a data engineering pipeline to scrape, clean, and spatially analyze thousands of in-game kill events across the Caldera map. Identified high-traffic zones and strategic hotspots using Python and geospatial libraries.',
    tags: ['Python', 'Data Engineering', 'Geospatial Analysis'],
    link: 'https://github.com/samwich-j/CODCalderaAnalysis',
  },
  {
    title: 'Utah Valley Growth & Prosperity Summit',
    description: 'Partnered with the Utah Valley Chamber of Commerce to design surveys, clean response data, and produce presentation-ready analytics for a regional economic summit attended by business and civic leaders.',
    tags: ['Data Presentation', 'Survey Design', 'Data Cleaning & Analytics'],
    link: 'https://drive.google.com/file/d/1xZmydzlQCSDvf64RcuuJPSaClRoK0Dx8/view?usp=sharing',
  },
  {
    title: 'Utah Valley Growth & Prosperity Summit 2025',
    description: 'Led survey design, data collection, and analysis for the 2025 Growth & Prosperity Summit. Produced a comprehensive report with data-driven insights for regional business and civic leaders.',
    tags: ['Survey Design', 'Data Analysis', 'Report Writing'],
    link: 'https://drive.google.com/file/d/1IxZcEjnaDVoo4AKdbZH_QVJ3aU-FRrAh/view?usp=sharing',
  },
];

export default function PortfolioPage() {
  return (
    <div className="content-inner">
      {/* Hero */}
      <section style={{ marginBottom: 56 }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 500, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Statistical Data Analyst
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 20 }}>
          Hi, I&apos;m Sam Johnston
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 640, marginBottom: 32 }}>
          I&apos;m a statistical data analyst specializing in large-scale data processing, interactive dashboard development, and survey and experimental design. I build robust, data-driven solutions that help organizations make confident decisions from complex datasets.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScBjRUWuAQFgdRpcjU-J6U-hC4PuWV3ifB34nQVQqTiYgf0hw/viewform?usp=sharing&ouid=100469976106773205149"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 'var(--radius-md)',
              background: 'var(--accent)', color: '#fff',
              fontWeight: 600, fontSize: 'var(--text-sm)',
              textDecoration: 'none', transition: 'opacity var(--trans-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get in touch
          </a>
          <Link
            href="/resume"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', color: 'var(--text-primary)',
              fontWeight: 500, fontSize: 'var(--text-sm)',
              textDecoration: 'none', transition: 'background var(--trans-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            View résumé
          </Link>
        </div>
      </section>

      {/* Projects */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeading>Projects</SectionHeading>
        <div className="project-grid">
          {PROJECTS.map(p => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            href="/portfolio"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', color: 'var(--text-primary)',
              fontWeight: 500, fontSize: 'var(--text-sm)',
              textDecoration: 'none', transition: 'background var(--trans-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            View all projects →
          </Link>
        </div>
      </section>

      {/* Skills */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeading>Skills</SectionHeading>
        <SkillsSection />
      </section>
    </div>
  );
}
