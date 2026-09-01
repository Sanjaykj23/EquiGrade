import React from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { ProcessingStep } from '../../types';

interface ProcessingOverlayProps {
  steps: ProcessingStep[];
  currentStepIndex: number;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  steps,
  currentStepIndex
}) => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-panel-glow p-5 max-w-lg w-100 text-center mx-3 shadow-lg" style={{ background: '#ffffff', border: '2px solid #2563eb' }}>
        
        <div className="d-inline-flex p-3 rounded-circle mb-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
          <Sparkles size={32} className="text-white" />
        </div>

        <h4 className="fs-4 fw-bold mb-1" style={{ color: '#0f172a' }}>Evaluating Exam Toughness & Equating Scores</h4>
        <p className="small mb-4" style={{ color: '#64748b' }}>PaddleOCR + Scikit-Learn Normalization Model Running</p>

        <div className="d-flex flex-column gap-3 text-start mb-4">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className="d-flex align-items-center gap-3 p-3 rounded-3 border transition-all"
                style={{
                  background: isDone ? '#ecfdf5' : isCurrent ? '#eff6ff' : '#f8fafc',
                  borderColor: isDone ? '#059669' : isCurrent ? '#2563eb' : '#e2e8f0'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={20} className="flex-shrink-0" style={{ color: '#059669' }} />
                ) : isCurrent ? (
                  <Loader2 size={20} className="flex-shrink-0 spin" style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div className="rounded-circle border" style={{ width: 20, height: 20, borderColor: '#cbd5e1' }} />
                )}

                <span className="small fw-medium" style={{ color: isDone ? '#047857' : isCurrent ? '#1d4ed8' : '#64748b' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
