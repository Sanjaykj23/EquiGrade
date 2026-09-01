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
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="glass-panel-glow p-5 max-w-lg w-100 text-center mx-3">
        
        <div className="d-inline-flex p-3 rounded-circle mb-3 animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}>
          <Sparkles size={32} className="text-white" />
        </div>

        <h4 className="fs-4 fw-bold text-white mb-1">Evaluating Exam Toughness & Equating Scores</h4>
        <p className="text-muted small mb-4">PaddleOCR + Scikit-Learn Normalization Model Running</p>

        <div className="d-flex flex-column gap-3 text-start mb-4">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`d-flex align-items-center gap-3 p-3 rounded-3 border transition-all ${
                  isDone ? 'bg-emerald-subtle border-emerald' : isCurrent ? 'bg-purple-subtle border-purple' : 'bg-dark opacity-50 border-secondary'
                }`}
                style={{
                  background: isDone ? 'rgba(16, 185, 129, 0.1)' : isCurrent ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                  borderColor: isDone ? '#10b981' : isCurrent ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={20} className="text-emerald flex-shrink-0" style={{ color: '#34d399' }} />
                ) : isCurrent ? (
                  <Loader2 size={20} className="text-purple flex-shrink-0 spin" style={{ color: '#c084fc', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div className="rounded-circle border border-secondary" style={{ width: 20, height: 20 }} />
                )}

                <span className={`small ${isDone ? 'text-emerald-light' : isCurrent ? 'text-white fw-semibold' : 'text-muted'}`}>
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
