import React, { useState } from 'react';
import { BarChart3, Brain, Calculator, CheckCircle2, FileText, FlaskConical, Loader2, Sparkles, Upload, Zap } from 'lucide-react';
import { analyzeQuestionPaper } from '../../services/api';
import { BoardType } from '../../types';

interface QPAnalysisResponse {
  subject: 'physics' | 'chemistry' | 'maths';
  total_questions: number;
  easy: number;
  medium: number;
  hard: number;
  difficulty_index: number;
  complexity_label: 'Easy' | 'Moderate' | 'Challenging' | 'Very High';
  predicted_paper_mean: number;
  sample_questions?: string[];
}

export const QPAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [board, setBoard] = useState<BoardType>('STATE_BOARD');
  const [manualSubject, setManualSubject] = useState<string>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qpdiResult, setQpdiResult] = useState<QPAnalysisResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setQpdiResult(null); // Reset previous result when a new file is attached
      } else {
        alert('Please upload a valid PDF question paper.');
      }
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) {
      alert('Please upload a question paper PDF.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeQuestionPaper(selectedFile, board, manualSubject);
      setQpdiResult(result);
    } catch (error) {
      console.error('Error analyzing question paper:', error);
      alert('An error occurred during paper analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'maths':
        return <Calculator size={20} style={{ color: '#2563eb' }} />;
      case 'physics':
        return <Zap size={20} style={{ color: '#7c3aed' }} />;
      case 'chemistry':
        return <FlaskConical size={20} style={{ color: '#db2777' }} />;
      default:
        return <Brain size={20} style={{ color: '#2563eb' }} />;
    }
  };

  return (
    <div className="container py-5">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-5">
        <span className="badge-tag badge-purple mb-2 d-inline-block">PaddleOCR + Bloom's Taxonomy</span>
        <h1 className="fs-1 fw-bold mb-3" style={{ color: '#0f172a' }}>Question Paper Difficulty Analyzer</h1>
        <p className="fs-6" style={{ color: '#475569', maxWidth: '650px', margin: '0 auto' }}>
          Upload any Physics, Chemistry, or Maths paper PDF to extract question difficulty vectors, Bloom's cognitive taxonomy breakdown, and AI complexity index scores.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        
        {/* Upload & Controls Column */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between bg-white">
            <div>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                <FileText size={20} style={{ color: '#2563eb' }} />
                Upload Question Paper (PDF)
              </h5>

              {/* Board Selector */}
              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#334155' }}>Select Board Category</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${board === 'STATE_BOARD' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setBoard('STATE_BOARD')}
                  >
                    Tamil Nadu State Board
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${board === 'CBSE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setBoard('CBSE')}
                  >
                    CBSE Board
                  </button>
                </div>
              </div>

              {/* Subject Selector */}
              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#334155' }}>Paper Subject Category</label>
                <select
                  className="form-select form-select-sm custom-input"
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                >
                  <option value="auto">✨ Auto Detect Subject from PDF Content</option>
                  <option value="physics">⚡ Physics Question Paper</option>
                  <option value="chemistry">🧪 Chemistry Question Paper</option>
                  <option value="maths">📐 Mathematics Question Paper</option>
                </select>
              </div>

              {/* File Dropzone */}
              <label
                className="dropzone-container d-block mb-4"
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="d-none"
                  onChange={handleFileChange}
                />
                {!selectedFile ? (
                  <div className="py-4">
                    <Upload size={32} className="mb-2" style={{ color: '#2563eb' }} />
                    <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Click to select PDF or Drag & Drop</h6>
                    <small style={{ color: '#64748b' }}>Supports Tamil Nadu State Board & CBSE question papers</small>
                  </div>
                ) : (
                  <div className="py-3">
                    <CheckCircle2 size={32} className="mb-2" style={{ color: '#059669' }} />
                    <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{selectedFile.name}</h6>
                    <small style={{ color: '#64748b' }}>{(selectedFile.size / 1024).toFixed(1)} KB PDF attached</small>
                  </div>
                )}
              </label>
            </div>

            <button
              type="button"
              className="btn-primary-gradient w-100 py-3 fs-6"
              onClick={handleRunAnalysis}
              disabled={!selectedFile || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="spin me-2" style={{ animation: 'spin 1s linear infinite' }} />
                  OCR Parsing & Bloom NLP Model Running...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="me-2" /> Run QPDI NLP Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Display Column */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 h-100 bg-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ color: '#0f172a' }}>
              <span className="d-flex align-items-center gap-2">
                <Brain size={20} style={{ color: '#7c3aed' }} />
                QPDI AI Evaluation Report
              </span>
              {qpdiResult && (
                <span className="badge-tag badge-purple d-flex align-items-center gap-1 text-capitalize fs-6">
                  {getSubjectIcon(qpdiResult.subject)} {qpdiResult.subject} Paper Detected
                </span>
              )}
            </h5>

            {!qpdiResult ? (
              <div className="text-center py-5" style={{ color: '#64748b' }}>
                <BarChart3 size={48} className="mb-3 opacity-50" />
                <p className="mb-0">Upload a paper on the left and click "Run QPDI NLP Analysis" to extract real subject difficulty parameters.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {/* Metric Summary Grid */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span className="small fw-semibold d-block mb-1" style={{ color: '#64748b' }}>Overall Complexity Index</span>
                      <div className="d-flex align-items-baseline gap-2 mb-1">
                        <span className="display-6 fw-bold" style={{ color: '#0f172a' }}>{qpdiResult.difficulty_index}</span>
                        <span className={`badge-tag ${qpdiResult.difficulty_index >= 0.7 ? 'badge-amber' : 'badge-emerald'}`}>
                          {qpdiResult.complexity_label}
                        </span>
                      </div>
                      <small style={{ color: '#64748b' }}>Bloom Taxonomy Complexity (0.0 to 1.0)</small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span className="small fw-semibold d-block mb-1" style={{ color: '#64748b' }}>Predicted Board Paper Mean</span>
                      <div className="display-6 fw-bold text-primary mb-1" style={{ color: '#2563eb' }}>
                        {qpdiResult.predicted_paper_mean} <span className="fs-6 text-muted">/ 100</span>
                      </div>
                      <small style={{ color: '#64748b' }}>Scikit-Learn Estimated State Mean</small>
                    </div>
                  </div>
                </div>

                {/* Bloom's Distribution */}
                <div className="stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Bloom's Cognitive Question Breakdown</h6>
                    <span className="badge-tag badge-blue">{qpdiResult.total_questions} Questions Scanned</span>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between mb-2 small">
                    <span style={{ color: '#059669', fontWeight: 600 }}>Easy Questions (Direct Memory/Recall)</span>
                    <strong style={{ color: '#0f172a' }}>{qpdiResult.easy} Questions ({Math.round((qpdiResult.easy / qpdiResult.total_questions) * 100)}%)</strong>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between mb-2 small">
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>Medium Questions (Conceptual Understanding)</span>
                    <strong style={{ color: '#0f172a' }}>{qpdiResult.medium} Questions ({Math.round((qpdiResult.medium / qpdiResult.total_questions) * 100)}%)</strong>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-2 small">
                    <span style={{ color: '#db2777', fontWeight: 600 }}>Hard Questions (Application & Analytical Synthesis)</span>
                    <strong style={{ color: '#0f172a' }}>{qpdiResult.hard} Questions ({Math.round((qpdiResult.hard / qpdiResult.total_questions) * 100)}%)</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
