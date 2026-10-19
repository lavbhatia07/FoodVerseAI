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
      clayClass: 'card-clay-mint',
      iconBg: 'linear-gradient(135deg, #10B981, #059669)',
      badgeClass: 'badge-emerald',
      actionColor: '#059669',
      description: 'Upload meal imagery or query food items to instantly classify food types, compute calibrated macronutrient distributions, and examine micronutrients with transparent uncertainty bounds.'
    },
    {
      id: 'freshness',
      title: 'Freshness & Spoilage Detection',
      subtitle: 'Surface Biomarker & Degradation Modeling',
      icon: Sparkles,
      clayClass: 'card-clay-lime',
      iconBg: 'linear-gradient(135deg, #84CC16, #65A30D)',
      badgeClass: 'badge-amber',
      actionColor: '#65A30D',
      description: 'Identify visual fungal mycelium, enzymatic browning, cuticular dehydration, and structural breakdown combined with shelf-life storage context to prevent food waste and maintain safe kitchen practices.'
    },
    {
      id: 'hygiene',
      title: 'Restaurant Hygiene Monitoring',
      subtitle: 'Video & Image Computer Vision Auditing',
      icon: ShieldAlert,
      clayClass: 'card-clay-blue',
      iconBg: 'linear-gradient(135deg, #0284C7, #0369A1)',
      badgeClass: 'badge-cyan',
      actionColor: '#0284C7',
      description: 'Review kitchen video and photo streams to audit glove compliance, hair restraint adherence, cross-contamination vectors, and stainless prep sanitization with timestamped evidence logs.'
    },
    {
      id: 'cooking',
      title: 'Smart Cooking Assistance',
      subtitle: 'Conversational Culinary Reasoning',
      icon: ChefHat,
      clayClass: 'card-clay-peach',
      iconBg: 'linear-gradient(135deg, #EA580C, #C2410C)',
      badgeClass: 'badge-coral',
      actionColor: '#EA580C',
      description: 'Turn available refrigerator ingredients into gourmet structured recipes with step-by-step interactive cooking timers, chef tips, hands-free voice synthesis, and dynamic ingredient substitutions.'
    },
    {
      id: 'meal-planner',
      title: 'Personalized Meal Planner',
      subtitle: 'Constraint Solver & Allergen Guardrails',
      icon: CalendarCheck,
      clayClass: 'card-clay-purple',
      iconBg: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
      badgeClass: 'badge-purple',
      actionColor: '#7C3AED',
      description: 'Generate comprehensive 1-day or 7-day nutritional plans adhering strictly to dietary patterns and allergen exclusions, complete with consolidated grocery lists organized by supermarket aisle.'
    }
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
            <Activity size={14} />
            Academic Capstone & Production AI Platform
          </span>
          <span className="badge badge-cyan" style={{ fontWeight: 700 }}>Python 3.13 • React 19 • Colorful Claymorphism</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          FoodVerse <span style={{ background: 'linear-gradient(135deg, #10B981 0%, #0284C7 50%, #EA580C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          <br />
          <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2.3rem)', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Multimodal Food Intelligence Agent
          </span>
        </h1>

        <p style={{ maxWidth: '780px', margin: '0 auto 2.5rem', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          A unified, multimodal food intelligence platform synthesizing computer vision, video temporal auditing,
          scientific USDA nutrition databases, and large language model culinary reasoning to deliver actionable,
          transparent food decisions across households, restaurants, and clinical dietetics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-clay-primary"
            style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => onEnterWorkspace('dashboard')}
          >
            <span>Launch Intelligence Workspace</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn-clay-secondary"
            style={{ padding: '0.95rem 2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => onEnterWorkspace('about')}
          >
            <Layers size={18} color="#059669" />
            <span>Architecture & Methodology</span>
          </button>
        </div>
      </section>

      {/* 5 Core Capabilities Cards */}
      <section style={{ marginTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Five Specialized Multimodal Pillars</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Each domain operates as an autonomous, modular service with transparent confidence modeling.</p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {capabilities.map(cap => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className={cap.clayClass}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', transition: 'all 0.25s ease' }}
                onClick={() => onEnterWorkspace(cap.id)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div className="clay-icon-container" style={{ background: cap.iconBg, color: '#FFFFFF', boxShadow: '0 8px 18px rgba(0,0,0,0.12)' }}>
                      <Icon size={24} />
                    </div>
                    <span className={`badge ${cap.badgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>Explore</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>{cap.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: cap.actionColor, fontWeight: 700, marginBottom: '0.85rem' }}>
                    {cap.subtitle}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {cap.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: cap.actionColor, fontSize: '0.88rem', fontWeight: 700 }}>
                  <span>Open Console</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture Highlights */}
      <section className="card-clay" style={{ marginTop: '4.5rem', padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Decoupled Multimodal Architecture</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Engineered according to rigorous software engineering and AI safety standards.</p>
        </div>

        <div className="grid-3" style={{ gap: '1.75rem' }}>
          <div style={{ background: '#ECFDF5', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #A7F3D0', boxShadow: 'var(--clay-shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="clay-icon-container" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
                <Cpu size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Modular FastAPI Backend</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Pydantic v2 strict serialization</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Provider-agnostic AI adapters</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Secure file upload screening</span>
              </li>
            </ul>
          </div>

          <div style={{ background: '#F0F9FF', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #BAE6FD', boxShadow: 'var(--clay-shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="clay-icon-container" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0284C7, #0369A1)', color: '#fff' }}>
                <Database size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Zero-Config Persistence</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#0284C7" />
                <span>SQLAlchemy 2.0 ORM schema</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#0284C7" />
                <span>SQLite development & Postgres production</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#0284C7" />
                <span>Full audit trails & JSON report exports</span>
              </li>
            </ul>
          </div>

          <div style={{ background: '#FFFBEB', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FDE68A', boxShadow: 'var(--clay-shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="clay-icon-container" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}>
                <Lock size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Scientific AI Guardrails</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#D97706" />
                <span>Volume-vs-mass uncertainty disclosures</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#D97706" />
                <span>Microbiological safety disclaimers</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#D97706" />
                <span>Strict allergen elimination solver</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
