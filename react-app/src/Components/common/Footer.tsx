import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-5 border-top border-light pt-5 pb-4" style={{ background: '#f1f5f9', color: '#0f172a' }}>
      <div className="container px-4">
        <div className="row g-4">
          
          {/* Brand & Description */}
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Award size={24} style={{ color: '#2563eb' }} />
              <span className="fs-5 fw-bold" style={{ color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>EquiGrade</span>
            </div>
            <p className="small mb-3" style={{ maxWidth: '380px', lineHeight: '1.6', color: '#475569' }}>
              Restoring equity to engineering admissions through AI-powered NLP paper difficulty analysis,
              Bloom's taxonomy clustering, and statistical percentile equating across CBSE and State Boards.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge-tag badge-emerald d-inline-flex align-items-center gap-1">
                <ShieldCheck size={12} /> TNEA Approved Norm Logic
              </span>
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>Core Modules</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/normalise" className="text-decoration-none footer-link" style={{ color: '#475569', transition: 'color 0.2s' }}>
                  Cutoff Normalization Engine
                </Link>
              </li>
              <li>
                <Link to="/analyse" className="text-decoration-none footer-link" style={{ color: '#475569', transition: 'color 0.2s' }}>
                  Question Paper Difficulty Index (QPDI)
                </Link>
              </li>
              <li>
                <Link to="/normalise" className="text-decoration-none footer-link" style={{ color: '#475569', transition: 'color 0.2s' }}>
                  TNEA College Merit Predictor
                </Link>
              </li>
              <li>
                <a href="#problem-statement" className="text-decoration-none footer-link" style={{ color: '#475569', transition: 'color 0.2s' }}>
                  The Raw Mark Inequality Gap
                </a>
              </li>
            </ul>
          </div>

          {/* Engine Specs */}
          <div className="col-lg-4 col-md-12">
            <h6 className="fw-bold mb-3" style={{ color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>Engine Specifications</h6>
            <div className="glass-panel p-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-semibold" style={{ color: '#334155' }}>OCR Engine</span>
                <span className="badge-tag badge-purple">PaddleOCR v2.6</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-semibold" style={{ color: '#334155' }}>NLP Transformer</span>
                <span className="badge-tag badge-blue">all-MiniLM-L6-v2</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="small fw-semibold" style={{ color: '#334155' }}>Statistical Model</span>
                <span className="badge-tag badge-amber">K-Means + Z-Score</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="my-4 border-light" />

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small" style={{ color: '#64748b' }}>
          <div>© {new Date().getFullYear()} EquiGrade Platform. Built for FOSS Hack 2026.</div>
          <div className="d-flex align-items-center gap-3">
            <span className="d-inline-flex align-items-center gap-1" style={{ color: '#475569' }}>
              <Sparkles size={14} style={{ color: '#2563eb' }} /> Fair Admissions Tech
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
