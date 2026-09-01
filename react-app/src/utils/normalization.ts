import { CollegeMatch, NormalizationResults, QPDIBreakdown, SubjectKey, TNEACutoffSummary } from '../types';
import { SAMPLE_COLLEGES } from '../config/constants';

/**
 * Calculates TNEA Cutoff (Out of 200)
 * Formula: Maths + (Physics / 2) + (Chemistry / 2)
 */
export const calculateTNEA = (maths: number, physics: number, chemistry: number): number => {
  const m = Math.max(0, Math.min(100, maths));
  const p = Math.max(0, Math.min(100, physics));
  const c = Math.max(0, Math.min(100, chemistry));
  return Number((m + (p / 2) + (c / 2)).toFixed(2));
};

/**
 * Computes cut-off summary comparing raw cut-off against normalized cut-off
 */
export const computeCutoffSummary = (
  results: NormalizationResults
): TNEACutoffSummary => {
  const rawMaths = results.maths?.raw ?? 0;
  const rawPhysics = results.physics?.raw ?? 0;
  const rawChem = results.chemistry?.raw ?? 0;

  const normMaths = results.maths?.normalized ?? rawMaths;
  const normPhysics = results.physics?.normalized ?? rawPhysics;
  const normChem = results.chemistry?.normalized ?? rawChem;

  const rawCutoff = calculateTNEA(rawMaths, rawPhysics, rawChem);
  const normalizedCutoff = calculateTNEA(normMaths, normPhysics, normChem);
  const cutoffDelta = Number((normalizedCutoff - rawCutoff).toFixed(2));

  return {
    rawCutoff,
    normalizedCutoff,
    cutoffDelta
  };
};

/**
 * Maps difficulty index (0 to 1) to human readable label
 */
export const getComplexityLabel = (index: number): 'Easy' | 'Moderate' | 'Challenging' | 'Very High' => {
  if (index < 0.45) return 'Easy';
  if (index < 0.65) return 'Moderate';
  if (index < 0.82) return 'Challenging';
  return 'Very High';
};

/**
 * Generates QPDI visual breakdown per subject
 */
export const generateQPDIBreakdown = (subject: SubjectKey, easy = 8, medium = 12, hard = 5): QPDIBreakdown => {
  const total = easy + medium + hard;
  const diffIndex = Number(((easy * 0.3 + medium * 0.6 + hard * 1.0) / total).toFixed(2));
  return {
    subject,
    easy,
    medium,
    hard,
    totalQuestions: total,
    difficultyIndex: diffIndex,
    complexityLabel: getComplexityLabel(diffIndex)
  };
};

/**
 * Filters and ranks college eligibility based on normalized cutoff
 */
export const getCollegeMatches = (cutoff: number): CollegeMatch[] => {
  return SAMPLE_COLLEGES.map(college => {
    const diff = cutoff - college.minCutoff;
    let matchPercentage = 0;

    if (diff >= 5) {
      matchPercentage = 99;
    } else if (diff >= 0) {
      matchPercentage = Math.min(98, 85 + Math.round(diff * 2.5));
    } else if (diff >= -3) {
      matchPercentage = Math.max(40, 75 + Math.round(diff * 10));
    } else {
      matchPercentage = Math.max(10, 35 + Math.round(diff * 5));
    }

    return {
      ...college,
      matchPercentage
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};
