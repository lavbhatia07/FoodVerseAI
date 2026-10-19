import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  AlertOctagon,
  ShoppingCart,
  Download,
  RotateCw,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { MealPlanResult, DayMealPlan } from '../types';

const ALLERGEN_OPTIONS = [
  "Peanuts", "Tree Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"
];

const DIET_PATTERNS = [
  "Mediterranean", "Omnivore", "High-Protein", "Vegetarian", "Vegan", "Ketogenic", "Low-Carb"
];

export const MealPlannerPage: React.FC = () => {
  const [durationDays, setDurationDays] = useState(7);
  const [dietPattern, setDietPattern] = useState('Mediterranean');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['Peanuts']);
  const [targetCalories, setTargetCalories] = useState(2100);
  const [includeSnacks, setIncludeSnacks] = useState(true);
  const [budgetTier, setBudgetTier] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<MealPlanResult | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateMealPlan({
        duration_days: durationDays,
        diet_pattern: dietPattern,
        allergens_to_avoid: selectedAllergens,
        target_daily_calories: targetCalories,
        include_snacks: includeSnacks,
        budget_tier: budgetTier
      });
      setPlanResult(res);
      setActiveDayIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to generate meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!planResult) return;
    const blob = new Blob([JSON.stringify(planResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodverse_meal_plan_${planResult.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(34, 211, 238, 0.2)', color: 'var(--cyan-400)' }}>
            <CalendarCheck size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Personalized Meal Planner & Grocery Logistics</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Allergen-compliant nutritional schedule optimization and automated aisle-sorted grocery shopping compiler.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Preferences & Allergen Wizard */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Nutritional Constraints & Preferences</h3>

          {/* Duration Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Plan Horizon
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDurationDays(1)}
                className={`btn-secondary ${durationDays === 1 ? 'btn-primary' : ''}`}
                style={{ flex: 1, padding: '0.65rem' }}
              >
                1-Day Snapshot
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(7)}
                className={`btn-secondary ${durationDays === 7 ? 'btn-primary' : ''}`}
                style={{ flex: 1, padding: '0.65rem' }}
              >
                7-Day Weekly Schedule
              </button>
            </div>
          </div>

          {/* Dietary Pattern */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Dietary Pattern
            </label>
            <select
              className="input-field"
              value={dietPattern}
              onChange={e => setDietPattern(e.target.value)}
            >
              {DIET_PATTERNS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Daily Calorie Target */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Daily Energy:</span>
              <span style={{ fontWeight: 600, color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
                {targetCalories} kcal / day
              </span>
            </div>
            <input
              type="range"
              min="1400"
              max="3500"
              step="50"
              value={targetCalories}
              onChange={e => setTargetCalories(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cyan-400)' }}
            />
          </div>

          {/* Strict Allergen Exclusions Checklist */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} color="var(--rose-400)" />
                <span>Strict Allergen Exclusions (Guaranteed Zero-Contact):</span>
              </label>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {ALLERGEN_OPTIONS.map(allergen => {
                const isExcluded = selectedAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1px solid ${isExcluded ? 'var(--rose-400)' : 'var(--border-subtle)'}`,
                      background: isExcluded ? 'rgba(251, 113, 133, 0.2)' : 'rgba(5, 19, 11, 0.65)',
                      color: isExcluded ? 'var(--rose-400)' : 'var(--text-muted)',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {isExcluded ? `✕ ${allergen}` : `+ ${allergen}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeSnacks}
                onChange={e => setIncludeSnacks(e.target.checked)}
                style={{ accentColor: 'var(--cyan-400)' }}
              />
              <span>Include Afternoon Snacks</span>
            </label>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 113, 133, 0.15)', border: '1px solid rgba(251, 113, 133, 0.3)', color: 'var(--rose-400)', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleGeneratePlan}
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? <span>Solving Nutritional Constraints...</span> : <span>Generate Personalized Plan</span>}
          </button>
        </div>

        {/* Right Column: Generated Plan View & Shopping List */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Personalized Meal Schedule</h3>
            {planResult && (
              <button
                onClick={handleExportJSON}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            )}
          </div>

          {!planResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CalendarCheck size={48} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>No meal plan generated yet</div>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.35rem' }}>
                Set your dietary goals and allergen exclusions on the left to compile a complete daily or weekly schedule.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Plan Metadata Banner */}
              <div className="glass-card" style={{ padding: '1rem', background: 'rgba(34, 211, 238, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{planResult.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Allergen Guardrails Active: {planResult.allergens_excluded.length > 0 ? planResult.allergens_excluded.join(', ') : 'None specified'}
                    </div>
                  </div>
                  <span className="badge badge-cyan">{planResult.duration_days} Days</span>
                </div>
              </div>

              {/* Day Switcher Tabs */}
              {planResult.days.length > 1 && (
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                  {planResult.days.map((day, idx) => (
                    <button
                      key={day.day_number}
                      onClick={() => setActiveDayIndex(idx)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        border: `1px solid ${activeDayIndex === idx ? 'var(--cyan-400)' : 'var(--border-subtle)'}`,
                        background: activeDayIndex === idx ? 'rgba(34, 211, 238, 0.2)' : 'var(--surface-glass-card)',
                        color: activeDayIndex === idx ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      Day {day.day_number} ({day.day_name.slice(0, 3)})
                    </button>
                  ))}
                </div>
              )}

              {/* Active Day Meals */}
              {planResult.days[activeDayIndex] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{planResult.days[activeDayIndex].day_name} Targets</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      Total: {planResult.days[activeDayIndex].estimated_calories} kcal | P: {planResult.days[activeDayIndex].total_protein_g}g | C: {planResult.days[activeDayIndex].total_carbs_g}g | F: {planResult.days[activeDayIndex].total_fat_g}g
                    </span>
                  </div>

                  {planResult.days[activeDayIndex].meals.map(meal => (
                    <div key={meal.id} className="glass-card" style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div>
                          <span className="badge badge-emerald" style={{ fontSize: '0.62rem', marginBottom: '0.2rem' }}>{meal.meal_type}</span>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>{meal.name}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: 'var(--amber-400)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
                            {meal.calories} kcal
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{meal.prep_time_min} mins prep</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                        {meal.ingredients.join(', ')}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--emerald-300)', fontStyle: 'italic' }}>
                        "{meal.rationale}"
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Consolidated Grocery Shopping List */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShoppingCart size={18} color="var(--cyan-400)" />
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>
                    Aisle-Categorized Grocery Shopping List
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {Object.entries(planResult.shopping_list).map(([aisle, items]) => (
                    <div key={aisle}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {aisle}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {items.map((item, i) => (
                          <span key={i} className="badge badge-emerald" style={{ fontSize: '0.7rem', textTransform: 'none' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Notice */}
              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(5, 19, 11, 0.75)', border: '1px solid var(--border-subtle)', fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                {planResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
