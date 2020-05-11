import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
  addTradeLogs,
  updateFilter,
  addPositions,
  clearPositions,
} from './trade-logs.actions';
import {
  map,
  withLatestFrom,
  tap,
  delay,
  switchMap,
  take,
  filter,
} from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { TradeLogEntry, PositionLog } from '@zfl/models';
import { environment } from '../../environments/environment';
import { merge, iif, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import {
  TradeLogState,
  selectFilter,
  selectLatestEntryTime,
} from './trade-logs.reducer';
import { Store } from '@ngrx/store';
import { useMockData } from '../tokens/tokens';
import { mockTradeLogs } from '../../mockdata/mock-tradelogs';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

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
      this.store.select(selectLatestEntryTime).pipe(
        map(
          (latest) =>
            latest && new Timestamp(latest.seconds, latest.nanoseconds).toDate()
        ),
        take(1),
        switchMap((latest) =>
          merge(
            ...environment.tradeLogs.map((tl) =>
              this.firestore
                .collection<TradeLogEntry>(tl, (ref) =>
                  (latest ? ref.where('close', '>', latest) : ref).orderBy(
                    'close'
                  )
                )
                .valueChanges({ idField: 'id' })
                .pipe(
                  map((entries) => entries.map((e) => ({ ...e, alias: tl })))
                )
            )
          ).pipe(
            tap(() => console.warn('Using LIVE data')),
            map((tradeLogs) => addTradeLogs({ tradeLogs }))
          )
        )
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

  // TODO: add mocked positions
  onPositionLogUpdate$ = createEffect(() =>
    iif(
      () => false,
      of(
        addTradeLogs({
          tradeLogs: mockTradeLogs,
        })
      ).pipe(
        delay(500),
        tap(() => console.warn('Using MOCKED data'))
      ),
      merge(
        ...(environment.positionLogs || []).map((alias) =>
          this.firestore
            .collection('positions')
            .doc<PositionLog>(alias)
            .valueChanges()
            .pipe(
              filter((x) => !!x),
              map((pLog) =>
                addPositions({
                  alias,
                  positions: (pLog.positions || [])
                    .map((tle) => ({ ...tle, alias }))
                    .reduce((acc, val) => {
                      return acc.concat(val);
                    }, []),
                })
              ),
              tap(console.log)
            )
        )
      )
    )
  );

  onFirstLoadClearPositions$ = createEffect(() =>
    of(true).pipe(
      take(1),
      map(() => clearPositions())
    )
  );
}
