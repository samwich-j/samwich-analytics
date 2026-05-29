'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { Icon } from '@/components/ui/Icon';

const FEATURED_PROJECTS = [
  {
    title: 'Growth & Prosperity Summit Survey',
    client: 'Utah Valley Chamber of Commerce',
    date: 'July – November 2024',
    description: 'Commissioned by the Chamber, I collaborated with statistics faculty to execute a comprehensive public sentiment survey on Utah County priorities. My role spanned the full data lifecycle: designing survey logic in Qualtrics, performing statistical analysis in R, and creating visualizations in Canva. The project culminated in a formal presentation where I was selected to co-present findings to an audience of executives and state officials.',
    tools: ['Qualtrics', 'R', 'Data Visualization', 'Canva'],
    bullets: [
      'Co-presented to business executives and elected officials, including the Governor of Utah and a U.S. Senator.',
      'Translated complex statistical results into a clear, actionable narrative for non-technical stakeholders.',
    ],
    link: 'https://drive.google.com/file/d/1xZmydzlQCSDvf64RcuuJPSaClRoK0Dx8/view?usp=sharing',
  },
  {
    title: 'Growth & Prosperity Conference Survey (MaxDiff)',
    client: 'Utah Valley Chamber of Commerce',
    date: 'November 2025',
    description: 'Commissioned for a return engagement, I collaborated with Dr. David Benson and the UVU Statistics Lab to analyze community priorities. I designed and built the MaxDiff (Maximum Difference Scaling) survey instrument using Sawtooth Software to quantify resident trade-offs. Following data collection, I utilized R to execute advanced statistical inquiries — including Cluster Analysis and Regression modeling — to segment the population.',
    tools: ['Sawtooth Software (MaxDiff)', 'R', 'Cluster Analysis', 'Regression Modeling'],
    bullets: [
      'Identified distinct community priority segments through cluster analysis, enabling targeted policy recommendations.',
      'Co-presented results to summit attendees; finalizing comprehensive report and infographic for publication.',
    ],
    link: 'https://drive.google.com/file/d/1IxZcEjnaDVoo4AKdbZH_QVJ3aU-FRrAh/view?usp=sharing',
  },
  {
    title: 'CRO A/B Test & Dashboard',
    client: '&Collar (D2C Men\'s Dress Shirts)',
    date: '2026',
    description: 'Built a full statistical analysis pipeline and interactive Power BI dashboard around a simulated 30-day A/B test for a D2C apparel brand. The core analytical question: when a site change lifts conversion rate but drops average order value, is it actually worth deploying? This project demonstrates that trusting a single metric blindly can be deceiving.',
    tools: ['Python', 'Power BI', 'Two-Proportion Z-Test', 'Bootstrap Confidence Intervals'],
    bullets: [
      'Variant converts 14% more visitors but each buyer spends 17% less — the AOV drop outweighs the CVR gain.',
      'Deploying the Variant as-is would risk reducing annual revenue by ~$100K at current traffic levels.',
      'Breakeven AOV is $67.57 — a $3.87 lift through upsells or bundles makes the Variant the winner on both metrics.',
    ],
  },
  {
    title: 'Multi-Channel Inventory Forecasting',
    client: 'Nomatic (Premium Travel Gear)',
    date: '2026',
    description: 'Built a demand forecasting and inventory planning pipeline addressing a challenge multi-channel brands face: D2C sales are smooth and seasonal, but B2B wholesale orders are erratic — most days have zero volume, then a retailer suddenly orders 1,500 units. A single forecast model can\'t handle both channels, so this analysis uses different strategies for each and combines them into a unified inventory recommendation with explicit risk trade-offs.',
    tools: ['Python', 'R', 'Facebook Prophet', 'Monte Carlo Simulation', 'Power BI'],
    bullets: [
      'D2C forecast achieves 13.3% MAPE; B2B orders cluster at quarter-ends (z = 4.44, p < 0.00001).',
      'B2B spike sizes follow a log-normal distribution (KS test p = 0.52), enabling probabilistic modeling.',
      'Combined 6-month inventory recommendation: ~42,900 units (base) to ~48,500 units (safety stock).',
    ],
  },
  {
    title: 'Revenue Growth Management Analysis',
    client: 'Swire Coca-Cola',
    date: '2026',
    description: 'Applied the full RGM analytical toolkit to 3 years of beverage distribution data (7.8M transactions, 11 product lines, 158 weeks). The analysis covers five pillars: revenue decomposition into volume/price/mix effects, promotional ROI measurement, XGBoost-driven volume driver identification, Monte Carlo pricing simulation across 7 scenarios, and multi-method demand forecasting.',
    tools: ['Python', 'XGBoost', 'SARIMA', 'Prophet', 'Monte Carlo Simulation', 'Power BI'],
    bullets: [
      '2023–2024 revenue declined -0.9%, driven by volume loss despite stable pricing.',
      'Only 1 of 9 products (Core Power) showed positive promotional ROI.',
      'Best forecasting method: Prophet (avg MAPE 16.6%); XGBoost volume driver model achieves R² = 0.61.',
    ],
  },
  {
    title: 'Menu Performance Analytics',
    client: 'Crumbl Cookies',
    date: 'May 2026',
    description: 'Engineered a multi-source data pipeline integrating web-scraped menu history from CrumblCookieFlavors.com, a flavor catalog, and Reddit sentiment analysis to analyze Crumbl\'s flavor rotation patterns, category distribution, and popularity signals. Built a predictive model for flavor return likelihood using machine learning.',
    tools: ['Python', 'scikit-learn (Random Forest)', 'BeautifulSoup', 'Reddit API', 'Matplotlib'],
    bullets: [
      'Identified rotation patterns and category distribution trends across Crumbl\'s flavor history.',
      'Random Forest model predicts flavor return likelihood based on rotation history and popularity signals.',
    ],
  },
  {
    title: 'Wasatch Cup Healthcare Case Competition',
    client: '1st Place Winner',
    date: 'October 2025',
    description: 'Collaborated with an interdisciplinary team to secure 1st Place in the 2025 Wasatch Cup, the region\'s premier healthcare case competition hosted by the BYU Healthcare Leadership Association. Our winning solution proposed a mobile health clinic to expand critical access to underserved populations in Southern Utah. I spearheaded the data validation phase, modeling financial outcomes to prove the clinic model was both scalable and financially viable.',
    tools: ['Python', 'ARIMA', 'Prophet', 'Financial Modeling'],
    bullets: [
      'Built time-series forecasting models to project patient demand and clinic utilization over a 3-year horizon.',
      'Successfully differentiated our strategy from top competing teams across the state, winning the grand prize.',
    ],
  },
  {
    title: 'MLB Payroll Efficiency & Containerized Data Warehouse',
    client: 'Personal Project',
    date: 'February 2026',
    description: 'Engineered a fully reproducible, containerized PostgreSQL data warehouse using Docker to analyze the historical Lahman Baseball Database (1871–2025). Designed a strict 3rd Normal Form relational schema with composite primary keys and foreign key constraints. Architected an automated ETL pipeline that builds the schema and ingests raw CSV data instantly upon container startup.',
    tools: ['PostgreSQL 16', 'Docker Compose', 'SQL (CTEs, Window Functions, 3NF Design)'],
    bullets: [
      'Developed a post-Moneyball \'Cost Per Win\' metric proving Oakland Athletics achieved near-parity in wins at less than 1/3 of the Yankees\' payroll.',
    ],
    link: 'https://github.com/samwich-j/lahman-baseball-data',
  },
];

