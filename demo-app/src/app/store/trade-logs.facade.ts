import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TradeLogState,
  selectFilter,
  selectTradeLogsAsChartPoints,
  selectGroupSettings,
  selectTradeLogStatistics,
  selectPortfolioSize,
} from './trade-logs.reducer';
import { LogFilter, GroupSettings } from '@zfl/models';
import {
  updateFilter,
  updateGroupSettings,
  updatePortfolioSize,
} from './trade-logs.actions';

@Injectable({ providedIn: 'root' })
export class TradeLogsFacade {
  public logFilter$ = this.store.select(selectFilter);
  public chartPoints$ = this.store.select(selectTradeLogsAsChartPoints);
  public groupSettings$ = this.store.select(selectGroupSettings);
  public statistics$ = this.store.select(selectTradeLogStatistics);
  public porfolioSize$ = this.store.select(selectPortfolioSize);

  constructor(private store: Store<TradeLogState>) {}

  applyLogFilter(filter: LogFilter) {
    this.store.dispatch(updateFilter({ filter }));
  }

  updateGroupSettings(groupSettings: GroupSettings) {
    this.store.dispatch(updateGroupSettings({ groupSettings }));
  }

  updatePortfolioSize(portfolioSize: number) {
    this.store.dispatch(updatePortfolioSize({ portfolioSize }));
  }
}
