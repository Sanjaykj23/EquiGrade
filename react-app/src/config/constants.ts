import { BoardType, CollegeMatch, SubjectKey } from '../types';

export const BOARDS: { value: BoardType; label: string; description: string; badge: string }[] = [
  {
    value: 'CBSE',
    label: 'CBSE (Central Board)',
    description: 'Application-heavy paper structure with standard deviation ≈ 8',
    badge: 'National Standard'
  },
  {
    value: 'STATE_BOARD',
    label: 'Tamil Nadu State Board (TNSB)',
    description: 'Textbook-direct evaluation with standard deviation ≈ 12',
    badge: 'State Baseline'
  },
  {
    value: 'ICSE',
    label: 'CISCE / ICSE',
    description: 'Analytical depth focus with standard deviation ≈ 9',
    badge: 'Council Standard'
  }
];

export const SUBJECTS: { key: SubjectKey; name: string; iconName: string; color: string; maxMarks: number }[] = [
  { key: 'maths', name: 'Mathematics', iconName: 'Calculator', color: '#3b82f6', maxMarks: 100 },
  { key: 'physics', name: 'Physics', iconName: 'Zap', color: '#8b5cf6', maxMarks: 100 },
  { key: 'chemistry', name: 'Chemistry', iconName: 'FlaskConical', color: '#ec4899', maxMarks: 100 }
];

export const SAMPLE_COLLEGES: CollegeMatch[] = [
  {
    id: 'ceg-cse',
    name: 'College of Engineering Guindy (CEG)',
    campus: 'Anna University, Chennai',
    branch: 'Computer Science & Engineering',
    minCutoff: 198.5,
    category: 'Tier 1 Govt',
    matchPercentage: 0,
    location: 'Chennai'
  },
  {
    id: 'ceg-ece',
    name: 'College of Engineering Guindy (CEG)',
    campus: 'Anna University, Chennai',
    branch: 'Electronics & Communication',
    minCutoff: 196.5,
    category: 'Tier 1 Govt',
    matchPercentage: 0,
    location: 'Chennai'
  },
  {
    id: 'mit-aero',
    name: 'Madras Institute of Technology (MIT)',
    campus: 'Anna University, Chromepet',
    branch: 'Aeronautical Engineering',
    minCutoff: 194.0,
    category: 'Tier 1 Govt',
    matchPercentage: 0,
    location: 'Chennai'
  },
  {
    id: 'psg-cse',
    name: 'PSG College of Technology',
    campus: 'Coimbatore',
    branch: 'Computer Science & Engineering',
    minCutoff: 195.5,
    category: 'Tier 1 Aided',
    matchPercentage: 0,
    location: 'Coimbatore'
  },
  {
    id: 'ssn-it',
    name: 'SSN College of Engineering',
    campus: 'Kalavakkam, Chennai',
    branch: 'Information Technology',
    minCutoff: 192.5,
    category: 'Top Self-Financing',
    matchPercentage: 0,
    location: 'Chennai'
  },
  {
    id: 'cit-mech',
    name: 'Coimbatore Institute of Technology (CIT)',
    campus: 'Coimbatore',
    branch: 'Mechanical Engineering',
    minCutoff: 188.0,
    category: 'Tier 1 Aided',
    matchPercentage: 0,
    location: 'Coimbatore'
  }
];

export const INITIAL_PROCESSING_STEPS = [
  { id: '1', label: 'Extracting PDF Text & Diagrams via PaddleOCR', status: 'pending' as const },
  { id: '2', label: 'Tokenizing & Vectorizing Question Text (MiniLM-L6)', status: 'pending' as const },
  { id: '3', label: 'Clustering Questions by Bloom’s Taxonomy (Easy / Medium / Hard)', status: 'pending' as const },
  { id: '4', label: 'Predicting Paper Mean Score via Scikit-Learn Model', status: 'pending' as const },
  { id: '5', label: 'Applying Percentile Equating & Normalized Competency Scaling', status: 'pending' as const }
];
