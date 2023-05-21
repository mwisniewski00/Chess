import { useState, useEffect, useRef } from "react";
import { ITimer } from "types";
import useSocketClient from "hooks/useSocketClient";
import { useGameContext } from "../../GameProvider";
import "./Timer.scss";

interface TimerProps {
  timer: ITimer;
}

function Timer({ timer }: TimerProps) {
  const calculateTimeRemaining = (timer: ITimer) => {
    const remainingTime = timer.running
      ? timer.timeLeft - (Date.now() - timer.running)
      : timer.timeLeft;
    return remainingTime < 0 ? 0 : remainingTime;
  };

  const [timeRemaining, setTimeRemaining] = useState(0);

  const { socket } = useSocketClient();
  const { isFinished } = useGameContext();

  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (isFinished) {
      intervalRef.current && clearInterval(intervalRef.current);
    }

    if (timeRemaining <= 0) {
      if (!isFinished) {
        socket?.emit("timer_end");
      }
      return;
    }
  }, [socket, timeRemaining, isFinished]);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(timer));
    if (!timer.running) return;

    const createInterval = () =>
      setInterval(
        () => setTimeRemaining(time => (time - 1000 < 0 ? 0 : time - 1000)),
        1000,
      );

    intervalRef.current = createInterval();
    let timestampBeforeTabHidden: number | null = null;

    const listener = () => {
      if (document.hidden) {
        timestampBeforeTabHidden = Date.now();
        intervalRef.current && clearInterval(intervalRef.current);
      } else if (timestampBeforeTabHidden) {
        const passedTime = Date.now() - timestampBeforeTabHidden;
        setTimeRemaining(prev => (prev > 0 ? prev - passedTime : 0));
        timestampBeforeTabHidden = null;
        intervalRef.current = createInterval();
      }
    };

    document.addEventListener("visibilitychange", listener);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", listener);
    };
  }, [timer]);

  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <div className="timer">{`${minutes}:${
      Number(seconds) < 10 ? "0" : ""
    }${seconds}`}</div>
  );
}

export default Timer;
