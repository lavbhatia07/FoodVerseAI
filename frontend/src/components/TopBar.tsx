import React from 'react';
import { Search, Compass } from 'lucide-react';
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
          <Search size={16} color="#10B981" />
          <span>Search capabilities, foods, or recipes...</span>
          <kbd className="kbd-shortcut">Ctrl+K</kbd>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* System Health Liveness Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.45rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: isHealthy ? '#D9FBE8' : '#FEF3C7',
          border: `1.5px solid ${isHealthy ? '#A7F3D0' : '#FDE68A'}`,
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(100, 116, 139, 0.06)'
        }}>
          <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? '#10B981' : '#F59E0B',
            boxShadow: isHealthy ? '0 0 8px #10B981' : 'none',
            display: 'inline-block'
          }} />
          <span style={{ color: isHealthy ? '#065F46' : '#92400E' }}>
            {isHealthy ? 'AI ENGINE ONLINE' : 'CONNECTING...'}
          </span>
          <span style={{ color: isHealthy ? '#6EE7B7' : '#FCD34D' }}>•</span>
          <span style={{ color: isHealthy ? '#047857' : '#B45309' }}>v{systemHealth?.version || '1.0.0'}</span>
        </div>

        {/* View Landing Mode */}
        <button
          onClick={onNavigateLanding}
          className="btn-secondary"
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
        >
          <Compass size={16} color="#0D9488" />
          <span>Landing Tour</span>
        </button>

        {/* User Badge */}
        <div
          onClick={onOpenProfile}
          style={{
            cursor: 'pointer',
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            boxShadow: 'var(--clay-shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#1E293B',
            transition: 'all 200ms ease'
          }}
          title="Switch User Profile"
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981'
          }} />
          <span>{activeProfileName}</span>
        </div>
      </div>
    </header>
  );
};
