import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NormalizationResults } from '../../types';

interface ScoreComparisonChartProps {
  results: NormalizationResults;
}

export const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ results }) => {
  const chartData = [
    {
      subject: 'Mathematics',
      Raw: results.maths?.raw ?? 0,
      PaperMean: results.maths?.paper_mean ?? 0,
      Normalized: results.maths?.normalized ?? 0
    },
    {
      subject: 'Physics',
      Raw: results.physics?.raw ?? 0,
      PaperMean: results.physics?.paper_mean ?? 0,
      Normalized: results.physics?.normalized ?? 0
    },
    {
      subject: 'Chemistry',
      Raw: results.chemistry?.raw ?? 0,
      PaperMean: results.chemistry?.paper_mean ?? 0,
      Normalized: results.chemistry?.normalized ?? 0
    }
  ];

  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold text-white mb-1">Score Transformation Analytics</h5>
          <p className="text-muted small mb-0">Comparison of Raw Score, AI Predicted Paper Mean, and Normalized Competency Score</p>
        </div>
        <span className="badge-tag badge-purple">Interactive Graph</span>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="subject" stroke="#94a3b8" />
            <YAxis domain={[0, 100]} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Raw" fill="#64748b" name="Raw Student Score" radius={[4, 4, 0, 0]} />
            <Bar dataKey="PaperMean" fill="#3b82f6" name="AI Paper Mean (Difficulty)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Normalized" fill="#8b5cf6" name="Normalized Competency Score (NCS)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
