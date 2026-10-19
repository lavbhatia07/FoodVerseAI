import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Filter,
  Download,
  Trash2,
  Eye,
  X,
  FileText,
  Clock,
  Sparkles,
  Scan,
  ShieldAlert,
  ChefHat,
  CalendarCheck
} from 'lucide-react';
import { api } from '../services/api';
import { HistorySummaryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistorySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory(moduleFilter, 1, 50);
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [moduleFilter]);

  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await api.getHistoryDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this analysis record?")) return;
    try {
      await api.deleteHistory(id);
      setItems(prev => prev.filter(i => i.id !== id));
      if (selectedDetail?.id === id) setSelectedDetail(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportHistory(moduleFilter);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `foodverse_audit_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'food_recognition': return <Scan size={16} color="var(--emerald-400)" />;
      case 'freshness': return <Sparkles size={16} color="var(--mint-400)" />;
      case 'hygiene': return <ShieldAlert size={16} color="var(--amber-400)" />;
      case 'cooking': return <ChefHat size={16} color="var(--lime-400)" />;
      case 'meal_planning': return <CalendarCheck size={16} color="var(--cyan-400)" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="card-clay-mint" style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="clay-icon-container" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', boxShadow: '0 8px 18px rgba(16, 185, 129, 0.35)' }}>
            <HistoryIcon size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>Analysis History & Saved Reports</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Persistent audit records across food recognition, freshness tests, kitchen hygiene audits, and meal schedules.
            </p>
          </div>
        </div>

        <button className="btn-clay-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.15rem' }}>
          <Download size={16} color="#059669" />
          <span>Export All Records</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-clay" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#059669" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filter by Module:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'food_recognition', 'freshness', 'hygiene', 'cooking', 'meal_planning'].map(mod => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: `1.5px solid ${moduleFilter === mod ? '#10B981' : '#E2E8F0'}`,
                background: moduleFilter === mod ? 'linear-gradient(135deg, #10B981, #059669)' : '#FFFFFF',
                color: moduleFilter === mod ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: 'var(--clay-shadow-card)',
                transition: 'all 150ms ease'
              }}
            >
              {mod.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading history records...</div>
      ) : items.length === 0 ? (
        <div className="card-clay" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="clay-icon-container" style={{ width: '64px', height: '64px', background: '#F1F5F9', color: '#94A3B8', margin: '0 auto 1.25rem' }}>
            <HistoryIcon size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>No persisted analyses found</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
            Run any food recognition, freshness, or hygiene audit to populate this history log.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map(item => (
            <div
              key={item.id}
              className="card-clay"
              onClick={() => handleOpenDetail(item.id)}
              style={{
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="clay-icon-container" style={{ width: '42px', height: '42px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#059669' }}>
                  {getModuleIcon(item.module_type)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', fontWeight: 700 }}>{item.module_type}</span>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>{item.title}</h4>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.summary}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </div>
                  {item.confidence && (
                    <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                      Conf: {(item.confidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-clay-secondary"
                    style={{ padding: '0.45rem 0.75rem' }}
                    onClick={(e) => { e.stopPropagation(); handleOpenDetail(item.id); }}
                    title="View JSON Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="btn-clay-secondary"
                    style={{ padding: '0.45rem 0.75rem', borderColor: '#FDA4AF', color: '#E11D48' }}
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="command-palette-backdrop" onClick={() => setSelectedDetail(null)}>
          <div className="command-palette-modal" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #E2E8F0' }}>
              <div>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                  {selectedDetail.module_type}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{selectedDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '450px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Summary:</strong> {selectedDetail.summary}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Full JSON Result Payload:
              </div>
              <pre style={{
                background: '#0F172A',
                padding: '1.15rem',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid #1E293B',
                fontSize: '0.8rem',
                color: '#34D399',
                overflowX: 'auto',
                boxShadow: 'var(--clay-shadow-card)'
              }}>
                {JSON.stringify(selectedDetail.results, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
