import React from 'react';
import { getCollegeMatches } from '../../utils/normalization';
import { Building2, MapPin } from 'lucide-react';

interface CollegePredictorProps {
  normalizedCutoff: number;
}

export const CollegePredictor: React.FC<CollegePredictorProps> = ({ normalizedCutoff }) => {
  const matches = getCollegeMatches(normalizedCutoff);

  return (
    <div className="glass-panel p-4 h-100 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: '#0f172a' }}>TNEA College Merit & Rank Simulator</h5>
          <p className="small mb-0" style={{ color: '#64748b' }}>Predicted Seat Admission Probability based on {normalizedCutoff} / 200 Cutoff</p>
        </div>
        <span className="badge-tag badge-emerald">Anna University TNEA 2026</span>
      </div>

      <div className="row g-3">
        {matches.map((college) => {
          const isHighMatch = college.matchPercentage >= 85;
          const isModerateMatch = college.matchPercentage >= 60 && college.matchPercentage < 85;

          return (
            <div key={college.id} className="col-md-6">
              <div className="stat-card h-100 d-flex flex-column justify-content-between" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge-tag ${isHighMatch ? 'badge-emerald' : isModerateMatch ? 'badge-blue' : 'badge-amber'}`}>
                      {college.matchPercentage}% Match Probability
                    </span>
                    <span className="small" style={{ color: '#64748b' }}>Min Cutoff: <strong style={{ color: '#0f172a' }}>{college.minCutoff}</strong></span>
                  </div>

                  <h6 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                    <Building2 size={16} style={{ color: '#2563eb' }} />
                    {college.name}
                  </h6>
                  <p className="small mb-2" style={{ fontSize: '0.8rem', color: '#475569' }}>
                    {college.branch} • {college.campus}
                  </p>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light small" style={{ color: '#64748b' }}>
                  <span className="d-flex align-items-center gap-1">
                    <MapPin size={12} /> {college.location}
                  </span>
                  <span className="fw-semibold" style={{ color: '#334155' }}>{college.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
