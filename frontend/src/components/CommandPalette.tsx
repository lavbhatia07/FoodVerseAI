import React, { useState, useEffect } from 'react';
import {
  Search,
  Scan,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  History,
  Settings,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'food-recognition', label: 'Food Recognition & Nutrition Analysis', icon: Scan, category: 'AI Capability' },
    { id: 'freshness', label: 'Freshness & Spoilage Detection', icon: Sparkles, category: 'AI Capability' },
    { id: 'hygiene', label: 'Restaurant Kitchen Hygiene & Safety Audit', icon: ShieldAlert, category: 'AI Capability' },
    { id: 'cooking', label: 'Smart Cooking Assistant & Recipe Builder', icon: ChefHat, category: 'AI Capability' },
    { id: 'meal-planner', label: 'Personalized Meal Planner & Grocery Generator', icon: CalendarCheck, category: 'AI Capability' },
    { id: 'dashboard', label: 'Main AI Dashboard Workspace', icon: Sparkles, category: 'Navigation' },
    { id: 'history', label: 'Analysis History & Exportable Reports', icon: History, category: 'Navigation' },
    { id: 'settings', label: 'User Dietary Preferences & AI Providers', icon: Settings, category: 'Navigation' },
    { id: 'about', label: 'Methodology, Models & Limitations', icon: Info, category: 'Navigation' },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', gap: '0.75rem' }}>
          <Search size={20} color="var(--emerald-400)" />
          <input
            type="text"
            placeholder="Type a command or jump to AI module... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matching modules or actions found.
            </div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 150ms ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-glass-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '6px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--emerald-400)'
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: '0.6rem 1.25rem', background: 'rgba(5, 19, 11, 0.95)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>Navigation: Select to jump directly</span>
          <span><kbd className="kbd-shortcut">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
