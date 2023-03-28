export interface ITimer {
  timeLeft: number;
  running?: number;
}

export interface ITimers {
  white: ITimer;
  black: ITimer;
}

export enum GameType {
  CLASSIC = "classic",
  WITH_TIMER = "with_timer",
}
