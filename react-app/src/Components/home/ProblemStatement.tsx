import React from 'react';
import { AlertTriangle, Scale, Users } from 'lucide-react';

export const ProblemStatement: React.FC = () => {
  return (
    <section id="problem-statement" className="py-5">
      <div className="container">
        
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge-tag badge-amber mb-2 d-inline-block">The Admission Inequality</span>
          <h2 className="fs-1 fw-bold text-white mb-3">The "Raw Mark" Trap in TNEA</h2>
          <p className="fs-6" style={{ color: '#cbd5e1' }}>
            In competitive engineering admissions like TNEA, candidates are traditionally ranked purely by raw percentage.
            However, this creates a severe structural inequality due to cross-board paper complexity disparities.
          </p>
        </div>

        <div className="row g-4">
          
          {/* Difficulty Gap Card */}
          <div className="col-lg-4 col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 rounded-3 d-inline-block mb-3" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                  <AlertTriangle size={24} />
                </div>
                <h4 className="fs-5 fw-bold text-white mb-2">Difficulty Gap</h4>
                <p className="small mb-0" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                  A 192/200 score in an application-heavy CBSE Physics exam requires high analytical synthesis compared to a direct-textbook 198/200 in certain boards.
                </p>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <span className="badge-tag badge-purple">Bloom's Taxonomy Variance</span>
              </div>
            </div>
          </div>

          {/* Statistical Standard Deviation Disparity */}
          <div className="col-lg-4 col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 rounded-3 d-inline-block mb-3" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                  <Scale size={24} />
                </div>
                <h4 className="fs-5 fw-bold text-white mb-2">Statistical Spread Disparity</h4>
                <p className="small mb-0" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                  CBSE mark distributions display tight variance (Standard Deviation ≈ 8), whereas State Board distributions exhibit wider spread (Standard Deviation ≈ 12).
                </p>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <span className="badge-tag badge-blue">Z-Score & Percentile Equating</span>
              </div>
            </div>
          </div>

          {/* Financial & Merit Consequence */}
          <div className="col-lg-4 col-md-12">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 rounded-3 d-inline-block mb-3" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fde047' }}>
                  <Users size={24} />
                </div>
                <h4 className="fs-5 fw-bold text-white mb-2">Unfair Quota Displacement</h4>
                <p className="small mb-0" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                  Meritorious students miss out on government seats in top tier institutions (CEG, MIT, PSG) by fractions of a point, pushing them into expensive management quota fees.
                </p>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <span className="badge-tag badge-amber">EquiGrade Solution</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
