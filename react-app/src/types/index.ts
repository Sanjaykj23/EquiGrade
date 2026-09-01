export type BoardType = 'CBSE' | 'STATE_BOARD' | 'ICSE';

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

export interface CollegeMatch {
  id: string;
  name: string;
  campus: string;
  branch: string;
  minCutoff: number;
  category: 'Tier 1 Govt' | 'Tier 1 Aided' | 'Top Self-Financing';
  matchPercentage: number;
  location: string;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}
