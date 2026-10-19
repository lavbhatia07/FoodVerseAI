import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Sliders,
  Cpu,
  Save,
  CheckCircle2,
  ShieldCheck,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { SystemSettingsResponse, UserProfileSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileSettings>({
    username: 'Chef Guest',
    display_name: 'FoodVerse Explorer',
    dietary_pattern: 'Omnivore',
    allergens: ['Peanuts'],
    daily_calorie_target: 2000,
    macro_ratios: { protein: 25, carbs: 50, fat: 25 }
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettingsResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getSettings();
        setSystemSettings(res);
        if (res.profile) setProfile(res.profile);
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const allergenPresets = ["Peanuts", "Tree Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"];

  const toggleAllergen = (item: string) => {
    setProfile(prev => ({
      ...prev,
      allergens: prev.allergens.includes(item)
        ? prev.allergens.filter(a => a !== item)
        : [...prev.allergens, item]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' }}>
            <SettingsIcon size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>User Settings & AI System Configuration</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Configure dietary profiles, strict allergen safeguards, and review multimodal provider orchestrations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: User Dietary Preferences */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '1.2rem' }}>Personal Dietary Profile</h3>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Display Name
            </label>
            <input
              type="text"
              className="input-field"
              value={profile.display_name}
              onChange={e => setProfile({ ...profile, display_name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Default Dietary Pattern
            </label>
            <select
              className="input-field"
              value={profile.dietary_pattern}
              onChange={e => setProfile({ ...profile, dietary_pattern: e.target.value })}
            >
              <option value="Omnivore">Omnivore (Standard Balanced)</option>
              <option value="Mediterranean">Mediterranean (Heart-Healthy / Unsaturated)</option>
              <option value="High-Protein">High-Protein (Hypertrophy / Athletic)</option>
              <option value="Vegetarian">Vegetarian (Lacto-Ovo)</option>
              <option value="Vegan">Vegan (100% Plant-Based)</option>
              <option value="Ketogenic">Ketogenic (Very Low-Carb / High-Fat)</option>
              <option value="Low-Carb">Low-Carb (Moderate Carbohydrates)</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Caloric Baseline:</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                {profile.daily_calorie_target} kcal
              </span>
            </div>
            <input
              type="range"
              min="1400"
              max="3500"
              step="50"
              value={profile.daily_calorie_target}
              onChange={e => setProfile({ ...profile, daily_calorie_target: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--emerald-400)' }}
            />
          </div>

          {/* Allergens Checklist */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Permanent Allergen Exclusions:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {allergenPresets.map(allergen => {
                const isChecked = profile.allergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1px solid ${isChecked ? 'var(--rose-400)' : 'var(--border-subtle)'}`,
                      background: isChecked ? 'rgba(251, 113, 133, 0.2)' : 'rgba(5, 19, 11, 0.75)',
                      color: isChecked ? 'var(--rose-400)' : 'var(--text-muted)'
                    }}
                  >
                    {isChecked ? `✕ ${allergen}` : `+ ${allergen}`}
                  </button>
                );
              })}
            </div>
          </div>

          {savedSuccess && (
            <div style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--border-glow)', color: 'var(--emerald-400)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Preferences saved and persisted to database.</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </form>

        {/* Right Column: AI Providers & System Environment */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} color="var(--mint-400)" />
            <h3 style={{ fontSize: '1.2rem' }}>AI Architecture & Providers</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Computer Vision Model Provider
              </div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                {systemSettings?.providers.vision || 'local'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Pretrained Food-101 taxonomy classifier with color-space feature extraction.
              </div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Culinary LLM Provider
              </div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                {systemSettings?.providers.llm || 'local'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Intelligent local recipe synthesis with optional OpenAI / Gemini pluggable overrides.
              </div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Nutrition Dataset Provider
              </div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                {systemSettings?.providers.nutrition || 'local'} (USDA FoodData Central)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Bundled 120-item standard composition database with portion-scaling adapter.
              </div>
            </div>

            <div className="glass-card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Security & Media Upload Limit
              </div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                {systemSettings?.max_upload_size_mb || 50} MB Max Media Payload
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Enforced server-side with MIME magic-byte screening and disk sanitization.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
