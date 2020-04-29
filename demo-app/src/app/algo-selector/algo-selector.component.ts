import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AlgosAndSymbols, Filter } from '@zfl/models';

@Component({
  selector: 'app-algo-selector',
  templateUrl: './algo-selector.component.html',
  styleUrls: ['./algo-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlgoSelectorComponent {
  private _algosAndSymbols: AlgosAndSymbols = { algos: [], symbols: [] };

  public checked: Filter = { algos: {}, symbols: {} };

  @Input() set algosAndSymbols(aas: AlgosAndSymbols) {
    if (aas) {
      aas.algos.forEach((algo) => (this.checked.algos[algo] = true));
      aas.symbols.forEach((symbol) => (this.checked.symbols[symbol] = true));
      this._algosAndSymbols = aas;
      this.filter.emit(this.checked);
    }
  }

  @Output() filter = new EventEmitter<Filter>();

  get algosAndSymbols() {
    return this._algosAndSymbols;
  }
  panelOpenState = false;

  constructor() {}
}
