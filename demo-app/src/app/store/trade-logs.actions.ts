import { createAction, props } from '@ngrx/store';
import { TradeLogEntry, LogFilter } from '@zfl/models';

export const addTradeLogs = createAction(
  '[TradeLogs] Add trade log entries',
  props<{ tradeLogs: TradeLogEntry[] }>()
);

export const updateFilter = createAction(
  '[TradeLogs] Update filter',
  props<{ filter: LogFilter }>()
);
