import React from 'react';
import { QPDIBreakdown } from '../../types';
import { Brain, Layers } from 'lucide-react';

interface QPDIChartProps {
  breakdowns: QPDIBreakdown[];
}

export const QPDIChart: React.FC<QPDIChartProps> = ({ breakdowns }) => {
  return (
    <div className="glass-panel p-4 h-100 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Question Paper Difficulty Index (QPDI)</h5>
          <p className="small mb-0" style={{ color: '#64748b' }}>Bloom's Taxonomy Classification via MiniLM Clustering</p>
        </div>
        <div className="d-flex align-items-center gap-1" style={{ color: '#7c3aed' }}>
          <Brain size={18} />
          <span className="small fw-semibold">NLP Engine</span>
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        {breakdowns.map((qpdi) => {
          const total = qpdi.easy + qpdi.medium + qpdi.hard || 1;
          const easyPct = Math.round((qpdi.easy / total) * 100);
          const medPct = Math.round((qpdi.medium / total) * 100);
          const hardPct = Math.round((qpdi.hard / total) * 100);

          return (
            <div key={qpdi.subject} className="stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <Layers size={16} style={{ color: '#2563eb' }} />
                  <span className="fw-bold text-capitalize" style={{ color: '#0f172a' }}>{qpdi.subject} Paper</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="small" style={{ color: '#64748b' }}>Complexity Index: <strong style={{ color: '#0f172a' }}>{qpdi.difficultyIndex}</strong></span>
                  <span className={`badge-tag ${qpdi.difficultyIndex > 0.7 ? 'badge-amber' : 'badge-emerald'}`}>
                    {qpdi.complexityLabel}
                  </span>
                </div>
              </div>

              {/* Stacked Percentage Bar */}
              <div className="progress mb-2" style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '6px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: `${easyPct}%`, backgroundColor: '#059669' }} title={`Easy: ${qpdi.easy}`} />
                <div className="progress-bar" role="progressbar" style={{ width: `${medPct}%`, backgroundColor: '#2563eb' }} title={`Medium: ${qpdi.medium}`} />
                <div className="progress-bar" role="progressbar" style={{ width: `${hardPct}%`, backgroundColor: '#db2777' }} title={`Hard: ${qpdi.hard}`} />
              </div>

              <div className="d-flex align-items-center justify-content-between small" style={{ fontSize: '0.8rem', color: '#475569' }}>
                <span className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#059669' }} />
                  Easy: <strong>{easyPct}%</strong> ({qpdi.easy} Qs)
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#2563eb' }} />
                  Medium: <strong>{medPct}%</strong> ({qpdi.medium} Qs)
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#db2777' }} />
                  Hard: <strong>{hardPct}%</strong> ({qpdi.hard} Qs)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
