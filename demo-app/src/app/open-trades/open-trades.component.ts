import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TradeLogEntry } from '@zfl/models';

@Component({
  selector: 'app-open-trades',
  templateUrl: './open-trades.component.html',
  styleUrls: ['./open-trades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenTradesComponent implements OnInit {
  private _trades: TradeLogEntry[];
  total: number;

  @Input() set openTrades(trades: TradeLogEntry[]) {
    this._trades = trades;
    this.total = trades.reduce((acc, cur) => (acc += cur.profit), 0);
  }
  get openTrades() {
    return this._trades;
  }

  @Input() loaded: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  trackByFn(_index, tle: TradeLogEntry) {
    return tle.id;
  }
}
