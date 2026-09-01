import React from 'react';
import { SUBJECTS } from '../../config/constants';
import { SubjectMarks } from '../../types';
import { Calculator, FlaskConical, Zap } from 'lucide-react';

interface MarksInputGridProps {
  marks: SubjectMarks;
  onChangeMarks: (marks: SubjectMarks) => void;
}

export const MarksInputGrid: React.FC<MarksInputGridProps> = ({
  marks,
  onChangeMarks
}) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'maths':
        return <Calculator size={18} style={{ color: '#2563eb' }} />;
      case 'physics':
        return <Zap size={18} style={{ color: '#7c3aed' }} />;
      case 'chemistry':
        return <FlaskConical size={18} style={{ color: '#db2777' }} />;
      default:
        return null;
    }
  };

  const handleSubjectChange = (key: keyof SubjectMarks, value: string) => {
    onChangeMarks({
      ...marks,
      [key]: value
    });
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold fs-6 mb-3 d-block" style={{ color: '#0f172a' }}>
        Step 2: Enter Board Raw Marks (Out of 100)
      </label>

      <div className="row g-3">
        {SUBJECTS.map((sub) => (
          <div key={sub.key} className="col-md-4">
            <div className="glass-panel p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  {getIcon(sub.key)}
                  <span className="fw-semibold" style={{ color: '#0f172a' }}>{sub.name}</span>
                </div>
                <span className="badge-tag badge-purple">Max: 100</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Enter Raw Score"
                className="custom-input"
                value={marks[sub.key]}
                onChange={(e) => handleSubjectChange(sub.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
