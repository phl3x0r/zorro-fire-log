import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-portfolio-settings',
  templateUrl: './portfolio-settings.component.html',
  styleUrls: ['./portfolio-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() portfolioSize: number;
  @Output() portfolioSizeChange = new EventEmitter<number>();
  constructor() {}

  porfolioSizeControl: FormControl;

  ngOnInit(): void {
    this.porfolioSizeControl = new FormControl(this.portfolioSize);
    this.porfolioSizeControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => this.portfolioSizeChange.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
