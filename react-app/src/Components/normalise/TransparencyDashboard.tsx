import React, { useState } from 'react';
import { BoardType, NormalizationResults, SubjectKey } from '../../types';
import { computeCutoffSummary, generateQPDIBreakdown } from '../../utils/normalization';
import { ScoreComparisonChart } from './ScoreComparisonChart';
import { QPDIChart } from './QPDIChart';
import { CollegePredictor } from './CollegePredictor';
import { ArrowUpRight, Award, BarChart2, Brain, Building2, Download, Printer, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

interface TransparencyDashboardProps {
  board: BoardType;
  results: NormalizationResults;
  onReset: () => void;
}

export const TransparencyDashboard: React.FC<TransparencyDashboardProps> = ({
  board,
  results,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'qpdi' | 'colleges'>('analytics');

  const summary = computeCutoffSummary(results);

  const qpdiBreakdowns = (['maths', 'physics', 'chemistry'] as SubjectKey[]).map((sub) => {
    const res = results[sub];
    return generateQPDIBreakdown(
      sub,
      res?.easy ?? (board === 'CBSE' ? 6 : 10),
      res?.medium ?? (board === 'CBSE' ? 12 : 11),
      res?.hard ?? (board === 'CBSE' ? 7 : 4)
    );
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="py-4">
      
      {/* Top Banner & Audit Stamp */}
      <div className="glass-panel p-4 mb-4">
        <div className="row align-items-center g-4">
          
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge-tag badge-emerald d-inline-flex align-items-center gap-1">
                <ShieldCheck size={14} /> EquiGrade Verified Report
              </span>
              <span className="badge-tag badge-purple">{board} Normalized</span>
            </div>
            <h2 className="fs-2 fw-bold text-white mb-2">TNEA Normalized Competency Summary</h2>
            <p className="text-muted small mb-0" style={{ maxWidth: '520px' }}>
              Your raw mark score has been mathematically equated against overall board paper toughness using Z-score standardization and NLP Bloom taxonomy modeling.
            </p>
          </div>

          <div className="col-lg-5">
            <div className="glass-panel-glow p-4 text-center">
              <span className="text-muted small text-uppercase tracking-wider d-block mb-1">Normalized TNEA Cut-Off Score</span>
              
              <div className="d-flex align-items-baseline justify-content-center gap-2 mb-2">
                <span className="display-4 fw-extrabold text-gradient">{summary.normalizedCutoff}</span>
                <span className="fs-5 text-muted">/ 200</span>
              </div>

              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="text-muted small">
                  Raw Cutoff: <strong className="text-white">{summary.rawCutoff}</strong>
                </div>
                <div className={`badge-tag ${summary.cutoffDelta >= 0 ? 'badge-emerald' : 'badge-amber'}`}>
                  {summary.cutoffDelta >= 0 ? `+${summary.cutoffDelta}` : summary.cutoffDelta} Points Adjusted
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Subject Score Metric Cards */}
      <div className="row g-3 mb-4">
        {(['maths', 'physics', 'chemistry'] as SubjectKey[]).map((subKey) => {
          const res = results[subKey];
          if (!res) return null;
          const delta = Number((res.normalized - res.raw).toFixed(2));

          return (
            <div key={subKey} className="col-md-4">
              <div className="glass-panel p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold text-white text-capitalize fs-5">{subKey}</span>
                  <span className="badge-tag badge-purple">Max: 100</span>
                </div>

                <div className="d-flex align-items-end justify-content-between mb-3">
                  <div>
                    <span className="text-muted extra-small d-block">Raw Mark</span>
                    <span className="fs-4 fw-bold text-white">{res.raw}</span>
                  </div>

                  <div className="text-center px-2">
                    <span className="text-muted extra-small d-block">Paper Mean</span>
                    <span className="fs-6 fw-semibold text-blue" style={{ color: '#60a5fa' }}>{res.paper_mean}</span>
                  </div>

                  <div className="text-end">
                    <span className="text-muted extra-small d-block">Normalized</span>
                    <span className="fs-4 fw-bold text-emerald" style={{ color: '#34d399' }}>{res.normalized}</span>
                  </div>
                </div>

                <div className="p-2 rounded-3 bg-dark bg-opacity-40 d-flex align-items-center justify-content-between text-muted extra-small">
                  <span>Equating Variance:</span>
                  <strong className={delta >= 0 ? 'text-success' : 'text-warning'}>
                    {delta >= 0 ? `+${delta}` : delta} Score Shift
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Tabs Section */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`nav-link-custom ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={16} className="me-1" /> Score Analytics Graph
          </button>
          <button
            type="button"
            className={`nav-link-custom ${activeTab === 'qpdi' ? 'active' : ''}`}
            onClick={() => setActiveTab('qpdi')}
          >
            <Brain size={16} className="me-1" /> QPDI Difficulty Index
          </button>
          <button
            type="button"
            className={`nav-link-custom ${activeTab === 'colleges' ? 'active' : ''}`}
            onClick={() => setActiveTab('colleges')}
          >
            <Building2 size={16} className="me-1" /> TNEA College Predictor
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn btn-sm btn-secondary-glass" onClick={handlePrintReport}>
            <Printer size={14} className="me-1" /> Print Report
          </button>
          <button type="button" className="btn btn-sm btn-outline-purple text-white border-purple" onClick={onReset}>
            <RotateCcw size={14} className="me-1" /> Reset Form
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'analytics' && <ScoreComparisonChart results={results} />}
      {activeTab === 'qpdi' && <QPDIChart breakdowns={qpdiBreakdowns} />}
      {activeTab === 'colleges' && <CollegePredictor normalizedCutoff={summary.normalizedCutoff} />}

    </div>
  );
};
