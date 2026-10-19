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
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.2)', color: 'var(--mint-400)' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Food Freshness & Spoilage Detection</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Multi-factor assessment evaluating optical degradation biomarkers, surface turgor, and environmental storage history.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Form */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Freshness Inspection Parameters</h3>

          {/* Upload Area */}
          <div
            className="spatial-dropzone"
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
                  style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--mint-400)' }}>Click to replace file</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <UploadCloud size={38} color="var(--mint-400)" />
                <div style={{ fontWeight: 600 }}>Upload image of perishable food</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High-resolution surface closeups yield optimal biomarker analysis</div>
              </div>
            )}
          </div>

          {/* Food Category Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Storage Duration:</span>
              <span style={{ fontWeight: 600, color: 'var(--mint-400)', fontFamily: 'var(--font-mono)' }}>
                {daysStored} {daysStored === 1 ? 'day' : 'days'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="21"
              value={daysStored}
              onChange={e => setDaysStored(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--mint-400)' }}
            />
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 113, 133, 0.15)', border: '1px solid rgba(251, 113, 133, 0.3)', color: 'var(--rose-400)', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? <span>Analyzing Biomarkers...</span> : <span>Run Freshness Assessment</span>}
          </button>
        </div>

        {/* Right Column: Results & Actionable Recommendations */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Freshness Evaluation & Indicators</span>
            {result && <span className="badge badge-emerald">Inference Complete</span>}
          </h3>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ThermometerSnowflake size={48} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>No item evaluated</div>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.35rem' }}>
                Upload an image and specify storage details to examine optical indicators and remaining shelf life.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score Display Card */}
              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(52, 211, 153, 0.08)' }}>
                <div>
                  <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>{result.category}</span>
                  <h2 style={{ fontSize: '1.6rem', color: getStatusColor(result.freshness_score) }}>
                    {result.status}
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Estimated safe consumption window: <strong style={{ color: '#fff' }}>{result.shelf_life_remaining_days} days remaining</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '50%',
                    border: `4px solid ${getStatusColor(result.freshness_score)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${getStatusColor(result.freshness_score)}44`
                  }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {result.freshness_score}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Index</span>
                  </div>
                </div>
              </div>

              {/* Observed Optical Biomarkers */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  Observed Visual Surface Indicators
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {result.observed_indicators.map((ind, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(5, 19, 11, 0.65)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: ind.detected ? 'var(--amber-400)' : 'var(--text-primary)' }}>
                          {ind.indicator}
                        </span>
                        <span className={`badge ${ind.detected ? (ind.severity === 'high' ? 'badge-rose' : 'badge-amber') : 'badge-emerald'}`}>
                          {ind.detected ? `${ind.severity.toUpperCase()} RISK` : 'ABSENT'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ind.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Culinary Action Steps */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.65rem', color: 'var(--text-secondary)' }}>
                  Actionable Handling Recommendations
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {result.recommendations.map((rec, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle size={15} color="var(--mint-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Food Safety Disclaimer */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.3)', display: 'flex', gap: '0.65rem' }}>
                <ShieldAlert size={20} color="var(--rose-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--rose-400)' }}>Food Safety Guardrail:</strong> {result.safety_disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
