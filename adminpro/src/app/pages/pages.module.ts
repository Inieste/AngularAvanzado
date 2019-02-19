import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {SharedModule} from '../shared/shared.module';
import {PAGES_ROUTES} from './pages.routes';
import { ChartsModule } from 'ng2-charts';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProgressComponent} from './progress/progress.component';
import {Graficas1Component} from './graficas1/graficas1.component';
import {FormsModule} from '@angular/forms';
import {IncrementadorComponent} from '../components/incrementador/incrementador.component';
import {GraficoDonaComponent} from '../components/graficoDona/grafico-dona.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    IncrementadorComponent,
    GraficoDonaComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    ChartsModule
  ]
})
export class PagesModule { }
