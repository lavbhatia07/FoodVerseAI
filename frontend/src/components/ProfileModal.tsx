import React from 'react';
import { UserCheck, X, Shield, Award, Sparkles, Heart } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: string;
  onSelectProfile: (name: string, diet: string, cals: number) => void;
}

const PRESET_PROFILES = [
  {
    name: "Dr. Elena Vance",
    role: "Academic AI Capstone Researcher",
    diet: "Omnivore",
    calories: 2200,
    icon: Award,
    description: "Evaluating multimodal neural networks, confidence intervals, and HACCP compliance auditing."
  },
  {
    name: "Chef Marcus",
    role: "Executive Culinary Lead",
    diet: "Mediterranean",
    calories: 2500,
    icon: Sparkles,
    description: "Pantry-to-plate speed cooking, sensory balancing, and culinary technique execution."
  },
  {
    name: "Sarah Jenkins, RD",
    role: "Clinical Dietetics Specialist",
    diet: "High-Protein",
    calories: 2000,
    icon: Heart,
    description: "Focus on strict allergen exclusions, macronutrient ratios, and micronutrient densities."
  },
  {
    name: "Alex Chen",
    role: "Home Cook & Meal Prep Explorer",
    diet: "Vegetarian",
    calories: 1900,
    icon: Shield,
    description: "Reducing household food waste through spoilage detection and smart weekly grocery planning."
  }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onSelectProfile
}) => {
  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-modal" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>User Session & Persona</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Switch active persona to preview tailored intelligence profiles</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {PRESET_PROFILES.map(p => {
            const Icon = p.icon;
            const isSelected = activeProfile === p.name;
            return (
              <div
                key={p.name}
                onClick={() => {
                  onSelectProfile(p.name, p.diet, p.calories);
                  onClose();
                }}
                className="glass-card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--emerald-400)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface-glass-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} color="var(--emerald-400)" />
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{p.name}</span>
                  </div>
                  <span className="badge badge-emerald">{p.diet} • {p.calories} kcal</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--emerald-300)', marginBottom: '0.25rem' }}>{p.role}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
