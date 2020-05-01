import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  @Input() public dimensions: { height: number; width: number };
  @Input() set chartPoints(
    data: { label: string; data: Chart.ChartPoint[] }[]
  ) {
    this.lineChartData = data;
  }

  lineChartData: ChartDataSets[] = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            displayFormats: {
              millisecond: 'MMM DD',
              second: 'MMM DD',
              minute: 'MMM DD HH',
              hour: 'MMM DD',
              day: 'MMM DD',
              week: 'MMM DD',
              month: 'MMM DD',
              quarter: 'MMM DD',
              year: 'MMM DD',
            },
          },
        },
      ],
    },
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
}
