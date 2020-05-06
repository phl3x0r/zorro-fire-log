import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LogFilter } from '@zfl/models';
import { ResizedEvent } from 'angular-resize-event';
import { TradeLogsFacade } from './store/trade-logs.facade';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  dimensions: { height: number; width: number };
  logFilter$ = this.tradeLogsFacade.logFilter$;
  chartPoints$ = this.tradeLogsFacade.chartPoints$;
  statistics$ = this.tradeLogsFacade.statistics$;
  openPositions$ = this.tradeLogsFacade.openPositions$;
  positionsLoaded$ = this.tradeLogsFacade.positionsLoaded$;

  openPositionsEnabled =
    environment.positionLogs && environment.positionLogs.length > 0;

  constructor(private tradeLogsFacade: TradeLogsFacade) {}

  ngOnInit(): void {}

  title = 'demo-app';

  onResized(event: ResizedEvent) {
    this.dimensions = {
      height: event.newHeight - 32,
      width: event.newWidth - 32,
    };
  }
  applyLogFilter($event: LogFilter) {
    this.tradeLogsFacade.applyLogFilter($event);
  }
}
