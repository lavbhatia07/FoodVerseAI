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
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' }}>
            <HistoryIcon size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Analysis History & Saved Reports</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Persistent audit records across food recognition, freshness tests, kitchen hygiene audits, and meal schedules.
            </p>
          </div>
        </div>

        <button className="btn-secondary" onClick={handleExport}>
          <Download size={16} color="var(--emerald-400)" />
          <span>Export All Records</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter by Module:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'food_recognition', 'freshness', 'hygiene', 'cooking', 'meal_planning'].map(mod => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${moduleFilter === mod ? 'var(--emerald-400)' : 'var(--border-subtle)'}`,
                background: moduleFilter === mod ? 'rgba(16, 185, 129, 0.2)' : 'var(--surface-glass-card)',
                color: moduleFilter === mod ? '#fff' : 'var(--text-muted)'
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
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <HistoryIcon size={44} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
          <h3>No persisted analyses found</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Run any food recognition, freshness, or hygiene audit to populate this history log.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map(item => (
            <div
              key={item.id}
              className="glass-card"
              onClick={() => handleOpenDetail(item.id)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(5, 19, 11, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getModuleIcon(item.module_type)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>{item.module_type}</span>
                    <h4 style={{ fontSize: '1rem', color: '#fff' }}>{item.title}</h4>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.summary}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </div>
                  {item.confidence && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--emerald-400)', fontWeight: 600 }}>
                      Conf: {(item.confidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.65rem' }}
                    onClick={(e) => { e.stopPropagation(); handleOpenDetail(item.id); }}
                    title="View JSON Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', borderColor: 'rgba(251, 113, 133, 0.3)', color: 'var(--rose-400)' }}
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete Record"
                  >
                    <Trash2 size={15} />
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>
                  {selectedDetail.module_type}
                </span>
                <h3 style={{ fontSize: '1.15rem' }}>{selectedDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', maxHeight: '450px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <strong>Summary:</strong> {selectedDetail.summary}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Full JSON Result Payload:
              </div>
              <pre style={{
                background: 'rgba(3, 10, 6, 0.95)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: 'var(--emerald-300)',
                overflowX: 'auto'
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
