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
import { MatTableModule } from '@angular/material/table';
import { AlgoSelectorComponent } from './algo-selector/algo-selector.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { TradeLogEffects } from './store/trade-logs.effects';
import { tradeLogsReducer } from './store/trade-logs.reducer';
import { ChartModule } from 'angular-highcharts';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GroupToggleComponent } from './toolbar/group-toggle/group-toggle.component';
import { useMockData } from './tokens/tokens';
import { StatsTableComponent } from './stats-table/stats-table.component';
import { MatSortModule } from '@angular/material/sort';
import { PortfolioSettingsComponent } from './toolbar/portfolio-settings/portfolio-settings.component';
import { OpenTradesComponent } from './open-trades/open-trades.component';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    AlgoSelectorComponent,
    ToolbarComponent,
    GroupToggleComponent,
    StatsTableComponent,
    PortfolioSettingsComponent,
    OpenTradesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTableModule,
    MatSortModule,
    AngularResizedEventModule,
    ChartModule,
    StoreModule.forRoot({ tradeLogs: tradeLogsReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([TradeLogEffects]),
  ],
  providers: [
    {
      provide: useMockData,
      useFactory: () => !!environment.useMockData,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
