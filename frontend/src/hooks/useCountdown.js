import { useState, useEffect } from 'react';

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    
    if (difference <= 0) {
      return { 
        ended: true,
        days: 0, 
        hours: 0, 
        minutes: 0, 
        seconds: 0 
      };
    }

    return {
      ended: false,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export const formatCountdown = (timeLeft) => {
  if (timeLeft.ended) {
    return '🏁 Contest Started/Ended';
  }

  const parts = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
  if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);
  if (timeLeft.seconds > 0 && timeLeft.days === 0) parts.push(`${timeLeft.seconds}s`);

  return parts.length > 0 ? `⏱ Starts in ${parts.join(' ')}` : '⏱ Starting soon...';
};
