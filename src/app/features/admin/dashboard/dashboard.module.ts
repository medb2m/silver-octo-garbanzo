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
import { UserListComponent } from './user-list/user-list.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SharedModule } from '@app/shared';
import { TunMapComponent } from './tun-map/tun-map.component';
import { DelegationModListComponent } from "./delegation-mod-list/delegation-mod-list.component";
import { ExitConfirmComponent } from './report-view/exit-confirm.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    RegionsComponent,
    DelegationsComponent,
    ReportViewComponent,
    ReportListComponent,
    

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    UserListComponent,
    UserInfoComponent,
    WorkersComponent,
    CitiesComponent,
    StatisticsComponent,
    TunMapComponent,
    SharedModule,
    DelegationModListComponent,
    ExitConfirmComponent
]
})
export class DashboardModule { }
