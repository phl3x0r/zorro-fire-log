import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TradeLogEntry, AlgosAndSymbols, Filter } from '@zfl/models';
import { scan, map, filter, switchMap, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChartDataSets } from 'chart.js';

@Injectable({ providedIn: 'root' })
export class TradeLogService {
  private filterSubject = new BehaviorSubject<Filter>(null);

  public tradeLogs$ = this.firestore
    .collection<TradeLogEntry>('oanda', (ref) => ref.orderBy('Close'))
    .valueChanges()
    .pipe(shareReplay());

  public chartPoints$: Observable<ChartDataSets[]> = this.filterSubject.pipe(
    filter((flter) => !!flter),
    switchMap((flter: Filter) =>
      this.tradeLogs$.pipe(
        map((tls) =>
          tls.filter((tl) => flter.algos[tl.name] && flter.symbols[tl.asset])
        ),
        filter((tls) => tls && !!tls.length),
        map((tls) => {
          const reduced = tls.reduce((acc, cur) => {
            if (!acc['total']) {
              acc['total'] = [];
            }
            if (!acc[cur.name]) {
              acc[cur.name] = [];
            }
            acc[cur.name].push({
              x: cur.close.toDate().toLocaleString(),
              y: cur.profit + (acc[cur.name][acc[cur.name].length - 1]?.y || 0),
            });
            acc['total'].push({
              x: cur.close.toDate().toLocaleString(),
              y: cur.profit + (acc['total'][acc['total'].length - 1]?.y || 0),
            });
            return acc;
          }, <ChartDataSets[]>{});
          return [
            ...Object.keys(reduced).map((key) => ({
              fill: false,
              label: key,
              data: reduced[key],
            })),
          ];
        })
      )
    )
  );

  public algosAndSymbols$: Observable<AlgosAndSymbols> = this.tradeLogs$.pipe(
    scan(
      (acc, cur) => {
        cur.forEach((tl) => {
          if (!acc.algos.includes(tl.name)) {
            acc.algos.push(tl.name);
          }
          if (!acc.symbols.includes(tl.asset)) {
            acc.symbols.push(tl.asset);
          }
        });
        return acc;
      },
      <AlgosAndSymbols>{ algos: [], symbols: [] }
    )
  );

  constructor(private firestore: AngularFirestore) {}

  public setFilter(filter: Filter) {
    this.filterSubject.next(filter);
  }
}
