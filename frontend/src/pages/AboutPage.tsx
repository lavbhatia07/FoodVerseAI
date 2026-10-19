import React from 'react';
import {
  Info,
  Layers,
  BookOpen,
  ShieldAlert,
  Cpu,
  Database,
  Award,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' }}>
            <Info size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem' }}>About FoodVerse AI & Engineering Methodology</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Academic capstone project specification, multimodal AI system design, dataset provenance, and ethical safety boundaries.
            </p>
          </div>
        </div>
      </div>

      {/* Abstract & Research Context */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <h2 style={{ fontSize: '1.45rem', marginBottom: '0.85rem', color: 'var(--text-secondary)' }}>
          Research Motivation & System Abstract
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1rem' }}>
          In modern culinary environments, commercial restaurants, and household meal management, decision-making is heavily fragmented.
          Nutritional tracking depends on manual calorie logging; food freshness is judged purely through subjective visual inspection
          without calibrated shelf-life estimation; restaurant kitchen hygiene relies on periodic, infrequent physical audits;
          and cooking tools are typically restricted to static text recipes without interactive voice or substitution intelligence.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
          <strong>FoodVerse AI</strong> addresses these systemic challenges through a unified multimodal food intelligence architecture.
          By combining computer vision, video temporal frame extraction, structured USDA composition datasets, and culinary natural language
          reasoning into a high-performance spatial user interface, FoodVerse AI demonstrates the practical power of AI in kitchen workflows,
          spoilage mitigation, operational safety, and personalized dietetics.
        </p>
      </div>

      {/* Technology Stack & Datasets */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="var(--emerald-400)" />
            <span>Curated Datasets & Provenance</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li>
              <strong style={{ color: '#fff' }}>Food-101 Benchmark Dataset:</strong>
              <div style={{ marginTop: '0.2rem' }}>
                101 food classes covering 101,000 real-world food photographs used to train and calibrate classification heuristics.
              </div>
            </li>
            <li>
              <strong style={{ color: '#fff' }}>USDA FoodData Central (FDC):</strong>
              <div style={{ marginTop: '0.2rem' }}>
                Standard Reference Legacy and Foundation Foods composition dataset providing baseline macronutrients and micronutrients per 100g.
              </div>
            </li>
            <li>
              <strong style={{ color: '#fff' }}>HACCP & FDA Food Code:</strong>
              <div style={{ marginTop: '0.2rem' }}>
                Kitchen sanitation classification rules modeling cross-contamination boundaries, single-use glove adherence, and cold-chain storage.
              </div>
            </li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} color="var(--mint-400)" />
            <span>Production Technology Stack</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Frontend Framework</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>React 19 + TypeScript + Vite</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>UI & Design System</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>Spatial Midnight-Green CSS Tokens</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Backend Engine</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>FastAPI (Python 3.13) + Pydantic v2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Persistence Tier</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>SQLAlchemy 2.0 (SQLite / Postgres)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Audio & Speech I/O</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>Web Speech API (STT & TTS)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Quality Assurance</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>pytest automated test suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ethical AI & Scientific Limitations */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose-400)' }}>
          <ShieldAlert size={22} color="var(--rose-400)" />
          <span>Scientific Limitations & Ethical Boundaries</span>
        </h3>

        <div className="grid-2" style={{ gap: '1.5rem', marginTop: '1rem' }}>
          <div className="glass-card" style={{ borderColor: 'rgba(251, 113, 133, 0.25)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--rose-400)' }}>
              1. Volume vs. Mass Uncertainty
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              2D computer vision images estimate food volume based on surface geometry and container perspective,
              not physical mass. Real caloric and macronutrient values vary with moisture content, oil immersion,
              and internal density.
            </p>
          </div>

          <div className="glass-card" style={{ borderColor: 'rgba(251, 113, 133, 0.25)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--rose-400)' }}>
              2. Microbiological Spoilage Boundaries
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Visual analysis detects surface mycelium, cellular weeping, and discoloration. It cannot detect
              tasteless, odorless, invisible bacterial pathogens (e.g. <em>Salmonella</em>, <em>Listeria</em>,
              <em>E. coli</em>, or <em>Botulinum</em>). Food that looks intact may still harbor microbial toxins.
            </p>
          </div>

          <div className="glass-card" style={{ borderColor: 'rgba(251, 113, 133, 0.25)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--rose-400)' }}>
              3. Non-Regulatory Hygiene Auditing
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Computer vision hygiene scoring serves solely as an assistive training and internal quality benchmark.
              It does not substitute for statutory public health inspections or certified HACCP health department audits.
            </p>
          </div>

          <div className="glass-card" style={{ borderColor: 'rgba(251, 113, 133, 0.25)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--rose-400)' }}>
              4. Lifestyle Planning vs. Medical Nutrition
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Meal plans provide general wellness and culinary guidance. They do not constitute clinical Medical
              Nutrition Therapy (MNT). Individuals with severe anaphylactic allergies or chronic metabolic diseases
              must verify commercial packaging labels and consult licensed physicians.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
