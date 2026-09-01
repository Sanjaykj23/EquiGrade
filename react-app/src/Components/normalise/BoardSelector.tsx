import React from 'react';
import { BOARDS } from '../../config/constants';
import { BoardType } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface BoardSelectorProps {
  selectedBoard: BoardType | '';
  onSelectBoard: (board: BoardType) => void;
}

export const BoardSelector: React.FC<BoardSelectorProps> = ({
  selectedBoard,
  onSelectBoard
}) => {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold fs-6 mb-3 d-block" style={{ color: '#0f172a' }}>
        Step 1: Select Secondary Education Board
      </label>
      
      <div className="row g-3">
        {BOARDS.map((board) => {
          const isSelected = selectedBoard === board.value;
          return (
            <div key={board.value} className="col-md-4">
              <div
                className={`glass-panel p-3 h-100 cursor-pointer ${
                  isSelected ? 'shadow-sm' : ''
                }`}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                  borderWidth: isSelected ? '2px' : '1px',
                  background: isSelected ? '#eff6ff' : '#ffffff'
                }}
                onClick={() => onSelectBoard(board.value)}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge-tag badge-purple">{board.badge}</span>
                  {isSelected && <CheckCircle2 size={18} style={{ color: '#2563eb' }} />}
                </div>
                <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{board.label}</h6>
                <p className="mb-0" style={{ fontSize: '0.825rem', lineHeight: '1.5', color: '#475569' }}>
                  {board.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
