import React from 'react';
import { QPDIBreakdown } from '../../types';
import { Brain, Layers } from 'lucide-react';

interface QPDIChartProps {
  breakdowns: QPDIBreakdown[];
}

export const QPDIChart: React.FC<QPDIChartProps> = ({ breakdowns }) => {
  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold text-white mb-1">Question Paper Difficulty Index (QPDI)</h5>
          <p className="text-muted small mb-0">Bloom's Taxonomy Classification via MiniLM Clustering</p>
        </div>
        <div className="d-flex align-items-center gap-1 text-purple" style={{ color: '#c084fc' }}>
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
            <div key={qpdi.subject} className="stat-card">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <Layers size={16} className="text-purple" style={{ color: '#8b5cf6' }} />
                  <span className="text-white fw-bold text-capitalize">{qpdi.subject} Paper</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted extra-small">Complexity Index: <strong className="text-white">{qpdi.difficultyIndex}</strong></span>
                  <span className={`badge-tag ${qpdi.difficultyIndex > 0.7 ? 'badge-amber' : 'badge-emerald'}`}>
                    {qpdi.complexityLabel}
                  </span>
                </div>
              </div>

              {/* Stacked Percentage Bar */}
              <div className="progress mb-2" style={{ height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: `${easyPct}%`, backgroundColor: '#10b981' }} title={`Easy: ${qpdi.easy}`} />
                <div className="progress-bar" role="progressbar" style={{ width: `${medPct}%`, backgroundColor: '#3b82f6' }} title={`Medium: ${qpdi.medium}`} />
                <div className="progress-bar" role="progressbar" style={{ width: `${hardPct}%`, backgroundColor: '#ec4899' }} title={`Hard: ${qpdi.hard}`} />
              </div>

              <div className="d-flex align-items-center justify-content-between text-muted extra-small" style={{ fontSize: '0.75rem' }}>
                <span className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#10b981' }} />
                  Easy: <strong>{easyPct}%</strong> ({qpdi.easy} Qs)
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#3b82f6' }} />
                  Medium: <strong>{medPct}%</strong> ({qpdi.medium} Qs)
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#ec4899' }} />
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
