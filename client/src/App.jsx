import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Wrench,
  Droplets,
  Database,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import Inspections from './pages/Inspections';
import Maintenance from './pages/Maintenance';
import HarvestingSystems from './pages/HarvestingSystems';
import StorageStructures from './pages/StorageStructures';
import Login from './pages/Login';
import './index.css';
import './App.css';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Users', icon: Users },
  { name: 'Harvesting Systems', icon: Droplets },
  { name: 'Storage Structures', icon: Database },
  { name: 'Inspections', icon: ClipboardCheck },
  { name: 'Maintenance', icon: Wrench },
];

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogin(loggedInUser) {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setActivePage('Dashboard');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActivePage('Dashboard');
  }

  if (!user || !localStorage.getItem('token')) {
    return <Login onLogin={handleLogin} />;
  }

  const pages = {
    Dashboard: <Dashboard />,
    Users: <UsersPage />,
    'Harvesting Systems': <HarvestingSystems />,
    'Storage Structures': <StorageStructures />,
    Inspections: <Inspections />,
    Maintenance: <Maintenance />,
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Droplets size={25} /></div>
          <div>
            <h1>Rainwater</h1>
            <span>MANAGEMENT SYSTEM</span>
          </div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="side-navigation">
          {navigation
            .filter(item => user.role === 'Admin' || item.name !== 'Users')
            .map(item => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                  onClick={() => {
                    setActivePage(item.name);
                    setMenuOpen(false);
                  }}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </button>
              );
            })}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div>
            <span className="topbar-eyebrow">SMART RAINWATER HARVESTING</span>
            <h2>{activePage}</h2>
          </div>
          <div className="topbar-user">
            <span className="online-dot" />
            {user.name}
          </div>
        </header>

        <div className="page-content">
          {pages[activePage]}
        </div>

        <footer className="app-footer">
          Smart Rainwater Harvesting System · Water-conscious management
        </footer>
      </main>
    </div>
  );
}