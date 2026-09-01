import React from 'react';
import { ArrowRight, BarChart2, CheckCircle, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <div className="hero-wrapper">
      <div className="container">
        <div className="row align-items-center g-5">
          
          <div className="col-lg-7">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>AI-Driven Cross-Board Mark Normalization</span>
            </div>

            <h1 className="display-4 fw-extrabold text-white mb-4 tracking-tight" style={{ lineHeight: 1.15 }}>
              Bridge the <span className="text-gradient">Board Difficulty Gap</span> in TNEA Admissions
            </h1>

            <p className="fs-5 mb-4" style={{ lineHeight: 1.6, maxWidth: '620px', color: '#cbd5e1' }}>
              Standard raw percentages penalize students from application-heavy boards like CBSE.
              EquiGrade uses NLP OCR and Bloom’s Taxonomy to evaluate question paper toughness
              and compute a truly fair <strong className="text-white">Normalized Competency Score (NCS)</strong>.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
              <Link to="/normalise" className="btn-primary-gradient fs-6">
                Normalise Cutoff <ArrowRight size={18} />
              </Link>
              <Link to="/analyse" className="btn-secondary-glass fs-6">
                Analyse Question Paper <BarChart2 size={18} />
              </Link>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-4 small border-top border-secondary border-opacity-25 pt-4" style={{ color: '#cbd5e1' }}>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle size={16} className="text-emerald" style={{ color: '#34d399' }} />
                <span>Percentile Equating</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle size={16} className="text-emerald" style={{ color: '#34d399' }} />
                <span>PaddleOCR NLP Engine</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle size={16} className="text-emerald" style={{ color: '#34d399' }} />
                <span>Bloom's Taxonomy Index</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="glass-panel-glow p-4 animate-pulse-glow">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                <div className="d-flex align-items-center gap-2">
                  <Shield size={20} className="text-purple" style={{ color: '#c084fc' }} />
                  <span className="fw-bold text-white">Equating Simulation Teaser</span>
                </div>
                <span className="badge-tag badge-purple">Live Demo</span>
              </div>

              {/* CBSE Mock Card */}
              <div className="stat-card mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small" style={{ color: '#cbd5e1' }}>CBSE Candidate Physics</span>
                  <span className="badge-tag badge-blue">SD: 8.0</span>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <span className="extra-small d-block" style={{ color: '#94a3b8' }}>Raw Mark</span>
                    <span className="fs-5 fw-bold text-white">192 / 200</span>
                  </div>
                  <div className="text-end">
                    <span className="extra-small d-block" style={{ color: '#94a3b8' }}>Normalized Competency</span>
                    <span className="fs-4 fw-bold text-emerald" style={{ color: '#34d399' }}>197.8 / 200</span>
                  </div>
                </div>
              </div>

              {/* State Board Mock Card */}
              <div className="stat-card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small" style={{ color: '#cbd5e1' }}>State Board Candidate Physics</span>
                  <span className="badge-tag badge-emerald">SD: 12.0</span>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <span className="extra-small d-block" style={{ color: '#94a3b8' }}>Raw Mark</span>
                    <span className="fs-5 fw-bold text-white">196 / 200</span>
                  </div>
                  <div className="text-end">
                    <span className="extra-small d-block" style={{ color: '#94a3b8' }}>Normalized Competency</span>
                    <span className="fs-4 fw-bold text-white">196.2 / 200</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-3" style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                <div className="d-flex align-items-center gap-2 mb-1" style={{ color: '#ddd6fe' }}>
                  <TrendingUp size={16} />
                  <strong className="small">Restoring Meritocracy</strong>
                </div>
                <p className="extra-small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4', color: '#cbd5e1' }}>
                  EquiGrade prevents high-mastery CBSE students from being unfairly displaced from merit seats in CEG, MIT & PSG.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
