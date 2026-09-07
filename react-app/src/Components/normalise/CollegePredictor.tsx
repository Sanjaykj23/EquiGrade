import React, { useState } from 'react';
import { getDetailedCollegePredictions } from '../../utils/normalization';
import { Award, BookOpen, Building2, CheckCircle2, ChevronDown, ChevronUp, GraduationCap, MapPin } from 'lucide-react';

interface CollegePredictorProps {
  normalizedCutoff: number;
}

export const CollegePredictor: React.FC<CollegePredictorProps> = ({ normalizedCutoff }) => {
  const predictions = getDetailedCollegePredictions(normalizedCutoff);
  const [expandedCollegeId, setExpandedCollegeId] = useState<string | null>(predictions[0]?.id || null);
  const [filterMode, setFilterMode] = useState<'all' | 'eligible_only'>('eligible_only');

  const toggleExpand = (id: string) => {
    setExpandedCollegeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="glass-panel p-4 h-100 bg-white">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: '#0f172a' }}>TNEA College & Course Admission Predictor</h5>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            List of eligible engineering colleges and available branch courses based on your <strong style={{ color: '#2563eb' }}>{normalizedCutoff} / 200</strong> Normalized Cut-Off
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${filterMode === 'eligible_only' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterMode('eligible_only')}
            >
              Eligible Courses Only
            </button>
            <button
              type="button"
              className={`btn ${filterMode === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterMode('all')}
            >
              Show All Courses
            </button>
          </div>
        </div>
      </div>

      {/* College List */}
      <div className="d-flex flex-column gap-3">
        {predictions.map((college) => {
          const isExpanded = expandedCollegeId === college.id;
          const displayCourses = filterMode === 'eligible_only'
            ? college.eligibleCourses.filter(c => c.isEligible)
            : college.eligibleCourses;

          const totalEligibleInCollege = college.eligibleCourses.filter(c => c.isEligible).length;

          return (
            <div
              key={college.id}
              className="stat-card"
              style={{ background: '#ffffff', border: isExpanded ? '2px solid #2563eb' : '1px solid #e2e8f0' }}
            >
              {/* College Card Header */}
              <div
                className="d-flex align-items-center justify-content-between cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleExpand(college.id)}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge-tag badge-purple">{college.code}</span>
                    <span className="badge-tag badge-blue">{college.category}</span>
                    <span className="badge-tag badge-emerald">{totalEligibleInCollege} Courses Available</span>
                  </div>

                  <h6 className="fw-bold fs-6 mb-1" style={{ color: '#0f172a' }}>
                    <Building2 size={18} className="me-2" style={{ color: '#2563eb' }} />
                    {college.collegeName}
                  </h6>
                  <p className="small mb-0" style={{ color: '#64748b' }}>
                    <MapPin size={14} className="me-1" /> {college.location} • {college.campus}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <span className="fs-5 fw-bold" style={{ color: '#059669' }}>
                      {college.overallMatchPercentage}%
                    </span>
                    <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Match Probability</small>
                  </div>
                  <button type="button" className="btn btn-sm btn-light border-0">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Courses Accordion Content */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-top border-light">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', color: '#334155' }}>
                    <GraduationCap size={16} style={{ color: '#7c3aed' }} />
                    Available Engineering Courses & Cutoff Comparison:
                  </h6>

                  {displayCourses.length === 0 ? (
                    <div className="p-3 bg-light rounded text-center small" style={{ color: '#64748b' }}>
                      No direct cutoff matches in this college for your current score. Click "Show All Courses" to view department benchmarks.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {displayCourses.map((course) => {
                        const cutoffDiff = Number((normalizedCutoff - course.cutoffRequired).toFixed(2));
                        return (
                          <div
                            key={course.code}
                            className="p-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2"
                            style={{
                              background: course.isEligible ? '#ecfdf5' : '#f8fafc',
                              border: course.isEligible ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                            }}
                          >
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="fw-bold" style={{ color: '#0f172a' }}>{course.name}</span>
                                <span className="badge-tag badge-purple" style={{ fontSize: '0.7rem' }}>{course.code}</span>
                              </div>
                              <small style={{ color: '#475569' }}>
                                Required Cutoff: <strong>{course.cutoffRequired}</strong> | Your Cutoff: <strong>{normalizedCutoff}</strong>
                              </small>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                              <span className={`badge-tag ${
                                course.confidence === 'High Probability' ? 'badge-emerald' : course.confidence === 'Moderate Chance' ? 'badge-blue' : 'badge-amber'
                              }`}>
                                {course.confidence} ({cutoffDiff >= 0 ? `+${cutoffDiff}` : cutoffDiff})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
