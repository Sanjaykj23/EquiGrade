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
        return <Calculator size={28} style={{ color: '#2563eb' }} />;
      case 'physics':
        return <Zap size={28} style={{ color: '#7c3aed' }} />;
      case 'chemistry':
        return <FlaskConical size={28} style={{ color: '#db2777' }} />;
      default:
        return <FileText size={28} style={{ color: '#475569' }} />;
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
            <div className="mb-3 p-3 rounded-circle" style={{ background: '#ffffff', boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}>
              {getIcon()}
            </div>
            <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{title}</h6>
            <p className="small mb-3" style={{ color: '#64748b' }}>Drag & drop exam PDF or click to browse</p>
            <button
              type="button"
              className="btn btn-sm btn-secondary-glass py-1.5 px-3"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload size={14} /> Select PDF
            </button>
          </>
        ) : (
          <div className="w-100 text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2" style={{ color: '#059669' }}>
              <CheckCircle2 size={22} />
              <span className="fw-bold small" style={{ color: '#0f172a' }}>PDF Attached</span>
            </div>
            <div className="bg-white p-2 rounded-3 mb-2 border border-light shadow-sm">
              <div className="text-truncate small fw-medium" style={{ color: '#0f172a' }} title={file.name}>
                {file.name}
              </div>
              <small style={{ color: '#64748b' }}>{formatFileSize(file.size)}</small>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger border-0 py-1 px-2"
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
