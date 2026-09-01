import React from 'react';
import { AlertTriangle, Scale, Users } from 'lucide-react';

export const ProblemStatement: React.FC = () => {
  return (
    <section id="problem-statement" className="py-5">
      <div className="container">
        
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge-tag badge-amber mb-2 d-inline-block">The Admission Inequality</span>
          <h2 className="fs-1 fw-bold mb-3" style={{ color: '#0f172a' }}>The "Raw Mark" Trap in TNEA</h2>
          <p className="fs-6" style={{ color: '#475569', maxWidth: '650px', margin: '0 auto' }}>
            In competitive engineering admissions like TNEA, candidates are traditionally ranked purely by raw percentage.
            However, this creates a severe structural inequality due to cross-board paper complexity disparities.
          </p>
        </div>

        <div className="row g-4">
          
          {/* Difficulty Gap Card */}
          <div className="col-lg-4 col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between bg-white">
              <div>
                <div className="p-3 rounded-3 d-inline-block mb-3" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <AlertTriangle size={24} />
                </div>
                <h4 className="fs-5 fw-bold mb-2" style={{ color: '#0f172a' }}>Difficulty Gap</h4>
                <p className="small mb-0" style={{ lineHeight: '1.6', color: '#475569' }}>
                  A 192/200 score in an application-heavy CBSE Physics exam requires high analytical synthesis compared to a direct-textbook 198/200 in certain boards.
                </p>
              </div>
              <div className="mt-4 pt-3 border-top border-light">
                <span className="badge-tag badge-purple">Bloom's Taxonomy Variance</span>
              </div>
            </div>
          </div>

          {/* Statistical Standard Deviation Disparity */}
          <div className="col-lg-4 col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between bg-white">
              <div>
                <div className="p-3 rounded-3 d-inline-block mb-3" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <Scale size={24} />
                </div>
                <h4 className="fs-5 fw-bold mb-2" style={{ color: '#0f172a' }}>Statistical Spread Disparity</h4>
                <p className="small mb-0" style={{ lineHeight: '1.6', color: '#475569' }}>
                  CBSE mark distributions display tight variance (Standard Deviation ≈ 8), whereas State Board distributions exhibit wider spread (Standard Deviation ≈ 12).
                </p>
              </div>
              <div className="mt-4 pt-3 border-top border-light">
                <span className="badge-tag badge-blue">Z-Score & Percentile Equating</span>
              </div>
            </div>
          </div>

          {/* Financial & Merit Consequence */}
          <div className="col-lg-4 col-md-12">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between bg-white">
              <div>
                <div className="p-3 rounded-3 d-inline-block mb-3" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <Users size={24} />
                </div>
                <h4 className="fs-5 fw-bold mb-2" style={{ color: '#0f172a' }}>Unfair Quota Displacement</h4>
                <p className="small mb-0" style={{ lineHeight: '1.6', color: '#475569' }}>
                  Meritorious students miss out on government seats in top tier institutions (CEG, MIT, PSG) by fractions of a point, pushing them into expensive management quota fees.
                </p>
              </div>
              <div className="mt-4 pt-3 border-top border-light">
                <span className="badge-tag badge-amber">EquiGrade Solution</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
