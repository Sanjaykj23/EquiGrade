import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, BarChart3, FileSpreadsheet, Home, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky-top nav-custom">
      <div className="container-fluid px-4 py-2 d-flex align-items-center justify-content-between">
        
        {/* Brand Logo & Title */}
        <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="d-flex align-items-center justify-content-center rounded-3 p-2" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
            <Award className="text-white" size={24} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fs-5 fw-bold text-white tracking-wide">EquiGrade</span>
              <span className="badge-tag badge-purple d-none d-sm-inline-block">AI Normalization</span>
            </div>
            <small className="d-block" style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Cross-Board Competency & TNEA Equating</small>
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
          <div className="px-3 py-1.5 rounded-pill glass-panel d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
            <Sparkles size={14} className="text-warning" />
            <span style={{ color: '#cbd5e1' }}>TNEA 2026 Ready</span>
          </div>
        </div>

      </div>
    </header>
  );
};
