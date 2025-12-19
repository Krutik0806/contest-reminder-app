import React from 'react';
import { useCountdown, formatCountdown } from '../hooks/useCountdown';

const CountdownTimer = ({ startTime }) => {
  const timeLeft = useCountdown(startTime);
  
  return (
    <div className="mt-2">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
        timeLeft.ended 
          ? 'bg-gray-100 text-gray-600' 
          : 'bg-green-50 text-green-700 border border-green-200'
      }`}>
        {formatCountdown(timeLeft)}
      </div>
    </div>
  );
};

export default CountdownTimer;
