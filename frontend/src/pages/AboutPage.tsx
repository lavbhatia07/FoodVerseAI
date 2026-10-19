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
      <div className="card-clay-mint" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 8px 18px rgba(16, 185, 129, 0.35)' }}>
            <Info size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>About FoodVerse AI & Engineering Methodology</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              Academic capstone project specification, multimodal AI system design, dataset provenance, and ethical safety boundaries.
            </p>
          </div>
        </div>
      </div>

      {/* Abstract & Research Context */}
      <div className="card-clay" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
          Research Motivation & System Abstract
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1rem' }}>
          In modern culinary environments, commercial restaurants, and household meal management, decision-making is heavily fragmented.
          Nutritional tracking depends on manual calorie logging; food freshness is judged purely through subjective visual inspection
          without calibrated shelf-life estimation; restaurant kitchen hygiene relies on periodic, infrequent physical audits;
          and cooking tools are typically restricted to static text recipes without interactive voice or substitution intelligence.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
          <strong style={{ color: 'var(--text-primary)' }}>FoodVerse AI</strong> addresses these systemic challenges through a unified multimodal food intelligence architecture.
          By combining computer vision, video temporal frame extraction, structured USDA composition datasets, and culinary natural language
          reasoning into a high-performance colorful claymorphic user interface, FoodVerse AI demonstrates the practical power of AI in kitchen workflows,
          spoilage mitigation, operational safety, and personalized dietetics.
        </p>
      </div>

      {/* Technology Stack & Datasets */}
      <div className="grid-2">
        <div className="card-clay" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div className="clay-icon-container" style={{ width: '38px', height: '38px', background: '#ECFDF5', color: '#059669' }}>
              <Database size={18} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Curated Datasets & Provenance</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
            <li style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#047857', fontSize: '0.95rem' }}>Food-101 Benchmark Dataset:</strong>
              <div style={{ marginTop: '0.35rem', lineHeight: 1.5 }}>
                101 food classes covering 101,000 real-world food photographs used to train and calibrate classification heuristics.
              </div>
            </li>
            <li style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0284C7', fontSize: '0.95rem' }}>USDA FoodData Central (FDC):</strong>
              <div style={{ marginTop: '0.35rem', lineHeight: 1.5 }}>
                Standard Reference Legacy and Foundation Foods composition dataset providing baseline macronutrients and micronutrients per 100g.
              </div>
            </li>
            <li style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#EA580C', fontSize: '0.95rem' }}>HACCP & FDA Food Code:</strong>
              <div style={{ marginTop: '0.35rem', lineHeight: 1.5 }}>
                Kitchen sanitation classification rules modeling cross-contamination boundaries, single-use glove adherence, and cold-chain storage.
              </div>
            </li>
          </ul>
        </div>

        <div className="card-clay" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div className="clay-icon-container" style={{ width: '38px', height: '38px', background: '#F0F9FF', color: '#0284C7' }}>
              <Cpu size={18} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Production Technology Stack</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Frontend Framework</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>React 19 + TypeScript + Vite</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>UI & Design System</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Colorful Claymorphism CSS Tokens</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Backend Engine</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>FastAPI (Python 3.13) + Pydantic v2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Persistence Tier</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>SQLAlchemy 2.0 (SQLite / Postgres)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Audio & Speech I/O</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Web Speech API (STT & TTS)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Quality Assurance</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>pytest automated test suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ethical AI & Scientific Limitations */}
      <div className="card-clay" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div className="clay-icon-container" style={{ width: '38px', height: '38px', background: '#FFE4E6', color: '#BE123C' }}>
            <ShieldAlert size={18} />
          </div>
          <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>
            Scientific Limitations & Ethical Boundaries
          </h3>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ background: '#FFF1F2', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FECDD3', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#BE123C', fontWeight: 700 }}>
              1. Volume vs. Mass Uncertainty
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#9F1239', lineHeight: 1.6, margin: 0 }}>
              2D computer vision images estimate food volume based on surface geometry and container perspective,
              not physical mass. Real caloric and macronutrient values vary with moisture content, oil immersion,
              and internal density.
            </p>
          </div>

          <div style={{ background: '#FFF1F2', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FECDD3', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#BE123C', fontWeight: 700 }}>
              2. Microbiological Spoilage Boundaries
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#9F1239', lineHeight: 1.6, margin: 0 }}>
              Visual analysis detects surface mycelium, cellular weeping, and discoloration. It cannot detect
              tasteless, odorless, invisible bacterial pathogens (e.g. <em>Salmonella</em>, <em>Listeria</em>,
              <em>E. coli</em>, or <em>Botulinum</em>). Food that looks intact may still harbor microbial toxins.
            </p>
          </div>

          <div style={{ background: '#FFF1F2', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FECDD3', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#BE123C', fontWeight: 700 }}>
              3. Non-Regulatory Hygiene Auditing
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#9F1239', lineHeight: 1.6, margin: 0 }}>
              Computer vision hygiene scoring serves solely as an assistive training and internal quality benchmark.
              It does not substitute for statutory public health inspections or certified HACCP health department audits.
            </p>
          </div>

          <div style={{ background: '#FFF1F2', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FECDD3', boxShadow: 'var(--clay-shadow-card)' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#BE123C', fontWeight: 700 }}>
              4. Lifestyle Planning vs. Medical Nutrition
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#9F1239', lineHeight: 1.6, margin: 0 }}>
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
