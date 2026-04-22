import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function TimeAgo({ date }) {
  const getTimeAgo = () => {
    if (!date) return 'Just now';
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const [timeAgo, setTimeAgo] = useState(getTimeAgo());

  useEffect(() => {
    const interval = setInterval(() => setTimeAgo(getTimeAgo()), 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span className="time-ago">Updated {timeAgo}</span>;
}
