import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export interface TradeLogEntry {
  name: string;
  type: string;
  asset: string;
  id: number;
  lots: number;
  open: Timestamp;
  close: Timestamp;
  entry: number;
  exit: number;
  profit: number;
  roll: number;
  exitType: string;
}

export type TradeLog = Array<TradeLogEntry>;

export interface AlgosAndSymbols {
  algos: string[];
  symbols: string[];
}

export interface Filter {
  algos: { [key: string]: boolean };
  symbols: { [key: string]: boolean };
}
