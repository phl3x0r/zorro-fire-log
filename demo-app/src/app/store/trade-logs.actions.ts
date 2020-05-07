import { createAction, props } from '@ngrx/store';
import {
  TradeLogEntry,
  LogFilter,
  GroupSettings,
  DateFilter,
} from '@zfl/models';

export const addTradeLogs = createAction(
  '[TradeLogs] Add trade log entries',
  props<{ tradeLogs: TradeLogEntry[] }>()
);

export const updateFilter = createAction(
  '[Filters] Update filter',
  props<{ filter: LogFilter }>()
);

export const updateDateFilter = createAction(
  '[Filters] Update date filter',
  props<{ dateFilter: DateFilter }>()
);

export const updateGroupSettings = createAction(
  '[Filters] Update group settings',
  props<{ groupSettings: GroupSettings }>()
);

export const updatePortfolioSize = createAction(
  '[TradeLogs] Update Portfolio Size',
  props<{ portfolioSize: number }>()
);

export const addPositions = createAction(
  '[Positions] Add positions',
  props<{ alias: string; positions: TradeLogEntry[] }>()
);

export const clearPositions = createAction('[Positions] Clear positions');
