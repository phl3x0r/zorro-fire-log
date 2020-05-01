import * as firebase from 'firebase/app';

export interface TradeLogEntry {
  name: string;
  type: string;
  asset: string;
  id: number;
  lots: number;
  open: firebase.firestore.Timestamp;
  close: firebase.firestore.Timestamp;
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
    symbols?: SymbolFilter;
  };
}

export interface AliasFilter {
  [key: string]: {
    enabled: boolean;
    algos?: AlgoFilter;
  };
}

export interface LogFilter {
  aliases: AliasFilter;
}
