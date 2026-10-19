import React, { useState } from 'react';
import {
  Scan,
  UploadCloud,
  Search,
  Scale,
  Flame,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  PieChart
} from 'lucide-react';
import { api } from '../services/api';
import { FoodRecognitionResult } from '../types';

export const FoodRecognitionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [portionGrams, setPortionGrams] = useState(150);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !textQuery.trim()) {
      setError('Please provide a food image or type a dish description.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.recognizeFood(
        selectedFile || undefined,
        textQuery.trim() || undefined,
        portionGrams
      );
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to process food recognition request.');
    } finally {
      setLoading(false);
    }
  };

  const handlePortionChange = async (grams: number) => {
    setPortionGrams(grams);
    if (result) {
      try {
        const nut = await api.getNutrition(result.top_prediction.name, grams);
        setResult(prev => prev ? {
          ...prev,
          portion: nut.portion,
          nutrition: nut.nutrition,
          micronutrients: nut.micronutrients
        } : null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' }}>
            <Scan size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Food Recognition & Nutrition Analysis</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Multimodal optical classification powered by Food-101 taxonomy and verified USDA FoodData Central composition.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Input Meal Information</span>
          </h3>

          {/* Drag & Drop Area */}
          <div
            className="spatial-dropzone"
            onClick={() => document.getElementById('food-file-input')?.click()}
          >
            <input
              id="food-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={previewUrl}
                  alt="Food Preview"
                  style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--emerald-400)', fontWeight: 500 }}>
                  Click to replace: {selectedFile?.name}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <UploadCloud size={38} color="var(--emerald-400)" />
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>Drag food photo here or click to upload</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports JPEG, PNG, WebP (Max 50MB)</div>
              </div>
            )}
          </div>

          {/* Quick preset selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Or enter dish name manually:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Avocado Toast, Grilled Salmon, Caesar Salad..."
                value={textQuery}
                onChange={e => setTextQuery(e.target.value)}
              />
              <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', top: '12px' }} />
            </div>
          </div>

          {/* Portion Size Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Portion Size:</span>
              <span style={{ fontWeight: 600, color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                {portionGrams} grams
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="500"
              step="25"
              value={portionGrams}
              onChange={e => handlePortionChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--emerald-400)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              <span>Small (50g)</span>
              <span>Standard (150g)</span>
              <span>Large (300g)</span>
              <span>Feast (500g)</span>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 113, 133, 0.15)', border: '1px solid rgba(251, 113, 133, 0.3)', color: 'var(--rose-400)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? <span>Inferring Multimodal Model...</span> : <span>Run Nutritional Recognition</span>}
          </button>
        </div>

        {/* Right Column: Results & Interactive Nutrition Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Nutritional Analysis Output</span>
            {result && <span className="badge badge-emerald">Verified Ingest</span>}
          </h3>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <PieChart size={48} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>No analysis performed yet</div>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.35rem' }}>
                Upload a food image or search a dish to inspect recognized items, top candidates, and complete macronutrient assays.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Top Prediction Card */}
              <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'var(--border-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', marginBottom: '0.35rem' }}>
                      {result.top_prediction.category}
                    </span>
                    <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>{result.top_prediction.name}</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                      {(result.top_prediction.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {result.portion.description}
                </div>
              </div>

              {/* Energy & Macros Display */}
              <div className="grid-4" style={{ gap: '0.75rem' }}>
                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calories</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--amber-400)', fontFamily: 'var(--font-mono)' }}>
                    {result.nutrition.calories}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>kcal</div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Protein</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                    {result.nutrition.protein_g}g
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>4 kcal/g</div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Carbs</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
                    {result.nutrition.carbs_g}g
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Fiber: {result.nutrition.fiber_g}g</div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Fat</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--rose-400)', fontFamily: 'var(--font-mono)' }}>
                    {result.nutrition.fat_g}g
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>9 kcal/g</div>
                </div>
              </div>

              {/* Top-K Candidate Predictions */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.65rem', color: 'var(--text-secondary)' }}>
                  Top-K Vision Classification Candidates
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.recognized_items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: idx === 0 ? 'var(--emerald-400)' : 'var(--text-muted)' }}>
                        {idx + 1}. {item.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micronutrients breakdown */}
              {result.micronutrients && (
                <div className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.65rem', color: 'var(--text-secondary)' }}>
                    Key Micronutrients (per {portionGrams}g)
                  </div>
                  <div className="grid-3" style={{ gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div>Potassium: <strong style={{ color: '#fff' }}>{result.micronutrients.potassium_mg || 0} mg</strong></div>
                    <div>Calcium: <strong style={{ color: '#fff' }}>{result.micronutrients.calcium_mg || 0} mg</strong></div>
                    <div>Iron: <strong style={{ color: '#fff' }}>{result.micronutrients.iron_mg || 0} mg</strong></div>
                  </div>
                </div>
              )}

              {/* Uncertainty Disclosure */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', display: 'flex', gap: '0.65rem' }}>
                <HelpCircle size={18} color="var(--amber-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--amber-400)' }}>Uncertainty & Portion Disclosure:</strong> {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
