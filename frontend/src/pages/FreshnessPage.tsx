import React, { useState } from 'react';
import {
  Sparkles,
  UploadCloud,
  ThermometerSnowflake,
  Clock,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { FreshnessResult } from '../types';

export const FreshnessPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState('Produce');
  const [storageLocation, setStorageLocation] = useState('refrigerator');
  const [daysStored, setDaysStored] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FreshnessResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a food image to analyze its freshness and surface degradation.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeFreshness(
        file,
        category,
        storageLocation,
        daysStored
      );
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze freshness.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= 85) return 'var(--emerald-400)';
    if (score >= 70) return 'var(--mint-400)';
    if (score >= 50) return 'var(--amber-400)';
    return 'var(--rose-400)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="card-clay-lime" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #84CC16, #65A30D)', color: '#FFFFFF', boxShadow: '0 8px 18px rgba(132, 204, 22, 0.35)' }}>
            <Sparkles size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-amber" style={{ fontWeight: 700 }}>Shelf Life AI</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Surface Degradation Biomarkers</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Food Freshness & Spoilage Detection</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Multi-factor assessment evaluating optical degradation biomarkers, surface turgor, spoilage indicators, and environmental storage history.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Form */}
        <div className="card-clay" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Freshness Inspection Parameters</h3>
            <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>Storage Context</span>
          </div>

          {/* Upload Area */}
          <div
            className="dropzone-clay"
            onClick={() => document.getElementById('freshness-file-input')?.click()}
          >
            <input
              id="freshness-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={previewUrl}
                  alt="Perishable Item"
                  style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--clay-shadow-card)' }}
                />
                <span style={{ fontSize: '0.88rem', color: '#4D7C0F', fontWeight: 600 }}>Click to replace file</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #ECFCCB, #D9F99D)', color: '#4D7C0F' }}>
                  <UploadCloud size={30} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Upload image of perishable food</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>High-resolution surface closeups yield optimal biomarker analysis</div>
              </div>
            )}
          </div>

          {/* Food Category Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Food Category
            </label>
            <select
              className="input-field"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Produce">Produce (Fruits & Leafy Vegetables)</option>
              <option value="Dairy">Dairy & Fermented Products</option>
              <option value="Meat">Meat & Poultry</option>
              <option value="Bakery">Bakery & Grains</option>
              <option value="Other">Other Perishables</option>
            </select>
          </div>

          {/* Storage Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Storage Environment
            </label>
            <select
              className="input-field"
              value={storageLocation}
              onChange={e => setStorageLocation(e.target.value)}
            >
              <option value="refrigerator">Refrigerated (3°C - 5°C / 38°F - 41°F)</option>
              <option value="pantry">Room Temperature / Ambient Pantry</option>
              <option value="freezer">Frozen (-18°C / 0°F)</option>
            </select>
          </div>

          {/* Days Stored */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Estimated Storage Duration:</span>
              <span className="badge badge-amber" style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {daysStored} {daysStored === 1 ? 'day' : 'days'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="21"
              value={daysStored}
              onChange={e => setDaysStored(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#84CC16', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontWeight: 500 }}>
              <span>Fresh (0d)</span>
              <span>1 Week</span>
              <span>2 Weeks</span>
              <span>3+ Weeks</span>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: '#FFE4E6', border: '1.5px solid #FDA4AF', color: '#BE123C', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn-clay-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)', boxShadow: '0 6px 16px rgba(132, 204, 22, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.5)' }}
          >
            {loading ? <span>Analyzing Biomarkers...</span> : <span>Run Freshness Assessment</span>}
          </button>
        </div>

        {/* Right Column: Results & Actionable Recommendations */}
        <div className="card-clay" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
              Freshness Evaluation & Indicators
            </h3>
            {result && <span className="badge badge-emerald" style={{ fontWeight: 700 }}>Inference Complete</span>}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="clay-icon-container" style={{ width: '64px', height: '64px', background: '#F1F5F9', color: '#94A3B8', marginBottom: '1.25rem' }}>
                <ThermometerSnowflake size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>No item evaluated</div>
              <p style={{ fontSize: '0.88rem', maxWidth: '340px', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Upload an image and specify storage details to examine optical indicators and remaining shelf life.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score Display Card */}
              <div className="card-clay-lime" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-amber" style={{ marginBottom: '0.35rem', fontWeight: 700 }}>{result.category}</span>
                  <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                    {result.status}
                  </h2>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Estimated safe consumption window: <strong style={{ color: '#15803D' }}>{result.shelf_life_remaining_days} days remaining</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: `4px solid ${result.freshness_score >= 70 ? '#84CC16' : (result.freshness_score >= 50 ? '#F59E0B' : '#F43F5E')}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--clay-shadow-card)'
                  }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: 'var(--text-primary)' }}>
                      {result.freshness_score}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Index</span>
                  </div>
                </div>
              </div>

              {/* Observed Optical Biomarkers */}
              <div style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Observed Visual Surface Indicators
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {result.observed_indicators.map((ind, idx) => (
                    <div key={idx} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: ind.detected ? '#FFFBEB' : '#F8FAFC', border: ind.detected ? '1px solid #FDE68A' : '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: ind.detected ? '#92400E' : 'var(--text-primary)' }}>
                          {ind.indicator}
                        </span>
                        <span className={`badge ${ind.detected ? (ind.severity === 'high' ? 'badge-rose' : 'badge-amber') : 'badge-emerald'}`}>
                          {ind.detected ? `${ind.severity.toUpperCase()} RISK` : 'ABSENT'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ind.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Culinary Action Steps */}
              <div style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Actionable Handling Recommendations
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {result.recommendations.map((rec, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Food Safety Disclaimer */}
              <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: '#FFF1F2', border: '1.5px solid #FECDD3', display: 'flex', gap: '0.75rem', boxShadow: 'var(--clay-shadow-card)' }}>
                <ShieldAlert size={20} color="#E11D48" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: '#9F1239', lineHeight: 1.5 }}>
                  <strong style={{ color: '#BE123C' }}>Food Safety Guardrail:</strong> {result.safety_disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
