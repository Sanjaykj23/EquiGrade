import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-5 border-top border-secondary border-opacity-25 pt-5 pb-4" style={{ background: 'rgba(9, 13, 22, 0.95)' }}>
      <div className="container px-4">
        <div className="row g-4">
          
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Award className="text-purple" size={24} style={{ color: '#8b5cf6' }} />
              <span className="fs-5 fw-bold text-white">EquiGrade</span>
            </div>
            <p className="text-muted small mb-3" style={{ maxWidth: '380px', lineHeight: '1.6' }}>
              Restoring equity to engineering admissions through AI-powered NLP paper difficulty analysis,
              Bloom's taxonomy clustering, and statistical percentile equating across CBSE and State Boards.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge-tag badge-emerald d-inline-flex align-items-center gap-1">
                <ShieldCheck size={12} /> TNEA Approved Norm Logic
              </span>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Core Modules</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><Link to="/normalise" className="text-decoration-none text-muted hover-white">Cutoff Normalization Engine</Link></li>
              <li><Link to="/analyse" className="text-decoration-none text-muted hover-white">Question Paper Difficulty Index (QPDI)</Link></li>
              <li><Link to="/normalise" className="text-decoration-none text-muted hover-white">TNEA College Merit Predictor</Link></li>
              <li><a href="#problem-statement" className="text-decoration-none text-muted hover-white">The Raw Mark Inequality Gap</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h6 className="text-white fw-bold mb-3">Engine Specifications</h6>
            <div className="glass-panel p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">OCR Engine</span>
                <span className="badge-tag badge-purple">PaddleOCR v2.6</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">NLP Transformer</span>
                <span className="badge-tag badge-blue">all-MiniLM-L6-v2</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">Statistical Model</span>
                <span className="badge-tag badge-amber">K-Means + Z-Score</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="my-4 border-secondary border-opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-muted small">
          <div>© {new Date().getFullYear()} EquiGrade Platform. Built for FOSS Hack 2026.</div>
          <div className="d-flex align-items-center gap-3">
            <span className="d-inline-flex align-items-center gap-1">
              <Sparkles size={14} className="text-purple" style={{ color: '#8b5cf6' }} /> Fair Admissions Tech
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
