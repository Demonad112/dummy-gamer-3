// Serializable command log entries. The view only ever produces these.
export type Command =
  | { t: 'move'; dx: -1 | 0 | 1; dy: -1 | 0 | 1 }
  | { t: 'wait' };

export type CommandLog = Command[];
