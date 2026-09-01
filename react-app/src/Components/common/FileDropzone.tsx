import React, { useRef, useState } from 'react';
import { Calculator, CheckCircle2, FileText, FlaskConical, Trash2, Upload, Zap } from 'lucide-react';
import { SubjectKey } from '../../types';

interface FileDropzoneProps {
  subject: SubjectKey;
  title: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  subject,
  title,
  file,
  onFileSelect
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getIcon = () => {
    switch (subject) {
      case 'maths':
        return <Calculator size={28} className="text-blue" style={{ color: '#60a5fa' }} />;
      case 'physics':
        return <Zap size={28} className="text-purple" style={{ color: '#c084fc' }} />;
      case 'chemistry':
        return <FlaskConical size={28} className="text-pink" style={{ color: '#f472b6' }} />;
      default:
        return <FileText size={28} className="text-white" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        onFileSelect(droppedFile);
      } else {
        alert('Please upload a valid PDF question paper document.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        onFileSelect(selectedFile);
      } else {
        alert('Please upload a valid PDF question paper document.');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="h-100 d-flex flex-column">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="d-none"
        onChange={handleInputChange}
      />

      <div
        className={`dropzone-container flex-grow-1 d-flex flex-column align-items-center justify-content-center ${
          isDragOver ? 'active' : ''
        } ${file ? 'file-attached' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        {!file ? (
          <>
            <div className="mb-3 p-3 rounded-circle" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              {getIcon()}
            </div>
            <h6 className="text-white fw-bold mb-1">{title}</h6>
            <p className="small mb-3" style={{ color: '#cbd5e1' }}>Drag & drop exam PDF or click to browse</p>
            <button
              type="button"
              className="btn btn-sm btn-secondary-glass py-1.5 px-3"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload size={14} /> Upload PDF
            </button>
          </>
        ) : (
          <div className="w-100 text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2 text-success">
              <CheckCircle2 size={22} style={{ color: '#34d399' }} />
              <span className="fw-bold text-white small">PDF Attached</span>
            </div>
            <div className="bg-dark bg-opacity-75 p-2 rounded-3 mb-2 border border-secondary">
              <div className="text-truncate text-white small fw-medium" title={file.name}>
                {file.name}
              </div>
              <small style={{ color: '#cbd5e1' }}>{formatFileSize(file.size)}</small>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger border-0 text-danger-emphasis py-1 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              <Trash2 size={14} className="me-1" /> Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
