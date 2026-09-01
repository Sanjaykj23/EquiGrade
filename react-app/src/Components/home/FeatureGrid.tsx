import React from 'react';
import { Award, Cpu, FileSpreadsheet, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Cpu size={26} style={{ color: '#7c3aed' }} />,
      title: 'QPDI NLP Engine',
      description: 'Scans uploaded PDF exam papers with PaddleOCR and clusters question text into Bloom’s Taxonomy levels (Easy / Medium / Hard).',
      tag: 'PaddleOCR + MiniLM'
    },
    {
      icon: <LineChart size={26} style={{ color: '#2563eb' }} />,
      title: 'Adaptive Normalization',
      description: 'Applies Scikit-learn trained models to estimate true paper mean scores and normalizes student performance against board peer distributions.',
      tag: 'Z-Score Equating'
    },
    {
      icon: <Award size={26} style={{ color: '#059669' }} />,
      title: 'TNEA Merit Simulator',
      description: 'Computes your equated cut-off score (out of 200) and predicts eligible college cutoffs across Anna University CEG, MIT, PSG Tech & SSN.',
      tag: 'Rank Predictor'
    },
    {
      icon: <FileSpreadsheet size={26} style={{ color: '#d97706' }} />,
      title: 'Transparency Audit Reports',
      description: 'Generates detailed step-by-step mathematical breakdowns of raw mark conversion to Normalized Competency Score (NCS).',
      tag: 'Audit Ready'
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge-tag badge-purple mb-2 d-inline-block">Platform Capabilities</span>
          <h2 className="fs-1 fw-bold mb-3" style={{ color: '#0f172a' }}>Architected for Precision & Transparency</h2>
          <p className="fs-6" style={{ color: '#475569' }}>
            Explore the core AI modules driving cross-board equity and admission meritocracy.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, idx) => (
            <div key={idx} className="col-lg-6">
              <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between bg-white">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      {feature.icon}
                    </div>
                    <span className="badge-tag badge-purple">{feature.tag}</span>
                  </div>
                  <h4 className="fs-5 fw-bold mb-2" style={{ color: '#0f172a' }}>{feature.title}</h4>
                  <p className="small mb-0" style={{ lineHeight: '1.6', color: '#475569' }}>
                    {feature.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-light text-end">
                  <Link to="/normalise" className="text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1" style={{ color: '#2563eb' }}>
                    Launch Module →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
