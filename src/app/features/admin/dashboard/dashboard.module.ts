import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RegionsComponent } from './regions/regions.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { CitiesComponent } from './cities/cities.component';
import { WorkersComponent } from './workers/workers.component';
import { LayoutComponent } from './layout/layout.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportListComponent } from './report-list/report-list.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    RegionsComponent,
    DelegationsComponent,
    CitiesComponent,
    WorkersComponent,
    ReportViewComponent,
    ReportListComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    
  ]
})
export class DashboardModule { }
