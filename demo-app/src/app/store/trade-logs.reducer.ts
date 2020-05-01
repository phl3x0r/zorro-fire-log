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
import { ChartDataSets } from 'chart.js';
import * as firebase from 'firebase/app';

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
      if (!acc['total']) {
        acc['total'] = [];
      }
      if (!acc[cur.name]) {
        acc[cur.name] = [];
      }
      acc[cur.name].push({
        x: new firebase.firestore.Timestamp(
          cur.close.seconds,
          cur.close.nanoseconds
        )
          .toDate()
          .toLocaleString(),
        y: cur.profit + (acc[cur.name][acc[cur.name].length - 1]?.y || 0),
      });
      acc['total'].push({
        x: new firebase.firestore.Timestamp(
          cur.close.seconds,
          cur.close.nanoseconds
        )
          .toDate()
          .toLocaleString(),
        y: cur.profit + (acc['total'][acc['total'].length - 1]?.y || 0),
      });
      return acc;
    }, <ChartDataSets[]>{});
    return [
      ...Object.keys(reduced).map((key) => ({
        fill: false,
        label: key,
        data: reduced[key],
      })),
    ];
  }
);
