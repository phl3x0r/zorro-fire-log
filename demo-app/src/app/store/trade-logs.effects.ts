import { createEffect, ofType, Actions } from '@ngrx/effects';
import { addTradeLogs, updateFilter } from './trade-logs.actions';
import { map, withLatestFrom, tap, delay } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { TradeLogEntry } from '@zfl/models';
import { environment } from '../../environments/environment';
import { merge, iif, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { TradeLogState, selectFilter } from './trade-logs.reducer';
import { Store } from '@ngrx/store';
import { useMockData } from '../tokens/tokens';
import { mockTradeLogs } from '../../mockdata/mock-tradelogs';

@Injectable()
export class TradeLogEffects {
  constructor(
    private firestore: AngularFirestore,
    private store: Store<TradeLogState>,
    private actions$: Actions,
    @Inject(useMockData) private useMockData: boolean
  ) {}

  onTradeLogUpdate$ = createEffect(() =>
    iif(
      () => this.useMockData,
      of(
        addTradeLogs({
          tradeLogs: mockTradeLogs,
        })
      ).pipe(
        delay(500),
        tap(() => console.warn('Using MOCKED data'))
      ),
      merge(
        ...environment.tradeLogs.map((tl) =>
          this.firestore
            .collection<TradeLogEntry>(tl, (ref) => ref.orderBy('close'))
            .valueChanges({ idField: 'id' })
            .pipe(map((entries) => entries.map((e) => ({ ...e, alias: tl }))))
        )
      ).pipe(
        tap(() => console.warn('Using LIVE data')),
        map((tradeLogs) => addTradeLogs({ tradeLogs }))
      )
    )
  );

  onAddTradeLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTradeLogs),
      withLatestFrom(this.store.select(selectFilter)),
      map(([action, filter]) => {
        const newFilter = { ...filter };
        const reduced = action.tradeLogs.reduce((acc, cur) => {
          //check alias
          if (!acc.aliases) {
            acc.aliases = {};
          }
          if (!acc.aliases[cur.alias]) {
            acc = {
              ...acc,
              aliases: {
                ...acc.aliases,
                [cur.alias]: { enabled: true, expanded: true, algos: {} },
              },
            };
          }
          if (!acc.aliases[cur.alias].algos[cur.name]) {
            acc.aliases[cur.alias].algos[cur.name] = {
              enabled: true,
              expanded: false,
              symbols: {},
            };
          }
          if (!acc.aliases[cur.alias].algos[cur.name].symbols[cur.asset]) {
            acc.aliases[cur.alias].algos[cur.name].symbols[cur.asset] = {
              enabled: true,
            };
          }
          return acc;
        }, newFilter);
        return updateFilter({ filter: reduced });
      })
    )
  );
}
