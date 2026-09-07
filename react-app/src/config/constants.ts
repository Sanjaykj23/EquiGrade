import { BoardType, CollegePrediction, SubjectKey } from '../types';

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
  }
];

export const SUBJECTS: { key: SubjectKey; name: string; iconName: string; color: string; maxMarks: number }[] = [
  { key: 'maths', name: 'Mathematics', iconName: 'Calculator', color: '#3b82f6', maxMarks: 100 },
  { key: 'physics', name: 'Physics', iconName: 'Zap', color: '#8b5cf6', maxMarks: 100 },
  { key: 'chemistry', name: 'Chemistry', iconName: 'FlaskConical', color: '#ec4899', maxMarks: 100 }
];

export const TNEA_COLLEGE_DATABASE: CollegePrediction[] = [
  {
    id: 'ceg-guindy',
    collegeName: 'College of Engineering Guindy (CEG)',
    code: 'TNEA Code: 0001',
    campus: 'Anna University Campus',
    location: 'Guindy, Chennai',
    category: 'Tier 1 Govt',
    overallMatchPercentage: 0,
    eligibleCourses: [
      { code: 'CSE', name: 'B.E. Computer Science & Engineering', cutoffRequired: 198.5, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'ECE', name: 'B.E. Electronics & Communication Engineering', cutoffRequired: 196.5, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'AI-DS', name: 'B.E. Artificial Intelligence & Data Science', cutoffRequired: 195.5, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'IT', name: 'B.Tech Information Technology', cutoffRequired: 196.0, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'EEE', name: 'B.E. Electrical & Electronics Engineering', cutoffRequired: 194.5, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'MECH', name: 'B.E. Mechanical Engineering', cutoffRequired: 191.0, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'BME', name: 'B.Tech Bio-Medical Engineering', cutoffRequired: 189.0, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'CIVIL', name: 'B.E. Civil Engineering', cutoffRequired: 186.0, isEligible: false, confidence: 'High Probability', category: 'Government' }
    ]
  },
  {
    id: 'mit-chromepet',
    collegeName: 'Madras Institute of Technology (MIT)',
    code: 'TNEA Code: 0004',
    campus: 'Anna University Campus',
    location: 'Chromepet, Chennai',
    category: 'Tier 1 Govt',
    overallMatchPercentage: 0,
    eligibleCourses: [
      { code: 'AERO', name: 'B.E. Aeronautical Engineering', cutoffRequired: 194.0, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'CSE', name: 'B.E. Computer Science & Engineering', cutoffRequired: 197.0, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'ROBOTICS', name: 'B.E. Robotics & Automation', cutoffRequired: 193.0, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'EIE', name: 'B.E. Electronics & Instrumentation Engineering', cutoffRequired: 191.5, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'AUTO', name: 'B.E. Automobile Engineering', cutoffRequired: 188.5, isEligible: false, confidence: 'High Probability', category: 'Government' },
      { code: 'RPT', name: 'B.Tech Rubber & Plastics Technology', cutoffRequired: 184.0, isEligible: false, confidence: 'High Probability', category: 'Government' }
    ]
  },
  {
    id: 'psg-tech',
    collegeName: 'PSG College of Technology',
    code: 'TNEA Code: 2006',
    campus: 'Peelamedu Campus',
    location: 'Coimbatore',
    category: 'Tier 1 Aided',
    overallMatchPercentage: 0,
    eligibleCourses: [
      { code: 'CSE', name: 'B.E. Computer Science & Engineering', cutoffRequired: 196.0, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'CYBER', name: 'B.E. Cyber Security & Forensics', cutoffRequired: 194.5, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'MCT', name: 'B.E. Mechatronics Engineering', cutoffRequired: 192.0, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'MECH', name: 'B.E. Mechanical Engineering', cutoffRequired: 190.0, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'FT', name: 'B.Tech Fashion Technology', cutoffRequired: 182.0, isEligible: false, confidence: 'High Probability', category: 'Aided' }
    ]
  },
  {
    id: 'ssn-chennai',
    collegeName: 'SSN College of Engineering',
    code: 'TNEA Code: 1315',
    campus: 'Kalavakkam Campus',
    location: 'OMR, Chennai',
    category: 'Top Self-Financing',
    overallMatchPercentage: 0,
    eligibleCourses: [
      { code: 'CSE', name: 'B.E. Computer Science & Engineering', cutoffRequired: 194.5, isEligible: false, confidence: 'High Probability', category: 'Autonomous' },
      { code: 'IT', name: 'B.Tech Information Technology', cutoffRequired: 192.5, isEligible: false, confidence: 'High Probability', category: 'Autonomous' },
      { code: 'EEE', name: 'B.E. Electrical & Electronics Engineering', cutoffRequired: 189.0, isEligible: false, confidence: 'High Probability', category: 'Autonomous' },
      { code: 'CHEM', name: 'B.Tech Chemical Engineering', cutoffRequired: 185.0, isEligible: false, confidence: 'High Probability', category: 'Autonomous' }
    ]
  },
  {
    id: 'cit-coimbatore',
    collegeName: 'Coimbatore Institute of Technology (CIT)',
    code: 'TNEA Code: 2005',
    campus: 'Civil Aerodrome Post',
    location: 'Coimbatore',
    category: 'Tier 1 Aided',
    overallMatchPercentage: 0,
    eligibleCourses: [
      { code: 'CSE', name: 'B.E. Computer Science & Engineering', cutoffRequired: 193.0, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'MECH', name: 'B.E. Mechanical Engineering', cutoffRequired: 187.5, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'CHEM', name: 'B.Tech Chemical Engineering', cutoffRequired: 184.5, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'CIVIL', name: 'B.E. Civil Engineering', cutoffRequired: 183.0, isEligible: false, confidence: 'High Probability', category: 'Aided' }
    ]
  },
  {
    id: 'tce-madurai',
    collegeName: 'Thiagarajar College of Engineering (TCE)',
    code: 'TNEA Code: 5008',
    campus: 'Tirupparankundram Campus',
    location: 'Madurai',
    category: 'Tier 1 Aided',
    overallMatchPercentage: 0,
    eligibleCourses: [
      { code: 'CSE', name: 'B.E. Computer Science & Engineering', cutoffRequired: 194.0, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'ECE', name: 'B.E. Electronics & Communication Engineering', cutoffRequired: 191.0, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'IT', name: 'B.Tech Information Technology', cutoffRequired: 190.5, isEligible: false, confidence: 'High Probability', category: 'Aided' },
      { code: 'MECH', name: 'B.E. Mechanical Engineering', cutoffRequired: 186.0, isEligible: false, confidence: 'High Probability', category: 'Aided' }
    ]
  }
];

export const INITIAL_PROCESSING_STEPS = [
  { id: '1', label: 'Extracting PDF Text & Diagrams via PaddleOCR', status: 'pending' as const },
  { id: '2', label: 'Tokenizing & Vectorizing Question Text (MiniLM-L6)', status: 'pending' as const },
  { id: '3', label: 'Clustering Questions by Bloom’s Taxonomy (Easy / Medium / Hard)', status: 'pending' as const },
  { id: '4', label: 'Predicting Paper Mean Score via Scikit-Learn Model', status: 'pending' as const },
  { id: '5', label: 'Applying Percentile Equating & Normalized Competency Scaling', status: 'pending' as const }
];
