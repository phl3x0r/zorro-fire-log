import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TradeLogState,
  selectFilter,
  selectTradeLogsAsChartPoints,
  selectGroupSettings,
} from './trade-logs.reducer';
import { LogFilter, GroupSettings } from '@zfl/models';
import { updateFilter, updateGroupSettings } from './trade-logs.actions';

@Injectable({ providedIn: 'root' })
export class TradeLogsFacade {
  public logFilter$ = this.store.select(selectFilter);
  public chartPoints$ = this.store.select(selectTradeLogsAsChartPoints);
  public groupSettings$ = this.store.select(selectGroupSettings);
  constructor(private store: Store<TradeLogState>) {}

  applyLogFilter(filter: LogFilter) {
    this.store.dispatch(updateFilter({ filter }));
  }

  updateGroupSettings(groupSettings: GroupSettings) {
    this.store.dispatch(updateGroupSettings({ groupSettings }));
  }
}
