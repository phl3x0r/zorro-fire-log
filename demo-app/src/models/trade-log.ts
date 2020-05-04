export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface TradeLogEntry {
  name: string;
  type: string;
  asset: string;
  id: string;
  lots: number;
  open: Timestamp;
  close: Timestamp;
  entry: number;
  exit: number;
  profit: number;
  roll: number;
  exitType: string;
  alias: string;
}

export type TradeLog = Array<TradeLogEntry>;

export interface SymbolFilter {
  [key: string]: {
    enabled: boolean;
  };
}

export interface AlgoFilter {
  [key: string]: {
    enabled: boolean;
    expanded: boolean;
    symbols?: SymbolFilter;
  };
}

export interface AliasFilter {
  [key: string]: {
    enabled: boolean;
    expanded: boolean;
    algos?: AlgoFilter;
  };
}

export interface LogFilter {
  aliases: AliasFilter;
}

export interface GroupSettings {
  alias: boolean;
  algo: boolean;
  symbol: boolean;
}
