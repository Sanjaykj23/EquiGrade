import { CollegePrediction, CourseEligibility, NormalizationResults, QPDIBreakdown, SubjectKey, TNEACutoffSummary } from '../types';
import { TNEA_COLLEGE_DATABASE } from '../config/constants';

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
 * Ensures the overall cutoff delta is strictly clamped within [-5.0, +5.0] points.
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
  const unconstrainedNormalized = calculateTNEA(normMaths, normPhysics, normChem);
  
  // Calculate raw delta and strictly clamp between [-5.0, +5.0]
  const rawDelta = unconstrainedNormalized - rawCutoff;
  const clampedDelta = Number((Math.max(-5.0, Math.min(5.0, rawDelta))).toFixed(2));
  
  const normalizedCutoff = Number((Math.min(200.0, Math.max(0.0, rawCutoff + clampedDelta))).toFixed(2));

  return {
    rawCutoff,
    normalizedCutoff,
    cutoffDelta: clampedDelta
  };
};

/**
 * Maps difficulty index (0 to 1) to human readable label
 */
export const getComplexityLabel = (index: number): 'Easy' | 'Moderate' | 'Challenging' | 'Very High' => {
  if (index < 0.45) return 'Easy';
  if (index < 0.62) return 'Moderate';
  if (index < 0.78) return 'Challenging';
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
 * Computes college-by-college prediction with full list of eligible engineering courses
 */
export const getDetailedCollegePredictions = (studentCutoff: number): CollegePrediction[] => {
  return TNEA_COLLEGE_DATABASE.map((college) => {
    let eligibleCount = 0;

    const evaluatedCourses: CourseEligibility[] = college.eligibleCourses.map((course) => {
      const diff = studentCutoff - course.cutoffRequired;
      const isEligible = diff >= -2.0; // Eligible if cutoff is within 2 points of required threshold

      if (isEligible) eligibleCount++;

      let confidence: 'High Probability' | 'Moderate Chance' | 'Reach Option' = 'Reach Option';
      if (diff >= 1.5) {
        confidence = 'High Probability';
      } else if (diff >= -0.5) {
        confidence = 'Moderate Chance';
      }

      return {
        ...course,
        isEligible,
        confidence
      };
    }).sort((a, b) => b.cutoffRequired - a.cutoffRequired);

    const overallMatchPercentage = Math.min(
      99,
      Math.max(15, Math.round((eligibleCount / college.eligibleCourses.length) * 100))
    );

    return {
      ...college,
      overallMatchPercentage,
      eligibleCourses: evaluatedCourses
    };
  }).sort((a, b) => b.overallMatchPercentage - a.overallMatchPercentage);
};
