import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export interface TradeLogEntry {
  Name: string;
  Type: string;
  Asset: string;
  ID: number;
  Lots: number;
  Open: Timestamp;
  Close: Timestamp;
  Entry: number;
  Exit: number;
  Profit: number;
  Roll: number;
  ExitType: string;
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