const ADDITIONAL_PROJECTS = [
  { title: 'Big 12 Healthcare Case Competition', description: 'Best Presentation Award — structural equation modeling and forecasting for healthcare case competition.', tools: ['SEM', 'Forecasting', 'Data Visualization'] },
  { title: 'Baseball Game Theory Engine', description: 'Nash equilibrium analysis of optimal first-pitch swing strategy using 2024 MLB Statcast data.', tools: ['R', 'Quarto', 'Statcast', 'Lahman DB'] },
  { title: 'Program Learning Outcomes NLP Analysis', description: 'NLP-driven audit of curriculum alignment across degree programs, deployed as interactive dashboards.', tools: ['Python', 'R', 'NLP', 'Power BI'] },
  { title: 'Learning Outcome Hierarchy Analysis', description: 'Maps hierarchical relationships between degree programs and courses to evaluate curriculum alignment.', tools: ['NLP', 'Power BI', 'Semantic Analysis'] },
  { title: 'Student Engagement Research Paper', description: 'Assessed student engagement using the validated Utrecht Student Engagement Scale; contributed to formal manuscript.', tools: ['Qualtrics', 'R', 'UWES Scale'] },
  { title: 'Student Engagement Dashboard Migration', description: 'Migrated proprietary analysis logic from Tableau to Power BI with complex DAX queries.', tools: ['Tableau → Power BI', 'Advanced DAX'] },
  { title: 'Online Program Information Dashboard', description: 'Multi-page Power BI dashboard for university online program performance metrics.', tools: ['Python', 'Power BI', 'Data Wrangling'] },
  { title: 'Survey Software Comparison Experiment', description: 'Comparative usability study commissioned by Sawtooth Software, scaling to a 300-student cohort.', tools: ['Sawtooth', 'Qualtrics', 'SurveyMonkey', 'R'] },
  { title: 'Midway Bond Report', description: 'Public sentiment analysis for a municipal bond proposal; bond successfully passed after survey-guided messaging.', tools: ['Qualtrics', 'R', 'Canva'] },
  { title: 'Multi-Agent LLM for Faculty', description: 'Custom agentic architecture enabling faculty to query institutional datasets through natural language.', tools: ['Python', 'LangGraph', 'Ollama'] },
  { title: 'AutoEDA R Package', description: 'R package generating self-contained interactive HTML exploratory data analysis reports with light/dark theming.', tools: ['R (Plotly, DT, Quarto)', 'HTML/CSS'] },
  { title: 'Stock Market Prediction & Analysis', description: 'Ensemble forecasting models and structural equation modeling for equity price prediction.', tools: ['Python (yfinance)', 'XGBoost', 'Prophet', 'SEM'] },
  { title: 'Prisoner\'s Dilemma Behavioral Experiment', description: 'Six-variant experimental design analyzing human-computer interaction persistence; currently on third iteration.', tools: ['Custom Web Interface', 'R', 'Excel'] },
  { title: 'Call of Duty Geospatial Analysis', description: 'Parsed Warzone Caldera map telemetry files to identify optimal landing zones by survival time.', tools: ['Python', 'ETL', 'Heat Mapping'] },
];

