import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Users,
  ClipboardList,
  LogOut,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Manage Trips', to: '/admin/trips', icon: MapPin },
  { label: 'Student Records', to: '/admin/students', icon: Users },
  { label: 'Registrations', to: '/admin/registrations', icon: ClipboardList },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-primary min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-primary" />
          </div>
          <span className="font-heading font-bold text-white text-lg">
            Trip<span className="text-accent">Edu</span>
          </span>
        </div>
        <p className="text-white/40 text-xs mt-1 font-body">Admin Dashboard</p>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-accent font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-white/50 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            id={`sidebar-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-accent text-primary font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary' : 'text-white/60'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-primary/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
