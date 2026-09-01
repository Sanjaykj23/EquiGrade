import React from 'react';
import { SUBJECTS } from '../../config/constants';
import { SubjectFiles, SubjectKey } from '../../types';
import { FileDropzone } from '../common/FileDropzone';

interface QPFileUploadSectionProps {
  files: SubjectFiles;
  onFileSelect: (subject: SubjectKey, file: File | null) => void;
}

export const QPFileUploadSection: React.FC<QPFileUploadSectionProps> = ({
  files,
  onFileSelect
}) => {
  return (
    <div className="mb-4">
      <label className="form-label text-white fw-bold fs-6 mb-3 d-block">
        Step 3: Upload Exam Question Papers (PDF Format)
      </label>

      <div className="row g-3">
        {SUBJECTS.map((sub) => (
          <div key={sub.key} className="col-md-4">
            <FileDropzone
              subject={sub.key}
              title={`${sub.name} Question Paper`}
              file={files[sub.key]}
              onFileSelect={(file) => onFileSelect(sub.key, file)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
