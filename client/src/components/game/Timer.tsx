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
    if (!timer.running) return;
    if (timeRemaining <= 0) {
      if (!isFinished) {
        socket?.emit("timer_end");
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeRemaining(time => (time - 1000 < 0 ? 0 : time - 1000));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [socket, timeRemaining, timer.running, isFinished]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);

  return (
    <div>
      <h1>{`${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`}</h1>
    </div>
  );
}

export default Timer;
