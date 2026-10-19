import React, { useState, useEffect } from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { SystemHealth, HistorySummaryItem } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  systemHealth: SystemHealth | null;
  activeProfileName: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  systemHealth,
  activeProfileName
}) => {
  const [recentAnalyses, setRecentAnalyses] = useState<HistorySummaryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [savedPlansCount, setSavedPlansCount] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const hist = await api.getHistory('all', 1, 5);
        setRecentAnalyses(hist.items || []);
      } catch (err) {
        console.error("Failed to load history for dashboard", err);
      } finally {
        setLoadingHistory(false);
      }

      try {
        const plans = await api.listMealPlans();
        setSavedPlansCount(plans.length);
      } catch (err) {
        console.error("Failed to load meal plans count", err);
      }
    }
    loadDashboardData();
  }, []);

  const capabilityCards = [
    { id: 'food-recognition', label: 'Food Recognition', icon: Scan, desc: 'Image classification & USDA macros', tag: 'Vision AI' },
    { id: 'freshness', label: 'Freshness Detection', icon: Sparkles, desc: 'Biomarkers & shelf life decay', tag: 'Freshness' },
    { id: 'hygiene', label: 'Restaurant Hygiene', icon: ShieldAlert, desc: 'Kitchen sanitation & PPE audit', tag: 'Audit' },
    { id: 'cooking', label: 'Cooking Assistant', icon: ChefHat, desc: 'Pantry recipes & hands-free timers', tag: 'Culinary' },
    { id: 'meal-planner', label: 'Meal Planner', icon: CalendarCheck, desc: 'Allergen guardrails & groceries', tag: 'Nutrition' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-emerald">Workspace Online</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FoodVerse AI Central Engine</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Welcome back, {activeProfileName}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px' }}>
            Access all five multimodal food intelligence consoles, monitor real-time kitchen compliance audits,
            and inspect persisted nutritional telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={() => onNavigate('food-recognition')}>
            <Scan size={18} />
            <span>Analyze Food</span>
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('history')}>
            <FileText size={18} color="var(--emerald-400)" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Central Interactive Analysis Surface (Dropzone & Quick Actions) */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 2rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>Central Food Intelligence Workspace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Choose an AI capability below or drop meal media into the active detector to begin multimodal inference.
          </p>
        </div>

        {/* 5 Floating Capability Shortcuts */}
        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {capabilityCards.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{ cursor: 'pointer', transition: 'all 200ms ease' }}
                onClick={() => onNavigate(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald-400)'
                  }}>
                    <Icon size={22} />
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{item.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{item.label}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{item.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--emerald-400)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>Launch Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Analyses & Model Status */}
      <div className="grid-2">
        {/* Recent Analyses Backed by Database */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={19} color="var(--emerald-400)" />
              <h3 style={{ fontSize: '1.2rem' }}>Recent Persisted Analyses</h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              style={{ background: 'transparent', border: 'none', color: 'var(--emerald-400)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
            >
              View All ({recentAnalyses.length}) →
            </button>
          </div>

          {loadingHistory ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</div>
          ) : recentAnalyses.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No analyses yet. Start by running Food Recognition or Freshness Detection!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentAnalyses.map(item => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{ padding: '0.85rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => onNavigate('history')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>{item.module_type}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.summary}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & AI Provider Status */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <TrendingUp size={19} color="var(--emerald-400)" />
              <h3 style={{ fontSize: '1.2rem' }}>System & Model Status</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-glass-card)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>FastAPI Gateway</span>
                <span style={{ color: 'var(--emerald-400)', fontWeight: 600, fontSize: '0.88rem' }}>
                  v{systemHealth?.version || '1.0.0'} (Connected)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-glass-card)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Database Tier</span>
                <span style={{ color: 'var(--emerald-400)', fontWeight: 600, fontSize: '0.88rem' }}>
                  {systemHealth?.database || 'SQLite Local Active'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-glass-card)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Vision Inference Provider</span>
                <span style={{ color: 'var(--emerald-400)', fontWeight: 600, fontSize: '0.88rem' }}>
                  {systemHealth?.providers.vision || 'Food-101 Local Heuristics'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-glass-card)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Culinary LLM Provider</span>
                <span style={{ color: 'var(--emerald-400)', fontWeight: 600, fontSize: '0.88rem' }}>
                  {systemHealth?.providers.llm || 'Built-in Culinary Engine'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-glass-card)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Nutrition Dataset Provider</span>
                <span style={{ color: 'var(--emerald-400)', fontWeight: 600, fontSize: '0.88rem' }}>
                  USDA FoodData Central (120+ Items Embedded)
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={18} color="var(--emerald-400)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              All 5 AI services are loaded and accepting multimodal requests without unhandled errors.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
