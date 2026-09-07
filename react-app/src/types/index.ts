export type BoardType = 'CBSE' | 'STATE_BOARD';

export type SubjectKey = 'physics' | 'chemistry' | 'maths';

export interface SubjectMarks {
  physics: number | string;
  chemistry: number | string;
  maths: number | string;
}

export interface SubjectFiles {
  physics: File | null;
  chemistry: File | null;
  maths: File | null;
}

export interface SubjectNormalizedResult {
  raw: number;
  paper_mean: number;
  normalized: number;
  easy?: number;
  medium?: number;
  hard?: number;
  difficulty_index?: number;
  error?: string;
}

export type NormalizationResults = Record<SubjectKey, SubjectNormalizedResult>;

export interface TNEACutoffSummary {
  rawCutoff: number;         // Maths + Physics/2 + Chemistry/2 (Out of 200)
  normalizedCutoff: number;  // Normalized Maths + Physics/2 + Chemistry/2
  cutoffDelta: number;       // Difference (Normalized - Raw)
}

export interface QPDIBreakdown {
  subject: SubjectKey;
  easy: number;
  medium: number;
  hard: number;
  totalQuestions: number;
  difficultyIndex: number; // 0 to 1 scale
  complexityLabel: 'Easy' | 'Moderate' | 'Challenging' | 'Very High';
}

export interface CourseEligibility {
  code: string;
  name: string;              // e.g. "B.E. Computer Science & Engineering"
  cutoffRequired: number;    // e.g. 197.5
  isEligible: boolean;       // true if student cutoff >= cutoffRequired - 2.5
  confidence: 'High Probability' | 'Moderate Chance' | 'Reach Option';
  category: 'Autonomous' | 'Aided' | 'Government' | 'Self-Financing';
}

export interface CollegePrediction {
  id: string;
  collegeName: string;
  code: string;              // e.g. "TNEA Code: 0001"
  campus: string;
  location: string;
  category: 'Tier 1 Govt' | 'Tier 1 Aided' | 'Top Self-Financing';
  overallMatchPercentage: number;
  eligibleCourses: CourseEligibility[];
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}
