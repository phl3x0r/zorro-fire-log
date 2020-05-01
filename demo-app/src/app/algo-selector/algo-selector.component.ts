import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LogFilter, AliasFilter, AlgoFilter, SymbolFilter } from '@zfl/models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
interface Node {
  name: string;
  enabled: boolean;
  expanded?: boolean;
  children?: Node[];
}
@Component({
  selector: 'app-algo-selector',
  templateUrl: './algo-selector.component.html',
  styleUrls: ['./algo-selector.component.scss'],
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
export class AlgoSelectorComponent {
  nodes: Node[];
  animationsDisabled: boolean;
  isDisabled = false;
  @Input() set logFilter(lf: LogFilter) {
    this.isDisabled = true;
    this.nodes = Object.entries(lf.aliases).map(
      (alias) =>
        <Node>{
          name: alias[0],
          enabled: alias[1].enabled,
          expanded: alias[1].enabled,
          children: Object.entries(alias[1].algos).map(
            (algo) =>
              <Node>{
                name: algo[0],
                enabled: algo[1].enabled,
                expanded: algo[1].enabled,
                children: Object.entries(algo[1].symbols).map(
                  (symbol) =>
                    <Node>{
                      name: symbol[0],
                      enabled: symbol[1].enabled,
                    }
                ),
              }
          ),
        }
    );
    setTimeout(() => (this.isDisabled = false), 0);
  }

  @Output() logFilterChange = new EventEmitter<LogFilter>();

  constructor() {}

  handleChange($event: MatCheckboxChange, node: Node) {
    this.checkNode($event.checked, node);
    node.enabled = $event.checked;
    // this.enableByDescendant(this.nodes);
    const logFilter: LogFilter = {
      aliases: this.nodes.reduce((aliasacc, alias) => {
        aliasacc[alias.name] = {
          enabled: alias.enabled,
          algos: alias.children.reduce((algoacc, algo) => {
            algoacc[algo.name] = {
              enabled: algo.enabled,
              symbols: algo.children.reduce((symbolacc, symbol) => {
                symbolacc[symbol.name] = { enabled: symbol.enabled };
                return symbolacc;
              }, <SymbolFilter>{}),
            };
            return algoacc;
          }, <AlgoFilter>{}),
        };
        return aliasacc;
      }, <AliasFilter>{}),
    };
    this.logFilterChange.emit(logFilter);
  }

  toggleExpand($event: MouseEvent, node: Node) {
    $event.stopPropagation();
    node.expanded = !node.expanded;
  }

  private checkNode(checked: boolean, node: Node | undefined) {
    if (!node) {
      return;
    }
    node.children &&
      node.children.forEach((child) => {
        this.checkNode(checked, child);
        child.enabled = checked;
      });
    node.enabled == checked;
  }
}
