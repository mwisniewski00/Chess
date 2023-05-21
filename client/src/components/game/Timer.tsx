import { useState, useEffect } from "react";
import { ITimer } from "types";
import useSocketClient from "hooks/useSocketClient";
import { useGameContext } from "./GameProvider";

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

  useEffect(() => {
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

    let intervalId = createInterval();
    let timestampBeforeTabHidden: number | null = null;

    const listener = () => {
      if (document.hidden) {
        timestampBeforeTabHidden = Date.now();
        clearInterval(intervalId);
      } else if (timestampBeforeTabHidden) {
        const passedTime = Date.now() - timestampBeforeTabHidden;
        setTimeRemaining(prev => (prev > 0 ? prev - passedTime : 0));
        timestampBeforeTabHidden = null;
        intervalId = createInterval();
      }
    };

    document.addEventListener("visibilitychange", listener);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", listener);
    };
  }, [timer]);

  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <div>
      <h1>{`${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`}</h1>
    </div>
  );
}

export default Timer;
