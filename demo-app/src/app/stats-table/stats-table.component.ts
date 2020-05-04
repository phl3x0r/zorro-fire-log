import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Statistics, StatisticsModel } from '@zfl/models';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsTableComponent implements OnInit {
  @Input() set data(data: Statistics) {
    this.dataSource.data = data;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [
    'name',
    'pnl',
    'daysHeld',
    'ar',
    'cagr',
    'std',
    'vol',
    'mr',
    'sharpe',
  ];
  dataSource = new MatTableDataSource<StatisticsModel>([]);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {}
}
