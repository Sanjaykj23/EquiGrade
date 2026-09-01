import React, { useState } from 'react';
import { Navbar } from '../Components/common/Navbar';
import { Footer } from '../Components/common/Footer';
import { BoardSelector } from '../Components/normalise/BoardSelector';
import { MarksInputGrid } from '../Components/normalise/MarksInputGrid';
import { QPFileUploadSection } from '../Components/normalise/QPFileUploadSection';
import { ProcessingOverlay } from '../Components/normalise/ProcessingOverlay';
import { TransparencyDashboard } from '../Components/normalise/TransparencyDashboard';
import { BoardType, NormalizationResults, ProcessingStep, SubjectFiles, SubjectMarks, SubjectKey } from '../types';
import { INITIAL_PROCESSING_STEPS } from '../config/constants';
import { normalizeScores } from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

const NormaliseQP: React.FC = () => {
  const [board, setBoard] = useState<BoardType | ''>('');
  const [marks, setMarks] = useState<SubjectMarks>({
    physics: '',
    chemistry: '',
    maths: ''
  });
  const [files, setFiles] = useState<SubjectFiles>({
    physics: null,
    chemistry: null,
    maths: null
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(INITIAL_PROCESSING_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [results, setResults] = useState<NormalizationResults | null>(null);

  const handleFileSelect = (subject: SubjectKey, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [subject]: file
    }));
  };

  const handleRunNormalization = async () => {
    if (!board) {
      alert('Please select your secondary education board.');
      return;
    }

    if (!marks.physics || !marks.chemistry || !marks.maths) {
      alert('Please enter marks for all three subjects (Physics, Chemistry, Mathematics).');
      return;
    }

    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Step-by-step progress animation
    for (let i = 0; i < INITIAL_PROCESSING_STEPS.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const data = await normalizeScores(board, marks, files);
      setResults(data);
    } catch (error) {
      console.error('Normalization execution error:', error);
      alert('An error occurred during normalization analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setBoard('');
    setMarks({ physics: '', chemistry: '', maths: '' });
    setFiles({ physics: null, chemistry: null, maths: null });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 container py-5">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge-tag badge-purple mb-2 d-inline-block">EquiGrade Norm Engine</span>
          <h1 className="fs-1 fw-bold mb-2" style={{ color: '#0f172a' }}>TNEA Cutoff Normalization</h1>
          <p className="fs-6" style={{ color: '#475569', maxWidth: '650px', margin: '0 auto' }}>
            Select your board, input your raw marks out of 100, and upload your question paper PDFs to calculate a truly fair, equated TNEA admission cut-off.
          </p>
        </div>

        {isProcessing && (
          <ProcessingOverlay
            steps={processingSteps}
            currentStepIndex={currentStepIndex}
          />
        )}

        {!results ? (
          <div className="glass-panel p-4 p-md-5 max-w-4xl mx-auto bg-white">
            <BoardSelector
              selectedBoard={board}
              onSelectBoard={setBoard}
            />

            <MarksInputGrid
              marks={marks}
              onChangeMarks={setMarks}
            />

            <QPFileUploadSection
              files={files}
              onFileSelect={handleFileSelect}
            />

            <div className="text-center pt-3 border-top border-light mt-4">
              <button
                type="button"
                className="btn-primary-gradient fs-6 px-5 py-3"
                onClick={handleRunNormalization}
              >
                <Sparkles size={20} className="me-2" /> Calculate Equated Cutoff <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <TransparencyDashboard
            board={board as BoardType}
            results={results}
            onReset={handleReset}
          />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default NormaliseQP;