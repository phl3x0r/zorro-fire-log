import {
  createReducer,
  on,
  Action,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TradeLogEntry, LogFilter } from '@zfl/models';
import { addTradeLogs, updateFilter } from './trade-logs.actions';
import { SeriesOptionsType } from 'highcharts';

export interface TradeLogState extends EntityState<TradeLogEntry> {
  filter: LogFilter | null;
}
export const adapter: EntityAdapter<TradeLogEntry> = createEntityAdapter<
  TradeLogEntry
>();
export const initialState: TradeLogState = adapter.getInitialState({
  filter: { aliases: {} },
});
export const featureSelectorKey = 'tradeLogs';

export const tradeLogsReducer = createReducer(
  initialState,
  on(addTradeLogs, (state, { tradeLogs }) =>
    adapter.upsertMany(tradeLogs, {
      ...state,
    })
  ),
  on(updateFilter, (state, { filter }) => ({
    ...state,
    filter,
  }))
);

export function reducer(state: TradeLogState, action: Action) {
  return tradeLogsReducer(state, action);
}

// ** Selectors ** //
export const selectTradeLogState = createFeatureSelector<TradeLogState>(
  featureSelectorKey
);
export const {
  selectIds: selectTradeLogIds,
  selectEntities: selectTradeLogEntities,
  selectAll: selectAllTradeLogs,
  selectTotal: selectTradeLogsTotal,
} = adapter.getSelectors(selectTradeLogState);

export const selectFilter = createSelector(
  selectTradeLogState,
  (state: TradeLogState) => state.filter
);

export const selectTradeLogsSorted = createSelector(
  selectAllTradeLogs,
  (tradeLogs) => tradeLogs.sort((a, b) => a.close.seconds - b.close.seconds)
);

export const selectTradeLogsByFilter = createSelector(
  selectTradeLogsSorted,
  selectFilter,
  (tradeLogs, logFilter) =>
    tradeLogs.reduce((acc, cur) => {
      if (
        logFilter?.aliases[cur.alias]?.enabled &&
        logFilter?.aliases[cur.alias]?.algos[cur.name]?.enabled &&
        logFilter?.aliases[cur.alias]?.algos[cur.name]?.symbols[cur.asset]
          ?.enabled
      ) {
        acc.push(cur);
      }
      return acc;
    }, <TradeLogEntry[]>[])
);

export const selectTradeLogsAsChartPoints = createSelector(
  selectTradeLogsByFilter,
  (tradeLogs) => {
    const reduced = tradeLogs.reduce((acc, cur) => {
      if (!acc['Total']) {
        acc['Total'] = [];
      }
      if (!acc[cur.name]) {
        acc[cur.name] = [];
      }
      acc[cur.name].push({
        x: cur.close.seconds * 1000,
        y: cur.profit + (acc[cur.name][acc[cur.name].length - 1]?.y || 0),
      });
      acc['Total'].push({
        x: cur.close.seconds * 1000,
        y: cur.profit + (acc['Total'][acc['Total'].length - 1]?.y || 0),
      });
      return acc;
    }, <SeriesOptionsType[]>{});
    return [
      ...Object.keys(reduced).map((key) => ({
        name: key,
        data: reduced[key],
        type: 'line',
      })),
    ];
  }
);
