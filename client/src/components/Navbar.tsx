import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Menu, X, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive ? 'text-accent' : 'text-white/80 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-400 transition-colors">
              <GraduationCap size={20} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-white text-lg leading-tight">
              Trip<span className="text-accent">Edu</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/trips" className={navLinkClass}>Trips</NavLink>
            {isAuthenticated && (
              <NavLink to="/admin" className={navLinkClass}>Dashboard</NavLink>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">
                  {user?.name}
                  <span className="ml-1.5 bg-accent/20 text-accent text-xs px-1.5 py-0.5 rounded-md font-medium capitalize">
                    {user?.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  id="nav-logout-btn"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="nav-login-btn"
                className="flex items-center gap-1.5 bg-accent text-primary text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent-400 transition-colors"
              >
                <LogIn size={16} />
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
            className="md:hidden text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1 animate-fade-in">
            <MobileLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
            <MobileLink to="/trips" onClick={() => setMobileOpen(false)}>Trips</MobileLink>
            {isAuthenticated && (
              <>
                <MobileLink to="/admin" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={16} className="inline mr-1.5" />
                  Dashboard
                </MobileLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-white/70 hover:text-white hover:bg-primary-700 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <MobileLink to="/login" onClick={() => setMobileOpen(false)}>
                Admin Login
              </MobileLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-700 text-accent'
            : 'text-white/80 hover:text-white hover:bg-primary-700'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
