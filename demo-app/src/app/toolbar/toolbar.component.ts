import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GroupSettings } from '@zfl/models';
import { TradeLogsFacade } from '../store/trade-logs.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  constructor(private tradeLogsFacade: TradeLogsFacade) {}
  groupSettings$: Observable<GroupSettings> = this.tradeLogsFacade
    .groupSettings$;
  portfolioSize$: Observable<number> = this.tradeLogsFacade.porfolioSize$;
  ngOnInit(): void {}

  updateGroupSettings(groupSettings: GroupSettings) {
    this.tradeLogsFacade.updateGroupSettings(groupSettings);
  }

  updatePortfolioSize(portfolioSize: number) {
    this.tradeLogsFacade.updatePortfolioSize(portfolioSize);
  }
}
