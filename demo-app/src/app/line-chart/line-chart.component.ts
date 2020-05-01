import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Chart } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  @Input() public dimensions: { height: number; width: number };
  chart: Chart;
  @Input() set chartPoints(series: SeriesOptionsType[]) {
    console.log(series);
    this.chart = new Chart({
      chart: {
        type: 'line',
      },
      xAxis: {
        type: 'datetime',
        endOnTick: true,
        tickInterval: 1000 * 60 * 60 * 24,
        gridLineWidth: 1,
      },
      title: {
        text: 'Linechart',
      },
      credits: {
        enabled: false,
      },
      series,
    });
    console.log(this.dimensions);
  }
}
