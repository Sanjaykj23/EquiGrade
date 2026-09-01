import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, BarChart3, FileSpreadsheet, Home, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky-top nav-custom">
      <div className="container-fluid px-4 py-2.5 d-flex align-items-center justify-content-between">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="d-flex align-items-center justify-content-center rounded-3 p-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
            <Award className="text-white" size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fs-5 fw-bold tracking-tight" style={{ color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>EquiGrade</span>
              <span className="badge-tag badge-purple d-none d-sm-inline-block">TNEA Equating Logic</span>
            </div>
            <small className="d-block text-muted" style={{ fontSize: '0.75rem', color: '#64748b' }}>AI-Driven Cross-Board Mark Normalization</small>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="d-flex align-items-center gap-2">
          <Link
            to="/"
            className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={18} />
            <span className="d-none d-md-inline">Home</span>
          </Link>

          <Link
            to="/normalise"
            className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/normalise') ? 'active' : ''}`}
          >
            <FileSpreadsheet size={18} />
            <span>Normalise Cutoff</span>
          </Link>

          <Link
            to="/analyse"
            className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/analyse') ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Analyse QP</span>
          </Link>
        </nav>

        {/* Quick Action Badge */}
        <div className="d-none d-lg-flex align-items-center gap-2">
          <div className="px-3 py-1.5 rounded-pill bg-white border border-light shadow-sm d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
            <Sparkles size={14} style={{ color: '#d97706' }} />
            <span className="fw-medium" style={{ color: '#334155' }}>Anna University TNEA 2026</span>
          </div>
        </div>

      </div>
    </header>
  );
};
