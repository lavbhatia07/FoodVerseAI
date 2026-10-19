import React from 'react';
import { Search, Compass, Activity, Sparkles } from 'lucide-react';
import { SystemHealth } from '../types';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onNavigateLanding: () => void;
  systemHealth: SystemHealth | null;
  activeProfileName: string;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onNavigateLanding,
  systemHealth,
  activeProfileName,
  onOpenProfile
}) => {
  const isHealthy = systemHealth?.status === 'healthy';

  return (
    <header className="spatial-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="command-search-btn"
          onClick={onOpenCommandPalette}
          title="Global Search & Navigation (Ctrl+K)"
        >
          <Search size={16} color="var(--emerald-400)" />
          <span>Search capabilities or command...</span>
          <kbd className="kbd-shortcut">Ctrl+K</kbd>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* System Health Liveness Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(6, 20, 12, 0.75)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? 'var(--emerald-400)' : 'var(--amber-400)',
            boxShadow: isHealthy ? '0 0 10px var(--emerald-400)' : 'none',
            display: 'inline-block'
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {isHealthy ? 'AI ENGINE ONLINE' : 'CONNECTING...'}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ color: 'var(--emerald-400)' }}>v{systemHealth?.version || '1.0.0'}</span>
        </div>

        {/* View Landing Mode */}
        <button
          onClick={onNavigateLanding}
          className="btn-secondary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          <Compass size={15} color="var(--emerald-400)" />
          <span>Landing Tour</span>
        </button>

        {/* User Badge */}
        <div
          onClick={onOpenProfile}
          style={{
            cursor: 'pointer',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface-glass-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>{activeProfileName}</span>
        </div>
      </div>
    </header>
  );
};
