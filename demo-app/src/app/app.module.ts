import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ChartsModule } from 'ng2-charts';
import { environment } from '../environments/environment';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlgoSelectorComponent } from './algo-selector/algo-selector.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, LineChartComponent, AlgoSelectorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ChartsModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    AngularResizedEventModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
