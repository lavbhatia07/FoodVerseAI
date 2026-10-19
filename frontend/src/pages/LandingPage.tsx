import React from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  ArrowRight,
  Cpu,
  Database,
  Layers,
  CheckCircle2,
  Lock,
  Activity
} from 'lucide-react';

interface LandingPageProps {
  onEnterWorkspace: (page?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace }) => {
  const capabilities = [
    {
      id: 'food-recognition',
      title: 'Food Recognition & Nutrition',
      subtitle: 'Computer Vision & USDA Composition',
      icon: Scan,
      color: 'var(--emerald-400)',
      description: 'Upload meal imagery or query food items to instantly classify food types, compute calibrated macronutrient distributions, and examine micronutrients with transparent uncertainty bounds.'
    },
    {
      id: 'freshness',
      title: 'Freshness & Spoilage Detection',
      subtitle: 'Surface Biomarker & Degradation Modeling',
      icon: Sparkles,
      color: 'var(--mint-400)',
      description: 'Identify visual fungal mycelium, enzymatic browning, cuticular dehydration, and structural breakdown combined with shelf-life storage context to prevent food waste and maintain safe kitchen practices.'
    },
    {
      id: 'hygiene',
      title: 'Restaurant Hygiene Monitoring',
      subtitle: 'Video & Image Computer Vision Auditing',
      icon: ShieldAlert,
      color: 'var(--amber-400)',
      description: 'Review kitchen video and photo streams to audit glove compliance, hair restraint adherence, cross-contamination vectors, and stainless prep sanitization with timestamped evidence logs.'
    },
    {
      id: 'cooking',
      title: 'Smart Cooking Assistance',
      subtitle: 'Conversational Culinary Reasoning',
      icon: ChefHat,
      color: 'var(--lime-400)',
      description: 'Turn available refrigerator ingredients into gourmet structured recipes with step-by-step interactive cooking timers, chef tips, hands-free voice synthesis, and dynamic ingredient substitutions.'
    },
    {
      id: 'meal-planner',
      title: 'Personalized Meal Planner',
      subtitle: 'Constraint Solver & Allergen Guardrails',
      icon: CalendarCheck,
      color: 'var(--cyan-400)',
      description: 'Generate comprehensive 1-day or 7-day nutritional plans adhering strictly to dietary patterns and allergen exclusions, complete with consolidated grocery lists organized by supermarket aisle.'
    }
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3.5rem', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-emerald">
            <Activity size={13} />
            Academic Capstone & Production AI Platform
          </span>
          <span className="badge badge-cyan">Python 3.13 • React 19 • Spatial UI</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
          FoodVerse <span style={{ background: 'linear-gradient(135deg, var(--emerald-400) 0%, var(--lime-400) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          <br />
          <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Multimodal Food Intelligence Agent
          </span>
        </h1>

        <p style={{ maxWidth: '780px', margin: '0 auto 2.5rem', fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          A unified, multimodal food intelligence platform synthesizing computer vision, video temporal auditing,
          scientific USDA nutrition databases, and large language model culinary reasoning to deliver actionable,
          transparent food decisions across households, restaurants, and clinical dietetics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
            onClick={() => onEnterWorkspace('dashboard')}
          >
            <span>Launch Intelligence Workspace</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}
            onClick={() => onEnterWorkspace('about')}
          >
            <Layers size={18} color="var(--emerald-400)" />
            <span>Architecture & Methodology</span>
          </button>
        </div>
      </section>

      {/* 5 Core Capabilities Cards */}
      <section style={{ marginTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Five Specialized Multimodal Pillars</h2>
          <p style={{ color: 'var(--text-muted)' }}>Each domain operates as an autonomous, modular service with transparent confidence modeling.</p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {capabilities.map(cap => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className="glass-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                onClick={() => onEnterWorkspace(cap.id)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cap.color
                    }}>
                      <Icon size={24} />
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Explore</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{cap.title}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--emerald-400)', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {cap.subtitle}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {cap.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Open Console</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture Highlights */}
      <section className="glass-panel" style={{ marginTop: '4.5rem', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Decoupled Multimodal Architecture</h2>
          <p style={{ color: 'var(--text-muted)' }}>Engineered according to rigorous software engineering and AI safety standards.</p>
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Cpu size={22} color="var(--emerald-400)" />
              <h4 style={{ fontSize: '1.1rem' }}>Modular FastAPI Backend</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald-400)" />
                Pydantic v2 strict serialization
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald-400)" />
                Provider-agnostic AI adapters
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald-400)" />
                Secure file upload screening
              </li>
            </ul>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Database size={22} color="var(--mint-400)" />
              <h4 style={{ fontSize: '1.1rem' }}>Zero-Config Persistence</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--mint-400)" />
                SQLAlchemy 2.0 ORM schema
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--mint-400)" />
                SQLite development & Postgres production
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--mint-400)" />
                Full audit trails & JSON report exports
              </li>
            </ul>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Lock size={22} color="var(--lime-400)" />
              <h4 style={{ fontSize: '1.1rem' }}>Scientific AI Guardrails</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--lime-400)" />
                Volume-vs-mass uncertainty disclosures
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--lime-400)" />
                Microbiological safety disclaimers
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--lime-400)" />
                Strict allergen elimination solver
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
