import React from 'react';

const ScoreGauge = ({ score = 0, size = 120, label = 'Match Score' }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = '#10b981'; // green
  if (safeScore < 50) {
    strokeColor = '#f59e0b'; // amber
  } else if (safeScore < 75) {
    strokeColor = '#3b82f6'; // blue
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: size * 0.24, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {safeScore}%
          </span>
        </div>
      </div>
      {label && (
        <span style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreGauge;
