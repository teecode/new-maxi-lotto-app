import {type JSX, useEffect, useState} from "react";

interface CountDownProps {
  targetDate: string
}
export default function Countdown({ targetDate }: CountDownProps): JSX.Element {
  const calculateTimeLeft = () => {
    // @ts-ignore
    const difference: any = new Date(targetDate) - new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);
      if (!updatedTime) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="tabular-nums">Game Closed!</span>;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className="tabular-nums">
      {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
      {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
    </span>
  );
}
