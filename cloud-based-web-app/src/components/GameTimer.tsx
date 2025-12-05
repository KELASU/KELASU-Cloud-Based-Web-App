'use client';

import { useState, useEffect } from 'react';

type TimerProps = {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
};

export default function GameTimer({ initialTime, onTimeUp, isActive }: TimerProps) {
  const [seconds, setSeconds] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      onTimeUp();
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeUp]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="text-xl font-mono font-bold p-2 border border-red-500 rounded bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100">
      Time Remaining: {formatTime(seconds)}
    </div>
  );
}