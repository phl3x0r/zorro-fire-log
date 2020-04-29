import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { TradeLogEntry, AlgosAndSymbols, Filter } from '@zfl/models';
import { scan, map, filter, switchMap, tap, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChartDataSets, ChartPoint } from 'chart.js';

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
          tls.filter((tl) => flter.algos[tl.Name] && flter.symbols[tl.Asset])
        ),
        filter((tls) => tls && !!tls.length),
        map((tls) => {
          const reduced = tls.reduce((acc, cur) => {
            if (!acc['total']) {
              acc['total'] = [];
            }
            if (!acc[cur.Name]) {
              acc[cur.Name] = [];
            }
            acc[cur.Name].push({
              x: cur.Close.toDate().toLocaleString(),
              y: cur.Profit + (acc[cur.Name][acc[cur.Name].length - 1]?.y || 0),
            });
            acc['total'].push({
              x: cur.Close.toDate().toLocaleString(),
              y: cur.Profit + (acc['total'][acc['total'].length - 1]?.y || 0),
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
          if (!acc.algos.includes(tl.Name)) {
            acc.algos.push(tl.Name);
          }
          if (!acc.symbols.includes(tl.Asset)) {
            acc.symbols.push(tl.Asset);
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
