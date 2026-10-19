import React, { useState } from 'react';
import {
  ShieldAlert,
  UploadCloud,
  Video,
  FileCheck2,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';
import { api } from '../services/api';
import { HygieneResult } from '../types';

export const HygienePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [environmentType, setEnvironmentType] = useState('commercial_kitchen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HygieneResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setIsVideo(selected.type.startsWith('video/'));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a kitchen scene image or video clip.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeHygiene(file, environmentType);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to complete hygiene analysis.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'badge-rose';
      case 'Major': return 'badge-amber';
      case 'Minor': return 'badge-cyan';
      default: return 'badge-emerald';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.2)', color: 'var(--amber-400)' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Restaurant Hygiene & Safety Monitoring</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Temporal computer vision auditing for kitchen sanitization, PPE glove adherence, and HACCP cross-contamination prevention.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Form & Media Upload */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Kitchen Surveillance Media</h3>

          <div
            className="spatial-dropzone"
            onClick={() => document.getElementById('hygiene-file-input')?.click()}
          >
            <input
              id="hygiene-file-input"
              type="file"
              accept="image/*,video/mp4,video/webm"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                {isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-md)' }}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Kitchen Preview"
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                )}
                <span style={{ fontSize: '0.82rem', color: 'var(--amber-400)' }}>Click to replace: {file?.name}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <Video size={38} color="var(--amber-400)" />
                <div style={{ fontWeight: 600 }}>Drop kitchen photo or video clip here</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports MP4, WebM, JPEG, PNG (Sample frames evaluated at 1 fps)</div>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Kitchen Environment Type
            </label>
            <select
              className="input-field"
              value={environmentType}
              onChange={e => setEnvironmentType(e.target.value)}
            >
              <option value="commercial_kitchen">Commercial Restaurant Main Kitchen</option>
              <option value="prep_station">Cold Prep / Salad Assembly Workstation</option>
              <option value="cook_line">Hot Line / Thermal Cooking Zone</option>
              <option value="storage_walkin">Refrigerated Storage & Walk-In Cooler</option>
            </select>
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
            {loading ? <span>Extracting & Auditing Frames...</span> : <span>Run Kitchen Sanitation Audit</span>}
          </button>
        </div>

        {/* Right Column: Audit Report & Observation Timeline */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Inspection Audit Report</h3>
            {result && (
              <button
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                <Printer size={14} />
                <span>Print Audit</span>
              </button>
            )}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileCheck2 size={48} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>No audit performed yet</div>
              <p style={{ fontSize: '0.85rem', maxWidth: '320px', marginTop: '0.35rem' }}>
                Upload kitchen footage to generate frame-level sanitation findings, severity logs, and compliance grades.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score & Tier Banner */}
              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(251, 191, 36, 0.08)' }}>
                <div>
                  <span className="badge badge-amber" style={{ marginBottom: '0.35rem' }}>
                    {result.frames_analyzed} {result.frames_analyzed === 1 ? 'Frame Analyzed' : 'Video Frames Evaluated'}
                  </span>
                  <h2 style={{ fontSize: '1.45rem', color: '#fff' }}>{result.inspection_tier}</h2>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '4px solid var(--amber-400)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
                  }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {result.overall_score}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>SCORE</span>
                  </div>
                </div>
              </div>

              {/* Summary Counts */}
              <div className="grid-4" style={{ gap: '0.5rem' }}>
                <div className="glass-card" style={{ padding: '0.65rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--rose-400)' }}>Critical</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.summary.critical_count}</div>
                </div>
                <div className="glass-card" style={{ padding: '0.65rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--amber-400)' }}>Major</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.summary.major_count}</div>
                </div>
                <div className="glass-card" style={{ padding: '0.65rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--cyan-400)' }}>Minor</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.summary.minor_count}</div>
                </div>
                <div className="glass-card" style={{ padding: '0.65rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>Compliant</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{result.summary.compliant_count}</div>
                </div>
              </div>

              {/* Timestamped Observations */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  Frame Observation Evidence Log
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {result.observations.map((obs, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(5, 19, 11, 0.75)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> {obs.timestamp_sec.toFixed(1)}s
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{obs.category}</span>
                        </div>
                        <span className={`badge ${getSeverityBadgeClass(obs.severity)}`}>
                          {obs.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{obs.finding}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--emerald-300)' }}>
                        <strong>Corrective Action:</strong> {obs.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Disclaimer */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--amber-400)' }}>Compliance Notice:</strong> {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
