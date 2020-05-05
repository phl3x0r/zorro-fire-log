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
  @Input() openTrades: TradeLogEntry[];

  constructor() {}

  ngOnInit(): void {}
}