function FeaturedCard({ project }: { project: typeof FEATURED_PROJECTS[0] }) {
  const [hovered, setHovered] = useState(false);
  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)',
        padding: 24, border: '1px solid var(--border)',
        borderLeft: `3px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: hovered ? 'var(--shadow)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all var(--trans-normal)',
        cursor: project.link ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
        <h3 style={{ fontSize: 'var(--text-h4)', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.3, margin: 0 }}>
          {project.title}
        </h3>
        {project.link && <Icon name="externalLink" size={14} color="var(--text-muted)" />}
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0 0 12px' }}>
        {project.client} &nbsp;·&nbsp; {project.date}
      </p>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.7, margin: '0 0 12px' }}>
        {project.description}
      </p>

      <ul style={{ margin: '0 0 14px', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {project.bullets.map((b, i) => (
          <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b}</li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tools.map(t => <Tag key={t} label={t} category="accent" small />)}
      </div>
    </div>
  );

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {card}
      </a>
    );
  }
  return card;
}

function CompactRow({ project }: { project: typeof ADDITIONAL_PROJECTS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 12px',
        padding: '12px 16px', borderRadius: 'var(--radius-md)',
        background: hovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'background var(--trans-fast)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
        {project.title}
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', flex: 1, minWidth: 120 }}>
        {project.description}
      </span>
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flexShrink: 0 }}>
        {project.tools.map(t => <Tag key={t} label={t} category="gold" small />)}
      </span>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="content-inner">
      {/* Header */}
      <section style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 500, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Featured Work
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 16 }}>
          Portfolio
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 640 }}>
          A collection of research, analytics, and data engineering projects spanning survey design, statistical modeling, forecasting, and interactive dashboards.
        </p>
      </section>

      {/* Featured Projects */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeading>Featured Projects</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FEATURED_PROJECTS.map(p => <FeaturedCard key={p.title} project={p} />)}
        </div>
      </section>

      {/* Additional Projects */}
      <section style={{ marginBottom: 56 }}>
        <SectionHeading>Additional Projects</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ADDITIONAL_PROJECTS.map(p => <CompactRow key={p.title} project={p} />)}
        </div>
      </section>
    </div>
  );
}
