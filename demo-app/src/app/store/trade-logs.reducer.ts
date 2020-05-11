import {
  createReducer,
  on,
  Action,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  TradeLogEntry,
  LogFilter,
  GroupSettings,
  StatisticsModel,
  DataCollection,
  DataSet,
  DateFilter,
} from '@zfl/models';
import {
  addTradeLogs,
  updateFilter,
  updateGroupSettings,
  updatePortfolioSize,
  addPositions,
  clearPositions,
} from './trade-logs.actions';
import * as math from 'mathjs';

export interface TradeLogState extends EntityState<TradeLogEntry> {
  filter: LogFilter | null;
  dateFilter: DateFilter;
  groupSettings: GroupSettings;
  portfolioSize: number;
  positions: TradeLogEntry[];
  positionsLoaded: boolean;
}
export const adapter: EntityAdapter<TradeLogEntry> = createEntityAdapter<
  TradeLogEntry
>();
export const initialState: TradeLogState = adapter.getInitialState({
  filter: { aliases: {} },
  dateFilter: { enabled: false, from: null, to: null },
  groupSettings: {
    alias: false,
    algo: true,
    symbol: false,
  },
  portfolioSize: 10000,
  positions: [],
  positionsLoaded: false,
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
  })),
  on(updateGroupSettings, (state, { groupSettings }) => ({
    ...state,
    groupSettings,
  })),
  on(updatePortfolioSize, (state, { portfolioSize }) => ({
    ...state,
    portfolioSize,
  })),
  on(addPositions, (state, { alias, positions }) => ({
    ...state,
    positions: [
      ...state.positions.filter((pos) => pos.alias !== alias),
      ...positions,
    ].sort((a, b) => a.name.localeCompare(b.name)),
    positionsLoaded: true,
  })),
  on(clearPositions, (state) => ({
    ...state,
    positions: [],
    positionsLoaded: false,
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

export const selectDateFilter = createSelector(
  selectTradeLogState,
  (state) => state.dateFilter
);

export const selectGroupSettings = createSelector(
  selectTradeLogState,
  (state) => state.groupSettings
);

export const selectPortfolioSize = createSelector(
  selectTradeLogState,
  (state) => state.portfolioSize
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

export const selectTradeLogsData = createSelector(
  selectTradeLogsByFilter,
  selectGroupSettings,
  (tradeLogs, groupSettings) => {
    const getGroupName = (tle: TradeLogEntry) =>
      [
        groupSettings.alias ? tle.alias : null,
        groupSettings.algo ? tle.name : null,
        groupSettings.symbol ? tle.asset : null,
      ]
        .filter((g) => !!g)
        .reduce(
          (acc, cur, index) => (acc += cur && (index ? '|' + cur : cur)),
          ''
        );
    const reduced = tradeLogs.reduce((acc, cur) => {
      const groupName = getGroupName(cur);
      if (!acc['Total']) {
        acc['Total'] = [];
      }
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({
        o: cur.open.seconds * 1000,
        t: (cur.close.seconds - cur.open.seconds) * 1000,
        x: cur.close.seconds * 1000,
        y:
          (Math.round(cur.profit * 100) +
            Math.round(
              acc[groupName][acc[groupName].length - 1]?.y * 100 || 0
            )) /
          100,
        z: cur.profit,
      });
      acc['Total'].push({
        o: cur.open.seconds * 1000,
        t: (cur.close.seconds - cur.open.seconds) * 1000,
        x: cur.close.seconds * 1000,
        y:
          (Math.round(cur.profit * 100) +
            Math.round(acc['Total'][acc['Total'].length - 1]?.y * 100 || 0)) /
          100,
        z: cur.profit,
      });
      return acc;
    }, <DataCollection>{});
    return reduced;
  }
);

export const selectTradeLogsAsChartPoints = createSelector(
  selectTradeLogsData,
  (reduced) => [
    ...Object.keys(reduced).map((key) => ({
      name: key,
      data: reduced[key],
      type: 'line',
    })),
  ]
);

// TODO: calculate some more statistics here
const getDaysHeld = (dataset: DataSet) =>
  (dataset[dataset.length - 1].x - dataset[0].o) / 1000 / 60 / 60 / 24;
const getExposure = (dataset: DataSet) =>
  dataset.reduce((acc, cur) => (acc += cur.t), 0) /
  (dataset[dataset.length - 1].x - dataset[0].o);

export const selectTradeLogStatistics = createSelector(
  selectTradeLogsData,
  selectPortfolioSize,
  (reduced, portfolioSize) =>
    [
      ...Object.keys(reduced).map((key) => {
        const dataset = reduced[key];
        const returns = dataset.map((point) => point.z);
        const std = math.std(returns);
        const pnl = dataset[dataset.length - 1]?.y || 0;
        const daysHeld = getDaysHeld(dataset);
        const ar = (1 + pnl) * (365 / daysHeld) - 1;
        const cagr = (ar + portfolioSize) / portfolioSize - 1;
        const vol = (std * Math.sqrt(252)) / portfolioSize;
        const mr = pnl / dataset.length;
        const sharpe = Math.sqrt(dataset.length) * (mr / std);
        const exp = getExposure(dataset);
        return <StatisticsModel>{
          name: key,
          pnl,
          daysHeld,
          ar,
          cagr,
          std,
          vol,
          mr,
          sharpe,
          exp,
        };
      }),
    ] as StatisticsModel[]
);

export const selectPositions = createSelector(
  selectTradeLogState,
  (state) => state.positions
);

export const selectPositionsLoaded = createSelector(
  selectTradeLogState,
  (state) => state.positionsLoaded
);

// cache stuff
export const selectLatestEntryTime = createSelector(
  selectTradeLogsSorted,
  (tradeLogs) =>
    tradeLogs && tradeLogs.length && tradeLogs[tradeLogs.length - 1].close
);
