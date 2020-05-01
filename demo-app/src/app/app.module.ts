import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { AlgoSelectorComponent } from './algo-selector/algo-selector.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { TradeLogEffects } from './store/trade-logs.effects';
import { tradeLogsReducer } from './store/trade-logs.reducer';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [AppComponent, LineChartComponent, AlgoSelectorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatIconModule,
    MatTabsModule,
    MatTreeModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    AngularResizedEventModule,
    ChartModule,
    StoreModule.forRoot({ tradeLogs: tradeLogsReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([TradeLogEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
