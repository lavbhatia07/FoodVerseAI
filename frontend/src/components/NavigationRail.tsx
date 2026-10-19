import React from 'react';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  LayoutDashboard,
  History,
  FileText,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface NavigationRailProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenProfile: () => void;
  activeProfileName: string;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onOpenProfile,
  activeProfileName
}) => {
  const primaryLinks = [
    { id: 'food-recognition', label: 'Food Recognition', icon: Scan },
    { id: 'freshness', label: 'Freshness Detection', icon: Sparkles },
    { id: 'hygiene', label: 'Restaurant Hygiene', icon: ShieldAlert },
    { id: 'cooking', label: 'Cooking Assistant', icon: ChefHat },
    { id: 'meal-planner', label: 'Meal Planner', icon: CalendarCheck },
  ];

  const secondaryLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'Project Information', icon: Info },
  ];

  return (
    <aside className={`spatial-nav-rail ${collapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="brand-badge" onClick={() => onNavigate('dashboard')}>
          <div className="brand-icon-wrapper">
            <span style={{ fontSize: '1.25rem' }}>🥑</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ lineHeight: 1.1, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>FoodVerse <span style={{ color: 'var(--emerald-400)' }}>AI</span></div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.04em' }}>SPATIAL MULTIMODAL</div>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px'
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="nav-links-container">
        {!collapsed && <div className="nav-section-title">Core AI Capabilities</div>}
        {primaryLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentPage === link.id;
          return (
            <div
              key={link.id}
              className={`nav-link-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(link.id)}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={20} color={isActive ? 'var(--emerald-400)' : 'currentColor'} />
              {!collapsed && <span>{link.label}</span>}
            </div>
          );
        })}

        {!collapsed && <div className="nav-section-title" style={{ marginTop: '0.5rem' }}>Workspace</div>}
        {secondaryLinks.map(link => {
          const Icon = link.icon;
          const isActive = currentPage === link.id;
          return (
            <div
              key={link.id}
              className={`nav-link-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(link.id)}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={19} color={isActive ? 'var(--emerald-400)' : 'currentColor'} />
              {!collapsed && <span>{link.label}</span>}
            </div>
          );
        })}
      </div>

      {/* User Session Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div
          onClick={onOpenProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-glass-card)',
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
            transition: 'all 200ms ease'
          }}
          title="Switch User Profile"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--emerald-500) 0%, var(--lime-400) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#022013'
          }}>
            <UserCheck size={16} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeProfileName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>Active Session</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
