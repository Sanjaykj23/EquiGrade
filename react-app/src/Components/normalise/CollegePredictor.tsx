import React from 'react';
import { getCollegeMatches } from '../../utils/normalization';
import { Award, Building2, MapPin } from 'lucide-react';

interface CollegePredictorProps {
  normalizedCutoff: number;
}

export const CollegePredictor: React.FC<CollegePredictorProps> = ({ normalizedCutoff }) => {
  const matches = getCollegeMatches(normalizedCutoff);

  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold text-white mb-1">TNEA College Merit & Rank Simulator</h5>
          <p className="text-muted small mb-0">Predicted Seat Admission Probability based on {normalizedCutoff} / 200 Cutoff</p>
        </div>
        <span className="badge-tag badge-emerald">Anna University TNEA 2026</span>
      </div>

      <div className="row g-3">
        {matches.map((college) => {
          const isHighMatch = college.matchPercentage >= 85;
          const isModerateMatch = college.matchPercentage >= 60 && college.matchPercentage < 85;

          return (
            <div key={college.id} className="col-md-6">
              <div className="stat-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge-tag ${isHighMatch ? 'badge-emerald' : isModerateMatch ? 'badge-blue' : 'badge-amber'}`}>
                      {college.matchPercentage}% Match Probability
                    </span>
                    <span className="text-muted extra-small">Min Cutoff: <strong className="text-white">{college.minCutoff}</strong></span>
                  </div>

                  <h6 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                    <Building2 size={16} className="text-purple" style={{ color: '#8b5cf6' }} />
                    {college.name}
                  </h6>
                  <p className="text-muted extra-small mb-2" style={{ fontSize: '0.8rem' }}>
                    {college.branch} • {college.campus}
                  </p>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25 text-muted extra-small">
                  <span className="d-flex align-items-center gap-1">
                    <MapPin size={12} /> {college.location}
                  </span>
                  <span className="fw-medium text-white">{college.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
