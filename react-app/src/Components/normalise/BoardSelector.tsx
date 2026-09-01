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
      <label className="form-label text-white fw-bold fs-6 mb-3 d-block">
        Step 1: Select Secondary Education Board
      </label>
      
      <div className="row g-3">
        {BOARDS.map((board) => {
          const isSelected = selectedBoard === board.value;
          return (
            <div key={board.value} className="col-md-4">
              <div
                className={`glass-panel p-3 h-100 cursor-pointer border ${
                  isSelected ? 'border-purple border-2 bg-purple-subtle' : ''
                }`}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? '#8b5cf6' : undefined,
                  background: isSelected ? 'rgba(139, 92, 246, 0.25)' : undefined
                }}
                onClick={() => onSelectBoard(board.value)}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge-tag badge-purple">{board.badge}</span>
                  {isSelected && <CheckCircle2 size={18} className="text-purple" style={{ color: '#c084fc' }} />}
                </div>
                <h6 className="fw-bold text-white mb-1">{board.label}</h6>
                <p className="mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4', color: '#cbd5e1' }}>
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
