import React from 'react';
import { Award, Cpu, FileSpreadsheet, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="text-purple" size={28} style={{ color: '#c084fc' }} />,
      title: 'QPDI NLP Engine',
      description: 'Scans uploaded PDF exam papers with PaddleOCR and clusters question text into Bloom’s Taxonomy levels (Easy / Medium / Hard).',
      tag: 'PaddleOCR + MiniLM'
    },
    {
      icon: <LineChart className="text-blue" size={28} style={{ color: '#60a5fa' }} />,
      title: 'Adaptive Normalization',
      description: 'Applies Scikit-learn trained models to estimate true paper mean scores and normalizes student performance against board peer distributions.',
      tag: 'Z-Score Equating'
    },
    {
      icon: <Award className="text-emerald" size={28} style={{ color: '#34d399' }} />,
      title: 'TNEA Merit Simulator',
      description: 'Computes your equated cut-off score (out of 200) and predicts eligible college cutoffs across Anna University CEG, MIT, PSG Tech & SSN.',
      tag: 'Rank Predictor'
    },
    {
      icon: <FileSpreadsheet className="text-amber" size={28} style={{ color: '#fbbf24' }} />,
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
          <h2 className="fs-1 fw-bold text-white mb-3">Architected for Precision & Transparency</h2>
          <p className="fs-6" style={{ color: '#cbd5e1' }}>
            Explore the core AI modules driving cross-board equity and admission meritocracy.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, idx) => (
            <div key={idx} className="col-lg-6">
              <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      {feature.icon}
                    </div>
                    <span className="badge-tag badge-purple">{feature.tag}</span>
                  </div>
                  <h4 className="fs-5 fw-bold text-white mb-2">{feature.title}</h4>
                  <p className="small mb-0" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                    {feature.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-end">
                  <Link to="/normalise" className="text-decoration-none small text-purple fw-semibold d-inline-flex align-items-center gap-1" style={{ color: '#c084fc' }}>
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
