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

export interface PositionLog {
  positions: TradeLogEntry[];
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

export type DataSet = Array<{
  o: number;
  t: number;
  x: number;
  y: number;
  z: number;
}>;

export interface DataCollection {
  [key: string]: DataSet;
}

export interface StatisticsModel {
  name: string;
  pnl: number; // profit and loss
  daysHeld: number;
  ar: number; // Annualized return
  cagr: number; // CAGR
  std: number; // standard deviation
  vol: number; // annualized volatility
  mr: number; // mean return
  sharpe: number; // sharpe
  exp: number; // exposure
}

export type Statistics = Array<StatisticsModel>;

export interface DateFilter {
  enabled: boolean;
  from: Date;
  to: Date;
}
