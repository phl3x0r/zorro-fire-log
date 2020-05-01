import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TradeLogState,
  selectFilter,
  selectTradeLogsAsChartPoints,
} from './trade-logs.reducer';
import { LogFilter } from '@zfl/models';
import { updateFilter } from './trade-logs.actions';

@Injectable({ providedIn: 'root' })
export class TradeLogsFacade {
  public logFilter$ = this.store.select(selectFilter);
  public chartPoints$ = this.store.select(selectTradeLogsAsChartPoints);
  constructor(private store: Store<TradeLogState>) {}

  applyLogFilter(filter: LogFilter) {
    this.store.dispatch(updateFilter({ filter }));
  }
}
