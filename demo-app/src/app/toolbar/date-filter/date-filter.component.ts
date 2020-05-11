import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { combineLatest, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { DateFilter } from '@zfl/models';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fold', [
      transition(':enter', [
        style({ height: 0, overflow: 'hidden' }),
        animate('.3s ease', style({ height: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        animate('.3s ease', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class DateFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() dateFilter: DateFilter;
  @Output() dateFilterChange = new EventEmitter<DateFilter>();

  toggleControl: FormControl;
  fromDateControl: FormControl;
  toDateControl: FormControl;

  constructor() {}

  ngOnInit(): void {
    this.toggleControl = new FormControl(this.dateFilter.enabled);
    this.fromDateControl = new FormControl(this.dateFilter.from);
    this.toDateControl = new FormControl(this.dateFilter.to);

    combineLatest(
      this.toggleControl.valueChanges.pipe(startWith(this.toggleControl.value)),
      this.fromDateControl.valueChanges.pipe(
        startWith(this.fromDateControl.value)
      ),
      this.toDateControl.valueChanges.pipe(startWith(this.toDateControl.value))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([enabled, from, to]) =>
        this.dateFilterChange.emit({ enabled, from, to })
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
