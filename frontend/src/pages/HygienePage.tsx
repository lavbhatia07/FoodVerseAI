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
      <div className="card-clay-blue" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #0284C7, #0369A1)', color: '#FFFFFF', boxShadow: '0 8px 18px rgba(2, 132, 199, 0.35)' }}>
            <ShieldAlert size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-cyan" style={{ fontWeight: 700 }}>HACCP Compliance Vision</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sanitation & PPE Verification</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Restaurant Hygiene & Safety Monitoring</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px' }}>
              Temporal computer vision auditing for kitchen sanitization, PPE glove adherence, workstation cleanliness, and HACCP cross-contamination prevention.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Input Form & Media Upload */}
        <div className="card-clay" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Kitchen Surveillance Media</h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Audit Ingest</span>
          </div>

          <div
            className="dropzone-clay"
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
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--clay-shadow-card)' }}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Kitchen Preview"
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--clay-shadow-card)' }}
                  />
                )}
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 600 }}>Click to replace: {file?.name}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #BAE6FD, #E0F2FE)', color: '#0284C7' }}>
                  <Video size={30} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Drop kitchen photo or video clip here</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supports MP4, WebM, JPEG, PNG (Sample frames evaluated at 1 fps)</div>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
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
            <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', background: '#FFE4E6', border: '1.5px solid #FDA4AF', color: '#BE123C', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn-clay-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', boxShadow: '0 6px 16px rgba(2, 132, 199, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.5)' }}
          >
            {loading ? <span>Extracting & Auditing Frames...</span> : <span>Run Kitchen Sanitation Audit</span>}
          </button>
        </div>

        {/* Right Column: Audit Report & Observation Timeline */}
        <div className="card-clay" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Inspection Audit Report</h3>
            {result && (
              <button
                onClick={() => window.print()}
                className="btn-clay-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Printer size={15} />
                <span>Print Audit</span>
              </button>
            )}
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="clay-icon-container" style={{ width: '64px', height: '64px', background: '#F1F5F9', color: '#94A3B8', marginBottom: '1.25rem' }}>
                <FileCheck2 size={32} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>No audit performed yet</div>
              <p style={{ fontSize: '0.88rem', maxWidth: '340px', marginTop: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Upload kitchen footage to generate frame-level sanitation findings, severity logs, and compliance grades.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score & Tier Banner */}
              <div className="card-clay-blue" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '0.35rem', fontWeight: 700 }}>
                    {result.frames_analyzed} {result.frames_analyzed === 1 ? 'Frame Analyzed' : 'Video Frames Evaluated'}
                  </span>
                  <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>{result.inspection_tier}</h2>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '4px solid #0284C7',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--clay-shadow-card)'
                  }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: 'var(--text-primary)' }}>
                      {result.overall_score}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>SCORE</span>
                  </div>
                </div>
              </div>

              {/* Summary Counts */}
              <div className="grid-4" style={{ gap: '0.65rem' }}>
                <div style={{ background: '#FFF1F2', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FECDD3', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#9F1239', fontWeight: 700, textTransform: 'uppercase' }}>Critical</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#E11D48', margin: '0.1rem 0' }}>{result.summary.critical_count}</div>
                </div>
                <div style={{ background: '#FFFBEB', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #FDE68A', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>Major</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D97706', margin: '0.1rem 0' }}>{result.summary.major_count}</div>
                </div>
                <div style={{ background: '#F0F9FF', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #BAE6FD', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#075985', fontWeight: 700, textTransform: 'uppercase' }}>Minor</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0284C7', margin: '0.1rem 0' }}>{result.summary.minor_count}</div>
                </div>
                <div style={{ background: '#ECFDF5', padding: '0.85rem 0.65rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1.5px solid #A7F3D0', boxShadow: 'var(--clay-shadow-card)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>Compliant</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', margin: '0.1rem 0' }}>{result.summary.compliant_count}</div>
                </div>
              </div>

              {/* Timestamped Observations */}
              <div style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid #E2E8F0', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Frame Observation Evidence Log
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {result.observations.map((obs, idx) => (
                    <div key={idx} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                            <Clock size={13} /> {obs.timestamp_sec.toFixed(1)}s
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{obs.category}</span>
                        </div>
                        <span className={`badge ${getSeverityBadgeClass(obs.severity)}`}>
                          {obs.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', lineHeight: 1.4 }}>{obs.finding}</div>
                      <div style={{ fontSize: '0.8rem', color: '#047857', background: '#ECFDF5', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #A7F3D0' }}>
                        <strong style={{ color: '#065F46' }}>Corrective Action:</strong> {obs.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Disclaimer */}
              <div style={{ padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-lg)', background: '#FEFCE8', border: '1.5px solid #FEF08A', boxShadow: 'var(--clay-shadow-card)' }}>
                <div style={{ fontSize: '0.82rem', color: '#854D0E', lineHeight: 1.5 }}>
                  <strong style={{ color: '#A16207' }}>Compliance Notice:</strong> {result.disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
