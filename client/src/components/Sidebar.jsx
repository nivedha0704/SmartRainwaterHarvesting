
import {
  Droplet,
  LayoutDashboard,
  Database,
  ClipboardCheck,
  Wrench,
  Users,
  LogOut,
} from 'lucide-react';

function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Harvesting Systems', icon: Droplet },
    { name: 'Storage Structures', icon: Database },
    { name: 'Inspections', icon: ClipboardCheck },
    { name: 'Maintenance', icon: Wrench },
    { name: 'Users', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Droplet size={20} strokeWidth={1.7} />
        </div>

        <div className="brand-text">
          <h3>Smart Rainwater</h3>
          <h3>Management System</h3>
        </div>
      </div>

      <p className="menu-heading">MAIN MENU</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`menu-item ${
                activePage === item.name ? 'active' : ''
              }`}
              onClick={() => onNavigate(item.name)}
            >
              <Icon size={16} strokeWidth={1.7} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <button
        className="logout-button"
        onClick={() => onNavigate('Login')}
      >
        <LogOut size={15} strokeWidth={1.7} />
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
