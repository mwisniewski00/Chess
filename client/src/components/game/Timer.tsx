import { useState, useEffect, useMemo } from "react";
import { ITimer } from "types";
import useSocketClient from "hooks/useSocketClient";
import { useGameContext } from "./GameProvider";

interface TimerProps {
  timer: ITimer;
}

function Timer({ timer }: TimerProps) {
  const calculatedTimerRemaining = useMemo(
    () =>
      timer.running
        ? timer.timeLeft - (Date.now() - timer.running)
        : timer.timeLeft,
    [timer.running, timer.timeLeft],
  );
  const [timeRemaining, setTimeRemaining] = useState(
    calculatedTimerRemaining < 0 ? 0 : calculatedTimerRemaining,
  );
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
    if (!timer.running) return;

    const createInterval = () =>
      setInterval(
        () => setTimeRemaining(time => (time - 1000 < 0 ? 0 : time - 1000)),
        1000,
      );

    let intervalId = createInterval();
    let timestampBeforeTabHidden: number | null = null;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        timestampBeforeTabHidden = Date.now();
        clearInterval(intervalId);
      } else if (timestampBeforeTabHidden) {
        const passedTime = Date.now() - timestampBeforeTabHidden;
        setTimeRemaining(prev => (prev > 0 ? prev - passedTime : 0));
        timestampBeforeTabHidden = null;
        intervalId = createInterval();
      }
    });

    return () => {
      clearInterval(intervalId);
    };
  }, [timer.running]);

  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <div>
      <h1>{`${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`}</h1>
    </div>
  );
}

export default Timer;
