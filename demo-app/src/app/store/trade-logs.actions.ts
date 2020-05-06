import { createAction, props } from '@ngrx/store';
import { TradeLogEntry, LogFilter, GroupSettings } from '@zfl/models';

export const addTradeLogs = createAction(
  '[TradeLogs] Add trade log entries',
  props<{ tradeLogs: TradeLogEntry[] }>()
);

export const updateFilter = createAction(
  '[TradeLogs] Update filter',
  props<{ filter: LogFilter }>()
);

export const updateGroupSettings = createAction(
  '[TradeLogs] Update group settings',
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
