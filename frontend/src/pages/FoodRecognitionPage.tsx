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
      <div className="card-clay-mint" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 8px 18px rgba(16, 185, 129, 0.35)' }}>
            <Scan size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-emerald" style={{ fontWeight: 700 }}>Food-101 Deep Vision</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USDA FoodData Central Ingest</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Food Recognition & Nutrition Analysis</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Multimodal optical food classifier and nutritional breakdown. Recognizes prepared dishes, calculates calibrated macros, and estimates micronutrient density.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Panel */}
        <div className="card-clay" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Input Meal Information</span>
            </h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>Interactive Ingest</span>
          </div>

          {/* Drag & Drop Area */}
          <div
            className="dropzone-clay"
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
                  style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--clay-shadow-card)' }}
                />
                <span style={{ fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>
                  Click to replace: {selectedFile?.name}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #A7F3D0, #D1FAE5)', color: '#047857' }}>
                  <UploadCloud size={30} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Drag food photo here or click to upload</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supports JPEG, PNG, WebP (Max 50MB)</div>
              </div>
            )}
          </div>

          {/* Quick manual entry selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
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
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px' }} />
            </div>
          </div>

          {/* Portion Size Slider */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Portion Size:</span>
              <span className="badge badge-emerald" style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
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
              style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 500 }}>
              <span>Small (50g)</span>
              <span>Standard (150g)</span>
              <span>Large (300g)</span>
              <span>Feast (500g)</span>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: '#FFE4E6', border: '1.5px solid #FDA4AF', color: '#BE123C', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn-clay-mint"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? <span>Inferring Multimodal Model...</span> : (
              <>
                <Sparkles size={18} />
                <span>Run Nutritional Recognition</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results & Interactive Nutrition Panel */}
        <div className="card-clay" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
              Nutritional Analysis Output
            </h3>
            {result && <span className="badge badge-emerald" style={{ fontWeight: 700 }}>Verified Ingest</span>}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="clay-icon-container" style={{ width: '64px', height: '64px', background: '#F1F5F9', color: '#94A3B8', marginBottom: '1.25rem' }}>
                <PieChart size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>No analysis performed yet</div>
              <p style={{ fontSize: '0.88rem', maxWidth: '340px', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Upload a food image or search a dish to inspect recognized items, top candidates, and complete macronutrient assays.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Top Prediction Card */}
              <div className="card-clay-mint" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                      {result.top_prediction.category}
                    </span>
                    <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>{result.top_prediction.name}</h2>
                  </div>
                  <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.7)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>
                      {(result.top_prediction.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {result.portion.description}
                </div>
              </div>

              {/* Energy & Macros Display */}
              <div className="grid-4" style={{ gap: '0.75rem' }}>
                <div style={{ background: '#FFFBEB', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FDE68A', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Calories</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                    {result.nutrition.calories}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#B45309' }}>kcal</div>
                </div>

                <div style={{ background: '#ECFDF5', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #A7F3D0', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Protein</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                    {result.nutrition.protein_g}g
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#047857' }}>4 kcal/g</div>
                </div>

                <div style={{ background: '#F0F9FF', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #BAE6FD', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#075985', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Carbs</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284C7', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                    {result.nutrition.carbs_g}g
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0369A1' }}>Fiber: {result.nutrition.fiber_g}g</div>
                </div>

                <div style={{ background: '#FFF1F2', padding: '1rem 0.75rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FECDD3', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#9F1239', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Fat</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E11D48', fontFamily: 'var(--font-mono)', margin: '0.15rem 0' }}>
                    {result.nutrition.fat_g}g
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#BE123C' }}>9 kcal/g</div>
                </div>
              </div>

              {/* Top-K Candidate Predictions */}
              <div style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Top-K Vision Classification Candidates
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.recognized_items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', background: idx === 0 ? '#ECFDF5' : '#F8FAFC', border: idx === 0 ? '1px solid #A7F3D0' : '1px solid #F1F5F9' }}>
                      <span style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? '#047857' : 'var(--text-secondary)' }}>
                        {idx + 1}. {item.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: idx === 0 ? '#047857' : 'var(--text-muted)' }}>
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micronutrients breakdown */}
              {result.micronutrients && (
                <div style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                    Key Micronutrients (per {portionGrams}g)
                  </div>
                  <div className="grid-3" style={{ gap: '0.65rem', fontSize: '0.82rem' }}>
                    <div style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Potassium:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.micronutrients.potassium_mg || 0} mg</strong>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Calcium:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.micronutrients.calcium_mg || 0} mg</strong>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Iron:</span> <strong style={{ color: 'var(--text-primary)' }}>{result.micronutrients.iron_mg || 0} mg</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Uncertainty Disclosure */}
              <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: '#FEFCE8', border: '1.5px solid #FEF08A', display: 'flex', gap: '0.75rem', boxShadow: 'var(--clay-shadow-card)' }}>
                <HelpCircle size={20} color="#CA8A04" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: '#854D0E', lineHeight: 1.5 }}>
                  <strong style={{ color: '#A16207' }}>Uncertainty & Portion Disclosure:</strong> {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
