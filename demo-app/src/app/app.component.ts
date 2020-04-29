import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TradeLogEntry, TradeLog, Filter } from '@zfl/models';
import { Observable } from 'rxjs';
import { ResizedEvent } from 'angular-resize-event';
import { TradeLogService } from './services/trade-log-service';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public chartPoints$: Observable<ChartDataSets[]> = this.tradeLogService
    .chartPoints$;
  public algosAndSymbols$ = this.tradeLogService.algosAndSymbols$;
  public dimensions: { height: number; width: number };

  constructor(private tradeLogService: TradeLogService) {}

  ngOnInit(): void {}

  title = 'demo-app';

  onResized(event: ResizedEvent) {
    this.dimensions = {
      height: event.newHeight - 32,
      width: event.newWidth - 32,
    };
  }

  applyFilter($event: Filter) {
    this.tradeLogService.setFilter($event);
  }
}
