import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-card glass container">
      <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Car size={32} className="text-primary" />
        <span style={{ fontSize: '1.25rem', fontWeight: 800 }} className="title-gradient">DriveFlow</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        
        {user ? (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              <LayoutDashboard size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              Dashboard
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
               <User size={18} />
               <span style={{ fontWeight: 600 }}>{user.name}</span>
               <button onClick={logout} className="nav-link" style={{ background: 'none' }}>
                 <LogOut size={20} />
               </button>
            </div>
          </>
        ) : (
          <>
             <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
             <Link to="/signup" className="btn-primary" style={{ marginLeft: '1rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
