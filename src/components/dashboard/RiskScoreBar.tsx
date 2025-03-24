
import React from 'react';

interface RiskScoreBarProps {
  score: number;
}

const RiskScoreBar: React.FC<RiskScoreBarProps> = ({ score }) => {
  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            score >= 70 ? 'bg-red-600' : 
            score >= 40 ? 'bg-amber-500' : 'bg-green-500'
          }`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <span className="text-xs text-muted-foreground">{score}/100</span>
    </div>
  );
};

export default RiskScoreBar;
